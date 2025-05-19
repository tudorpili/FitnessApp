// src/controllers/workoutLogController.js
const WorkoutSession = require('../models/WorkoutSession');

const workoutLogController = {
  
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
      

      
      const sessionData = {
        userId,
        sessionDate,
        name, 
        notes,
        durationSeconds,
      };

      
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
  }

  
};

module.exports = workoutLogController;
