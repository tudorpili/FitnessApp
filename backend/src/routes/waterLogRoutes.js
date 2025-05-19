// src/routes/waterLogRoutes.js
const express = require('express');
const waterLogController = require('../controllers/waterLogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/adjust', authenticateToken, waterLogController.adjustTodayWater);



module.exports = router;
