// src/models/Goal.js
const db = require('../config/db');

const Goal = {
  
  create: async (userId, goalData) => {
    const { goal_type, description, target_value, target_unit, start_date, target_date, is_active } = goalData;
    const sql = `
      INSERT INTO user_goals (user_id, goal_type, description, target_value, target_unit, start_date, target_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, goal_type, description, target_value, target_unit, start_date, target_date, is_active ?? true];
    try {
      const [result] = await db.query(sql, values);
      const [rows] = await db.query('SELECT * FROM user_goals WHERE id = ?', [result.insertId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  
  findActiveByUserId: async (userId) => {
    const sql = 'SELECT * FROM user_goals WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC';
    try {
      const [rows] = await db.query(sql, [userId]);
      return rows;
    } catch (error) {
      console.error("Error finding active goals:", error);
      throw error;
    }
  },

   
   findByIdAndUser: async (goalId, userId) => {
    const sql = 'SELECT * FROM user_goals WHERE id = ? AND user_id = ?';
    try {
      const [rows] = await db.query(sql, [goalId, userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error finding goal by ID:", error);
      throw error;
    }
  },

  
  update: async (goalId, userId, updateData) => {
    
    const allowedFields = ['description', 'target_value', 'target_unit', 'start_date', 'target_date', 'is_active'];
    const fieldsToUpdate = [];
    const values = [];

    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            values.push(updateData[field]);
        }
    });

    if (fieldsToUpdate.length === 0) {
        return Goal.findByIdAndUser(goalId, userId); 
    }

    values.push(goalId);
    values.push(userId); 

    const sql = `UPDATE user_goals SET ${fieldsToUpdate.join(', ')} WHERE id = ? AND user_id = ?`;

    try {
      const [result] = await db.query(sql, values);
      if (result.affectedRows === 0) return null; 
      return Goal.findByIdAndUser(goalId, userId); 
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  },

  
  deleteByIdAndUser: async (goalId, userId) => {
     const sql = 'DELETE FROM user_goals WHERE id = ? AND user_id = ?';
     try {
       const [result] = await db.query(sql, [goalId, userId]);
       return result.affectedRows > 0;
     } catch (error) {
       console.error("Error deleting goal:", error);
       throw error;
     }
  }
};

module.exports = Goal;
