// backend/src/routes/exerciseRoutes.js

const express = require('express');
const exerciseController = require('../controllers/exerciseController'); // Import controller functions

// Create an Express Router instance
const router = express.Router();

// Define routes and link them to controller functions

// GET /api/exercises - Fetch all exercises
router.get('/', exerciseController.getAllExercises);

// GET /api/exercises/:id - Fetch a single exercise by ID (Example for later)
// router.get('/:id', exerciseController.getExerciseById);

// POST /api/exercises - Create a new exercise (Add later)
// router.post('/', exerciseController.createExercise);

// PUT /api/exercises/:id - Update an exercise (Add later)
// router.put('/:id', exerciseController.updateExercise);

// DELETE /api/exercises/:id - Delete an exercise (Add later)
// router.delete('/:id', exerciseController.deleteExercise);


// Export the router
module.exports = router;
