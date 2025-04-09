const Workout = require('../models/workoutModel');

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.getAllWorkouts();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addWorkout = async (req, res) => {
  try {
    const newWorkout = await Workout.createWorkout(req.body);
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
