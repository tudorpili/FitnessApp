// src/routes/recipeRoutes.js

const express = require('express');
// Import the recipe controller containing handler functions
const recipeController = require('../controllers/recipeController');
// Import any necessary middleware (e.g., for authentication/authorization)
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Example

// Create a new Express router instance
const router = express.Router();

// --- Public Routes (No Authentication Required) ---

// GET /api/recipes - Fetch all recipes
router.get('/', recipeController.getAllRecipes);

// GET /api/recipes/:id - Fetch a single recipe by ID
router.get('/:id', recipeController.getRecipeById);

// --- Protected Routes (Example: Assuming Authentication is needed) ---
// You would uncomment and use middleware like 'authenticateToken'
// if you want to protect these routes

// POST /api/recipes - Create a new recipe
// router.post('/', authenticateToken, recipeController.createRecipe); // Example with auth
router.post('/', recipeController.createRecipe); // Current: No auth

// PUT /api/recipes/:id - Update a recipe by ID
// router.put('/:id', authenticateToken, recipeController.updateRecipe); // Example with auth
router.put('/:id', recipeController.updateRecipe); // Current: No auth

// DELETE /api/recipes/:id - Delete a recipe by ID
// router.delete('/:id', authenticateToken, recipeController.deleteRecipe); // Example with auth (maybe check ownership or admin role)
// router.delete('/:id', authenticateToken, isAdmin, recipeController.deleteRecipe); // Example with admin auth
router.delete('/:id', recipeController.deleteRecipe); // Current: No auth

// Export the router to be used in the main server file
module.exports = router;
