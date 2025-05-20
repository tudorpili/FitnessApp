// src/controllers/mealLogController.js
const MealLog = require('../models/MealLog');
const Food = require('../models/Food'); 


const calculateMacrosForApiFood = (food, quantityG) => {
    if (!food || !quantityG || quantityG <= 0) return { calories: null, proteinG: null, carbsG: null, fatG: null };
    const factor = quantityG / 100;
    return {
        calories: Math.round((food.calories_per_100g || 0) * factor),
        proteinG: Math.round((food.protein_per_100g || 0) * factor * 10) / 10,
        carbsG: Math.round((food.carbs_per_100g || 0) * factor * 10) / 10,
        fatG: Math.round((food.fat_per_100g || 0) * factor * 10) / 10,
    };
};


const mealLogController = {
  
  addMealLogEntry: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      
      const { foodId, foodName, logDate, mealType, quantityG } = req.body;

      if (!logDate || !mealType || quantityG === undefined || quantityG === null || (!foodId && !foodName)) {
        return res.status(400).json({ message: 'Missing required fields: logDate, mealType, quantityG, and either foodId or foodName.' });
      }

      const quantityValue = parseFloat(quantityG);
      if (isNaN(quantityValue) || quantityValue <= 0) {
        return res.status(400).json({ message: 'Invalid quantity. Must be a number greater than 0.' });
      }

      let foodDetails = null;
      let macros = { calories: null, proteinG: null, carbsG: null, fatG: null };
      let finalFoodName = foodName; 

      
      if (foodId) {
        
        
        
        
        if (req.body.calories !== undefined) {
            macros = {
                calories: req.body.calories,
                proteinG: req.body.proteinG,
                carbsG: req.body.carbsG,
                fatG: req.body.fatG
            };
        }
        
        
        
        
      }

       
      if (!finalFoodName) {
         return res.status(400).json({ message: 'Food name is required.' });
      }


      
      const logData = {
        userId,
        foodId: foodId || null, 
        foodNameAtLogTime: finalFoodName, 
        logDate,
        mealType,
        quantityG: quantityValue,
        calories: macros.calories,
        proteinG: macros.proteinG,
        carbsG: macros.carbsG,
        fatG: macros.fatG,
      };

      
      const createdEntry = await MealLog.addLogEntry(logData);

      
      res.status(201).json({ message: 'Meal entry logged successfully!', entry: createdEntry });

    } catch (error) {
      console.error('Error in addMealLogEntry controller:', error);
      res.status(500).json({ message: 'Error logging meal entry', error: error.message });
    }
  },

  
  getMealHistory: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      
      const { startDate, endDate } = req.query;

      
      const history = await MealLog.findUserMealLogs(userId, startDate, endDate);

      
      res.status(200).json(history);

    } catch (error) {
      console.error('Error in getMealHistory controller:', error);
      res.status(500).json({ message: 'Error fetching meal history', error: error.message });
    }
  },

  
  deleteMealLogEntry: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      
      const { logId } = req.params;
      const id = parseInt(logId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid log ID format.' });
      }

      
      const success = await MealLog.deleteLogEntryById(id, userId);

      
      if (success) {
        res.status(200).json({ message: `Meal log entry ${id} deleted successfully.` });
      } else {
        res.status(404).json({ message: `Meal log entry ${id} not found or access denied.` });
      }

    } catch (error) {
      console.error('Error in deleteMealLogEntry controller:', error);
      res.status(500).json({ message: 'Error deleting meal log entry', error: error.message });
    }
  }

  
};

module.exports = mealLogController;
