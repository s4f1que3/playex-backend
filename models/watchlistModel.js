const db = require('../config/db');

const Watchlist = {
  // Add media to watchlist
  add: async (userId, mediaId, mediaType) => {
    const [result] = await db.execute(
      'INSERT INTO watchlist (user_id, media_id, media_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE added_at = CURRENT_TIMESTAMP',
      [userId, mediaId, mediaType]
    );
    
    return result.insertId;
  },
  
  // Remove media from watchlist
  remove: async (userId, mediaId, mediaType) => {
    const [result] = await db.execute(
      'DELETE FROM watchlist WHERE user_id = ? AND media_id = ? AND media_type = ?',
      [userId, mediaId, mediaType]
    );
    
    return result.affectedRows > 0;
  },
  
  // Get user's watchlist
  getByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [userId]
    );
    
    return rows;
  },
  
  // Check if media is in watchlist
  isInWatchlist: async (userId, mediaId, mediaType) => {
    const [rows] = await db.execute(
      'SELECT * FROM watchlist WHERE user_id = ? AND media_id = ? AND media_type = ?',
      [userId, mediaId, mediaType]
    );
    
    return rows.length > 0;
  }
};

module.exports = Watchlist;