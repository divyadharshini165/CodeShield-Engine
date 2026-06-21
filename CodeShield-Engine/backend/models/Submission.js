const mongoose = require('mongoose');

// Per-test-case execution trace, used to power the real-time streaming UI
// and the post-run analytics breakdown (Tier 2, item 7).
const testCaseResultSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Passed', 'Failed', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded'],
        required: true
    },
    executionTimeMs: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    language: {
        type: String,
        required: true,
        enum: ['python', 'javascript', 'c', 'cpp', 'java', 'bash']
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'Queued',
            'Evaluating',
            'Pending',
            'Accepted',
            'Wrong Answer',
            'Time Limit Exceeded',
            'Memory Limit Exceeded',
            'Compilation Error',
            'Runtime Error'
        ],
        default: 'Queued'
    },
    output: {
        type: String,
        default: ''
    },
    executionTime: {
        type: Number
    },
    testCaseResults: {
        type: [testCaseResultSchema],
        default: []
    },
    aiReview: {
        complexity: { type: String, default: '' },
        suggestions: { type: [String], default: [] },
        generatedAt: { type: Date }
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Speeds up leaderboard aggregation and per-user history queries.
submissionSchema.index({ userId: 1, status: 1 });
submissionSchema.index({ problemId: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
