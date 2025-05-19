// src/routes/workoutLogRoutes.js
const express = require('express');
const workoutLogController = require('../controllers/workoutLogController');


const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();






router.post('/', authenticateToken, workoutLogController.logWorkoutSession);



router.get('/history', authenticateToken, workoutLogController.getUserWorkoutHistory);




module.exports = router;
