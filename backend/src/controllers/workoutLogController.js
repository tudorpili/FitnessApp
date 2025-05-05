// src/controllers/workoutLogController.js
const WorkoutSession = require('../models/WorkoutSession');

const workoutLogController = {
  /**
   * Handles POST request to log a new workout session.
   * Expects session details and exercises array in req.body.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  logWorkoutSession: async (req, res) => {
    try {
      // Extract data from request body
      const { sessionDate, name, notes, durationSeconds, exercises } = req.body;

      // --- Validation ---
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Check for required fields
      if (!sessionDate || !Array.isArray(exercises)) {
        return res.status(400).json({ message: 'Missing required fields: sessionDate and exercises array.' });
      }
      // Optional: Add more specific validation for date format, exercise structure, etc.
      if (exercises.some(ex => !ex.exerciseId || !Array.isArray(ex.sets))) {
         return res.status(400).json({ message: 'Invalid exercises data structure. Each exercise needs exerciseId and a sets array.' });
      }
      // --- End Validation ---

      // Prepare session data object for the model
      const sessionData = {
        userId,
        sessionDate,
        name, // Will be handled as null if undefined by the model
        notes,
        durationSeconds,
      };

      // Call the model function to create the log (handles transaction)
      const createdSession = await WorkoutSession.create(sessionData, exercises);

      // Send success response
      res.status(201).json({ message: 'Workout logged successfully!', session: createdSession });

    } catch (error) {
      console.error('Error in logWorkoutSession controller:', error);
      // Handle specific errors if needed (e.g., validation errors from DB)
      res.status(500).json({ message: 'Error logging workout session', error: error.message });
    }
  },

  /**
   * Handles GET request to fetch the workout history for the authenticated user.
   * Optionally accepts startDate and endDate query parameters.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  getUserWorkoutHistory: async (req, res) => {
    try {
        // 1. Check for authenticated user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;

        // 2. Get optional date filters from query parameters
        const { startDate, endDate } = req.query;
        // Optional: Add validation for date formats if needed

        // Call the model function to fetch history with details
        const history = await WorkoutSession.findUserSessionsWithDetails(userId, startDate, endDate);

        // Send success response
        res.status(200).json(history);

    } catch (error) {
        console.error('Error in getUserWorkoutHistory controller:', error);
        res.status(500).json({ message: 'Error fetching workout history', error: error.message });
    }
  }

  // Add other controller methods if needed (e.g., deleteWorkoutSession)
};

module.exports = workoutLogController;
