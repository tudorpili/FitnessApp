// src/controllers/mealLogController.js
const MealLog = require('../models/MealLog');
const Food = require('../models/Food'); 
const db = require('../config/db'); // Import db for direct query if needed


// calculateMacrosForApiFood can be removed if not used elsewhere in this controller
// const calculateMacrosForApiFood = (food, quantityG) => { ... };


const mealLogController = {
  // ... addMealLogEntry, getMealHistory, deleteMealLogEntry (existing methods) ...
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

      let macros = { calories: null, proteinG: null, carbsG: null, fatG: null };
      let finalFoodName = foodName; 

      if (foodId) {
        // If macros are sent directly from frontend (already calculated for custom quantity)
        if (req.body.calories !== undefined) {
            macros = {
                calories: req.body.calories,
                proteinG: req.body.proteinG,
                carbsG: req.body.carbsG,
                fatG: req.body.fatG
            };
        }
        // Ensure foodName is set if only foodId is provided initially
        if (!finalFoodName) {
            const foodItemDetails = await Food.findById(foodId); // Assuming Food model has findById
            if (foodItemDetails) {
                finalFoodName = foodItemDetails.name;
            } else {
                 // Fallback if foodId is invalid or food item not found
                finalFoodName = "Unknown Food (ID: " + foodId + ")";
            }
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
  },

  // --- NEW: Function to get all meal logs for export ---
  exportUserMealLogs: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // Fetch all meal logs for the user, ordered by date and then by original creation time
      // MealLog.findUserMealLogs can be reused if it fetches all necessary fields
      // For export, we typically want all data, so passing null for startDate and endDate
      const logs = await MealLog.findUserMealLogs(userId, null, null); 

      // The model already returns: id, food_id, food_name_at_log_time, log_date, meal_type,
      // quantity_g, calories, protein_g, carbs_g, fat_g, created_at
      // We can format the date if needed for consistency
      const exportData = logs.map(log => ({
        log_date: log.log_date ? new Date(log.log_date).toISOString().split('T')[0] : null,
        meal_type: log.meal_type,
        food_name_at_log_time: log.food_name_at_log_time,
        quantity_g: log.quantity_g,
        calories: log.calories,
        protein_g: log.protein_g,
        carbs_g: log.carbs_g,
        fat_g: log.fat_g,
        // food_id: log.food_id, // Optional
        // created_at: log.created_at // Optional
      }));
      
      res.status(200).json(exportData);

    } catch (error) {
      console.error('Error in exportUserMealLogs controller:', error);
      res.status(500).json({ message: 'Error exporting meal data', error: error.message });
    }
  }
  // --- END NEW ---
};

module.exports = mealLogController;
