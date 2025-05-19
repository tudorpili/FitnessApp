// src/models/Food.js
const db = require('../config/db'); 

const Food = {
  
  searchByName: async (searchTerm, limit = 10) => {
    
    const searchQuery = `%${searchTerm}%`;
    
    const sql = `
      SELECT
        id, name, calories_per_100g, protein_per_100g,
        carbs_per_100g, fat_per_100g, default_serving_g, unit_name
      FROM foods
      WHERE name LIKE ?
      ORDER BY name ASC
      LIMIT ?
    `;
    try {
      const [rows] = await db.query(sql, [searchQuery, limit]);
      return rows;
    } catch (error) {
      console.error('Error searching foods by name:', error);
      throw error;
    }
  },

  
  
};

module.exports = Food;
