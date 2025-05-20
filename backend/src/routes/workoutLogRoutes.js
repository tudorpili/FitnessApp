// src/routes/workoutLogRoutes.js
const express = require('express');
const workoutLogController = require('../controllers/workoutLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();

// POST /api/workouts - Log a new workout session
router.post('/', authenticateToken, workoutLogController.logWorkoutSession);

// GET /api/workouts/history - Get user's workout history
router.get('/history', authenticateToken, workoutLogController.getUserWorkoutHistory);

// --- NEW: Route for exporting workout data ---
// GET /api/workouts/export - Get all workout data for the authenticated user
router.get('/export', authenticateToken, workoutLogController.exportUserWorkouts);
// --- END NEW ---

module.exports = router;
