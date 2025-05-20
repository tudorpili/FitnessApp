// src/controllers/workoutLogController.js
const WorkoutSession = require('../models/WorkoutSession');
const db = require('../config/db'); // Import db for direct query if WorkoutSession model isn't sufficient

const workoutLogController = {
  // ... logWorkoutSession, getUserWorkoutHistory (existing methods) ...
  logWorkoutSession: async (req, res) => {
    try {
      const { sessionDate, name, notes, durationSeconds, exercises } = req.body;
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      if (!sessionDate || !Array.isArray(exercises)) {
        return res.status(400).json({ message: 'Missing required fields: sessionDate and exercises array.' });
      }
      if (exercises.some(ex => !ex.exerciseId || !Array.isArray(ex.sets))) {
         return res.status(400).json({ message: 'Invalid exercises data structure. Each exercise needs exerciseId and a sets array.' });
      }
      const sessionData = { userId, sessionDate, name, notes, durationSeconds, };
      const createdSession = await WorkoutSession.create(sessionData, exercises);
      res.status(201).json({ message: 'Workout logged successfully!', session: createdSession });
    } catch (error) {
      console.error('Error in logWorkoutSession controller:', error);
      res.status(500).json({ message: 'Error logging workout session', error: error.message });
    }
  },

  getUserWorkoutHistory: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const history = await WorkoutSession.findUserSessionsWithDetails(userId, startDate, endDate);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error in getUserWorkoutHistory controller:', error);
        res.status(500).json({ message: 'Error fetching workout history', error: error.message });
    }
  },

  // --- NEW: Function to get all workout data for export ---
  exportUserWorkouts: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // Fetch all workout sessions for the user
      const sessionsSql = `
        SELECT 
          ws.id as session_id, 
          ws.session_date, 
          ws.name as session_name, 
          ws.notes as session_notes, 
          ws.duration_seconds
        FROM workout_sessions ws
        WHERE ws.user_id = ?
        ORDER BY ws.session_date DESC, ws.created_at DESC
      `;
      const [sessions] = await db.query(sessionsSql, [userId]);

      if (sessions.length === 0) {
        return res.status(200).json([]); // Return empty if no workouts
      }

      const sessionIds = sessions.map(s => s.session_id);

      // Fetch all exercises and sets for these sessions
      const exercisesSql = `
        SELECT 
          wse.session_id,
          e.name as exercise_name,
          wse.set_number,
          wse.reps,
          wse.weight,
          wse.unit
        FROM workout_session_exercises wse
        JOIN exercises e ON wse.exercise_id = e.id
        WHERE wse.session_id IN (?)
        ORDER BY wse.session_id, e.name, wse.set_number ASC 
      `;
      // Use [sessionIds] to ensure it's correctly formatted for IN clause if sessionIds is empty
      const [exerciseDetails] = await db.query(exercisesSql, [sessionIds.length > 0 ? sessionIds : [0]]);


      // Structure data for export: one row per set, duplicating session info
      const exportData = [];
      sessions.forEach(session => {
        const setsForThisSession = exerciseDetails.filter(ex => ex.session_id === session.session_id);
        if (setsForThisSession.length > 0) {
          setsForThisSession.forEach(set => {
            exportData.push({
              session_date: session.session_date ? new Date(session.session_date).toISOString().split('T')[0] : null,
              session_name: session.session_name,
              duration_seconds: session.duration_seconds,
              exercise_name: set.exercise_name,
              set_number: set.set_number,
              reps: set.reps,
              weight: set.weight,
              unit: set.unit,
              session_notes: session.session_notes, // Notes are per session
            });
          });
        } else {
          // Include session even if it has no exercises logged (e.g., just duration)
          exportData.push({
            session_date: session.session_date ? new Date(session.session_date).toISOString().split('T')[0] : null,
            session_name: session.session_name,
            duration_seconds: session.duration_seconds,
            exercise_name: null,
            set_number: null,
            reps: null,
            weight: null,
            unit: null,
            session_notes: session.session_notes,
          });
        }
      });

      res.status(200).json(exportData);

    } catch (error) {
      console.error('Error in exportUserWorkouts controller:', error);
      res.status(500).json({ message: 'Error exporting workout data', error: error.message });
    }
  }
  // --- END NEW ---
};

module.exports = workoutLogController;
