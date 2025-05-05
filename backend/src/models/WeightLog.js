// src/models/WeightLog.js
const db = require('../config/db'); // Adjust path if needed

const WeightLog = {
  /**
   * Adds or updates a weight log entry for a specific user and date.
   * Uses INSERT ... ON DUPLICATE KEY UPDATE to handle existing entries.
   * @param {number} userId - The ID of the user.
   * @param {string} logDate - The date of the log (YYYY-MM-DD).
   * @param {number} weightKg - The weight in kilograms.
   * @returns {Promise<object>} A promise resolving to the created or updated log entry.
   * @throws {Error} Throws an error if the operation fails.
   */
  addOrUpdate: async (userId, logDate, weightKg) => {
    // SQL uses INSERT ... ON DUPLICATE KEY UPDATE to handle the unique constraint (user_id, log_date)
    // If a row with the same user_id and log_date exists, it updates the weight_kg.
    // Otherwise, it inserts a new row.
    const sql = `
      INSERT INTO weight_logs (user_id, log_date, weight_kg)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE weight_kg = VALUES(weight_kg)
    `;
    const values = [userId, logDate, weightKg];

    try {
      const [result] = await db.query(sql, values);

      // Determine if it was an insert or update (affectedRows is 1 for insert, 2 for update)
      // We need to fetch the actual row to return consistent data
      const [rows] = await db.query(
        'SELECT * FROM weight_logs WHERE user_id = ? AND log_date = ?',
        [userId, logDate]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        // Should not happen with INSERT ON DUPLICATE KEY UPDATE, but handle defensively
        throw new Error('Failed to retrieve weight log after add/update.');
      }
    } catch (error) {
      console.error('Error adding or updating weight log:', error);
      throw error;
    }
  },

  /**
   * Finds all weight log entries for a specific user, ordered by date descending.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} A promise resolving to an array of weight log objects.
   */
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

  /**
   * Deletes a specific weight log entry by its ID.
   * @param {number} logId - The ID of the weight log entry to delete.
   * @param {number} userId - The ID of the user (for authorization check).
   * @returns {Promise<boolean>} A promise resolving to true if deletion was successful, false otherwise.
   */
  deleteById: async (logId, userId) => {
    const sql = 'DELETE FROM weight_logs WHERE id = ? AND user_id = ?';
    try {
      const [result] = await db.query(sql, [logId, userId]);
      // affectedRows will be 1 if deleted, 0 if not found or user didn't match
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting weight log:', error);
      throw error;
    }
  }
};

module.exports = WeightLog;
