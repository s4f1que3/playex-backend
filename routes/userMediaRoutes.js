const express = require('express');
const userMediaController = require('../controllers/userMediaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Watchlist routes
router.post('/watchlist', protect, userMediaController.addToWatchlist);
router.delete('/watchlist/:mediaType/:mediaId', protect, userMediaController.removeFromWatchlist);
router.get('/watchlist', protect, userMediaController.getWatchlist);

// Favorites routes
router.post('/favorites', protect, userMediaController.addToFavorites);
router.delete('/favorites/:mediaType/:mediaId', protect, userMediaController.removeFromFavorites);
router.get('/favorites', protect, userMediaController.getFavorites);

// Watch history routes
router.post('/watch-progress', protect, userMediaController.updateWatchProgress);
router.get('/watch-history', protect, userMediaController.getWatchHistory);
router.delete('/watch-history/:mediaType/:mediaId', protect, userMediaController.deleteWatchHistoryItem);
router.delete('/watch-history', protect, userMediaController.clearWatchHistory);

module.exports = router;