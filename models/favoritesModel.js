const db = require('../config/db');

const Favorites = {
  // Add media to favorites
  add: async (userId, mediaId, mediaType) => {
    const [result] = await db.execute(
      'INSERT INTO favorites (user_id, media_id, media_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE added_at = CURRENT_TIMESTAMP',
      [userId, mediaId, mediaType]
    );
    
    return result.insertId;
  },
  
  // Remove media from favorites
  remove: async (userId, mediaId, mediaType) => {
    const [result] = await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND media_id = ? AND media_type = ?',
      [userId, mediaId, mediaType]
    );
    
    return result.affectedRows > 0;
  },
  
  // Get user's favorites
  getByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [userId]
    );
    
    return rows;
  },
  
  // Check if media is in favorites
  isInFavorites: async (userId, mediaId, mediaType) => {
    const [rows] = await db.execute(
      'SELECT * FROM favorites WHERE user_id = ? AND media_id = ? AND media_type = ?',
      [userId, mediaId, mediaType]
    );
    
    return rows.length > 0;
  }
};

module.exports = Favorites;