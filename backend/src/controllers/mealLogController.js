// src/controllers/mealLogController.js
const MealLog = require('../models/MealLog');
const Food = require('../models/Food'); // Need Food model to get details if only ID is sent

// Helper Function for macro calculation (can be moved to a utils file)
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
  /**
   * Handles POST request to add a new meal log entry.
   * Expects details in req.body. Calculates macros based on foodId if provided.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  addMealLogEntry: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Extract and validate data
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
      let finalFoodName = foodName; // Use provided name by default

      // 3. Fetch food details if foodId is provided to calculate macros
      if (foodId) {
        // Assuming Food model has findById method
        // foodDetails = await Food.findById(foodId); // You'll need to implement Food.findById if needed
        // For now, let's assume frontend sends calculated macros or we skip calculation if foodId is missing details
        // If frontend sends macros, use them directly. Otherwise, calculate if possible.
        if (req.body.calories !== undefined) {
            macros = {
                calories: req.body.calories,
                proteinG: req.body.proteinG,
                carbsG: req.body.carbsG,
                fatG: req.body.fatG
            };
        }
        // If foodName wasn't provided, try to get it from foodDetails if fetched
        // if (foodDetails && !finalFoodName) {
        //     finalFoodName = foodDetails.name;
        // }
      }

       // Ensure we have a name to store
      if (!finalFoodName) {
         return res.status(400).json({ message: 'Food name is required.' });
      }


      // 4. Prepare data for the model
      const logData = {
        userId,
        foodId: foodId || null, // Store foodId if available
        foodNameAtLogTime: finalFoodName, // Store the name used at log time
        logDate,
        mealType,
        quantityG: quantityValue,
        calories: macros.calories,
        proteinG: macros.proteinG,
        carbsG: macros.carbsG,
        fatG: macros.fatG,
      };

      // 5. Call the model function to add the entry
      const createdEntry = await MealLog.addLogEntry(logData);

      // 6. Send success response
      res.status(201).json({ message: 'Meal entry logged successfully!', entry: createdEntry });

    } catch (error) {
      console.error('Error in addMealLogEntry controller:', error);
      res.status(500).json({ message: 'Error logging meal entry', error: error.message });
    }
  },

  /**
   * Handles GET request to fetch meal log history for the authenticated user.
   * Optionally accepts startDate and endDate query parameters.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  getMealHistory: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Get optional date filters
      const { startDate, endDate } = req.query;

      // 3. Call the model function
      const history = await MealLog.findUserMealLogs(userId, startDate, endDate);

      // 4. Send success response
      res.status(200).json(history);

    } catch (error) {
      console.error('Error in getMealHistory controller:', error);
      res.status(500).json({ message: 'Error fetching meal history', error: error.message });
    }
  },

  /**
   * Handles DELETE request to remove a specific meal log entry.
   * Expects log ID in req.params.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user and req.params.logId exist.
   * @param {object} res - Express response object.
   */
  deleteMealLogEntry: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Get log ID from route parameters
      const { logId } = req.params;
      const id = parseInt(logId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid log ID format.' });
      }

      // 3. Call the model function to delete
      const success = await MealLog.deleteLogEntryById(id, userId);

      // 4. Send response based on success
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
