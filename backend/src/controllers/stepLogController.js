// src/controllers/stepLogController.js
const StepLog = require('../models/StepLog');
const getDbTodayDate = require('../utils/dateUtils'); 

const stepLogController = {
  
  adjustTodaySteps: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      const todayDate = getDbTodayDate(); 

      const { amount } = req.body;
      const adjustmentAmount = parseInt(amount, 10);

      if (isNaN(adjustmentAmount)) {
        return res.status(400).json({ message: 'Invalid amount provided. Must be a number.' });
      }

      const updatedLog = await StepLog.adjustSteps(userId, todayDate, adjustmentAmount);

      res.status(200).json({ message: 'Steps updated successfully!', log: updatedLog });

    } catch (error) {
      console.error('Error adjusting steps:', error);
      res.status(500).json({ message: 'Error adjusting steps', error: error.message });
    }
  }
};

module.exports = stepLogController;
