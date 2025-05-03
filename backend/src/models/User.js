// backend/src/models/User.js

const dbPool = require('../config/db.js');
const bcrypt = require('bcrypt');

const User = {
  /**
   * Creates a new user in the database after hashing the password.
   * @param {object} userData - Object containing username, email, password, role.
   * @returns {Promise<object>} The result object from the database operation.
   * @throws {Error} If hashing or database insertion fails.
   */
  async create({ username, email, password, role = 'User' }) {
    try {
      // Hash the password before saving
      const saltRounds = 10; // Recommended salt rounds
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (username, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `;
      console.log('[User Model] Creating user:', username, email, role);
      // Ensure password_hash column name matches your table
      const [result] = await dbPool.query(query, [username, email, hashedPassword, role]);
      console.log('[User Model] User created successfully, ID:', result.insertId);
      // Return the ID or the full result object as needed
      return { id: result.insertId, username, email, role };
    } catch (error) {
      console.error('[User Model] Error creating user:', error);
      // Check for specific duplicate entry errors (e.g., ER_DUP_ENTRY for MySQL)
      if (error.code === 'ER_DUP_ENTRY') {
          // Determine if it's email or username based on error message (can be brittle)
          if (error.message.includes('users.email')) {
             throw new Error('Email already exists.');
          } else if (error.message.includes('users.username')) {
             throw new Error('Username already exists.');
          } else {
             throw new Error('Duplicate entry error.');
          }
      }
      throw error; // Re-throw other errors
    }
  },

  /**
   * Finds a user by their email address.
   * @param {string} email - The email address to search for.
   * @returns {Promise<object|null>} The user object or null if not found.
   * @throws {Error} If the database query fails.
   */
  async findByEmail(email) {
    try {
      const query = 'SELECT id, username, email, password_hash, role FROM users WHERE email = ?';
      console.log('[User Model] Finding user by email:', email);
      const [results] = await dbPool.query(query, [email]);

      if (results.length > 0) {
        console.log('[User Model] User found by email.');
        return results[0]; // Return the user object
      } else {
        console.log('[User Model] User not found by email.');
        return null;
      }
    } catch (error) {
      console.error('[User Model] Error finding user by email:', error);
      throw error;
    }
  },

  /**
   * Finds a user by their ID.
   * @param {number|string} id - The user ID.
   * @returns {Promise<object|null>} The user object (without password hash) or null.
   * @throws {Error} If the database query fails.
   */
   async findById(id) {
    try {
      // Exclude password hash when finding by ID for general use
      const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
      console.log('[User Model] Finding user by ID:', id);
      const [results] = await dbPool.query(query, [id]);

      if (results.length > 0) {
        console.log('[User Model] User found by ID.');
        return results[0];
      } else {
        console.log('[User Model] User not found by ID.');
        return null;
      }
    } catch (error) {
      console.error('[User Model] Error finding user by ID:', error);
      throw error;
    }
  },

  /**
   * Compares a plaintext password with a stored hash.
   * @param {string} plaintextPassword - The password entered by the user.
   * @param {string} hashedPassword - The hash stored in the database.
   * @returns {Promise<boolean>} True if passwords match, false otherwise.
   */
  async comparePassword(plaintextPassword, hashedPassword) {
      try {
          return await bcrypt.compare(plaintextPassword, hashedPassword);
      } catch (error) {
          console.error('[User Model] Error comparing password:', error);
          return false; // Treat comparison error as mismatch for security
      }
  }

  // Add other user-related database functions here (update, delete, etc.)
};

module.exports = User;
