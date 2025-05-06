// src/routes/workoutPlanRoutes.js
const express = require('express');
const workoutPlanController = require('../controllers/workoutPlanController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// GET /api/plans - Fetch all workout plans (Public)
router.get('/', workoutPlanController.getAllPlans);

// GET /api/plans/:planId - Fetch a single workout plan by ID (Public)
router.get('/:planId', workoutPlanController.getPlanById);

// POST /api/plans - Create a new workout plan (Requires Auth)
router.post('/', authenticateToken, workoutPlanController.createPlan);

// DELETE /api/plans/:planId - Delete a workout plan (Requires Auth & Ownership)
router.delete('/:planId', authenticateToken, workoutPlanController.deletePlan);

// PUT /api/plans/:planId - Update a workout plan (Requires Auth & Ownership)
// TODO: Implement update route and controller if needed
router.put('/:planId', authenticateToken, workoutPlanController.updatePlan);

module.exports = router;
