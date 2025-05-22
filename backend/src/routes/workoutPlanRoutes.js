// backend/src/routes/workoutPlanRoutes.js
const express = require('express');
const workoutPlanController = require('../controllers/workoutPlanController');
// Import all needed middleware
const { authenticateToken, optionalAuthenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/plans - Get all plans (public can see approved, users see their own too, admins see all)
// Uses optionalAuthenticateToken because guests might view approved plans.
// The controller's getAllPlans method will use req.user if present.
router.get('/', optionalAuthenticateToken, workoutPlanController.getAllPlans);

// GET /api/plans/:planId - Get a single plan by ID
// Also uses optionalAuthenticateToken for similar reasons.
router.get('/:planId', optionalAuthenticateToken, workoutPlanController.getPlanById);

// POST /api/plans - Create a new workout plan (requires user to be logged in)
router.post('/', authenticateToken, workoutPlanController.createPlan);

// PUT /api/plans/:planId - Update a workout plan (requires user to be owner)
// The controller logic will verify ownership.
router.put('/:planId', authenticateToken, workoutPlanController.updatePlan);

// DELETE /api/plans/:planId - Delete a workout plan (requires user to be owner or admin)
// The controller logic will verify ownership or admin status.
router.delete('/:planId', authenticateToken, workoutPlanController.deletePlan);

// --- Admin Route for Plan Status ---
// PUT /api/plans/:planId/status - Update status of a plan (Admin only)
router.put('/:planId/status', authenticateToken, isAdmin, workoutPlanController.updatePlanStatus);

// --- Routes for Liking/Unliking Plans ---
// POST /api/plans/:planId/like - Like a plan (requires user to be logged in)
router.post('/:planId/like', authenticateToken, workoutPlanController.likePlan);

// DELETE /api/plans/:planId/like - Unlike a plan (requires user to be logged in)
router.delete('/:planId/like', authenticateToken, workoutPlanController.unlikePlan);


module.exports = router;
