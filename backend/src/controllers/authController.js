// backend/src/controllers/authController.js

const User = require('../models/User.js'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; 

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1); 
}


const register = async (req, res, next) => {
    
    const { username, email, password, role } = req.body; 

    console.log('[AuthController] Register attempt:', { username, email, role });

    
    if (!username || !email || !password) {
        console.log('[AuthController] Register failed: Missing fields');
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    

    try {
        
        
        const newUser = await User.create({ username, email, password, role }); 

        
        const payload = {
            userId: newUser.id,
            username: newUser.username,
            role: newUser.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('[AuthController] Registration successful, token generated.');

        
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
        
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message }); 
        }
        
        res.status(500).json({ message: 'Registration failed. Please try again later.' });
    }
};



const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('[AuthController] Login attempt:', { email });

    
    if (!email || !password) {
        console.log('[AuthController] Login failed: Missing fields');
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        
        const user = await User.findByEmail(email);

        
        if (!user) {
            console.log('[AuthController] Login failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials.' }); 
        }

        
        const isMatch = await User.comparePassword(password, user.password_hash);

        if (!isMatch) {
            console.log('[AuthController] Login failed: Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials.' }); 
        }

        
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('[AuthController] Login successful, token generated.');

        
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
