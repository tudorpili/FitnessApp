// src/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// --- Protected Dashboard Routes ---

// GET /api/dashboard/recent-activity - Fetch recent activity for the logged-in user
router.get('/recent-activity', authenticateToken, dashboardController.getRecentActivity);

// GET /api/dashboard/today-summary - Fetch nutritional summary for today
// --- FIX: Add this line ---
router.get('/today-summary', authenticateToken, dashboardController.getTodaySummary);

// Add other dashboard routes here later (e.g., /weight-trend)

module.exports = router;
