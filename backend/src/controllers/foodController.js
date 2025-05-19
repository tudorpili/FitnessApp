// src/controllers/foodController.js
const Food = require('../models/Food');

const foodController = {
  
  searchFoods: async (req, res) => {
    try {
      
      const searchTerm = req.query.q;

      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
        
        return res.status(400).json({ message: 'Search query parameter "q" is required.' });
        
      }

      
      const limit = parseInt(req.query.limit, 10) || 10; 

      
      const foods = await Food.searchByName(searchTerm.trim(), limit);

      
      res.status(200).json(foods);

    } catch (error) {
      console.error('Error in searchFoods controller:', error);
      res.status(500).json({ message: 'Error searching for foods', error: error.message });
    }
  },

  
};

module.exports = foodController;
