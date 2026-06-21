const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Submission = require('../models/Submission');

// ----------------------------------------------------------------------------
// GET /api/leaderboard
// Aggregates per-user stats from MongoDB and returns a ranked list sorted by
// total solved problems (desc), then by acceptance rate (desc) as a tiebreaker.
//
// Each entry: { rank, userId, username, totalSolved, totalSubmissions,
//                acceptedSubmissions, acceptanceRate }
// ----------------------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

        // Aggregate per-user submission counts directly from the
        // Submissions collection so the leaderboard reflects live data
        // even for users with many submissions.
        const submissionStats = await Submission.aggregate([
            { $match: { userId: { $ne: null } } },
            {
                $group: {
                    _id: '$userId',
                    totalSubmissions: { $sum: 1 },
                    acceptedSubmissions: {
                        $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
                    }
                }
            }
        ]);

        const statsByUser = new Map(
            submissionStats.map((s) => [s._id.toString(), s])
        );

        const users = await User.find({}).select('username solvedProblems');

        const leaderboard = users.map((user) => {
            const stats = statsByUser.get(user._id.toString());
            const totalSubmissions = stats ? stats.totalSubmissions : 0;
            const acceptedSubmissions = stats ? stats.acceptedSubmissions : 0;
            const acceptanceRate = totalSubmissions > 0
                ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(2))
                : 0;

            return {
                userId: user._id,
                username: user.username,
                totalSolved: user.solvedProblems ? user.solvedProblems.length : 0,
                totalSubmissions,
                acceptedSubmissions,
                acceptanceRate
            };
        });

        leaderboard.sort((a, b) => {
            if (b.totalSolved !== a.totalSolved) return b.totalSolved - a.totalSolved;
            if (b.acceptanceRate !== a.acceptanceRate) return b.acceptanceRate - a.acceptanceRate;
            return a.username.localeCompare(b.username);
        });

        const ranked = leaderboard.slice(0, limit).map((entry, idx) => ({
            rank: idx + 1,
            ...entry
        }));

        return res.json(ranked);
    } catch (err) {
        console.error('Leaderboard error:', err);
        return res.status(500).json({ error: 'Failed to compute leaderboard.' });
    }
});

module.exports = router;
