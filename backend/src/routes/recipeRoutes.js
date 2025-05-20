// backend/src/routes/recipeRoutes.js
const express = require('express');
const recipeController = require('../controllers/recipeController');
// Import all needed middleware
const { authenticateToken, optionalAuthenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/recipes - Get all recipes.
// Use optionalAuthenticateToken: if token is valid, req.user is set. If not, req.user is undefined.
// The controller will then decide what to show based on req.user.role.
router.get('/', optionalAuthenticateToken, recipeController.getAllRecipes);

// GET /api/recipes/:id - Get a single recipe by ID.
// Same logic: optional auth, controller decides visibility.
router.get('/:id', optionalAuthenticateToken, recipeController.getRecipeById);

// POST /api/recipes - Create a new recipe (requires user to be logged in)
router.post('/', authenticateToken, recipeController.createRecipe);

// PUT /api/recipes/:id - Update a recipe (requires user to be logged in and be creator or admin)
router.put('/:id', authenticateToken, recipeController.updateRecipe);

// DELETE /api/recipes/:id - Delete a recipe (requires user to be logged in and be creator or admin)
router.delete('/:id', authenticateToken, recipeController.deleteRecipe);

// PUT /api/recipes/:id/status - Update status of a recipe (Admin only)
router.put('/:id/status', authenticateToken, isAdmin, recipeController.updateRecipeStatus);

module.exports = router;
