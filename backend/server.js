// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./src/config/db.js');

// Import route handlers
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const authRoutes = require('./src/routes/authRoutes'); // <-- Import Auth Routes
// const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Routes
app.get('/', (req, res) => { /* ... */ res.status(200).json({ message: 'Welcome!' }); });

// Mount API routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes); // <-- Mount Auth Routes under /api/auth
// app.use('/api/users', userRoutes);


// Error Handling (Basic Placeholder)
// app.use((err, req, res, next) => { ... });

// Server Startup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`--------------------------------------------------`); console.log(`🚀 Backend server running on port ${PORT}`); console.log(`   Access API at http://localhost:${PORT}`); console.log(`--------------------------------------------------`); });
