const express = require('express');
const router = express.Router();
const { getWorkouts, addWorkout } = require('../controllers/workoutController');

router.get('/', getWorkouts);
router.post('/', addWorkout);

module.exports = router;
