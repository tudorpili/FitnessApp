// src/models/MealLog.js
const db = require('../config/db'); 

const MealLog = {
  
  addLogEntry: async (logData) => {
    const {
      userId, foodId, foodNameAtLogTime, logDate, mealType,
      quantityG, calories, proteinG, carbsG, fatG
    } = logData;

    const sql = `
      INSERT INTO meal_logs (
        user_id, food_id, food_name_at_log_time, log_date, meal_type,
        quantity_g, calories, protein_g, carbs_g, fat_g
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId, foodId, foodNameAtLogTime, logDate, mealType,
      quantityG, calories, proteinG, carbsG, fatG
    ];

    try {
      const [result] = await db.query(sql, values);
      const insertId = result.insertId;
      if (!insertId) {
        throw new Error('Failed to create meal log entry.');
      }
      
      const [rows] = await db.query('SELECT * FROM meal_logs WHERE id = ?', [insertId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error adding meal log entry:', error);
      throw error;
    }
  },

  
  findUserMealLogs: async (userId, startDate, endDate) => {
    let sql = `
      SELECT
        id, food_id, food_name_at_log_time, log_date, meal_type,
        quantity_g, calories, protein_g, carbs_g, fat_g, created_at
      FROM meal_logs
      WHERE user_id = ?
    `;
    const queryParams = [userId];

    if (startDate) {
      sql += ' AND log_date >= ?';
      queryParams.push(startDate);
    }
    if (endDate) {
      sql += ' AND log_date <= ?';
      queryParams.push(endDate);
    }
    sql += ' ORDER BY log_date DESC, created_at DESC'; 

    try {
      const [rows] = await db.query(sql, queryParams);
      return rows;
    } catch (error) {
      console.error('Error fetching user meal logs:', error);
      throw error;
    }
  },

  
  deleteLogEntryById: async (logId, userId) => {
    const sql = 'DELETE FROM meal_logs WHERE id = ? AND user_id = ?';
    try {
      const [result] = await db.query(sql, [logId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting meal log entry:', error);
      throw error;
    }
  }
};

module.exports = MealLog;
