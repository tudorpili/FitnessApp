// backend/src/controllers/workoutPlanController.js
const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutPlanLike = require('../models/WorkoutPlanLike'); // Import the new model

const workoutPlanController = {
    createPlan: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id;
            const { name, description, exercises } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({ message: 'Plan name is required.' });
            }
            if (!Array.isArray(exercises) /*|| exercises.length === 0*/) { // Allow empty exercises initially if desired
                // return res.status(400).json({ message: 'At least one exercise must be provided.' });
            }

            const validatedExercises = (exercises || []).map(ex => {
                const exerciseId = parseInt(ex.exerciseId, 10);
                const targetSets = ex.targetSets !== undefined && ex.targetSets !== null && String(ex.targetSets).trim() !== ''
                    ? parseInt(ex.targetSets, 10)
                    : null;
                if (isNaN(exerciseId)) return null;
                if (targetSets !== null && (isNaN(targetSets) || targetSets <= 0)) return null;
                return { exerciseId, targetSets };
            }).filter(ex => ex !== null);

            // if (validatedExercises.length !== (exercises || []).length) {
            //     return res.status(400).json({ message: 'Invalid exercise data. Ensure exerciseId is valid and targetSets (if provided) is a positive number.' });
            // }
            // if (validatedExercises.length === 0 && exercises && exercises.length > 0) { // If exercises were provided but none were valid
            //      return res.status(400).json({ message: 'No valid exercises provided for the plan.' });
            // }


            const planData = { name: name.trim(), description: description?.trim() || null };
            // The model will set status to 'pending' by default due to DB schema
            const createdPlan = await WorkoutPlan.create(userId, planData, validatedExercises);
            res.status(201).json({ message: 'Workout plan created successfully! It is pending approval.', plan: createdPlan });
        } catch (error) {
            console.error('Error in createPlan controller:', error);
            res.status(500).json({ message: 'Error creating workout plan', error: error.message });
        }
    },

    getAllPlans: async (req, res) => {
        try {
            const requestingUserId = req.user?.id || null;
            const isAdmin = req.user?.role === 'Admin';
            const sortBy = req.query.sortBy || 'created_at'; // Default sort
            const sortOrder = req.query.sortOrder || 'DESC';   // Default order

            const plans = await WorkoutPlan.findAllWithDetails(requestingUserId, isAdmin, sortBy, sortOrder);
            res.status(200).json(plans);
        } catch (error) {
            console.error('Error in getAllPlans controller:', error);
            res.status(500).json({ message: 'Error fetching workout plans', error: error.message });
        }
    },

    getPlanById: async (req, res) => {
        try {
            const { planId } = req.params;
            const id = parseInt(planId, 10);
            const requestingUserId = req.user?.id || null;
            const isAdmin = req.user?.role === 'Admin';

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            const plan = await WorkoutPlan.findByIdWithDetails(id, requestingUserId, isAdmin);
            if (plan) {
                res.status(200).json(plan);
            } else {
                res.status(404).json({ message: `Workout plan with ID ${id} not found or not approved.` });
            }
        } catch (error) {
            console.error('Error in getPlanById controller:', error);
            res.status(500).json({ message: 'Error fetching workout plan details', error: error.message });
        }
    },

    updatePlan: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id; // User performing the update
            const userRole = req.user.role;
            const { planId } = req.params;
            const id = parseInt(planId, 10);
            const { name, description, exercises } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            if (!name || !name.trim()) {
                return res.status(400).json({ message: 'Plan name is required.' });
            }
            // Validation for exercises (same as create)
            const validatedExercises = (exercises || []).map(ex => { /* ... validation logic ... */
                const exerciseId = parseInt(ex.exerciseId, 10);
                const targetSets = ex.targetSets !== undefined && ex.targetSets !== null && String(ex.targetSets).trim() !== ''
                    ? parseInt(ex.targetSets, 10)
                    : null;
                if (isNaN(exerciseId)) return null;
                if (targetSets !== null && (isNaN(targetSets) || targetSets <= 0)) return null;
                return { exerciseId, targetSets };
            }).filter(ex => ex !== null);


            const planData = { name: name.trim(), description: description?.trim() || null };
            // The model's update method will handle permission checks and status changes
            const updatedPlan = await WorkoutPlan.update(id, userId, planData, validatedExercises, userRole);

            if (updatedPlan) {
                res.status(200).json({ message: 'Workout plan updated successfully!', plan: updatedPlan });
            } else {
                res.status(404).json({ message: `Workout plan ${id} not found or you do not have permission to update it.` });
            }
        } catch (error) {
            console.error('Error in updatePlan controller:', error);
             if (error.message.includes('permission')) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error updating workout plan', error: error.message });
        }
    },

    deletePlan: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id;
            const isAdmin = req.user.role === 'Admin';
            const { planId } = req.params;
            const id = parseInt(planId, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            const success = await WorkoutPlan.deleteByIdAndUser(id, userId, isAdmin);
            if (success) {
                res.status(200).json({ message: `Workout plan ${id} deleted successfully.` });
            } else {
                res.status(404).json({ message: `Workout plan ${id} not found or you do not have permission to delete it.` });
            }
        } catch (error) {
            console.error('Error in deletePlan controller:', error);
            if (error.message.includes('permission')) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error deleting workout plan', error: error.message });
        }
    },

    updatePlanStatus: async (req, res) => {
        try {
            // Assumes isAdmin middleware has already verified admin role
            const adminUserId = req.user.id;
            const { planId } = req.params;
            const { status } = req.body;
            const id = parseInt(planId, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected.' });
            }

            const updatedPlan = await WorkoutPlan.updateStatus(id, status, adminUserId);
            if (updatedPlan) {
                res.status(200).json({ message: `Workout plan ${id} status updated to ${status}.`, plan: updatedPlan });
            } else {
                res.status(404).json({ message: `Workout plan ${id} not found.` });
            }
        } catch (error) {
            console.error('Error in updatePlanStatus controller:', error);
            res.status(500).json({ message: 'Error updating plan status', error: error.message });
        }
    },

    likePlan: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id;
            const { planId } = req.params;
            const id = parseInt(planId, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            // Check if plan exists and is approved (users can only like approved plans)
            const plan = await WorkoutPlan.findByIdWithDetails(id, null, false); // Check as non-admin
            if (!plan || plan.status !== 'approved') {
                 return res.status(404).json({ message: 'Plan not found or not approved for liking.' });
            }

            await WorkoutPlanLike.addLike(userId, id);
            const updatedPlan = await WorkoutPlan.findByIdWithDetails(id, userId); // Fetch again to get updated like count and user_has_liked
            res.status(200).json({ message: 'Plan liked successfully!', plan: updatedPlan });
        } catch (error) {
            console.error('Error in likePlan controller:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                 const updatedPlan = await WorkoutPlan.findByIdWithDetails(parseInt(req.params.planId, 10), req.user.id);
                 return res.status(200).json({ message: 'Plan already liked.', plan: updatedPlan });
            }
            res.status(500).json({ message: 'Error liking plan', error: error.message });
        }
    },

    unlikePlan: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }
            const userId = req.user.id;
            const { planId } = req.params;
            const id = parseInt(planId, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid plan ID format.' });
            }
            await WorkoutPlanLike.removeLike(userId, id);
            const updatedPlan = await WorkoutPlan.findByIdWithDetails(id, userId); // Fetch again
            res.status(200).json({ message: 'Plan unliked successfully!', plan: updatedPlan });
        } catch (error) {
            console.error('Error in unlikePlan controller:', error);
            res.status(500).json({ message: 'Error unliking plan', error: error.message });
        }
    }
};

module.exports = workoutPlanController;
