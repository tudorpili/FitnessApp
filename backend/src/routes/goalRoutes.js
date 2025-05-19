// src/routes/goalRoutes.js
const express = require('express');
const goalController = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All goal routes require authentication
router.use(authenticateToken);

// POST /api/goals - Create a new goal
router.post('/', goalController.createGoal);

// GET /api/goals - Get all active goals for the user
router.get('/', goalController.getActiveGoals);

// PUT /api/goals/:goalId - Update a specific goal
router.put('/:goalId', goalController.updateGoal);

// DELETE /api/goals/:goalId - Delete a specific goal
router.delete('/:goalId', goalController.deleteGoal);

module.exports = router;
