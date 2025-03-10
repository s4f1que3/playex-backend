const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// Get current user route (protected)
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;