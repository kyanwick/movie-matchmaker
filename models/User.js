const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    preferences: {
        genres: [String],
        directors: [String]
    },
    watchHistory: [String] // array of movie IDs
});

module.exports = mongoose.model('User', userSchema);
