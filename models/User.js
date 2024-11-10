// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
        genres: [String],         // Array of genre IDs
        decade: String,           // E.g., "2010s"
        pace: String,             // E.g., "Medium"
        themes: [String],         // Array of theme/mood preferences
        director: String,         // Director ID
        length: String,           // Preferred movie length
        language: String,         // E.g., "en"
        franchise: Boolean,       // Franchise preference
        blockbuster: Boolean      // Blockbuster vs. Indie preference
  },
});

module.exports =  mongoose.model("User", userSchema);

