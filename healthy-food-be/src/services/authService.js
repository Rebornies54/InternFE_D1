const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/connection');

class AuthService {
  static async register(userData) {
    try {
      const { name, email, password, phone, gender, birthday, province, district, address } = userData;

      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, phone, gender, birthday, province, district, address) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone, gender, birthday, province, district, address]
      );
      
      const [newUser] = await pool.execute(
        'SELECT id, name, email, phone, gender, birthday, province, district, address, created_at FROM users WHERE id = ?',
        [result.insertId]
      );
      
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
  
  static async login(email, password) {
    try {
      const [users] = await pool.execute(
        'SELECT id, name, email, password, phone, gender, birthday, province, district, address, created_at FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        throw new Error('Email không tồn tại trong hệ thống');
      }
      
      const user = users[0];
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Mật khẩu không đúng');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
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
  
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['name', 'phone', 'gender', 'birthday', 'province', 'district', 'address', 'avatar_url'];
      const updateFields = [];
      const updateValues = [];
      
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
  
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const [users] = await pool.execute(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      const isOldPasswordValid = await bcrypt.compare(oldPassword, users[0].password);
      
      if (!isOldPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
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