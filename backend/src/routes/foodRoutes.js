// src/routes/foodRoutes.js
const express = require('express');
const foodController = require('../controllers/foodController');


const router = express.Router();



router.get('/search', foodController.searchFoods);





module.exports = router;
