const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();


const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI) // mongodb://localhost:27017/testdb

.then(() => console.log("Connected to Azure Cosmos DB"))
.catch(err => console.error("Failed to connect to Azure Cosmos DB", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// for uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });
