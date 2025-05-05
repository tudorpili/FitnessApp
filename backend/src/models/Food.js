// src/models/Food.js
const db = require('../config/db'); // Adjust path if needed

const Food = {
  /**
   * Searches for food items by name.
   * Uses pattern matching (LIKE) for partial matches.
   * @param {string} searchTerm - The term to search for in food names.
   * @param {number} [limit=10] - Maximum number of results to return.
   * @returns {Promise<Array>} A promise resolving to an array of matching food objects.
   */
  searchByName: async (searchTerm, limit = 10) => {
    // Use '%' wildcards for partial matching
    const searchQuery = `%${searchTerm}%`;
    // Select all relevant columns needed by the frontend
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

  // Add other methods if needed (e.g., findById, create, update, delete)
  // findById: async (id) => { ... }
};

module.exports = Food;
