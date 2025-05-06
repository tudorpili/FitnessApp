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
const weightLogRoutes = require('./src/routes/weightLogRoutes');
const mealLogRoutes = require('./src/routes/mealLogRoutes');
const workoutPlanRoutes = require('./src/routes/workoutPlanRoutes');
const userRoutes = require('./src/routes/userRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const stepLogRoutes = require('./src/routes/stepLogRoutes'); // <-- Import Step Routes
const waterLogRoutes = require('./src/routes/waterLogRoutes'); // <-- Import Water Routes

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
app.use('/api/weight', weightLogRoutes);
app.use('/api/meals', mealLogRoutes);
app.use('/api/plans', workoutPlanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/steps', stepLogRoutes);   // <-- Mount Step Routes
app.use('/api/water', waterLogRoutes); // <-- Mount Water Routes

// --- Error Handling Middleware ---
app.use((err, req, res, next) => { /* ... */ });

// --- Server Startup ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { /* ... */ });

