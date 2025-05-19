// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();





router.get('/', authenticateToken, isAdmin, userController.getAllUsers);


router.put('/:id', authenticateToken, isAdmin, userController.updateUser);


router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
