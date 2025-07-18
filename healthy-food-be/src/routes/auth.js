const express = require('express');
const AuthService = require('../services/authService');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const auth = require('../middleware/auth');
const { pool } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDir = require('path').join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Cấu hình multer để lưu file vào thư mục uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Register new user
router.post('/register', registerValidation, validate, async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Login user
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await AuthService.getUserProfile(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, async (req, res) => {
  try {
    const result = await AuthService.updateProfile(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Change password (protected route)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }
    
    const result = await AuthService.changePassword(req.user.userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Upload avatar (protected route)
router.post('/profile/avatar', auth, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Trả về đường dẫn file để frontend lưu vào avatar_url
  const avatarUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, avatarUrl });
});

// Get user's BMI data
router.get('/bmi', auth, async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    const [rows] = await pool.execute(
      'SELECT * FROM user_bmi_data WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      [user_id]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        data: rows[0]
      });
    } else {
      res.json({
        success: true,
        data: null
      });
    }
  } catch (error) {
    console.error('Error fetching BMI data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch BMI data'
    });
  }
});

// Save/Update user's BMI data
router.post('/bmi', auth, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { height, weight, bmi, bmi_category } = req.body;

    // Validate input
    if (!height || !weight || !bmi || !bmi_category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: height, weight, bmi, bmi_category'
      });
    }

    // Check if user already has BMI data
    const [existingData] = await pool.execute(
      'SELECT * FROM user_bmi_data WHERE user_id = ?',
      [user_id]
    );

    if (existingData.length > 0) {
      // Update existing BMI data
      await pool.execute(
        'UPDATE user_bmi_data SET height = ?, weight = ?, bmi = ?, bmi_category = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [height, weight, bmi, bmi_category, user_id]
      );
    } else {
      // Insert new BMI data
      await pool.execute(
        'INSERT INTO user_bmi_data (user_id, height, weight, bmi, bmi_category) VALUES (?, ?, ?, ?, ?)',
        [user_id, height, weight, bmi, bmi_category]
      );
    }

    res.json({
      success: true,
      message: 'BMI data saved successfully'
    });
  } catch (error) {
    console.error('Error saving BMI data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save BMI data'
    });
  }
});

module.exports = router; 