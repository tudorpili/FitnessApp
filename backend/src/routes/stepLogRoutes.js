// src/routes/stepLogRoutes.js
const express = require('express');
const stepLogController = require('../controllers/stepLogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/adjust', authenticateToken, stepLogController.adjustTodaySteps);



module.exports = router;
