// backend/src/config/db.js

const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables (ensure .env is in the root of the backend folder)
dotenv.config();

// Create a connection pool
// Using a pool is better for performance than creating individual connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Default to localhost if not set
  user: process.env.DB_USER || 'root',      // Default to root if not set
  password: process.env.DB_PASSWORD || '',    // Default to empty if not set
  database: process.env.DB_NAME || 'fitness_tracker', // Default db name
  port: process.env.DB_PORT || 3306,      // Default MySQL port
  waitForConnections: true, // Wait for connection if pool is full
  connectionLimit: 10,      // Max number of connections in pool
  queueLimit: 0             // Max number of connection requests to queue (0 = no limit)
});

// Promisify the pool to use async/await easily
const promisePool = pool.promise();

// Test the connection (optional, but good practice)
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Database connection successful!');
    // You must release the connection back to the pool
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    // Potentially exit the application if DB connection is critical
    // process.exit(1);
  });

// Export the promise-based pool for use in other modules
module.exports = promisePool;
