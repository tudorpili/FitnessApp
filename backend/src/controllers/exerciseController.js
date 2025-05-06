// src/controllers/exerciseController.js
const Exercise = require('../models/Exercise');

const exerciseController = {
  /**
   * Handles GET request to fetch all exercises. Public endpoint.
   */
  getAllExercises: async (req, res) => {
    try {
      const exercises = await Exercise.findAll();
      res.status(200).json(exercises);
    } catch (error) {
      console.error('Error in getAllExercises controller:', error);
      res.status(500).json({ message: 'Error fetching exercises', error: error.message });
    }
  },

  /**
   * Handles GET request to fetch a single exercise by ID. Public endpoint.
   */
  getExerciseById: async (req, res) => {
    try {
      const { id } = req.params;
      const exerciseId = parseInt(id, 10);
      if (isNaN(exerciseId)) {
        return res.status(400).json({ message: 'Invalid exercise ID format.' });
      }
      const exercise = await Exercise.findById(exerciseId);
      if (exercise) {
        res.status(200).json(exercise);
      } else {
        res.status(404).json({ message: `Exercise with ID ${exerciseId} not found.` });
      }
    } catch (error) {
      console.error('Error in getExerciseById controller:', error);
      res.status(500).json({ message: 'Error fetching exercise', error: error.message });
    }
  },

  /**
   * Handles POST request to create a new exercise. Requires Admin role.
   */
  createExercise: async (req, res) => {
    try {
      // Assumes isAdmin middleware ran and verified role, or check here:
      // if (!req.user || req.user.role !== 'Admin') {
      //   return res.status(403).json({ message: 'Forbidden: Admin privileges required.' });
      // }

      const exerciseData = req.body;

      // Basic Validation
      if (!exerciseData.name || !exerciseData.name.trim()) {
        return res.status(400).json({ message: 'Exercise name is required.' });
      }
      // Ensure videos is an array if provided
      if (exerciseData.videos && !Array.isArray(exerciseData.videos)) {
         try {
             // Attempt to parse if it's a string, otherwise default to empty array
             exerciseData.videos = JSON.parse(exerciseData.videos);
             if (!Array.isArray(exerciseData.videos)) exerciseData.videos = [];
         } catch (e) {
             exerciseData.videos = []; // Default to empty if parsing fails
         }
      } else if (!exerciseData.videos) {
          exerciseData.videos = []; // Default to empty array if not provided
      }


      const newExercise = await Exercise.create(exerciseData);
      res.status(201).json({ message: 'Exercise created successfully!', exercise: newExercise });

    } catch (error) {
      console.error('Error in createExercise controller:', error);
       // Handle potential duplicate name error from model
      if (error.message.includes('already exists')) {
           return res.status(409).json({ message: error.message }); // 409 Conflict
      }
      res.status(500).json({ message: 'Error creating exercise', error: error.message });
    }
  },

  /**
   * Handles PUT request to update an existing exercise. Requires Admin role.
   */
  updateExercise: async (req, res) => {
    try {
      // Assumes isAdmin middleware ran and verified role

      const { id } = req.params;
      const exerciseId = parseInt(id, 10);
      const exerciseData = req.body;

      if (isNaN(exerciseId)) {
        return res.status(400).json({ message: 'Invalid exercise ID format.' });
      }
      if (!exerciseData.name || !exerciseData.name.trim()) {
        return res.status(400).json({ message: 'Exercise name is required.' });
      }
       // Ensure videos is an array if provided
      if (exerciseData.videos && !Array.isArray(exerciseData.videos)) {
         try {
             exerciseData.videos = JSON.parse(exerciseData.videos);
             if (!Array.isArray(exerciseData.videos)) exerciseData.videos = [];
         } catch (e) {
             exerciseData.videos = [];
         }
      } else if (!exerciseData.videos) {
          exerciseData.videos = [];
      }

      const updatedExercise = await Exercise.update(exerciseId, exerciseData);

      if (updatedExercise) {
        res.status(200).json({ message: 'Exercise updated successfully!', exercise: updatedExercise });
      } else {
        // Exercise not found
        res.status(404).json({ message: `Exercise with ID ${exerciseId} not found.` });
      }
    } catch (error) {
      console.error('Error in updateExercise controller:', error);
      if (error.message.includes('already exists')) {
           return res.status(409).json({ message: error.message }); // 409 Conflict
      }
      res.status(500).json({ message: 'Error updating exercise', error: error.message });
    }
  },

  /**
   * Handles DELETE request to remove an exercise. Requires Admin role.
   */
  deleteExercise: async (req, res) => {
    try {
       // Assumes isAdmin middleware ran and verified role

      const { id } = req.params;
      const exerciseId = parseInt(id, 10);

      if (isNaN(exerciseId)) {
        return res.status(400).json({ message: 'Invalid exercise ID format.' });
      }

      const success = await Exercise.deleteById(exerciseId);

      if (success) {
        res.status(200).json({ message: `Exercise ${exerciseId} deleted successfully.` });
        // Or res.status(204).send();
      } else {
        res.status(404).json({ message: `Exercise with ID ${exerciseId} not found.` });
      }
    } catch (error) {
      console.error('Error in deleteExercise controller:', error);
      res.status(500).json({ message: 'Error deleting exercise', error: error.message });
    }
  }
};

module.exports = exerciseController;
