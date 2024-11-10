// models/Movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],               // Array of genres
  director: String,
  rating: Number,                // Average rating
  poster: String,                // URL to movie poster image
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
