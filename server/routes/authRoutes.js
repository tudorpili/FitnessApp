// src/routes/authRoutes.js
const express = require('express');
const { signUp, login } = require('../controllers/authController');

const router = express.Router();

// POST /signup - Register new user
router.post('/signup', signUp);

// POST /login - Authenticate user and return JWT token
router.post('/login', login);

module.exports = router;
