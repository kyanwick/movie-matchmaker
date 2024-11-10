const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    genre: [String],
    director: String,
    rating: Number,
    poster: String // path to the image
});

module.exports = mongoose.model('Movie', movieSchema);
