// src/models/WeightLog.js
const db = require('../config/db'); 

const WeightLog = {
  
  addOrUpdate: async (userId, logDate, weightKg) => {
    
    
    
    const sql = `
      INSERT INTO weight_logs (user_id, log_date, weight_kg)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE weight_kg = VALUES(weight_kg)
    `;
    const values = [userId, logDate, weightKg];

    try {
      const [result] = await db.query(sql, values);

      
      
      const [rows] = await db.query(
        'SELECT * FROM weight_logs WHERE user_id = ? AND log_date = ?',
        [userId, logDate]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        
        throw new Error('Failed to retrieve weight log after add/update.');
      }
    } catch (error) {
      console.error('Error adding or updating weight log:', error);
      throw error;
    }
  },

  
  findByUserId: async (userId) => {
    const sql = `
      SELECT id, log_date, weight_kg
      FROM weight_logs
      WHERE user_id = ?
      ORDER BY log_date DESC
    `;
    try {
      const [rows] = await db.query(sql, [userId]);
      return rows;
    } catch (error) {
      console.error('Error fetching weight logs by user ID:', error);
      throw error;
    }
  },

  
  deleteById: async (logId, userId) => {
    const sql = 'DELETE FROM weight_logs WHERE id = ? AND user_id = ?';
    try {
      const [result] = await db.query(sql, [logId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting weight log:', error);
      throw error;
    }
  }
};

module.exports = WeightLog;
