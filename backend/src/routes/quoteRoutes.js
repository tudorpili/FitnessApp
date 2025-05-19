// backend/src/routes/quoteRoutes.js
const express = require('express');
const quoteController = require('../controllers/quoteController');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Uncomment if adding protected routes

const router = express.Router();

// GET /api/quotes/random - Fetch a random quote
router.get('/random', quoteController.getRandomQuote);

// Optional: POST /api/quotes - Add a new quote (example of a protected route)
// router.post('/', authenticateToken, isAdmin, quoteController.addQuote);

module.exports = router;
