const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { generateFile, cleanupJob } = require('../execute/generateFile');
const { executeCode } = require('../execute/executeCode');
const { computeStreakUpdate } = require('../utils/streak');

/**
 * Maps an internal executeCode verdict to the per-test-case status stored on
 * the submission and streamed to the client.
 */
function verdictToTestCaseStatus(verdict, passed) {
    switch (verdict) {
        case 'CompilationError': return 'Compilation Error';
        case 'TimeLimitExceeded': return 'Time Limit Exceeded';
        case 'MemoryLimitExceeded': return 'Memory Limit Exceeded';
        case 'RuntimeError': return 'Runtime Error';
        default: return passed ? 'Passed' : 'Failed';
    }
}

/**
 * Maps an internal executeCode verdict (or a wrong-answer determination) to
 * the overall Submission.status value.
 */
function verdictToSubmissionStatus(verdict, passed) {
    switch (verdict) {
        case 'CompilationError': return 'Compilation Error';
        case 'TimeLimitExceeded': return 'Time Limit Exceeded';
        case 'MemoryLimitExceeded': return 'Memory Limit Exceeded';
        case 'RuntimeError': return 'Runtime Error';
        default: return passed ? 'Accepted' : 'Wrong Answer';
    }
}

/**
 * Grades a submission against every test case (sample AND hidden, evaluated
 * sequentially and identically -- the client never receives the hidden
 * vectors regardless of outcome).
 *
 * Calls `onProgress(update)` after each test case finishes, where `update` is:
 *   { index, total, status, executionTimeMs, hidden }
 * This is used by the BullMQ worker to stream live updates over Socket.io,
 * and is a no-op when omitted (e.g. the synchronous fallback path).
 *
 * Persists the final result onto the Submission document identified by
 * `submissionId` and (on Accepted) records the solve on the user's profile.
 *
 * @param {object} params
 * @param {string} params.submissionId
 * @param {string} params.problemId
 * @param {string} params.language
 * @param {string} params.code
 * @param {string} [params.userId]
 * @param {(update: object) => void} [params.onProgress]
 * @returns {Promise<import('mongoose').Document>} the updated Submission document
 */
async function gradeSubmission({ submissionId, problemId, language, code, userId, onProgress }) {
    const emit = onProgress || (() => {});

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new Error('Problem not found.');
    }

    if (!problem.testCases || problem.testCases.length === 0) {
        throw new Error('No test cases defined for this problem.');
    }

    await Submission.findByIdAndUpdate(submissionId, { status: 'Evaluating' });
    emit({ status: 'Evaluating', total: problem.testCases.length });

    let job;
    let finalStatus = 'Accepted';
    let diagnostics = '';
    let totalExecTimeMs = 0;
    const testCaseResults = [];

    try {
        job = await generateFile(language, code);

        for (let i = 0; i < problem.testCases.length; i++) {
            const testcase = problem.testCases[i];
            // Sample test cases are the first `sampleCount` (default: just
            // testCases[0] is treated as the visible sample on the frontend).
            // All cases -- sample and hidden -- are graded identically here.
            const isHidden = i > 0;

            emit({ index: i, total: problem.testCases.length, status: 'Running', hidden: isHidden });

            const start = Date.now();
            const result = await executeCode(language, job.filepath, job.dir, testcase.input, problem.timeLimit, job.filename);
            const elapsed = Date.now() - start;
            totalExecTimeMs += elapsed;

            const actual = (result.stdout || '').trim();
            const expected = (testcase.expectedOutput || '').trim();
            const passed = result.verdict === 'OK' && actual === expected;

            const tcStatus = verdictToTestCaseStatus(result.verdict, passed);
            testCaseResults.push({ index: i, status: tcStatus, executionTimeMs: elapsed, hidden: isHidden });

            emit({ index: i, total: problem.testCases.length, status: tcStatus, executionTimeMs: elapsed, hidden: isHidden });

            if (result.verdict !== 'OK') {
                finalStatus = verdictToSubmissionStatus(result.verdict, false);
                if (result.verdict === 'CompilationError') {
                    diagnostics = result.stderr || 'Compilation failed.';
                } else if (result.verdict === 'TimeLimitExceeded') {
                    diagnostics = `Testcase ${i + 1} exceeded the time limit (${problem.timeLimit}ms).`;
                } else if (result.verdict === 'MemoryLimitExceeded') {
                    diagnostics = `Testcase ${i + 1} exceeded the memory limit.`;
                } else if (result.verdict === 'RuntimeError') {
                    diagnostics = `Testcase ${i + 1} crashed.\n${result.stderr || 'Process exited with a non-zero status code.'}`;
                }
                break;
            }

            if (!passed) {
                finalStatus = 'Wrong Answer';
                diagnostics = `Testcase ${i + 1} failed.\nInput:\n${testcase.input}\nExpected:\n${expected}\nGot:\n${actual}`;
                break;
            }
        }
    } finally {
        if (job && job.dir) {
            await cleanupJob(job.dir);
        }
    }

    const submission = await Submission.findByIdAndUpdate(
        submissionId,
        {
            status: finalStatus,
            output: diagnostics,
            executionTime: totalExecTimeMs,
            testCaseResults
        },
        { new: true }
    );

    // Track solved-problem milestones for authenticated users.
    if (userId && finalStatus === 'Accepted') {
        const user = await User.findById(userId);
        if (user) {
            const alreadySolved = user.solvedProblems.some(
                (id) => id.toString() === problem._id.toString()
            );
            if (!alreadySolved) {
                user.solvedProblems.push(problem._id);
                user.solvedHistory.push({ problemId: problem._id, solvedAt: new Date() });
            }

            // Daily streak: every Accepted submission counts toward "active
            // coding today", regardless of whether the problem was already
            // solved before -- a user grinding re-attempts or new problems
            // on the same day should still keep their streak alive.
            const streakUpdate = computeStreakUpdate(user, new Date());
            user.currentStreak = streakUpdate.currentStreak;
            user.longestStreak = streakUpdate.longestStreak;
            user.lastSolvedDate = streakUpdate.lastSolvedDate;

            await user.save();
        }
    }

    emit({ status: finalStatus, done: true, submission });

    return submission;
}

module.exports = { gradeSubmission, verdictToTestCaseStatus, verdictToSubmissionStatus };
