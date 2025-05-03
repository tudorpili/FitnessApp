// backend/src/controllers/authController.js

const User = require('../models/User.js'); // Import the User model
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Default expiry to 1 day

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1); // Exit if secret is missing
}

// --- Registration Controller ---
const register = async (req, res, next) => {
    // Extract data from request body
    const { username, email, password, role } = req.body; // Role might not always be provided from frontend

    console.log('[AuthController] Register attempt:', { username, email, role });

    // Basic Input Validation
    if (!username || !email || !password) {
        console.log('[AuthController] Register failed: Missing fields');
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    // Add more validation (password length, email format) if needed

    try {
        // Attempt to create user using the Model
        // The model handles password hashing and duplicate checks
        const newUser = await User.create({ username, email, password, role }); // Pass data to model

        // If successful, generate a JWT token
        const payload = {
            userId: newUser.id,
            username: newUser.username,
            role: newUser.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('[AuthController] Registration successful, token generated.');

        // Send back success response with token and user info (excluding password)
        res.status(201).json({
            message: 'User registered successfully!',
            token: token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('[AuthController] Registration error:', error.message);
        // Handle specific errors (like duplicates) thrown by the model
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        // Generic server error for other issues
        res.status(500).json({ message: 'Registration failed. Please try again later.' });
    }
};


// --- Login Controller ---
const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('[AuthController] Login attempt:', { email });

    // Basic Validation
    if (!email || !password) {
        console.log('[AuthController] Login failed: Missing fields');
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email using the Model
        const user = await User.findByEmail(email);

        // Check if user exists
        if (!user) {
            console.log('[AuthController] Login failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // Compare submitted password with stored hash using Model method
        const isMatch = await User.comparePassword(password, user.password_hash);

        if (!isMatch) {
            console.log('[AuthController] Login failed: Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // If password matches, generate JWT token
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('[AuthController] Login successful, token generated.');

        // Send back success response with token and user info (excluding password hash)
        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('[AuthController] Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
};


module.exports = {
    register,
    login
};
