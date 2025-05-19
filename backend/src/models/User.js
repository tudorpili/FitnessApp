// src/models/User.js
const db = require('../config/db'); 
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; 

const User = {
  
  create: async (userData) => {
    const { username, email, password, role } = userData;
    try {
      
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
      
      const userRole = (role === 'Admin' || role === 'User') ? role : 'User';
      const [result] = await db.query(sql, [username, email, hashedPassword, userRole]);
      const insertId = result.insertId;

      
      const [rows] = await db.query('SELECT id, username, email, role, status, created_at FROM users WHERE id = ?', [insertId]);
      return rows.length > 0 ? rows[0] : null;

    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        
        if (error.message.includes('username')) {
          throw new Error(`Username "${username}" already exists.`);
        } else if (error.message.includes('email')) {
          throw new Error(`Email "${email}" already exists.`);
        }
      }
      throw error; 
    }
  },

  
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


  
  comparePassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false; 
    }
  },

  

  
  findAllAdminView: async () => {
    
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

  
  updateById: async (id, updateData) => {
    
    const allowedFields = ['username', 'email', 'role', 'status'];
    const fieldsToUpdate = {};
    let sql = 'UPDATE users SET ';
    const values = [];

    
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            
            if (field === 'role' && !['User', 'Admin'].includes(updateData[field])) {
                 throw new Error(`Invalid role specified: ${updateData[field]}`);
            }
            if (field === 'status' && !['Active', 'Inactive'].includes(updateData[field])) {
                 throw new Error(`Invalid status specified: ${updateData[field]}`);
            }

            if (values.length > 0) sql += ', ';
            sql += `${field} = ?`;
            values.push(updateData[field]);
            fieldsToUpdate[field] = updateData[field]; 
        }
    });

    
    if (values.length === 0) {
        console.warn('User update called with no valid fields to update.');
        return User.findById(id); 
    }

    sql += ' WHERE id = ?';
    values.push(id);

    try {
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return null; 
        }
        
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

  
  deleteById: async (id) => {
    
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
