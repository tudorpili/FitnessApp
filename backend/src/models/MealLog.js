// src/models/MealLog.js
const db = require('../config/db'); // Adjust path if needed

const MealLog = {
  /**
   * Adds a single food item log for a specific user, date, and meal type.
   * @param {object} logData - Data for the meal log entry.
   * Expected fields: userId, foodId (nullable), foodNameAtLogTime, logDate, mealType,
   * quantityG, calories, proteinG, carbsG, fatG
   * @returns {Promise<object>} A promise resolving to the created meal log entry.
   * @throws {Error} Throws an error if the insertion fails.
   */
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
      // Fetch the newly created entry to return it
      const [rows] = await db.query('SELECT * FROM meal_logs WHERE id = ?', [insertId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error adding meal log entry:', error);
      throw error;
    }
  },

  /**
   * Finds meal log entries for a specific user, optionally filtered by date range.
   * @param {number} userId - The ID of the user.
   * @param {string} [startDate] - Optional start date (YYYY-MM-DD).
   * @param {string} [endDate] - Optional end date (YYYY-MM-DD).
   * @returns {Promise<Array>} A promise resolving to an array of meal log objects.
   */
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
    sql += ' ORDER BY log_date DESC, created_at DESC'; // Order by date, then time logged

    try {
      const [rows] = await db.query(sql, queryParams);
      return rows;
    } catch (error) {
      console.error('Error fetching user meal logs:', error);
      throw error;
    }
  },

  /**
   * Deletes a specific meal log entry by its ID.
   * @param {number} logId - The ID of the meal log entry to delete.
   * @param {number} userId - The ID of the user (for authorization check).
   * @returns {Promise<boolean>} A promise resolving to true if deletion was successful, false otherwise.
   */
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
