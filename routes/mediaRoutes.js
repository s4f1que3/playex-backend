const express = require('express');
const mediaController = require('../controllers/mediaController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Get trending media
router.get('/trending', mediaController.getTrending);

// Get top-rated media
router.get('/top-rated', mediaController.getTopRated);

// Get media details (optional auth to check watchlist/favorites)
router.get('/:mediaType/:mediaId', optionalAuth, mediaController.getMediaDetails);

// Get TV show season details (optional auth to check watch progress)
router.get('/tv/:tvId/season/:seasonNumber', optionalAuth, mediaController.getSeasonDetails);

// Search media
router.get('/search', mediaController.searchMedia);

// Get media by genre
router.get('/discover', mediaController.getByGenre);

// Get available genres
router.get('/genres', mediaController.getGenres);

module.exports = router;