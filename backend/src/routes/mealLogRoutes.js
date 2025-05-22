// src/routes/mealLogRoutes.js
const express = require('express');
const mealLogController = require('../controllers/mealLogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/meals - Add a new meal log entry
router.post('/', authenticateToken, mealLogController.addMealLogEntry);

// GET /api/meals/history - Get user's meal history (can be filtered by date)
router.get('/history', authenticateToken, mealLogController.getMealHistory);

// DELETE /api/meals/:logId - Delete a specific meal log entry
router.delete('/:logId', authenticateToken, mealLogController.deleteMealLogEntry);

// --- NEW: Route for exporting meal data ---
// GET /api/meals/export - Get all meal log data for the authenticated user
router.get('/export', authenticateToken, mealLogController.exportUserMealLogs);
// --- END NEW ---

module.exports = router;
