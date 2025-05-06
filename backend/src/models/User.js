// src/models/User.js
const db = require('../config/db'); // Adjust path if needed
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // Cost factor for hashing

const User = {
  /**
   * Creates a new user, hashing the password.
   * @param {object} userData - User data { username, email, password, role? }.
   * @returns {Promise<object>} The newly created user object (excluding password hash).
   */
  create: async (userData) => {
    const { username, email, password, role } = userData;
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
      // Default role to 'User' if not provided or invalid
      const userRole = (role === 'Admin' || role === 'User') ? role : 'User';
      const [result] = await db.query(sql, [username, email, hashedPassword, userRole]);
      const insertId = result.insertId;

      // Fetch the created user (without hash) to return
      const [rows] = await db.query('SELECT id, username, email, role, status, created_at FROM users WHERE id = ?', [insertId]);
      return rows.length > 0 ? rows[0] : null;

    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        // Check which field caused the duplicate error
        if (error.message.includes('username')) {
          throw new Error(`Username "${username}" already exists.`);
        } else if (error.message.includes('email')) {
          throw new Error(`Email "${email}" already exists.`);
        }
      }
      throw error; // Re-throw other errors
    }
  },

  /**
   * Finds a user by their email address (including password hash for login).
   * @param {string} email - The user's email.
   * @returns {Promise<object|null>} The user object or null if not found.
   */
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
      const [rows] = await db.query(sql, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  /**
   * Finds a user by their ID (excluding password hash).
   * @param {number} id - The user's ID.
   * @returns {Promise<object|null>} The user object or null if not found.
   */
   findById: async (id) => {
    const sql = 'SELECT id, username, email, role, status, created_at FROM users WHERE id = ?';
    try {
      const [rows] = await db.query(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },


  /**
   * Compares a plaintext password with a stored hash.
   * @param {string} plainPassword - The password attempt.
   * @param {string} hashedPassword - The stored hash from the database.
   * @returns {Promise<boolean>} True if passwords match, false otherwise.
   */
  comparePassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false; // Return false on error for security
    }
  },

  // --- NEW METHODS FOR ADMIN ---

  /**
   * Finds all users (excluding password hash).
   * @returns {Promise<Array>} Array of user objects.
   */
  findAllAdminView: async () => {
    // Select fields relevant for admin management, excluding password_hash
    const sql = `
        SELECT id, username, email, role, status, created_at, updated_at
        FROM users
        ORDER BY username ASC
    `;
    try {
        const [rows] = await db.query(sql);
        return rows;
    } catch (error) {
        console.error('Error fetching all users for admin:', error);
        throw error;
    }
  },

  /**
   * Updates specific fields of a user by ID (e.g., role, status).
   * Does NOT update password here (should have a separate password change flow).
   * @param {number} id - The ID of the user to update.
   * @param {object} updateData - Object containing fields to update (e.g., { role, status, username?, email? }).
   * @returns {Promise<object|null>} The updated user object or null if not found.
   */
  updateById: async (id, updateData) => {
    // Explicitly list allowed fields to update for security
    const allowedFields = ['username', 'email', 'role', 'status'];
    const fieldsToUpdate = {};
    let sql = 'UPDATE users SET ';
    const values = [];

    // Build the SET part of the query dynamically
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            // Validate role and status if provided
            if (field === 'role' && !['User', 'Admin'].includes(updateData[field])) {
                 throw new Error(`Invalid role specified: ${updateData[field]}`);
            }
            if (field === 'status' && !['Active', 'Inactive'].includes(updateData[field])) {
                 throw new Error(`Invalid status specified: ${updateData[field]}`);
            }

            if (values.length > 0) sql += ', ';
            sql += `${field} = ?`;
            values.push(updateData[field]);
            fieldsToUpdate[field] = updateData[field]; // Keep track of what's being updated
        }
    });

    // If no valid fields were provided for update
    if (values.length === 0) {
        console.warn('User update called with no valid fields to update.');
        return User.findById(id); // Return current user data
    }

    sql += ' WHERE id = ?';
    values.push(id);

    try {
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return null; // User not found
        }
        // Fetch and return the updated user (excluding password)
        return await User.findById(id);
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
         if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) throw new Error(`Username "${updateData.username}" already exists.`);
            if (error.message.includes('email')) throw new Error(`Email "${updateData.email}" already exists.`);
         }
        throw error;
    }
  },

  /**
   * Deletes a user by their ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  deleteById: async (id) => {
    // Note: ON DELETE CASCADE on foreign keys (e.g., workout_sessions) will handle related data deletion.
    const sql = 'DELETE FROM users WHERE id = ?';
    try {
      const [result] = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

};

module.exports = User;
