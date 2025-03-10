const Watchlist = require('../models/watchlistModel');
const Favorites = require('../models/favoritesModel');
const WatchHistory = require('../models/watchHistoryModel');
const tmdbClient = require('../config/tmdb');

const userMediaController = {
  // Add to watchlist
  addToWatchlist: async (req, res) => {
    try {
      const { mediaId, mediaType } = req.body;
      const userId = req.user.id;
      
      await Watchlist.add(userId, mediaId, mediaType);
      
      res.status(200).json({ message: 'Added to watchlist successfully' });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ message: 'Error adding to watchlist' });
    }
  },
  
  // Remove from watchlist
  removeFromWatchlist: async (req, res) => {
    try {
      const { mediaId, mediaType } = req.params;
      const userId = req.user.id;
      
      await Watchlist.remove(userId, mediaId, mediaType);
      
      res.status(200).json({ message: 'Removed from watchlist successfully' });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({ message: 'Error removing from watchlist' });
    }
  },
  
  // Get user's watchlist
  getWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const watchlist = await Watchlist.getByUserId(userId);
      
      // Get detailed information for each item
      const enrichedWatchlist = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const response = await tmdbClient.get(`/${item.media_type}/${item.media_id}`);
            return {
              ...item,
              details: response.data
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type}/${item.media_id}:`, error);
            return item;
          }
        })
      );
      
      res.status(200).json(enrichedWatchlist);
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Error getting watchlist' });
    }
  },
  
  // Add to favorites
  addToFavorites: async (req, res) => {
    try {
      const { mediaId, mediaType } = req.body;
      const userId = req.user.id;
      
      await Favorites.add(userId, mediaId, mediaType);
      
      res.status(200).json({ message: 'Added to favorites successfully' });
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ message: 'Error adding to favorites' });
    }
  },
  
  // Remove from favorites
  removeFromFavorites: async (req, res) => {
    try {
      const { mediaId, mediaType } = req.params;
      const userId = req.user.id;
      
      await Favorites.remove(userId, mediaId, mediaType);
      
      res.status(200).json({ message: 'Removed from favorites successfully' });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ message: 'Error removing from favorites' });
    }
  },
  
  // Get user's favorites
  getFavorites: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const favorites = await Favorites.getByUserId(userId);
      
      // Get detailed information for each item
      const enrichedFavorites = await Promise.all(
        favorites.map(async (item) => {
          try {
            const response = await tmdbClient.get(`/${item.media_type}/${item.media_id}`);
            return {
              ...item,
              details: response.data
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type}/${item.media_id}:`, error);
            return item;
          }
        })
      );
      
      res.status(200).json(enrichedFavorites);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error getting favorites' });
    }
  },
  
  // Update watch progress
  updateWatchProgress: async (req, res) => {
    try {
      const { mediaId, mediaType, progress, duration, season, episode } = req.body;
      const userId = req.user.id;
      
      await WatchHistory.updateProgress(
        userId, mediaId, mediaType, progress, duration, season, episode
      );
      
      res.status(200).json({ message: 'Watch progress updated successfully' });
    } catch (error) {
      console.error('Update watch progress error:', error);
      res.status(500).json({ message: 'Error updating watch progress' });
    }
  },
  
  // Get user's watch history
  getWatchHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit } = req.query;
      
      const history = await WatchHistory.getByUserId(userId, limit);
      
      // Get detailed information for each item
      const enrichedHistory = await Promise.all(
        history.map(async (item) => {
          try {
            const response = await tmdbClient.get(`/${item.media_type}/${item.media_id}`);
            
            // For TV shows, get episode details
            let episodeDetails = null;
            if (item.media_type === 'tv' && item.season !== null && item.episode !== null) {
              const episodeResponse = await tmdbClient.get(
                `/tv/${item.media_id}/season/${item.season}/episode/${item.episode}`
              );
              episodeDetails = episodeResponse.data;
            }
            
            return {
              ...item,
              details: response.data,
              episodeDetails
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type}/${item.media_id}:`, error);
            return item;
          }
        })
      );
      
      res.status(200).json(enrichedHistory);
    } catch (error) {
      console.error('Get watch history error:', error);
      res.status(500).json({ message: 'Error getting watch history' });
    }
  },
  
  // Delete watch history item
  deleteWatchHistoryItem: async (req, res) => {
    try {
      const { mediaId, mediaType } = req.params;
      const { season, episode } = req.query;
      const userId = req.user.id;
      
      await WatchHistory.delete(userId, mediaId, mediaType, season, episode);
      
      res.status(200).json({ message: 'Watch history item deleted successfully' });
    } catch (error) {
      console.error('Delete watch history item error:', error);
      res.status(500).json({ message: 'Error deleting watch history item' });
    }
  },
  
  // Clear entire watch history
  clearWatchHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await WatchHistory.clearAll(userId);
      
      res.status(200).json({ message: 'Watch history cleared successfully' });
    } catch (error) {
      console.error('Clear watch history error:', error);
      res.status(500).json({ message: 'Error clearing watch history' });
    }
  }
};

module.exports = userMediaController;