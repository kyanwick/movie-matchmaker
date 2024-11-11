const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from "Authorization" header, expecting format: "Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
        req.user = decoded; // Attach decoded data (userId) to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
