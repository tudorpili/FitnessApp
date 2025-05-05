// src/routes/weightLogRoutes.js
const express = require('express');
const weightLogController = require('../controllers/weightLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// --- Protected Weight Log Routes ---

// POST /api/weight - Add or update a weight log entry for the authenticated user
router.post('/', authenticateToken, weightLogController.addOrUpdateWeightLog);

// GET /api/weight/history - Get weight log history for the authenticated user
router.get('/history', authenticateToken, weightLogController.getWeightHistory);

// DELETE /api/weight/:logId - Delete a specific weight log entry for the authenticated user
router.delete('/:logId', authenticateToken, weightLogController.deleteWeightLog);

module.exports = router;
