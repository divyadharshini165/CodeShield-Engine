const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware that requires a valid JWT in the Authorization header.
 * Format: "Authorization: Bearer <token>"
 * Attaches the authenticated user document to req.user (without password).
 */
async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Not authorized. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            return res.status(401).json({ error: 'Not authorized. Token is invalid or has expired.' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Not authorized. User no longer exists.' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(500).json({ error: 'Internal server error during authentication.' });
    }
}

/**
 * Middleware that optionally attaches the user if a valid token is present,
 * but does NOT block the request if the token is missing or invalid.
 */
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        } catch (err) {
            // Invalid token in optional auth -> just proceed unauthenticated
        }

        next();
    } catch (err) {
        next();
    }
}

/**
 * Middleware that requires the authenticated user to have role === 'admin'.
 * Must be chained AFTER `protect` so req.user is already set.
 */
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin privileges required.' });
    }
    next();
}

module.exports = { protect, optionalAuth, requireAdmin };
