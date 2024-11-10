const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header
    if (!token) {
        return res.status(401).send("Access denied: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token with the secret
        req.user = decoded;  // Attach the decoded user info to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};
