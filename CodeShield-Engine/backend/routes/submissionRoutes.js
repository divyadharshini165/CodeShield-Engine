const express = require('express');
const router = express.Router();

const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { SUPPORTED_LANGUAGES } = require('../execute/languageConfig');
const { optionalAuth } = require('../middleware/authMiddleware');
const { isRedisAvailable } = require('../queue/connection');
const { enqueueSubmission } = require('../queue/submissionQueue');
const { gradeSubmission } = require('../queue/gradingService');
const { emitSubmissionUpdate } = require('../socket');

// ----------------------------------------------------------------------------
// POST /api/submissions
// Creates a "Queued" Submission document and dispatches it for grading.
//
// - If Redis/BullMQ is available, the job is pushed onto "submission-queue"
//   and a background worker (queue/submissionWorker.js) grades it,
//   streaming per-test-case updates over Socket.io to clients subscribed to
//   `submission:<id>`. This endpoint responds immediately with the
//   "Queued" submission so the frontend can show an "Evaluating..." state.
// - If Redis is unavailable, the submission is graded synchronously
//   in-process (no live streaming) and the final result is returned
//   directly -- this keeps local development working without Redis.
//
// Both paths grade EVERY test case (sample + hidden) sequentially via the
// shared gradingService; the hidden vectors are never sent to the client.
// ----------------------------------------------------------------------------
router.post('/', optionalAuth, async (req, res) => {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
        return res.status(400).json({ error: 'Missing required fields: problemId, language, and code are all required.' });
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return res.status(400).json({
            error: `Unsupported language "${language}". Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}.`
        });
    }

    let problem;
    try {
        problem = await Problem.findById(problemId);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid problem ID.' });
    }

    if (!problem) {
        return res.status(404).json({ error: 'Problem not found.' });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
        return res.status(500).json({ error: 'No test cases defined for this problem.' });
    }

    try {
        const submission = await Submission.create({
            problemId,
            userId: req.user ? req.user._id : undefined,
            language,
            code,
            status: 'Queued'
        });

        const useQueue = await isRedisAvailable();

        if (useQueue) {
            await enqueueSubmission({
                submissionId: submission._id.toString(),
                problemId: problem._id.toString(),
                language,
                code,
                userId: req.user ? req.user._id.toString() : undefined
            });

            return res.status(202).json({
                ...submission.toObject(),
                queued: true,
                totalTestCases: problem.testCases.length
            });
        }

        // Synchronous fallback (no Redis): grade in-process right now.
        const graded = await gradeSubmission({
            submissionId: submission._id.toString(),
            problemId: problem._id.toString(),
            language,
            code,
            userId: req.user ? req.user._id.toString() : undefined,
            onProgress: (update) => emitSubmissionUpdate(submission._id.toString(), update)
        });

        return res.json({ ...graded.toObject(), queued: false });
    } catch (err) {
        console.error('Submission dispatch error:', err);
        return res.status(500).json({ error: 'Internal server error while processing submission.' });
    }
});

// ----------------------------------------------------------------------------
// GET /api/submissions
// Returns submission history. If authenticated, returns only the
// requesting user's submissions (most recent first). Supports an optional
// ?problemId= filter. If not authenticated, returns the most recent
// submissions across the platform (anonymous/demo view).
// ----------------------------------------------------------------------------
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { problemId, limit } = req.query;
        const query = {};

        if (req.user) {
            query.userId = req.user._id;
        }

        if (problemId) {
            query.problemId = problemId;
        }

        const cappedLimit = Math.min(parseInt(limit, 10) || 50, 100);

        const submissions = await Submission.find(query)
            .sort({ submittedAt: -1 })
            .limit(cappedLimit)
            .populate('problemId', 'title difficulty category');

        return res.json(submissions);
    } catch (err) {
        console.error('Submission history error:', err);
        return res.status(500).json({ error: 'Internal server error while fetching submissions.' });
    }
});

// ----------------------------------------------------------------------------
// GET /api/submissions/:id
// Returns a single submission by ID, including the exact code string
// submitted (used by the "view code" modal on the frontend) and the
// per-test-case progress trace (used to render live grading status and the
// post-run analytics breakdown).
// ----------------------------------------------------------------------------
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('problemId', 'title difficulty category');

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found.' });
        }

        // If the submission belongs to a user, only that user (or an
        // unauthenticated demo request with no ownership) may view it.
        if (submission.userId && req.user && submission.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You do not have permission to view this submission.' });
        }

        return res.json(submission);
    } catch (err) {
        console.error('Submission fetch error:', err);
        return res.status(400).json({ error: 'Invalid submission ID.' });
    }
});

module.exports = router;
