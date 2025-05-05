// src/controllers/weightLogController.js
const WeightLog = require('../models/WeightLog');

// Helper Function for lbs to kg conversion
const LBS_TO_KG = 0.453592;

const weightLogController = {
  /**
   * Handles POST request to add or update a weight log entry.
   * Expects logDate, weight, and unit in req.body.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  addOrUpdateWeightLog: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Extract and validate data from request body
      const { logDate, weight, unit } = req.body;
      if (!logDate || weight === undefined || weight === null || !unit) {
        return res.status(400).json({ message: 'Missing required fields: logDate, weight, and unit.' });
      }

      const weightValue = parseFloat(weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        return res.status(400).json({ message: 'Invalid weight value. Must be a number greater than 0.' });
      }
      if (unit !== 'kg' && unit !== 'lbs') {
        return res.status(400).json({ message: 'Invalid unit. Must be "kg" or "lbs".' });
      }
      // Optional: Validate date format (YYYY-MM-DD)

      // 3. Convert weight to kilograms for consistent storage
      const weightKg = (unit === 'lbs') ? weightValue * LBS_TO_KG : weightValue;

      // 4. Call the model function
      const savedLog = await WeightLog.addOrUpdate(userId, logDate, weightKg);

      // 5. Send success response
      // Return the saved log (which will always have weight_kg)
      res.status(201).json({ message: 'Weight logged successfully!', log: savedLog });

    } catch (error) {
      console.error('Error in addOrUpdateWeightLog controller:', error);
      // Handle potential unique constraint errors if needed, though INSERT ON DUPLICATE handles it
      res.status(500).json({ message: 'Error logging weight', error: error.message });
    }
  },

  /**
   * Handles GET request to fetch weight history for the authenticated user.
   * Returns data with weight in kg. Frontend will handle conversion if needed.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  getWeightHistory: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // 2. Call the model function
      const history = await WeightLog.findByUserId(userId);

      // 3. Send success response (data is already ordered by date desc)
      res.status(200).json(history);

    } catch (error) {
      console.error('Error in getWeightHistory controller:', error);
      res.status(500).json({ message: 'Error fetching weight history', error: error.message });
    }
  },

  /**
   * Handles DELETE request to remove a specific weight log entry.
   * Expects log ID in req.params.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user and req.params.logId exist.
   * @param {object} res - Express response object.
   */
  deleteWeightLog: async (req, res) => {
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
        const success = await WeightLog.deleteById(id, userId);

        // 4. Send response based on success
        if (success) {
            res.status(200).json({ message: `Weight log entry ${id} deleted successfully.` });
            // Alternative: res.status(204).send(); // No content
        } else {
            // Log entry not found or didn't belong to the user
            res.status(404).json({ message: `Weight log entry ${id} not found or access denied.` });
        }

    } catch (error) {
        console.error('Error in deleteWeightLog controller:', error);
        res.status(500).json({ message: 'Error deleting weight log entry', error: error.message });
    }
  }
};

module.exports = weightLogController;
