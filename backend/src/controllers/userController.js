// src/controllers/userController.js
const User = require('../models/User');
// const bcrypt = require('bcrypt'); // bcrypt is used within User model now

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAllAdminView(); 
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  updateUser: async (req, res) => { // For Admin
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);
      const updateData = req.body; 

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }
      if (req.user && req.user.id === userId) {
          if (updateData.role !== undefined && updateData.role !== req.user.role) {
              return res.status(403).json({ message: 'Admins cannot change their own role via this endpoint.' });
          }
          if (updateData.status !== undefined && updateData.status !== 'Active') {
              return res.status(403).json({ message: 'Admins cannot deactivate their own account via this generic user management update.' });
          }
      }
      delete updateData.password;
      delete updateData.password_hash;

      const updatedUser = await User.updateById(userId, updateData);

      if (updatedUser) {
        const { password_hash, ...safeUser } = updatedUser;
        res.status(200).json({ message: 'User updated successfully!', user: safeUser });
      } else {
        res.status(404).json({ message: `User with ID ${userId} not found.` });
      }
    } catch (error) {
      console.error('Error in updateUser controller:', error);
       if (error.message.includes('already exists') || error.message.includes('Invalid role') || error.message.includes('Invalid status')) {
           return res.status(400).json({ message: error.message }); 
       }
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  deleteUser: async (req, res) => { // For Admin
    try {
      const { id } = req.params;
      const userIdToDelete = parseInt(id, 10);

      if (isNaN(userIdToDelete)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }
      if (req.user && req.user.id === userIdToDelete) {
        return res.status(403).json({ message: 'Admins cannot delete their own account through this admin endpoint.' });
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
  },

  updateMyProfile: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        const { username } = req.body; 

        if (!username || !username.trim()) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        const updatedUser = await User.updateMyProfile(userId, { username });

        if (updatedUser) {
            const { password_hash, ...safeUser } = updatedUser;
            res.status(200).json({ message: 'Profile updated successfully!', user: safeUser });
        } else {
            res.status(404).json({ message: 'User not found or update failed.' });
        }
    } catch (error) {
        console.error('Error in updateMyProfile controller:', error);
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  },

  changeMyPassword: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required.' });
        }

        const success = await User.changePassword(userId, currentPassword, newPassword);

        if (success) {
            res.status(200).json({ message: 'Password changed successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to change password.' });
        }
    } catch (error) {
        console.error('Error in changeMyPassword controller:', error);
        if (error.message === 'Incorrect current password.') {
            return res.status(401).json({ message: error.message });
        }
        if (error.message.includes('at least 6 characters')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
  },

  deactivateMyAccount: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        const success = await User.deactivateAccount(userId);

        if (success) {
            res.status(200).json({ message: 'Account deactivated successfully. You have been logged out.' });
        } else {
            res.status(404).json({ message: 'User not found or deactivation failed.' });
        }
    } catch (error) {
        console.error('Error in deactivateMyAccount controller:', error);
        res.status(500).json({ message: 'Error deactivating account', error: error.message });
    }
  },

  deleteMyAccount: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        // --- MODIFIED: Expect 'confirmationText' instead of 'password' ---
        const { confirmationText } = req.body; 
        const EXPECTED_CONFIRMATION_TEXT = "CONFIRM"; // Define the expected keyword

        if (!confirmationText) {
            return res.status(400).json({ message: `Confirmation text is required. Please type "${EXPECTED_CONFIRMATION_TEXT}".` });
        }

        if (confirmationText.toUpperCase() !== EXPECTED_CONFIRMATION_TEXT) {
            return res.status(401).json({ message: `Incorrect confirmation text. Please type "${EXPECTED_CONFIRMATION_TEXT}" to confirm deletion.` });
        }
        // --- END MODIFICATION ---
        
        // Password verification logic is removed.

        const success = await User.deleteById(userId);

        if (success) {
            res.status(200).json({ message: 'Account deleted successfully. You have been logged out.' });
        } else {
            // This might happen if the user was deleted between authentication and this call, though unlikely.
            res.status(404).json({ message: 'User not found or deletion failed unexpectedly.' });
        }
    } catch (error) {
        console.error('Error in deleteMyAccount controller:', error);
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
  }
};

module.exports = userController;