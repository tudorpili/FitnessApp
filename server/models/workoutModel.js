const db = require('../config/db');

// Get all workouts
const getAllWorkouts = async () => {
  const [rows, fields] = await db.promise().query('SELECT * FROM workouts ORDER BY created_at DESC');
  return rows;
};

// Add a new workout
const createWorkout = async ({ title, reps, weight }) => {
  const [result] = await db.promise().query(
    'INSERT INTO workouts (title, reps, weight) VALUES (?, ?, ?)',
    [title, reps, weight]
  );
  return { id: result.insertId, title, reps, weight };
};

module.exports = { getAllWorkouts, createWorkout };
