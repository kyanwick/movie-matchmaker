const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const router = express.Router();

router.get('/recommendations', async (req, res) => {
    const userId = req.user.userId; // Assuming user authentication middleware
    const user = await User.findById(userId);
    const preferences = user.preferences;
    const recommendedMovies = await Movie.find({
        genre: { $in: preferences.genres },
        director: { $in: preferences.directors },
    });
    res.json(recommendedMovies);
});

module.exports = router;
