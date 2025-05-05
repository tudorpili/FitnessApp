// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./src/config/db.js'); // Ensure path is correct

// --- Import Route Handlers ---
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const authRoutes = require('./src/routes/authRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');
const foodRoutes = require('./src/routes/foodRoutes');
const workoutLogRoutes = require('./src/routes/workoutLogRoutes');
const weightLogRoutes = require('./src/routes/weightLogRoutes'); // <-- Import Weight Log Routes
// const userRoutes = require('./src/routes/userRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Basic Root Route ---
app.get('/', (req, res) => { /* ... */ });

// --- Mount API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/workouts', workoutLogRoutes);
app.use('/api/weight', weightLogRoutes); // <-- Mount Weight Log Routes under /api/weight
// app.use('/api/users', userRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => { /* ... */ });

// --- Server Startup ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { /* ... */ });

