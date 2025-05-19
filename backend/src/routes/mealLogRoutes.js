// src/routes/mealLogRoutes.js
const express = require('express');
const mealLogController = require('../controllers/mealLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();




router.post('/', authenticateToken, mealLogController.addMealLogEntry);



router.get('/history', authenticateToken, mealLogController.getMealHistory);


router.delete('/:logId', authenticateToken, mealLogController.deleteMealLogEntry);

module.exports = router;
