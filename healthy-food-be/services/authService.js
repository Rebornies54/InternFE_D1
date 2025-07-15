const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

class AuthService {
  // Register new user
  static async register(userData) {
    try {
      const { name, email, password, phone, gender, birthday, province, district, address } = userData;
      
      // Check if user already exists
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert new user
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, phone, gender, birthday, province, district, address) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone, gender, birthday, province, district, address]
      );
      
      // Get user data without password
      const [newUser] = await pool.execute(
        'SELECT id, name, email, phone, gender, birthday, province, district, address, created_at FROM users WHERE id = ?',
        [result.insertId]
      );
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser[0],
          token
        }
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // Login user
  static async login(email, password) {
    try {
      // Find user by email
      const [users] = await pool.execute(
        'SELECT id, name, email, password, phone, gender, birthday, province, district, address, created_at FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        throw new Error('Email không tồn tại trong hệ thống');
      }
      
      const user = users[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Mật khẩu không đúng');
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // Get user profile
  static async getUserProfile(userId) {
    try {
      const [users] = await pool.execute(
        'SELECT id, name, email, phone, gender, birthday, province, district, address, avatar_url, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        data: users[0]
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['name', 'phone', 'gender', 'birthday', 'province', 'district', 'address', 'avatar_url'];
      const updateFields = [];
      const updateValues = [];
      
      // Build dynamic update query
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      updateValues.push(userId);
      
      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      
      // Get updated user data
      const [users] = await pool.execute(
        'SELECT id, name, email, phone, gender, birthday, province, district, address, avatar_url, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      return {
        success: true,
        message: 'Profile updated successfully',
        data: users[0]
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // Change password
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      // Get current password
      const [users] = await pool.execute(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, users[0].password);
      
      if (!isOldPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedNewPassword, userId]
      );
      
      return {
        success: true,
        message: 'Password changed successfully'
      };
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService; 