const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movieRoutes");
const preferencesRouter = require('./routes/preferences');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and enabling CORS
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://movie-recommender-app.azurewebsites.net/', // Update this to your deployed frontend URL
    credentials: true,
}));

// Connect to MongoDB (Cosmos DB) using environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to Azure Cosmos DB"))
.catch(err => console.error("Failed to connect to Azure Cosmos DB", err));

// Routes for authentication, movies, and preferences
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api", preferencesRouter);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Serve static files from the "public/build" directory for the frontend
app.use(express.static(path.join(__dirname, 'public', 'build')));

// Fallback route for the frontend React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});