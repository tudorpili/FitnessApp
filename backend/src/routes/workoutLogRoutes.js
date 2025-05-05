// src/routes/workoutLogRoutes.js
const express = require('express');
const workoutLogController = require('../controllers/workoutLogController');
// Import your authentication middleware
// Adjust the path based on your middleware location
const { authenticateToken } = require('../middleware/authMiddleware'); // Assuming you have this

const router = express.Router();

// --- Protected Workout Log Routes ---
// All routes in this file require the user to be authenticated.

// POST /api/workouts - Log a new workout session
// The authenticateToken middleware runs first to verify the user
router.post('/', authenticateToken, workoutLogController.logWorkoutSession);

// GET /api/workouts/history - Fetch workout history for the logged-in user
// Optionally accepts ?startDate=YYYY-MM-DD and ?endDate=YYYY-MM-DD query params
router.get('/history', authenticateToken, workoutLogController.getUserWorkoutHistory);

// Add other routes if needed later (e.g., DELETE /api/workouts/:sessionId)
// router.delete('/:sessionId', authenticateToken, workoutLogController.deleteWorkoutSession);

module.exports = router;
