// backend/src/routes/recipeRoutes.js
const express = require('express');
const recipeController = require('../controllers/recipeController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// GET /api/recipes - Get all recipes (public, filtered by model/controller for non-admins)
// For this route, authenticateToken is optional if public can see approved recipes.
// If authentication is required for all recipe viewing, add authenticateToken here.
// The controller will handle role-based filtering.
router.get('/', authenticateToken, recipeController.getAllRecipes); // Added authenticateToken to know user role

// GET /api/recipes/:id - Get a single recipe by ID
// Controller will handle if non-admin can see non-approved.
router.get('/:id', authenticateToken, recipeController.getRecipeById); // Added authenticateToken

// POST /api/recipes - Create a new recipe (requires user to be logged in)
router.post('/', authenticateToken, recipeController.createRecipe);

// PUT /api/recipes/:id - Update a recipe (requires user to be logged in and be creator or admin)
router.put('/:id', authenticateToken, recipeController.updateRecipe);

// DELETE /api/recipes/:id - Delete a recipe (requires user to be logged in and be creator or admin)
router.delete('/:id', authenticateToken, recipeController.deleteRecipe);

// --- NEW ROUTE for Admin to update recipe status ---
// PUT /api/recipes/:id/status - Update status of a recipe (Admin only)
router.put('/:id/status', authenticateToken, isAdmin, recipeController.updateRecipeStatus);

module.exports = router;
