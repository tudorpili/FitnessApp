// backend/src/config/db.js

const mysql = require('mysql2');
const dotenv = require('dotenv');


dotenv.config();



const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root',      
  password: process.env.DB_PASSWORD || '',    
  database: process.env.DB_NAME || 'fitness_tracker', 
  port: process.env.DB_PORT || 3306,      
  waitForConnections: true, 
  connectionLimit: 10,      
  queueLimit: 0             
});


const promisePool = pool.promise();


promisePool.getConnection()
  .then(connection => {
    console.log('✅ Database connection successful!');
    
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    
    
  });


module.exports = promisePool;
