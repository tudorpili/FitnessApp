// src/models/WaterLog.js
const db = require('../config/db'); 

const WaterLog = {
  
  adjustWater: async (userId, logDate, adjustmentAmountMl) => {
     
    const amount = Number(adjustmentAmountMl) || 0;
     if (amount === 0) { 
        const [current] = await db.query(
            'SELECT * FROM daily_water_logs WHERE user_id = ? AND log_date = ?',
            [userId, logDate]
        );
        return current.length > 0 ? current[0] : { user_id: userId, log_date: logDate, water_ml: 0 }; 
    }

    
    const sql = `
      INSERT INTO daily_water_logs (user_id, log_date, water_ml)
      VALUES (?, ?, GREATEST(0, ?)) -- Insert initial amount, ensuring it's not negative
      ON DUPLICATE KEY UPDATE water_ml = GREATEST(0, water_ml + ?) -- Add adjustment, ensuring not negative
    `;
    const values = [userId, logDate, Math.max(0, amount), amount];

    try {
      await db.query(sql, values);
      
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

  
  
};

module.exports = WaterLog;
