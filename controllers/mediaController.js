const tmdbClient = require('../config/tmdb');
const Watchlist = require('../models/watchlistModel');
const Favorites = require('../models/favoritesModel');
const WatchHistory = require('../models/watchHistoryModel');

const mediaController = {
  // Get trending media (movies and TV shows)
  getTrending: async (req, res) => {
    try {
      const { page = 1, timeWindow = 'week' } = req.query;
      
      const response = await tmdbClient.get(`/trending/all/${timeWindow}`, {
        params: { page }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ message: 'Error fetching trending media' });
    }
  },
  
  // Get top-rated media
  getTopRated: async (req, res) => {
    try {
      const { mediaType = 'movie', page = 1 } = req.query;
      
      const response = await tmdbClient.get(`/${mediaType}/top_rated`, {
        params: { page }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get top-rated error:', error);
      res.status(500).json({ message: 'Error fetching top-rated media' });
    }
  },
  
  // Get media details
  getMediaDetails: async (req, res) => {
    try {
      const { mediaType, mediaId } = req.params;
      
      const response = await tmdbClient.get(`/${mediaType}/${mediaId}`, {
        params: {
          append_to_response: 'credits,similar,videos,recommendations'
        }
      });
      
      // If user is authenticated, check if media is in watchlist/favorites
      if (req.user) {
        const userId = req.user.id;
        
        const isInWatchlist = await Watchlist.isInWatchlist(userId, mediaId, mediaType);
        const isInFavorites = await Favorites.isInFavorites(userId, mediaId, mediaType);
        const watchProgress = await WatchHistory.getProgress(userId, mediaId, mediaType);
        
        response.data.user_data = {
          in_watchlist: isInWatchlist,
          in_favorites: isInFavorites,
          watch_progress: watchProgress ? watchProgress.watch_progress : 0,
          duration: watchProgress ? watchProgress.duration : 0
        };
      }
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get media details error:', error);
      res.status(500).json({ message: 'Error fetching media details' });
    }
  },
  
  // Get TV show season details
  getSeasonDetails: async (req, res) => {
    try {
      const { tvId, seasonNumber } = req.params;
      
      const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`);
      
      // If user is authenticated, check watch progress for episodes
      if (req.user) {
        const userId = req.user.id;
        
        for (const episode of response.data.episodes) {
          const watchProgress = await WatchHistory.getProgress(
            userId, tvId, 'tv', seasonNumber, episode.episode_number
          );
          
          episode.user_data = {
            watch_progress: watchProgress ? watchProgress.watch_progress : 0,
            duration: watchProgress ? watchProgress.duration : 0
          };
        }
      }
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get season details error:', error);
      res.status(500).json({ message: 'Error fetching season details' });
    }
  },
  
  // Search media
  searchMedia: async (req, res) => {
    try {
      const { query, page = 1 } = req.query;
      
      const response = await tmdbClient.get('/search/multi', {
        params: { query, page }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Search media error:', error);
      res.status(500).json({ message: 'Error searching media' });
    }
  },
  
  // Get media by genre
  getByGenre: async (req, res) => {
    try {
      const { mediaType = 'movie', genreId, page = 1 } = req.query;
      
      const response = await tmdbClient.get(`/discover/${mediaType}`, {
        params: {
          with_genres: genreId,
          page
        }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get by genre error:', error);
      res.status(500).json({ message: 'Error fetching media by genre' });
    }
  },
  
  // Get available genres
  getGenres: async (req, res) => {
    try {
      const { mediaType = 'movie' } = req.query;
      
      const response = await tmdbClient.get(`/genre/${mediaType}/list`);
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get genres error:', error);
      res.status(500).json({ message: 'Error fetching genres' });
    }
  }
};

module.exports = mediaController;