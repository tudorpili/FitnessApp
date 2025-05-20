// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Admin Routes for User Management ---
// These should ideally be under an /admin/users prefix in server.js if not already
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.put('/:id', authenticateToken, isAdmin, userController.updateUser); // Admin updates any user
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser); // Admin deletes any user


// --- NEW: Routes for current user's own profile ---
// GET /api/users/me - Could be added to get current user's profile (optional for now)
// router.get('/me', authenticateToken, (req, res) => {
//   // req.user is populated by authenticateToken. We might want to fetch full user details from DB minus password.
//   // For now, frontend uses localStorage, but this could be an endpoint to refresh that.
//   res.status(200).json({ user: req.user }); 
// });

// PUT /api/users/me/profile - Current user updates their own profile (e.g., username)
router.put('/me/profile', authenticateToken, userController.updateMyProfile);

// PUT /api/users/me/password - Current user changes their own password
router.put('/me/password', authenticateToken, userController.changeMyPassword);


module.exports = router;
