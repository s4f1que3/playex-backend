const db = require('../config/db');

const WatchHistory = {
  // Update watch progress
  updateProgress: async (userId, mediaId, mediaType, progress, duration, season = null, episode = null) => {
    const [result] = await db.execute(
      'INSERT INTO watch_history (user_id, media_id, media_type, season, episode, watch_progress, duration) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE watch_progress = ?, duration = ?, watched_at = CURRENT_TIMESTAMP',
      [userId, mediaId, mediaType, season, episode, progress, duration, progress, duration]
    );
    
    return result.insertId || result.affectedRows > 0;
  },
  
  // Get user's watch history
  getByUserId: async (userId, limit = 20) => {
    const [rows] = await db.execute(
      'SELECT * FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT ?',
      [userId, limit]
    );
    
    return rows;
  },
  
  // Get specific media progress
  getProgress: async (userId, mediaId, mediaType, season = null, episode = null) => {
    let query = 'SELECT * FROM watch_history WHERE user_id = ? AND media_id = ? AND media_type = ?';
    let params = [userId, mediaId, mediaType];
    
    if (mediaType === 'tv' && season !== null && episode !== null) {
      query += ' AND season = ? AND episode = ?';
      params.push(season, episode);
    } else if (mediaType === 'tv') {
      query += ' AND season IS NOT NULL AND episode IS NOT NULL';
    } else {
      query += ' AND season IS NULL AND episode IS NULL';
    }
    
    const [rows] = await db.execute(query, params);
    
    return rows[0];
  },
  
  // Delete watch history entry
  delete: async (userId, mediaId, mediaType, season = null, episode = null) => {
    let query = 'DELETE FROM watch_history WHERE user_id = ? AND media_id = ? AND media_type = ?';
    let params = [userId, mediaId, mediaType];
    
    if (mediaType === 'tv' && season !== null && episode !== null) {
      query += ' AND season = ? AND episode = ?';
      params.push(season, episode);
    } else if (mediaType === 'tv') {
      query += ' AND season IS NOT NULL AND episode IS NOT NULL';
    } else {
      query += ' AND season IS NULL AND episode IS NULL';
    }
    
    const [result] = await db.execute(query, params);
    
    return result.affectedRows > 0;
  },
  
  // Clear user's entire watch history
  clearAll: async (userId) => {
    const [result] = await db.execute(
      'DELETE FROM watch_history WHERE user_id = ?',
      [userId]
    );
    
    return result.affectedRows > 0;
  }
};

module.exports = WatchHistory;