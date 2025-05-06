// src/controllers/waterLogController.js
const WaterLog = require('../models/WaterLog');
const getDbTodayDate = require('../utils/dateUtils'); // Assuming you create this util

const waterLogController = {
  /**
   * Handles POST request to adjust today's water intake.
   * Expects { amountMl } in req.body.
   * Requires user authentication.
   */
  adjustTodayWater: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      const todayDate = getDbTodayDate();

      const { amountMl } = req.body;
      const adjustmentAmountMl = parseInt(amountMl, 10);

       if (isNaN(adjustmentAmountMl)) {
        return res.status(400).json({ message: 'Invalid amount provided. Must be a number (ml).' });
      }

      const updatedLog = await WaterLog.adjustWater(userId, todayDate, adjustmentAmountMl);

      res.status(200).json({ message: 'Water intake updated successfully!', log: updatedLog });

    } catch (error) {
      console.error('Error adjusting water intake:', error);
      res.status(500).json({ message: 'Error adjusting water intake', error: error.message });
    }
  }
};

module.exports = waterLogController;
