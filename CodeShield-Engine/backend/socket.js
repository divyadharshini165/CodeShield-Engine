const { Server } = require('socket.io');

let io = null;

/**
 * Initializes the Socket.io server attached to the given HTTP server.
 * Clients join a room named `submission:<submissionId>` to receive live
 * grading updates for that specific submission.
 *
 * @param {import('http').Server} httpServer
 * @returns {Server}
 */
function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        socket.on('subscribe', (submissionId) => {
            if (typeof submissionId === 'string' && submissionId) {
                socket.join(`submission:${submissionId}`);
            }
        });

        socket.on('unsubscribe', (submissionId) => {
            if (typeof submissionId === 'string' && submissionId) {
                socket.leave(`submission:${submissionId}`);
            }
        });
    });

    return io;
}

/**
 * Emits a live grading update to every client subscribed to a submission.
 * Safe to call even if Socket.io has not been initialized (e.g. in tests) --
 * the emit is silently skipped.
 *
 * @param {string} submissionId
 * @param {object} update - e.g. { index, total, status, executionTimeMs, hidden }
 */
function emitSubmissionUpdate(submissionId, update) {
    if (!io) return;
    io.to(`submission:${submissionId}`).emit('submission:update', { submissionId, ...update });
}

/**
 * Emits a leaderboard-changed event so connected clients can refetch the
 * leaderboard. Broadcast globally (no room) since the leaderboard is global.
 */
function emitLeaderboardUpdate() {
    if (!io) return;
    io.emit('leaderboard:update');
}

function getIO() {
    return io;
}

module.exports = { initSocket, emitSubmissionUpdate, emitLeaderboardUpdate, getIO };
