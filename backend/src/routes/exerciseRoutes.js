// src/routes/exerciseRoutes.js
const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseById);

// Admin protected routes for CRUD on exercises
router.post('/', authenticateToken, isAdmin, exerciseController.createExercise);
router.put('/:id', authenticateToken, isAdmin, exerciseController.updateExercise);
router.delete('/:id', authenticateToken, isAdmin, exerciseController.deleteExercise);

// --- NEW ROUTE for exercise progress ---
// GET /api/exercises/:exerciseId/progress - Fetch progress data for a specific exercise
// Requires user to be authenticated
router.get('/:exerciseId/progress', authenticateToken, exerciseController.getExerciseProgressData);
// --- END NEW ROUTE ---

module.exports = router;
