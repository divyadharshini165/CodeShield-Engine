const express = require('express');
const router = express.Router();

const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// ----------------------------------------------------------------------------
// GET /api/problems
// Fetch all problems. Supports optional ?difficulty= and ?category= filters.
// Test cases are intentionally excluded from the list payload to keep the
// hidden test vectors hidden from the client.
// ----------------------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const { difficulty, category, tags } = req.query;
        const query = {};

        if (difficulty) query.difficulty = difficulty;
        if (category) query.category = category;

        // ?tags=Arrays,DP,Graphs  → filter problems that have ALL specified tags
        if (tags) {
            const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
            if (tagList.length > 0) {
                query.tags = { $all: tagList };
            }
        }

        const problems = await Problem.find(query).select('-testCases');
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch problems.' });
    }
});

// ----------------------------------------------------------------------------
// GET /api/problems/stats
// Returns platform-wide analytics for the dashboard:
//  - totalProblems
//  - totalSubmissions
//  - acceptedSubmissions
//  - platformAccuracy (%)
//  - verdictBreakdown: counts per verdict (Accepted, Wrong Answer, TLE, MLE,
//    Compilation Error, Runtime Error)
//  - languageStats: per-language submission counts, accepted counts, and
//    average execution time (ms)
// ----------------------------------------------------------------------------
router.get('/stats', async (req, res) => {
    try {
        const [totalProblems, totalSubmissions, acceptedSubmissions, verdictAgg, languageAgg] = await Promise.all([
            Problem.countDocuments({}),
            Submission.countDocuments({}),
            Submission.countDocuments({ status: 'Accepted' }),
            Submission.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Submission.aggregate([
                {
                    $group: {
                        _id: '$language',
                        totalSubmissions: { $sum: 1 },
                        acceptedSubmissions: {
                            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
                        },
                        avgExecutionTimeMs: { $avg: '$executionTime' }
                    }
                }
            ])
        ]);

        const platformAccuracy = totalSubmissions > 0
            ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(2))
            : 0;

        const verdictBreakdown = {
            'Accepted': 0,
            'Wrong Answer': 0,
            'Time Limit Exceeded': 0,
            'Memory Limit Exceeded': 0,
            'Compilation Error': 0,
            'Runtime Error': 0,
            'Queued': 0,
            'Evaluating': 0
        };
        verdictAgg.forEach((entry) => {
            if (entry._id in verdictBreakdown) {
                verdictBreakdown[entry._id] = entry.count;
            }
        });

        const languageStats = languageAgg.map((entry) => ({
            language: entry._id,
            totalSubmissions: entry.totalSubmissions,
            acceptedSubmissions: entry.acceptedSubmissions,
            avgExecutionTimeMs: entry.avgExecutionTimeMs ? Math.round(entry.avgExecutionTimeMs) : 0
        }));

        res.json({
            totalProblems,
            totalSubmissions,
            acceptedSubmissions,
            platformAccuracy,
            verdictBreakdown,
            languageStats
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch platform statistics.' });
    }
});

// ----------------------------------------------------------------------------
// GET /api/problems/:id
// Fetch a single problem by ID, including sample input/output. The hidden
// testCases array is excluded from the response.
// ----------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).select('-testCases');

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found.' });
        }

        res.json(problem);
    } catch (error) {
        res.status(400).json({ error: 'Invalid problem ID.' });
    }
});

// ----------------------------------------------------------------------------
// Problem creation, update, and deletion are admin-only operations and live
// under /api/admin/problems (see routes/adminRoutes.js, gated by
// `protect` + `requireAdmin`). This public router intentionally exposes
// read-only access.
// ----------------------------------------------------------------------------

module.exports = router;
