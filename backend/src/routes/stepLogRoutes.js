// src/routes/stepLogRoutes.js
const express = require('express');
const stepLogController = require('../controllers/stepLogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/steps/adjust - Adjust today's step count for the authenticated user
router.post('/adjust', authenticateToken, stepLogController.adjustTodaySteps);

// Add other routes if needed (e.g., GET history)

module.exports = router;
