const db = require('../config/db');
const bcrypt = require('bcryptjs');


const User = {
  // Create a new user
  create: async (userData) => {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    return result.insertId;
  },
  
  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, username, email, profile_image, created_at FROM users WHERE id = ?',
      [id]
    );
    
    return rows[0];
  },
  
  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0];
  },
  
  // Find user by username
  findByUsername: async (username) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    return rows[0];
  },
  
  // Update user
  update: async (id, userData) => {
    const { username, email } = userData;
    
    const [result] = await db.execute(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, id]
    );
    
    return result.affectedRows > 0;
  },
  
  // Update password
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  },
  
  // Delete user
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
};

module.exports = User;