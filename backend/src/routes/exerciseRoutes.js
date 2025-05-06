// src/routes/exerciseRoutes.js
const express = require('express');
const exerciseController = require('../controllers/exerciseController');
// Import authentication and authorization middleware
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Assuming isAdmin exists

const router = express.Router();

// --- Public Exercise Routes ---

// GET /api/exercises - Fetch all exercises
router.get('/', exerciseController.getAllExercises);

// GET /api/exercises/:id - Fetch a single exercise by ID
router.get('/:id', exerciseController.getExerciseById);


// --- Admin-Only Exercise Routes ---
// These routes require the user to be authenticated AND have an 'Admin' role.

// POST /api/exercises - Create a new exercise
router.post('/', authenticateToken, isAdmin, exerciseController.createExercise);

// PUT /api/exercises/:id - Update an existing exercise
router.put('/:id', authenticateToken, isAdmin, exerciseController.updateExercise);

// DELETE /api/exercises/:id - Delete an exercise
router.delete('/:id', authenticateToken, isAdmin, exerciseController.deleteExercise);


module.exports = router;
