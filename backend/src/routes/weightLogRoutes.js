// src/routes/weightLogRoutes.js
const express = require('express');
const weightLogController = require('../controllers/weightLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();

// POST /api/weight - Add or update a weight log entry
router.post('/', authenticateToken, weightLogController.addOrUpdateWeightLog);

// GET /api/weight/history - Get user's weight history
router.get('/history', authenticateToken, weightLogController.getWeightHistory);

// DELETE /api/weight/:logId - Delete a specific weight log entry
router.delete('/:logId', authenticateToken, weightLogController.deleteWeightLog);

// --- NEW: Route for exporting weight data ---
// GET /api/weight/export - Get all weight log data for the authenticated user
router.get('/export', authenticateToken, weightLogController.exportUserWeightLogs);
// --- END NEW ---

module.exports = router;
