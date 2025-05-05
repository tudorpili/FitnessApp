// src/controllers/recipeController.js

// Import the Recipe model
const Recipe = require('../models/Recipe');

// Controller object to hold request handler functions
const recipeController = {
  /**
   * Handles GET request to fetch all recipes.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  getAllRecipes: async (req, res) => {
    try {
      // Call the findAll method from the Recipe model
      const recipes = await Recipe.findAll();
      // Send a success response with the fetched recipes as JSON
      res.status(200).json(recipes);
    } catch (error) {
      // Log the error for server-side debugging
      console.error('Error in getAllRecipes controller:', error);
      // Send a generic server error response
      res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
  },

  /**
   * Handles GET request to fetch a single recipe by ID.
   * @param {object} req - Express request object (req.params.id contains the ID).
   * @param {object} res - Express response object.
   */
  getRecipeById: async (req, res) => {
    try {
      // Extract the recipe ID from the request parameters
      const { id } = req.params;
      // Convert ID to integer (important for database query)
      const recipeId = parseInt(id, 10);

      // Validate if the ID is a number
      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      // Call the findById method from the Recipe model
      const recipe = await Recipe.findById(recipeId);

      // Check if the recipe was found
      if (recipe) {
        // Send a success response with the recipe data
        res.status(200).json(recipe);
      } else {
        // Send a 404 Not Found response if the recipe doesn't exist
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found.` });
      }
    } catch (error) {
      console.error('Error in getRecipeById controller:', error);
      res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
  },

  /**
   * Handles POST request to create a new recipe.
   * @param {object} req - Express request object (req.body contains the recipe data).
   * @param {object} res - Express response object.
   */
  createRecipe: async (req, res) => {
    try {
      // Extract recipe data from the request body
      const recipeData = req.body;

      // --- Basic Validation (Example) ---
      // You should add more robust validation based on your requirements
      if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
        return res.status(400).json({ message: 'Missing required fields (title, ingredients, instructions).' });
      }

      // Optional: Assign the logged-in user's ID if applicable
      // Assuming authentication middleware adds user info to req.user
      // recipeData.user_id = req.user ? req.user.id : null;
      // For now, we'll allow null or expect it in the body if needed

      // Call the create method from the Recipe model
      const newRecipe = await Recipe.create(recipeData);

      // Send a 201 Created response with the newly created recipe data
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error('Error in createRecipe controller:', error);
      // Handle potential database errors (e.g., unique constraints) if needed
      res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
  },

  /**
   * Handles PUT request to update an existing recipe by ID.
   * @param {object} req - Express request object (req.params.id, req.body contains update data).
   * @param {object} res - Express response object.
   */
  updateRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeData = req.body;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      // Optional: Add validation for the request body data here

      // Call the update method from the Recipe model
      const updatedRecipe = await Recipe.update(recipeId, recipeData);

      if (updatedRecipe) {
        // Send a success response with the updated recipe data
        res.status(200).json(updatedRecipe);
      } else {
        // Send a 404 Not Found response if the recipe to update doesn't exist
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found for update.` });
      }
    } catch (error) {
      console.error('Error in updateRecipe controller:', error);
      res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
  },

  /**
   * Handles DELETE request to remove a recipe by ID.
   * @param {object} req - Express request object (req.params.id contains the ID).
   * @param {object} res - Express response object.
   */
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      // Call the delete method from the Recipe model
      const success = await Recipe.delete(recipeId);

      if (success) {
        // Send a 204 No Content response indicating successful deletion
        // Or send a 200 OK with a success message
        res.status(200).json({ message: `Recipe with ID ${recipeId} deleted successfully.` });
        // res.status(204).send(); // Alternative: No content in response body
      } else {
        // Send a 404 Not Found response if the recipe to delete doesn't exist
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found for deletion.` });
      }
    } catch (error) {
      console.error('Error in deleteRecipe controller:', error);
      res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
  }
};

// Export the controller object
module.exports = recipeController;
