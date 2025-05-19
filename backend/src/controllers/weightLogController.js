// src/controllers/weightLogController.js
const WeightLog = require('../models/WeightLog');


const LBS_TO_KG = 0.453592;

const weightLogController = {
  
  addOrUpdateWeightLog: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      
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
      

      
      const weightKg = (unit === 'lbs') ? weightValue * LBS_TO_KG : weightValue;

      
      const savedLog = await WeightLog.addOrUpdate(userId, logDate, weightKg);

      
      
      res.status(201).json({ message: 'Weight logged successfully!', log: savedLog });

    } catch (error) {
      console.error('Error in addOrUpdateWeightLog controller:', error);
      
      res.status(500).json({ message: 'Error logging weight', error: error.message });
    }
  },

  
  getWeightHistory: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      
      const history = await WeightLog.findByUserId(userId);

      
      res.status(200).json(history);

    } catch (error) {
      console.error('Error in getWeightHistory controller:', error);
      res.status(500).json({ message: 'Error fetching weight history', error: error.message });
    }
  },

  
  deleteWeightLog: async (req, res) => {
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

        
        const success = await WeightLog.deleteById(id, userId);

        
        if (success) {
            res.status(200).json({ message: `Weight log entry ${id} deleted successfully.` });
            
        } else {
            
            res.status(404).json({ message: `Weight log entry ${id} not found or access denied.` });
        }

    } catch (error) {
        console.error('Error in deleteWeightLog controller:', error);
        res.status(500).json({ message: 'Error deleting weight log entry', error: error.message });
    }
  }
};

module.exports = weightLogController;
