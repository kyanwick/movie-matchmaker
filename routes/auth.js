const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow CORS for this route
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
});


// Backend (e.g., in auth route)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create a JWT token and send it back along with userId
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with userId and token
        res.status(200).json({ userId: user._id, token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});




module.exports = router;
