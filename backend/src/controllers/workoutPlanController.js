// src/controllers/workoutPlanController.js
const WorkoutPlan = require('../models/WorkoutPlan');

const workoutPlanController = {
  /**
   * Handles POST request to create a new workout plan.
   * Requires user authentication.
   */
  createPlan: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      // Expecting exercises array: [{ exerciseId, targetSets? }]
      const { name, description, exercises } = req.body;

      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Plan name is required.' });
      }
      if (!Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ message: 'At least one exercise must be provided.' });
      }

      // Validate exercises structure
      const validatedExercises = exercises.map(ex => {
          const exerciseId = parseInt(ex.exerciseId, 10);
          // targetSets is optional, parse if present, ensure it's a positive integer or null
          const targetSets = ex.targetSets !== undefined && ex.targetSets !== null && String(ex.targetSets).trim() !== ''
                             ? parseInt(ex.targetSets, 10)
                             : null;

          if (isNaN(exerciseId)) return null; // Invalid exerciseId
          if (targetSets !== null && (isNaN(targetSets) || targetSets <= 0)) return null; // Invalid targetSets

          return { exerciseId, targetSets };
      }).filter(ex => ex !== null); // Filter out any invalid entries

      if (validatedExercises.length !== exercises.length) {
         return res.status(400).json({ message: 'Invalid exercise data provided. Ensure exerciseId is valid and targetSets (if provided) is a positive number.' });
      }
      if (validatedExercises.length === 0) {
           return res.status(400).json({ message: 'No valid exercises provided for the plan.' });
      }


      const planData = { name: name.trim(), description: description?.trim() || null };

      // Pass the validated exercises array (with targetSets) to the model
      const createdPlanHeader = await WorkoutPlan.create(userId, planData, validatedExercises);

      // Fetch the full details of the newly created plan to return
      const detailedPlan = await WorkoutPlan.findByIdWithDetails(createdPlanHeader.id);

      res.status(201).json({ message: 'Workout plan created successfully!', plan: detailedPlan });

    } catch (error) {
      console.error('Error in createPlan controller:', error);
      res.status(500).json({ message: 'Error creating workout plan', error: error.message });
    }
  },

  getAllPlans: async (req, res) => { /* ... (getAllPlans remains the same) ... */ try { const plans = await WorkoutPlan.findAllWithDetails(); res.status(200).json(plans); } catch (error) { console.error('Error in getAllPlans controller:', error); res.status(500).json({ message: 'Error fetching workout plans', error: error.message }); } },

  getPlanById: async (req, res) => { /* ... (getPlanById remains the same) ... */ try { const { planId } = req.params; const id = parseInt(planId, 10); if (isNaN(id)) { return res.status(400).json({ message: 'Invalid plan ID format.' }); } const plan = await WorkoutPlan.findByIdWithDetails(id); if (plan) { res.status(200).json(plan); } else { res.status(404).json({ message: `Workout plan with ID ${id} not found.` }); } } catch (error) { console.error('Error in getPlanById controller:', error); res.status(500).json({ message: 'Error fetching workout plan details', error: error.message }); } },

  /**
   * Handles PUT request to update an existing workout plan.
   * Requires user authentication and ownership.
   */
  updatePlan: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      const { planId } = req.params;
      const id = parseInt(planId, 10);
      // Expecting exercises array: [{ exerciseId, targetSets? }]
      const { name, description, exercises } = req.body;

      // Validation
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid plan ID format.' });
      }
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Plan name is required.' });
      }
       if (!Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ message: 'At least one exercise must be provided.' });
      }
       // Validate exercises structure
      const validatedExercises = exercises.map(ex => {
          const exerciseId = parseInt(ex.exerciseId, 10);
          const targetSets = ex.targetSets !== undefined && ex.targetSets !== null && String(ex.targetSets).trim() !== ''
                             ? parseInt(ex.targetSets, 10)
                             : null;
          if (isNaN(exerciseId)) return null;
          if (targetSets !== null && (isNaN(targetSets) || targetSets <= 0)) return null;
          return { exerciseId, targetSets };
      }).filter(ex => ex !== null);

       if (validatedExercises.length !== exercises.length) {
         return res.status(400).json({ message: 'Invalid exercise data provided. Ensure exerciseId is valid and targetSets (if provided) is a positive number.' });
       }
        if (validatedExercises.length === 0) {
           return res.status(400).json({ message: 'No valid exercises provided for the plan.' });
        }

      const planData = { name: name.trim(), description: description?.trim() || null };

      // Pass validated exercises array to the model update function
      const updatedPlanHeader = await WorkoutPlan.update(id, userId, planData, validatedExercises);

      if (updatedPlanHeader) {
         // Fetch the full details of the updated plan to return
        const detailedPlan = await WorkoutPlan.findByIdWithDetails(id);
        res.status(200).json({ message: 'Workout plan updated successfully!', plan: detailedPlan });
      } else {
        // Plan not found or user doesn't own it
        res.status(404).json({ message: `Workout plan ${id} not found or you do not have permission to update it.` });
      }
    } catch (error) {
      console.error('Error in updatePlan controller:', error);
      res.status(500).json({ message: 'Error updating workout plan', error: error.message });
    }
  },

  deletePlan: async (req, res) => { /* ... (deletePlan remains the same) ... */ try { if (!req.user || !req.user.id) { return res.status(401).json({ message: 'User not authenticated.' }); } const userId = req.user.id; const { planId } = req.params; const id = parseInt(planId, 10); if (isNaN(id)) { return res.status(400).json({ message: 'Invalid plan ID format.' }); } const success = await WorkoutPlan.deleteByIdAndUser(id, userId); if (success) { res.status(200).json({ message: `Workout plan ${id} deleted successfully.` }); } else { res.status(404).json({ message: `Workout plan ${id} not found or you do not have permission to delete it.` }); } } catch (error) { console.error('Error in deletePlan controller:', error); res.status(500).json({ message: 'Error deleting workout plan', error: error.message }); } },
};

module.exports = workoutPlanController;
