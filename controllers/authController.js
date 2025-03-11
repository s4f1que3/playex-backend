const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-fallback-secret-key-for-development', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      console.log('Registration attempt with data:', { 
        username: req.body.username ? '(provided)' : '(missing)',
        email: req.body.email ? '(provided)' : '(missing)',
        password: req.body.password ? '(provided)' : '(missing)'
      });
      
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email and password' });
      }
      
      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Check if username already exists
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      // Create new user
      const userId = await User.create({ username, email, password });
      console.log('User created with ID:', userId);
      
      // Generate token
      const token = generateToken(userId);
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          username,
          email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },
  
  // Login user
  login: async (req, res) => {
    try {
      console.log('Login attempt with data:', {
        email: req.body.email ? '(provided)' : '(missing)',
        password: req.body.password ? '(provided)' : '(missing)'
      });
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }
      
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        console.log(`Login failed: No user found with email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log(`User found: ${user.id}`);
      
      // Verify password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        console.log(`Login failed: Password doesn't match for user: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Generate token
      const token = generateToken(user.id);
      console.log(`Login successful for user: ${email}`);
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profile_image: user.profile_image
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'production' ? undefined : error.message  
      });
    }
  },
  
  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      
      if (!email || !newPassword) {
        return res.status(400).json({ message: 'Please provide email and new password' });
      }
      
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update password
      await User.updatePassword(user.id, newPassword);
      
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Server error during password reset' });
    }
  },
  
  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      console.log('Getting current user with ID:', req.user.id);
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error getting user data' });
    }
  }
};

module.exports = authController;