const { Queue } = require('bullmq');
const { getRedisConnection } = require('./connection');

const SUBMISSION_QUEUE_NAME = 'submission-queue';

let sharedQueue = null;

/**
 * Returns the shared BullMQ queue used to dispatch submission-grading jobs
 * to background workers. Created lazily so importing this module never
 * attempts a Redis connection on its own.
 */
function getSubmissionQueue() {
    if (!sharedQueue) {
        sharedQueue = new Queue(SUBMISSION_QUEUE_NAME, {
            connection: getRedisConnection(),
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: { age: 3600, count: 1000 },
                removeOnFail: { age: 86400, count: 1000 }
            }
        });
    }
    return sharedQueue;
}

/**
 * Enqueues a grading job for a previously-created (status: "Queued")
 * Submission document.
 *
 * @param {object} payload
 * @param {string} payload.submissionId - Mongo ObjectId of the Submission document.
 * @param {string} payload.problemId
 * @param {string} payload.language
 * @param {string} payload.code
 * @param {string} [payload.userId]
 */
async function enqueueSubmission(payload) {
    const queue = getSubmissionQueue();
    return queue.add('grade-submission', payload, {
        jobId: payload.submissionId
    });
}

module.exports = { SUBMISSION_QUEUE_NAME, getSubmissionQueue, enqueueSubmission };
