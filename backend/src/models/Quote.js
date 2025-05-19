// backend/src/models/Quote.js
const db = require('../config/db');

const Quote = {
  /**
   * Fetches a random quote from the database.
   * @returns {Promise<object|null>} A random quote object or null if none found.
   */
  getRandom: async () => {
    // SQL to get a random row. This method is generally efficient for moderately sized tables.
    // For very large tables, other methods might be more performant (e.g., getting all IDs, picking one, then querying).
    const sql = 'SELECT id, text, author, category FROM quotes ORDER BY RAND() LIMIT 1';
    try {
      const [rows] = await db.query(sql);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching random quote:', error);
      throw error; // Re-throw the error to be handled by the controller
    }
  },

  /**
   * Optional: Fetches a random quote by category.
   * @param {string} category - The category to filter by.
   * @returns {Promise<object|null>} A random quote object from the category or null.
   */
  getRandomByCategory: async (category) => {
    const sql = 'SELECT id, text, author, category FROM quotes WHERE category = ? ORDER BY RAND() LIMIT 1';
    try {
      const [rows] = await db.query(sql, [category]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching random quote by category "${category}":`, error);
      throw error;
    }
  },

  /**
   * Optional: Adds a new quote to the database.
   * @param {object} quoteData - Object containing text, author (optional), category (optional).
   * @returns {Promise<object|null>} The created quote object or null if creation failed.
   */
  add: async (quoteData) => {
    const { text, author, category = 'General' } = quoteData;
    if (!text || !text.trim()) {
      throw new Error('Quote text cannot be empty.');
    }
    const sql = 'INSERT INTO quotes (text, author, category) VALUES (?, ?, ?)';
    try {
      const [result] = await db.query(sql, [text.trim(), author || null, category]);
      if (result.insertId) {
        return { id: result.insertId, text, author, category };
      }
      return null;
    } catch (error) {
      console.error('Error adding new quote:', error);
      throw error;
    }
  }
};

module.exports = Quote;
