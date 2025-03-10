const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const userController = {
  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { username, email } = req.body;
      const userId = req.user.id;
      
      // Check if email already exists for another user
      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail && existingEmail.id !== userId) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
      
      // Check if username already exists for another user
      if (username) {
        const existingUsername = await User.findByUsername(username);
        if (existingUsername && existingUsername.id !== userId) {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }
      
      // Update user
      const success = await User.update(userId, { username, email });
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const updatedUser = await User.findById(userId);
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          profile_image: updatedUser.profile_image
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error during profile update' });
    }
  },
  
  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      // Get user with password
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      
      const user = rows[0];
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      await User.updatePassword(userId, newPassword);
      
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error during password change' });
    }
  },
  
  // Delete account
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Delete user
      const success = await User.delete(userId);
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Server error during account deletion' });
    }
  }
};

module.exports = userController;