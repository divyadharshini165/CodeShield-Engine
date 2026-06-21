const express = require('express');
const router = express.Router();

const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require a valid JWT AND admin role.
router.use(protect, requireAdmin);

// ============================================================================
// PROBLEM CRUD
// ============================================================================

// GET /api/admin/problems
// Returns all problems including their hidden test cases (admin view).
router.get('/problems', async (req, res) => {
    try {
        const { difficulty, category, search } = req.query;
        const query = {};
        if (difficulty) query.difficulty = difficulty;
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };

        const problems = await Problem.find(query).sort({ difficulty: 1, title: 1 });
        res.json(problems);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch problems.' });
    }
});

// GET /api/admin/problems/:id
// Single problem with all fields including test cases.
router.get('/problems/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ error: 'Problem not found.' });
        res.json(problem);
    } catch (err) {
        res.status(400).json({ error: 'Invalid problem ID.' });
    }
});

// POST /api/admin/problems
// Create a new problem.
router.post('/problems', async (req, res) => {
    try {
        const {
            title, description, difficulty, category, tags,
            timeLimit, memoryLimit, sampleInput, sampleOutput, testCases
        } = req.body;

        if (!title || !description || !difficulty) {
            return res.status(400).json({ error: 'title, description, and difficulty are required.' });
        }

        if (!testCases || !Array.isArray(testCases) || testCases.length < 1) {
            return res.status(400).json({ error: 'At least one test case is required.' });
        }

        const problem = await Problem.create({
            title, description, difficulty,
            category: category || 'General',
            tags: tags || [],
            timeLimit: timeLimit || 2000,
            memoryLimit: memoryLimit || 512,
            sampleInput, sampleOutput,
            testCases
        });

        res.status(201).json(problem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(' ') });
        }
        res.status(500).json({ error: 'Failed to create problem.', details: err.message });
    }
});

// PUT /api/admin/problems/:id
// Update any field on an existing problem (full replacement of supplied fields).
router.put('/problems/:id', async (req, res) => {
    try {
        const {
            title, description, difficulty, category, tags,
            timeLimit, memoryLimit, sampleInput, sampleOutput, testCases
        } = req.body;

        const update = {};
        if (title !== undefined) update.title = title;
        if (description !== undefined) update.description = description;
        if (difficulty !== undefined) update.difficulty = difficulty;
        if (category !== undefined) update.category = category;
        if (tags !== undefined) update.tags = tags;
        if (timeLimit !== undefined) update.timeLimit = timeLimit;
        if (memoryLimit !== undefined) update.memoryLimit = memoryLimit;
        if (sampleInput !== undefined) update.sampleInput = sampleInput;
        if (sampleOutput !== undefined) update.sampleOutput = sampleOutput;
        if (testCases !== undefined) update.testCases = testCases;

        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!problem) return res.status(404).json({ error: 'Problem not found.' });
        res.json(problem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(' ') });
        }
        res.status(400).json({ error: 'Failed to update problem.', details: err.message });
    }
});

// DELETE /api/admin/problems/:id
// Remove a problem and its associated submissions, and scrub any
// references to it from user profiles (solvedProblems / solvedHistory)
// so deleted problems don't linger in "Your Solved Challenges" counts,
// the solved-challenges modal, or the progression graph.
router.delete('/problems/:id', async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (!problem) return res.status(404).json({ error: 'Problem not found.' });

        // Clean up submissions for the deleted problem.
        await Submission.deleteMany({ problemId: req.params.id });

        // Scrub the deleted problem from every user's solved-problem
        // tracking so dashboard stats (solved count, difficulty
        // breakdown, progression graph) stay accurate.
        await User.updateMany(
            {},
            {
                $pull: {
                    solvedProblems: req.params.id,
                    solvedHistory: { problemId: req.params.id }
                }
            }
        );

        res.json({ message: `Problem "${problem.title}" and its submissions deleted.` });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete problem.' });
    }
});

// ============================================================================
// SUBMISSION LOG (live global log)
// ============================================================================

// GET /api/admin/submissions
// Paginated global submission log with user and problem details.
router.get('/submissions', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.language) filter.language = req.query.language;
        if (req.query.problemId) filter.problemId = req.query.problemId;

        const [submissions, total] = await Promise.all([
            Submission.find(filter)
                .sort({ submittedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('problemId', 'title difficulty category')
                .populate('userId', 'username email'),
            Submission.countDocuments(filter)
        ]);

        res.json({
            submissions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch submission log.' });
    }
});

// ============================================================================
// USER MANAGEMENT
// ============================================================================

// GET /api/admin/users
// List all users with stats summary.
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// PATCH /api/admin/users/:id/role
// Promote or demote a user's role.
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Role must be "user" or "admin".' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, select: '-password' }
        );

        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: `Role updated to "${role}".`, user });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update role.' });
    }
});

// ============================================================================
// PLATFORM STATS (admin-level detail)
// ============================================================================

// GET /api/admin/stats
// Extended platform analytics including per-day submission chart data.
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            totalProblems,
            totalSubmissions,
            recentSubmissions
        ] = await Promise.all([
            User.countDocuments({}),
            Problem.countDocuments({}),
            Submission.countDocuments({}),
            Submission.aggregate([
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
                            status: '$status'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': -1 } },
                { $limit: 70 }
            ])
        ]);

        // Reshape into { date: { Accepted: n, 'Wrong Answer': n, ... } }
        const byDate = {};
        recentSubmissions.forEach(({ _id, count }) => {
            if (!byDate[_id.date]) byDate[_id.date] = {};
            byDate[_id.date][_id.status] = count;
        });

        res.json({ totalUsers, totalProblems, totalSubmissions, submissionsByDate: byDate });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin stats.' });
    }
});

module.exports = router;
