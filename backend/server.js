// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./src/config/db.js'); // Initialize DB connection

// Import existing routes
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
const stepLogRoutes = require('./src/routes/stepLogRoutes');
const waterLogRoutes = require('./src/routes/waterLogRoutes');
const goalRoutes = require('./src/routes/goalRoutes');
const quoteRoutes = require('./src/routes/quoteRoutes'); // <-- NEW: Import quote routes

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic route for checking if server is up
app.get('/', (req, res) => {
  res.send('Fitness App Backend is running!');
});

// API Routes
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
app.use('/api/steps', stepLogRoutes);
app.use('/api/water', waterLogRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/quotes', quoteRoutes); // <-- NEW: Use quote routes

// Global error handler (optional, but good practice)
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
