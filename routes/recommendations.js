const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate user based on JWT token
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Extract token from Authorization header
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };  // Attach userId to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

// Route to get movie recommendations based on user preferences
router.get('/', authenticate, async (req, res) => {  // No need for :userId in the route
    try {
        const user = await User.findById(req.user.userId);  // Access userId from req.user
        if (!user) return res.status(404).json({ error: "User not found" });

        const { genres, directors } = user.preferences;  // Get user preferences
        const recommendedMovies = await Movie.find({
            genre: { $in: genres },  // Match movies by genre
            director: { $in: directors },  // Match movies by director
        });

        res.status(200).json(recommendedMovies);  // Return the recommended movies
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});

module.exports = router;
