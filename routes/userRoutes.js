const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Update profile route
router.put('/profile', protect, userController.updateProfile);

// Change password route
router.put('/change-password', protect, userController.changePassword);

// Delete account route
router.delete('/', protect, userController.deleteAccount);

module.exports = router;