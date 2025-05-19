// src/models/StepLog.js
const db = require('../config/db'); 

const StepLog = {
  
  adjustSteps: async (userId, logDate, adjustmentAmount) => {
    
    const amount = Number(adjustmentAmount) || 0;
    if (amount === 0) { 
        const [current] = await db.query(
            'SELECT * FROM daily_step_logs WHERE user_id = ? AND log_date = ?',
            [userId, logDate]
        );
        return current.length > 0 ? current[0] : { user_id: userId, log_date: logDate, steps: 0 }; 
    }

    
    const sql = `
      INSERT INTO daily_step_logs (user_id, log_date, steps)
      VALUES (?, ?, GREATEST(0, ?)) -- Insert initial amount, ensuring it's not negative
      ON DUPLICATE KEY UPDATE steps = GREATEST(0, steps + ?) -- Add adjustment, ensuring not negative
    `;
    
    
    const values = [userId, logDate, Math.max(0, amount), amount];

    try {
      await db.query(sql, values);
      
      const [rows] = await db.query(
        'SELECT * FROM daily_step_logs WHERE user_id = ? AND log_date = ?',
        [userId, logDate]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        
        throw new Error('Failed to retrieve step log after adjustment.');
      }
    } catch (error) {
      console.error('Error adjusting step log:', error);
      throw error;
    }
  },

  
  
};

module.exports = StepLog;
