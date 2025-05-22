// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Routes for current user's own profile ---
// These specific '/me/...' routes should come BEFORE generic '/:id' routes

// PUT /api/users/me/profile - Current user updates their own profile (e.g., username)
router.put('/me/profile', authenticateToken, userController.updateMyProfile);

// PUT /api/users/me/password - Current user changes their own password
router.put('/me/password', authenticateToken, userController.changeMyPassword);

// PUT /api/users/me/deactivate - Current user deactivates their own account
router.put('/me/deactivate', authenticateToken, userController.deactivateMyAccount);

// DELETE /api/users/me - Current user deletes their own account
router.delete('/me', authenticateToken, userController.deleteMyAccount);


// --- Admin Routes for User Management ---
// These routes are for admins to manage any user.

// GET /api/users - Admin gets all users
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

// PUT /api/users/:id - Admin updates any user
router.put('/:id', authenticateToken, isAdmin, userController.updateUser); 

// DELETE /api/users/:id - Admin deletes any user
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser); 

module.exports = router;
