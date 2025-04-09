const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // 'localhost' by default
  user: process.env.DB_USER || 'root',      // 'root' by default
  password: process.env.DB_PASS || '',      // Empty password by default
  database: process.env.DB_NAME || 'fitness_tracker', // Database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
