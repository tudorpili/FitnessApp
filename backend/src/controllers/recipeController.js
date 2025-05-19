// src/controllers/recipeController.js


const Recipe = require('../models/Recipe');


const recipeController = {
  
  getAllRecipes: async (req, res) => {
    try {
      
      const recipes = await Recipe.findAll();
      
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
      
      const recipeData = req.body;

      
      
      if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
        return res.status(400).json({ message: 'Missing required fields (title, ingredients, instructions).' });
      }

      
      
      
      

      
      const newRecipe = await Recipe.create(recipeData);

      
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error('Error in createRecipe controller:', error);
      
      res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
  },

  
  updateRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeData = req.body;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      

      
      const updatedRecipe = await Recipe.update(recipeId, recipeData);

      if (updatedRecipe) {
        
        res.status(200).json(updatedRecipe);
      } else {
        
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found for update.` });
      }
    } catch (error) {
      console.error('Error in updateRecipe controller:', error);
      res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
  },

  
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: 'Invalid recipe ID format.' });
      }

      
      const success = await Recipe.delete(recipeId);

      if (success) {
        
        
        res.status(200).json({ message: `Recipe with ID ${recipeId} deleted successfully.` });
        
      } else {
        
        res.status(404).json({ message: `Recipe with ID ${recipeId} not found for deletion.` });
      }
    } catch (error) {
      console.error('Error in deleteRecipe controller:', error);
      res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
  }
};


module.exports = recipeController;
