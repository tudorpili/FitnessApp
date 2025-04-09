// src/models/User.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = {
  create: (username, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]); // Return the first result (should be unique)
    });
  },
};

module.exports = User;
