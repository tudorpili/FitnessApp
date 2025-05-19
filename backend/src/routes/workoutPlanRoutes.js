// src/routes/workoutPlanRoutes.js
const express = require('express');
const workoutPlanController = require('../controllers/workoutPlanController');
const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();


router.get('/', workoutPlanController.getAllPlans);


router.get('/:planId', workoutPlanController.getPlanById);


router.post('/', authenticateToken, workoutPlanController.createPlan);


router.delete('/:planId', authenticateToken, workoutPlanController.deletePlan);



router.put('/:planId', authenticateToken, workoutPlanController.updatePlan);

module.exports = router;
