// backend/src/controllers/recipeController.js
const Recipe = require('../models/Recipe');

const recipeController = {
  getAllRecipes: async (req, res) => {
    try {
      // Check if the user is an admin. req.user is populated by authenticateToken middleware.
      // If no user is authenticated (e.g., public request), isAdmin will be false.
      const isAdmin = req.user && req.user.role === 'Admin';
      
      // Pass the isAdmin flag to the model's findAll method
      const recipes = await Recipe.findAll(isAdmin);
      
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error in getAllRecipes controller:', error);
      res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
  },

  getRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      const recipe = await Recipe.findById(recipeId);

      if (recipe) {
        // For non-admins, only show if approved. Admins can see any recipe by ID.
        if (req.user?.role !== 'Admin' && recipe.status !== 'approved') {
            // If the recipe is not approved and user is not admin, pretend it's not found
            // Or, you could return a 403 Forbidden if you want to be more explicit
            return res.status(404).json({ message: `Recipe with ID ${recipeId} not found or not approved.` });
        }
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found.` });
      }
    } catch (error) {
      console.error('Error in getRecipeById controller:', error);
      res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
  },

  createRecipe: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated. Please log in to create a recipe.' });
      }
      const userId = req.user.id; // Get user ID from authenticated user
      const recipeData = req.body;

      if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
        return res.status(400).json({ message: 'Missing required fields (title, ingredients, instructions).' });
      }
      // The model will set the status to 'pending' by default.
      const newRecipe = await Recipe.create(recipeData, userId);
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error('Error in createRecipe controller:', error);
      res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
  },

  updateRecipe: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const currentUserId = req.user.id;
      const currentUserRole = req.user.role;

      const { id } = req.params;
      const recipeData = req.body;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }
      if (!recipeData.title) { // Basic validation
        return res.status(400).json({ message: 'Recipe title is required.' });
      }

      const updatedRecipe = await Recipe.update(recipeId, recipeData, currentUserId, currentUserRole);

      if (updatedRecipe) {
        res.status(200).json(updatedRecipe);
      } else {
        // This case might mean recipe not found, or permission denied by the model
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found or update not permitted.` });
      }
    } catch (error) {
      console.error('Error in updateRecipe controller:', error);
      if (error.message.includes('permission')) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const currentUserId = req.user.id;
      const currentUserRole = req.user.role;

      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }
      
      const success = await Recipe.delete(recipeId, currentUserId, currentUserRole);

      if (success) {
        res.status(200).json({ message: `Recipe with ID ${recipeId} deleted successfully.` });
      } else {
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found or deletion not permitted.` });
      }
    } catch (error) {
      console.error('Error in deleteRecipe controller:', error);
      if (error.message.includes('permission')) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
  },

  // New controller function for updating recipe status
  updateRecipeStatus: async (req, res) => {
    try {
      // This route should be admin-only, ensured by middleware in routes file
      const adminUserId = req.user.id; // Admin performing the action
      const { id } = req.params;
      const { status } = req.body; // Expected: 'approved', 'rejected', or 'pending'
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }
      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid or missing status. Must be one of: approved, rejected, pending.' });
      }

      const updatedRecipe = await Recipe.updateStatus(recipeId, status, adminUserId);

      if (updatedRecipe) {
        res.status(200).json({ message: `Recipe ${recipeId} status updated to ${status}.`, recipe: updatedRecipe });
      } else {
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found.` });
      }
    } catch (error) {
      console.error('Error in updateRecipeStatus controller:', error);
      res.status(500).json({ message: 'Error updating recipe status', error: error.message });
    }
  }
};

module.exports = recipeController;
