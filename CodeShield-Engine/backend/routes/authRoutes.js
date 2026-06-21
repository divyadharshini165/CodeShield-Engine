const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { generateToken } = require('../utils/jwt');
const { protect } = require('../middleware/authMiddleware');

// ----------------------------------------------------------------------------
// POST /api/auth/register
// Creates a new user account. Passwords are hashed automatically via the
// User model's pre-save hook (bcrypt).
// ----------------------------------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are all required.' });
        }

        const trimmedUsername = String(username).trim();
        const normalizedEmail = String(email).trim().toLowerCase();

        if (trimmedUsername.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
        }

        if (trimmedUsername.length > 24) {
            return res.status(400).json({ error: 'Username cannot exceed 24 characters.' });
        }

        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: 'Please provide a valid email address.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }

        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: trimmedUsername }]
        });

        if (existingUser) {
            const conflictField = existingUser.email === normalizedEmail ? 'Email' : 'Username';
            return res.status(409).json({ error: `${conflictField} is already registered.` });
        }

        const user = await User.create({
            username: trimmedUsername,
            email: normalizedEmail,
            password,
            role: 'user',
            solvedProblems: []
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            message: 'Account created successfully.',
            token,
            user: user.toSafeObject()
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: messages.join(' ') });
        }
        if (err.code === 11000) {
            const duplicateField = err.keyPattern?.email ? 'Email' : 'Username';
            return res.status(409).json({ error: `${duplicateField} is already registered.` });
        }
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Internal server error during registration.' });
    }
});

// ----------------------------------------------------------------------------
// POST /api/auth/login
// Validates credentials and returns a signed JWT.
// ----------------------------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);

        return res.json({
            message: 'Login successful.',
            token,
            user: user.toSafeObject()
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error during login.' });
    }
});

// ----------------------------------------------------------------------------
// GET /api/auth/me
// Returns the authenticated user's profile plus analytics:
//  - Total Submissions Evaluated (platform-wide)
//  - Your Solved Challenges (count)
//  - Overall Platform Accuracy %
//  - Daily coding streak (current + longest)
//  - Difficulty breakdown (Easy/Medium/Hard solved vs total available)
//  - Solved problem list (title/difficulty/category, for the "Solved
//    Challenges" modal's deep links back into each workspace)
//  - Cumulative solved-over-time timeline (for the progression graph)
// ----------------------------------------------------------------------------
router.get('/me', protect, async (req, res) => {
    try {
        const [totalSubmissions, acceptedSubmissions, allProblems, solvedProblemDocs] = await Promise.all([
            Submission.countDocuments({}),
            Submission.countDocuments({ status: 'Accepted' }),
            Problem.find({}).select('difficulty'),
            Problem.find({ _id: { $in: req.user.solvedProblems } }).select('title difficulty category')
        ]);

        const platformAccuracy = totalSubmissions > 0
            ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(2))
            : 0;

        // Difficulty breakdown: solved count vs total available, per difficulty.
        const difficultyBreakdown = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } };
        allProblems.forEach((p) => {
            if (difficultyBreakdown[p.difficulty]) difficultyBreakdown[p.difficulty].total += 1;
        });
        solvedProblemDocs.forEach((p) => {
            if (difficultyBreakdown[p.difficulty]) difficultyBreakdown[p.difficulty].solved += 1;
        });

        // Solved problems list, most-recently-solved first, for the modal.
        const solvedByIdMap = new Map(solvedProblemDocs.map((p) => [p._id.toString(), p]));
        const solvedHistorySorted = [...(req.user.solvedHistory || [])].sort(
            (a, b) => new Date(b.solvedAt) - new Date(a.solvedAt)
        );
        const seen = new Set();
        const solvedProblemsList = [];
        solvedHistorySorted.forEach((entry) => {
            const pid = entry.problemId?.toString();
            if (!pid || seen.has(pid)) return;
            const problem = solvedByIdMap.get(pid);
            if (!problem) return; // problem may have been deleted since
            seen.add(pid);
            solvedProblemsList.push({
                _id: problem._id,
                title: problem.title,
                difficulty: problem.difficulty,
                category: problem.category,
                solvedAt: entry.solvedAt
            });
        });
        // Catch any legacy solvedProblems entries that predate solvedHistory
        // (e.g. accounts created before this feature existed) so the modal
        // doesn't silently drop them.
        solvedProblemDocs.forEach((problem) => {
            const pid = problem._id.toString();
            if (!seen.has(pid)) {
                seen.add(pid);
                solvedProblemsList.push({
                    _id: problem._id,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    category: problem.category,
                    solvedAt: null
                });
            }
        });

        // Cumulative solved-over-time series for the progression graph:
        // one point per day a solve happened, running total.
        const dayBuckets = new Map(); // YYYY-MM-DD -> count solved that day
        [...(req.user.solvedHistory || [])]
            .sort((a, b) => new Date(a.solvedAt) - new Date(b.solvedAt))
            .forEach((entry) => {
                const day = new Date(entry.solvedAt).toISOString().slice(0, 10);
                dayBuckets.set(day, (dayBuckets.get(day) || 0) + 1);
            });
        let running = 0;
        const solvedTimeline = Array.from(dayBuckets.entries()).map(([date, count]) => {
            running += count;
            return { date, solvedOnDay: count, cumulativeSolved: running };
        });

        return res.json({
            user: req.user.toSafeObject(),
            stats: {
                totalSubmissions,
                acceptedSubmissions,
                yourSolvedChallenges: req.user.solvedProblems.length,
                platformAccuracy,
                streak: {
                    current: req.user.currentStreak || 0,
                    longest: req.user.longestStreak || 0,
                    lastSolvedDate: req.user.lastSolvedDate || null
                },
                difficultyBreakdown,
                solvedProblemsList,
                solvedTimeline
            }
        });
    } catch (err) {
        console.error('Profile fetch error:', err);
        return res.status(500).json({ error: 'Internal server error while fetching profile.' });
    }
});

// ----------------------------------------------------------------------------
// POST /api/auth/make-admin
// Promotes a user to admin using a secret key (ADMIN_PROMOTION_SECRET env var).
// This is a one-time setup endpoint — use it to create the first admin account.
// In production, restrict or remove this endpoint after initial setup.
// ----------------------------------------------------------------------------
router.post('/make-admin', protect, async (req, res) => {
    const { secret } = req.body;
    const ADMIN_SECRET = process.env.ADMIN_PROMOTION_SECRET || 'codeshield-admin-secret';

    if (!secret || secret !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Invalid admin promotion secret.' });
    }

    try {
        req.user.role = 'admin';
        await req.user.save();
        return res.json({ message: 'Account promoted to admin.', user: req.user.toSafeObject() });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to promote account.' });
    }
});

module.exports = router;
