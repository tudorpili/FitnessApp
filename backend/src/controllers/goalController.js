// src/controllers/goalController.js
const Goal = require('../models/Goal');

const goalController = {
  /** Create a new goal */
  createGoal: async (req, res) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
      const userId = req.user.id;
      // Basic validation (add more as needed)
      const { goal_type, target_value } = req.body;
      if (!goal_type || target_value === undefined) {
        return res.status(400).json({ message: 'Goal type and target value are required.' });
      }
      const newGoal = await Goal.create(userId, req.body);
      res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
    } catch (error) {
      res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
  },

  /** Get active goals for the logged-in user */
  getActiveGoals: async (req, res) => {
     try {
      if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
      const userId = req.user.id;
      const goals = await Goal.findActiveByUserId(userId);
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching goals', error: error.message });
    }
  },

  /** Update a specific goal */
  updateGoal: async (req, res) => {
     try {
      if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
      const userId = req.user.id;
      const { goalId } = req.params;
      const id = parseInt(goalId, 10);
      if (isNaN(id)) return res.status(400).json({ message: 'Invalid goal ID.' });

      const updatedGoal = await Goal.update(id, userId, req.body);
      if (!updatedGoal) {
        return res.status(404).json({ message: 'Goal not found or user mismatch.' });
      }
      res.status(200).json({ message: 'Goal updated successfully', goal: updatedGoal });
    } catch (error) {
      res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
  },

  /** Delete a specific goal */
  deleteGoal: async (req, res) => {
     try {
      if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
      const userId = req.user.id;
      const { goalId } = req.params;
      const id = parseInt(goalId, 10);
      if (isNaN(id)) return res.status(400).json({ message: 'Invalid goal ID.' });

      const success = await Goal.deleteByIdAndUser(id, userId);
      if (!success) {
        return res.status(404).json({ message: 'Goal not found or user mismatch.' });
      }
      res.status(200).json({ message: 'Goal deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting goal', error: error.message });
    }
  }
};

module.exports = goalController;
