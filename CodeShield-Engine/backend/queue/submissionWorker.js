require('dotenv').config();
const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const { getRedisConnection } = require('./connection');
const { SUBMISSION_QUEUE_NAME } = require('./submissionQueue');
const { gradeSubmission } = require('./gradingService');
const { emitSubmissionUpdate, emitLeaderboardUpdate } = require('../socket');

const CONCURRENCY = parseInt(process.env.SUBMISSION_WORKER_CONCURRENCY, 10) || 2;

let worker = null;

/**
 * Starts the BullMQ worker that consumes the "submission-queue" and grades
 * each submission via the shared gradingService. Live per-test-case
 * progress is streamed to subscribed clients over Socket.io.
 *
 * Safe to call from within the main server process (single-process
 * deployments) or from a standalone `node queue/submissionWorker.js`
 * process (multi-process / horizontally-scaled deployments) -- both share
 * the same Redis queue.
 *
 * @returns {Worker}
 */
function startWorker() {
    if (worker) return worker;

    worker = new Worker(
        SUBMISSION_QUEUE_NAME,
        async (job) => {
            const { submissionId, problemId, language, code, userId } = job.data;

            return gradeSubmission({
                submissionId,
                problemId,
                language,
                code,
                userId,
                onProgress: (update) => {
                    emitSubmissionUpdate(submissionId, update);
                    if (update.done && update.status === 'Accepted') {
                        emitLeaderboardUpdate();
                    }
                }
            });
        },
        {
            connection: getRedisConnection(),
            concurrency: CONCURRENCY
        }
    );

    worker.on('failed', (job, err) => {
        console.error(`Submission job ${job?.id} failed:`, err.message);
        if (job?.data?.submissionId) {
            emitSubmissionUpdate(job.data.submissionId, {
                status: 'Runtime Error',
                done: true,
                error: 'The grading worker encountered an internal error.'
            });
        }
    });

    console.log(`Submission worker started (concurrency=${CONCURRENCY}).`);
    return worker;
}

// Allow running as a standalone process: `node queue/submissionWorker.js`
if (require.main === module) {
    const mongoURI = process.env.MONGO_URI;
    mongoose.connect(mongoURI)
        .then(() => {
            console.log('Worker connected to MongoDB.');
            startWorker();
        })
        .catch((err) => {
            console.error('Worker MongoDB connection error:', err.message);
            process.exit(1);
        });
}

module.exports = { startWorker };
