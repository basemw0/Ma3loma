const jwt = require('jsonwebtoken');

// Middleware that optionally checks auth (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SecretMoot');
                req.userData = { id: decoded.id };
            }
        }
    } catch (err) {
        // Silently fail - user not authenticated but that's okay
    }
    next();
};

// Middleware that requires auth (fails if no valid token)
const requireAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('No authorization header');
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error('No token found');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = requireAuth;
module.exports.optionalAuth = optionalAuth;
