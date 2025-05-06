// src/routes/mealLogRoutes.js
const express = require('express');
const mealLogController = require('../controllers/mealLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// --- Protected Meal Log Routes ---

// POST /api/meals - Add a new meal log entry for the authenticated user
router.post('/', authenticateToken, mealLogController.addMealLogEntry);

// GET /api/meals/history - Get meal log history for the authenticated user
// Optionally accepts ?startDate=YYYY-MM-DD and ?endDate=YYYY-MM-DD
router.get('/history', authenticateToken, mealLogController.getMealHistory);

// DELETE /api/meals/:logId - Delete a specific meal log entry for the authenticated user
router.delete('/:logId', authenticateToken, mealLogController.deleteMealLogEntry);

module.exports = router;
