// routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Movie = require("../models/Movie");
const multer = require('multer');
const path = require('path');

// Endpoint to save user preferences
router.post("/preferences", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
  const { userId, genres, directors } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { preferences: { genres, directors } },
      { new: true }
    );
    res.status(200).json({ message: "Preferences saved", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Endpoint to save a movie to the database
router.post("/movies", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
  const { title, genre, director, rating, poster } = req.body;
  try {
    const newMovie = new Movie({ title, genre, director, rating, poster });
    await newMovie.save();
    res.status(201).json({ message: "Movie saved", movie: newMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to save movie" });
  }
});

// Endpoint to retrieve movies based on user preferences
router.get("/recommendations/:userId", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recommendedMovies = await Movie.find({
      genre: { $in: user.preferences.genres },
      director: { $in: user.preferences.directors },
    });
    res.status(200).json(recommendedMovies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Set up storage for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
}).single('poster');  // Expecting a 'poster' field in form data


module.exports = router;
