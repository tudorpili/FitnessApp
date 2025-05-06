// src/models/StepLog.js
const db = require('../config/db'); // Adjust path if needed

const StepLog = {
  /**
   * Adjusts the step count for a user on a specific date.
   * Creates the record if it doesn't exist, otherwise adds the adjustment.
   * Ensures steps do not go below zero.
   * @param {number} userId - The ID of the user.
   * @param {string} logDate - The date (YYYY-MM-DD).
   * @param {number} adjustmentAmount - The amount to add (can be negative).
   * @returns {Promise<object>} The updated step log entry for the day.
   */
  adjustSteps: async (userId, logDate, adjustmentAmount) => {
    // Ensure adjustmentAmount is a number
    const amount = Number(adjustmentAmount) || 0;
    if (amount === 0) { // If adjustment is zero, just fetch current value
        const [current] = await db.query(
            'SELECT * FROM daily_step_logs WHERE user_id = ? AND log_date = ?',
            [userId, logDate]
        );
        return current.length > 0 ? current[0] : { user_id: userId, log_date: logDate, steps: 0 }; // Return default if no record
    }

    // Use INSERT ... ON DUPLICATE KEY UPDATE with addition, ensuring non-negative result
    const sql = `
      INSERT INTO daily_step_logs (user_id, log_date, steps)
      VALUES (?, ?, GREATEST(0, ?)) -- Insert initial amount, ensuring it's not negative
      ON DUPLICATE KEY UPDATE steps = GREATEST(0, steps + ?) -- Add adjustment, ensuring not negative
    `;
    // For insert, use the adjustment amount directly (but ensure >= 0).
    // For update, add the adjustment amount to the existing value.
    const values = [userId, logDate, Math.max(0, amount), amount];

    try {
      await db.query(sql, values);
      // Fetch the updated record to return the final value
      const [rows] = await db.query(
        'SELECT * FROM daily_step_logs WHERE user_id = ? AND log_date = ?',
        [userId, logDate]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        // Should not happen with this SQL logic, but handle defensively
        throw new Error('Failed to retrieve step log after adjustment.');
      }
    } catch (error) {
      console.error('Error adjusting step log:', error);
      throw error;
    }
  },

  // findByDate function might be useful for the summary endpoint, but summary can also query directly
  // findByDate: async (userId, logDate) => { ... }
};

module.exports = StepLog;
