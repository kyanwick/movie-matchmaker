// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    genres: [String],         // Array of preferred genres
    directors: [String],      // Array of favorite directors
    moviesWatched: [String],  // Array of movie IDs the user has watched
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
