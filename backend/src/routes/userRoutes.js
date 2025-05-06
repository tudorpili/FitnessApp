// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Admin-Only User Management Routes ---
// All routes require authentication and Admin role

// GET /api/users - Fetch all users
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

// PUT /api/users/:id - Update user details (role, status, etc.)
router.put('/:id', authenticateToken, isAdmin, userController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
