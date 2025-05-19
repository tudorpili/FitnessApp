// src/routes/weightLogRoutes.js
const express = require('express');
const weightLogController = require('../controllers/weightLogController');
const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();




router.post('/', authenticateToken, weightLogController.addOrUpdateWeightLog);


router.get('/history', authenticateToken, weightLogController.getWeightHistory);


router.delete('/:logId', authenticateToken, weightLogController.deleteWeightLog);

module.exports = router;
