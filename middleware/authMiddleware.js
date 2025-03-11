const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    console.log('Authorization Header:', req.headers.authorization ? 'Present' : 'Not present');
    
    let token;
    
    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key-for-development');
    console.log('Token verified for user ID:', decoded.id);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    console.log('User authenticated:', user.id);
    
    // Add user to request
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, please log in again' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Optional auth middleware (doesn't require auth but adds user data if available)
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key-for-development');
    
    // Get user from token
    const user = await User.findById(decoded.id);
    if (user) {
      // Add user to request
      req.user = { id: user.id };
    }
    
    next();
  } catch (error) {
    // Just continue without user data
    next();
  }
};

module.exports = { protect, optionalAuth };