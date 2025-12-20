const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.userData = { id: decoded.id };
            }
        }
    } catch (err) {
        // Silently fail -.-
    }
    next();
};


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
