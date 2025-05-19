// src/controllers/userController.js
const User = require('../models/User');

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

  
  updateUser: async (req, res) => {
    
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);
      const updateData = req.body; 

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      
      
      if (req.user && req.user.id === userId) {
          if (updateData.role !== undefined && updateData.role !== 'Admin') {
              return res.status(403).json({ message: 'Admins cannot change their own role.' });
          }
           if (updateData.status !== undefined && updateData.status !== 'Active') {
              return res.status(403).json({ message: 'Admins cannot deactivate their own account via user management.' });
          }
      }


      
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
           return res.status(400).json({ message: error.message }); 
       }
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  
  deleteUser: async (req, res) => {
    
    try {
      const { id } = req.params;
      const userIdToDelete = parseInt(id, 10);

      if (isNaN(userIdToDelete)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      
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
