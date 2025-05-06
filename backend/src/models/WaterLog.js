// src/models/WaterLog.js
const db = require('../config/db'); // Adjust path if needed

const WaterLog = {
  /**
   * Adjusts the water intake (in ml) for a user on a specific date.
   * Creates the record if it doesn't exist, otherwise adds the adjustment.
   * Ensures water_ml does not go below zero.
   * @param {number} userId - The ID of the user.
   * @param {string} logDate - The date (YYYY-MM-DD).
   * @param {number} adjustmentAmountMl - The amount to add in ml (can be negative).
   * @returns {Promise<object>} The updated water log entry for the day.
   */
  adjustWater: async (userId, logDate, adjustmentAmountMl) => {
     // Ensure adjustmentAmount is a number
    const amount = Number(adjustmentAmountMl) || 0;
     if (amount === 0) { // If adjustment is zero, just fetch current value
        const [current] = await db.query(
            'SELECT * FROM daily_water_logs WHERE user_id = ? AND log_date = ?',
            [userId, logDate]
        );
        return current.length > 0 ? current[0] : { user_id: userId, log_date: logDate, water_ml: 0 }; // Return default if no record
    }

    // Use INSERT ... ON DUPLICATE KEY UPDATE with addition, ensuring non-negative result
    const sql = `
      INSERT INTO daily_water_logs (user_id, log_date, water_ml)
      VALUES (?, ?, GREATEST(0, ?)) -- Insert initial amount, ensuring it's not negative
      ON DUPLICATE KEY UPDATE water_ml = GREATEST(0, water_ml + ?) -- Add adjustment, ensuring not negative
    `;
    const values = [userId, logDate, Math.max(0, amount), amount];

    try {
      await db.query(sql, values);
      // Fetch the updated record to return the final value
      const [rows] = await db.query(
        'SELECT * FROM daily_water_logs WHERE user_id = ? AND log_date = ?',
        [userId, logDate]
      );
       if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error('Failed to retrieve water log after adjustment.');
      }
    } catch (error) {
      console.error('Error adjusting water log:', error);
      throw error;
    }
  },

  // findByDate function might be useful for the summary endpoint
  // findByDate: async (userId, logDate) => { ... }
};

module.exports = WaterLog;
