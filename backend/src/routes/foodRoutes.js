// src/routes/foodRoutes.js
const express = require('express');
const foodController = require('../controllers/foodController');
// const { authenticateToken } = require('../middleware/authMiddleware'); // If needed later

const router = express.Router();

// GET /api/foods/search?q=<searchTerm> - Search for food items
// This is likely a public endpoint
router.get('/search', foodController.searchFoods);

// Add other routes if needed (e.g., GET /api/foods/:id, POST /api/foods)
// router.get('/:id', foodController.getFoodById);
// router.post('/', authenticateToken, foodController.createFood); // Example protected route

module.exports = router;
