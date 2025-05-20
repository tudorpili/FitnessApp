// src/controllers/weightLogController.js
const WeightLog = require('../models/WeightLog');
const db = require('../config/db'); // Import db for direct query if needed

const LBS_TO_KG = 0.453592; // This might not be needed if storing consistently

const weightLogController = {
  // ... addOrUpdateWeightLog, getWeightHistory, deleteWeightLog (existing methods) ...
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
  },

  // --- NEW: Function to get all weight logs for export ---
  exportUserWeightLogs: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;

      // Fetch all weight logs for the user, ordered by date
      // The WeightLog model already stores weight_kg, so no conversion needed here.
      const sql = `
        SELECT 
          log_date, 
          weight_kg,
          created_at,
          updated_at
        FROM weight_logs
        WHERE user_id = ?
        ORDER BY log_date ASC 
      `;
      // We could also use WeightLog.findByUserId(userId) if it returns all necessary fields and is sorted.
      // For direct control over exported fields and sorting, a direct query is fine.
      const [logs] = await db.query(sql, [userId]);

      const exportData = logs.map(log => ({
        log_date: log.log_date ? new Date(log.log_date).toISOString().split('T')[0] : null,
        weight_kg: log.weight_kg,
        // Optionally add created_at and updated_at if needed for export
        // created_at: log.created_at,
        // updated_at: log.updated_at
      }));

      res.status(200).json(exportData);

    } catch (error) {
      console.error('Error in exportUserWeightLogs controller:', error);
      res.status(500).json({ message: 'Error exporting weight data', error: error.message });
    }
  }
  // --- END NEW ---
};

module.exports = weightLogController;
