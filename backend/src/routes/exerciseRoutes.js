// src/routes/exerciseRoutes.js
const express = require('express');
const exerciseController = require('../controllers/exerciseController');

const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); 

const router = express.Router();




router.get('/', exerciseController.getAllExercises);


router.get('/:id', exerciseController.getExerciseById);






router.post('/', authenticateToken, isAdmin, exerciseController.createExercise);


router.put('/:id', authenticateToken, isAdmin, exerciseController.updateExercise);


router.delete('/:id', authenticateToken, isAdmin, exerciseController.deleteExercise);


module.exports = router;
