// src/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// --- Protected Dashboard Routes ---

// GET /api/dashboard/recent-activity - Fetch recent activity
router.get('/recent-activity', authenticateToken, dashboardController.getRecentActivity);

// GET /api/dashboard/today-summary - Fetch today's summary
router.get('/today-summary', authenticateToken, dashboardController.getTodaySummary);

// GET /api/dashboard/weight-trend - Fetch weight data for chart
router.get('/weight-trend', authenticateToken, dashboardController.getWeightTrend);

// GET /api/dashboard/calorie-trend - Fetch calorie data for chart
router.get('/calorie-trend', authenticateToken, dashboardController.getCalorieTrend);

// --- NEW: Goals Progress Route ---
// GET /api/dashboard/goals-progress - Fetch active goals with current progress
router.get('/goals-progress', authenticateToken, dashboardController.getGoalsProgress);


module.exports = router;
