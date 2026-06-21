require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const { initSocket } = require('./socket');
const { isRedisAvailable } = require('./queue/connection');
const { startWorker } = require('./queue/submissionWorker');

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Socket.io (live submission grading updates + leaderboard refresh events)
initSocket(httpServer);

// Import Routes
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health-check route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running successfully.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Start the in-process submission grading worker if Redis is reachable.
// If Redis is unavailable, POST /api/submissions falls back to synchronous
// grading (see routes/submissionRoutes.js), so the worker is simply skipped.
// For horizontally-scaled deployments, set SKIP_INPROCESS_WORKER=true and run
// `node queue/submissionWorker.js` as one or more standalone processes instead.
if (process.env.SKIP_INPROCESS_WORKER !== 'true') {
    isRedisAvailable().then((available) => {
        if (available) {
            startWorker();
        } else {
            console.log('Redis not detected -- submissions will be graded synchronously in-process.');
        }
    });
}
