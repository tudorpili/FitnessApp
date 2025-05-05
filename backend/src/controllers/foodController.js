// src/controllers/foodController.js
const Food = require('../models/Food');

const foodController = {
  /**
   * Handles GET request to search for food items.
   * Expects a query parameter 'q' for the search term.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  searchFoods: async (req, res) => {
    try {
      // Get the search term from query parameters (?q=...)
      const searchTerm = req.query.q;

      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
        // Return empty array or bad request if search term is missing/invalid
        return res.status(400).json({ message: 'Search query parameter "q" is required.' });
        // Alternatively, return empty array: return res.status(200).json([]);
      }

      // Define a limit for search results (optional)
      const limit = parseInt(req.query.limit, 10) || 10; // Default limit 10

      // Call the model function to search the database
      const foods = await Food.searchByName(searchTerm.trim(), limit);

      // Send the results back as JSON
      res.status(200).json(foods);

    } catch (error) {
      console.error('Error in searchFoods controller:', error);
      res.status(500).json({ message: 'Error searching for foods', error: error.message });
    }
  },

  // Add other controller methods if needed (getById, create, etc.)
};

module.exports = foodController;
