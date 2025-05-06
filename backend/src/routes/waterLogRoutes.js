// src/routes/waterLogRoutes.js
const express = require('express');
const waterLogController = require('../controllers/waterLogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/water/adjust - Adjust today's water intake for the authenticated user
router.post('/adjust', authenticateToken, waterLogController.adjustTodayWater);

// Add other routes if needed (e.g., GET history)

module.exports = router;
