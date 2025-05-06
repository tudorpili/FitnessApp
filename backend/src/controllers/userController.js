// src/controllers/userController.js
const User = require('../models/User');

const userController = {
  /**
   * Handles GET request to fetch all users (for Admin).
   * Requires Admin role.
   */
  getAllUsers: async (req, res) => {
    // Assumes isAdmin middleware has run and verified the user role
    try {
      const users = await User.findAllAdminView(); // Use the specific admin view method
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  /**
   * Handles PUT request to update a user's details (for Admin).
   * Requires Admin role.
   */
  updateUser: async (req, res) => {
    // Assumes isAdmin middleware has run
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);
      const updateData = req.body; // Contains fields like { role, status, username?, email? }

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      // Prevent admin from accidentally deactivating/changing role of their own account via this endpoint
      // Admins should manage their own account via a dedicated profile page if needed.
      if (req.user && req.user.id === userId) {
          if (updateData.role !== undefined && updateData.role !== 'Admin') {
              return res.status(403).json({ message: 'Admins cannot change their own role.' });
          }
           if (updateData.status !== undefined && updateData.status !== 'Active') {
              return res.status(403).json({ message: 'Admins cannot deactivate their own account via user management.' });
          }
      }


      // Remove password field if present, should not be updated here
      delete updateData.password;
      delete updateData.password_hash;

      const updatedUser = await User.updateById(userId, updateData);

      if (updatedUser) {
        res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
      } else {
        res.status(404).json({ message: `User with ID ${userId} not found.` });
      }
    } catch (error) {
      console.error('Error in updateUser controller:', error);
       if (error.message.includes('already exists') || error.message.includes('Invalid role') || error.message.includes('Invalid status')) {
           return res.status(400).json({ message: error.message }); // Bad request for validation errors
       }
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  /**
   * Handles DELETE request to remove a user (for Admin).
   * Requires Admin role.
   */
  deleteUser: async (req, res) => {
    // Assumes isAdmin middleware has run
    try {
      const { id } = req.params;
      const userIdToDelete = parseInt(id, 10);

      if (isNaN(userIdToDelete)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      // Prevent admin from deleting their own account via this endpoint
      if (req.user && req.user.id === userIdToDelete) {
        return res.status(403).json({ message: 'Admins cannot delete their own account via user management.' });
      }

      const success = await User.deleteById(userIdToDelete);

      if (success) {
        res.status(200).json({ message: `User ${userIdToDelete} deleted successfully.` });
      } else {
        res.status(404).json({ message: `User with ID ${userIdToDelete} not found.` });
      }
    } catch (error) {
      console.error('Error in deleteUser controller:', error);
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
};

module.exports = userController;
