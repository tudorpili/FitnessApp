// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'my-very-secure-secret-key'; // Use a secret key for JWT

// SignUp Controller
const signUp = (req, res) => {
  const { username, email, password } = req.body;

  User.create(username, email, password, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error during sign-up' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
};

// Login Controller
const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error during login' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  });
};

module.exports = { signUp, login };
