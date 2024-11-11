const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Movie = require('../models/Movie');
const router = express.Router();

// Middleware to authenticate user
const authenticate = require('../middleware/auth');

// Route to save user preferences
router.post('/preferences', authenticate, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
    const userId = req.user.userId; // Extract userId from token
    const { preferences } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.preferences = preferences;
        await user.save();

        res.status(200).json({ message: "Preferences saved successfully", preferences });
    } catch (error) {
        console.error("Error saving preferences:", error);
        res.status(500).json({ error: "Failed to save preferences" });
    }
});


// Route to get user preferences
router.get('/preferences', authenticate, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
    const userId = req.user.userId; // Extract userId from token

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ preferences: user.preferences });
     
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ error: "Failed to fetch preferences" });
    }
});

// Route to get movie recommendations based on user preferences
router.get('/', authenticate, async (req, res) => {  
    try {
        const userId = req.user.userId;  // Get userId from the authenticated token
        const user = await User.findById(userId);  // Find user in the database by ID
        if (!user) return res.status(404).json({ error: "User not found" });

        const preferences = user.preferences;  // Get the preferences from the user model

        // Prepare the filters based on the preferences
        const filter = {};

        // Filter by genre
        if (preferences.genres && preferences.genres.length > 0) {
            filter.genre = { $in: preferences.genres };
        }

        // Filter by decade (convert to year range)
        if (preferences.decade && preferences.decade !== 'no-preference') {
            const startYear = parseInt(preferences.decade.split('s')[0]);
            filter.release_year = { $gte: startYear, $lte: startYear + 9 };  // Apply year range for the decade
        }

        // Filter by movie length
        if (preferences.length && preferences.length !== 'no-preference') {
            if (preferences.length === 'short') {
                filter.length = { $lte: 90 };
            } else if (preferences.length === 'medium') {
                filter.length = { $gte: 90, $lte: 120 };
            } else if (preferences.length === 'long') {
                filter.length = { $gte: 120 };
            }
        }

        // Filter by language
        if (preferences.language && preferences.language !== 'no-preference') {
            filter.language = preferences.language;
        }

        // Fallback if no preferences are set (for variety)
        if (Object.keys(filter).length === 0) {
            // Provide a fallback filter to return a variety of movies
            filter.genre = { $in: ['Action', 'Drama', 'Comedy'] };  // Popular genres as fallback
            filter.release_year = { $gte: 2000 };  // Movies from 2000 onwards
        }

        // Fetch the recommended movies based on the filter
        const recommendedMovies = await Movie.find(filter);

        if (recommendedMovies.length === 0) {
            return res.status(404).json({ message: "No movie recommendations found based on your preferences" });
        }

        // Return the recommended movies
        res.status(200).json(recommendedMovies);
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});




module.exports = router;
