// src/controllers/exerciseController.js
const Exercise = require('../models/Exercise');

const exerciseController = {
    // ... (getAllExercises, getExerciseById, createExercise, updateExercise, deleteExercise methods remain the same) ...
    getAllExercises: async (req, res) => {
        try {
            const exercises = await Exercise.findAll();
            res.status(200).json(exercises);
        } catch (error) {
            console.error('Error in getAllExercises controller:', error);
            res.status(500).json({ message: 'Error fetching exercises', error: error.message });
        }
    },

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

    createExercise: async (req, res) => {
        try {
            const exerciseData = req.body;
            if (!exerciseData.name || !exerciseData.name.trim()) {
                return res.status(400).json({ message: 'Exercise name is required.' });
            }
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
            const newExercise = await Exercise.create(exerciseData);
            res.status(201).json({ message: 'Exercise created successfully!', exercise: newExercise });
        } catch (error) {
            console.error('Error in createExercise controller:', error);
            if (error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error creating exercise', error: error.message });
        }
    },

    updateExercise: async (req, res) => {
        try {
            const { id } = req.params;
            const exerciseId = parseInt(id, 10);
            const exerciseData = req.body;
            if (isNaN(exerciseId)) {
                return res.status(400).json({ message: 'Invalid exercise ID format.' });
            }
            if (!exerciseData.name || !exerciseData.name.trim()) {
                return res.status(400).json({ message: 'Exercise name is required.' });
            }
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
                res.status(404).json({ message: `Exercise with ID ${exerciseId} not found.` });
            }
        } catch (error) {
            console.error('Error in updateExercise controller:', error);
            if (error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error updating exercise', error: error.message });
        }
    },

    deleteExercise: async (req, res) => {
        try {
            const { id } = req.params;
            const exerciseId = parseInt(id, 10);
            if (isNaN(exerciseId)) {
                return res.status(400).json({ message: 'Invalid exercise ID format.' });
            }
            const success = await Exercise.deleteById(exerciseId);
            if (success) {
                res.status(200).json({ message: `Exercise ${exerciseId} deleted successfully.` });
            } else {
                res.status(404).json({ message: `Exercise with ID ${exerciseId} not found.` });
            }
        } catch (error) {
            console.error('Error in deleteExercise controller:', error);
            res.status(500).json({ message: 'Error deleting exercise', error: error.message });
        }
    },

    // --- NEW CONTROLLER FUNCTION ---
    getExerciseProgressData: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id;
            const { exerciseId } = req.params;
            const { startDate, endDate, metric } = req.query; // metric can be 'max_weight', 'total_volume' etc.

            const idNum = parseInt(exerciseId, 10);
            if (isNaN(idNum)) {
                return res.status(400).json({ message: 'Invalid exercise ID.' });
            }

            const progressData = await Exercise.getExerciseProgress(userId, idNum, metric, startDate, endDate);
            res.status(200).json(progressData);

        } catch (error) {
            console.error('Error in getExerciseProgressData controller:', error);
            res.status(500).json({ message: 'Error fetching exercise progress data', error: error.message });
        }
    }
    // --- END NEW CONTROLLER FUNCTION ---
};

module.exports = exerciseController;
