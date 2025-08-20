const express = require('express');
const AuthService = require('../services/authService');
const OTPService = require('../services/otpService');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const auth = require('../middleware/auth');
const { pool } = require('../config/connection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDir = require('path').join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.post('/register', registerValidation, validate, async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

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

router.post('/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Update avatar_url in database
    await pool.execute(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, req.user.userId]
    );
    
    res.json({ 
      success: true, 
      avatarUrl,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload avatar' 
    });
  }
});

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

router.post('/bmi', auth, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { height, weight, bmi, bmi_category } = req.body;

    if (!height || !weight || !bmi || !bmi_category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: height, weight, bmi, bmi_category'
      });
    }

    const [existingData] = await pool.execute(
      'SELECT * FROM user_bmi_data WHERE user_id = ?',
      [user_id]
    );

    if (existingData.length > 0) {
      await pool.execute(
        'UPDATE user_bmi_data SET height = ?, weight = ?, bmi = ?, bmi_category = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [height, weight, bmi, bmi_category, user_id]
      );
    } else {
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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Sử dụng OTPService để tạo OTP với rate limiting
    const result = await OTPService.createOTP(email);

    // Trong thực tế, bạn sẽ gửi email với OTP
    // Ở đây tôi sẽ trả về OTP để test
    res.json({
      success: true,
      message: result.message,
      data: {
        otp: result.otp, // Chỉ trả về trong môi trường development
        expiresAt: result.expiresAt,
        message: `OTP của bạn là: ${result.otp}`
      }
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    
    // Xử lý các loại lỗi khác nhau
    if (error.message.includes('Vui lòng đợi') || 
        error.message.includes('quá nhiều OTP')) {
      return res.status(429).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('không tồn tại')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi xử lý yêu cầu quên mật khẩu'
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và OTP là bắt buộc'
      });
    }

    // Sử dụng OTPService để xác thực OTP
    const result = await OTPService.verifyOTP(email, otp);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error in verify OTP:', error);
    
    if (error.message.includes('quá nhiều lần')) {
      return res.status(429).json({
        success: false,
        message: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xác thực OTP'
    });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP và mật khẩu mới là bắt buộc'
      });
    }

    // Sử dụng OTPService để reset password
    const result = await OTPService.resetPassword(email, otp, newPassword);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error in reset password:', error);
    
    if (error.message.includes('không hợp lệ')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lại mật khẩu'
    });
  }
});

// Admin API để xem thống kê OTP (chỉ dành cho admin)
router.get('/otp-stats', auth, async (req, res) => {
  try {
    // Kiểm tra quyền admin (bạn có thể thêm logic kiểm tra role)
    const { email } = req.query;
    const stats = await OTPService.getOTPStats(email);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting OTP stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê OTP'
    });
  }
});

// API để chạy cleanup thủ công (chỉ dành cho admin)
router.post('/cleanup-otp', auth, async (req, res) => {
  try {
    const CleanupService = require('../services/cleanupService');
    await CleanupService.manualCleanup();
    
    res.json({
      success: true,
      message: 'Cleanup hoàn thành'
    });
  } catch (error) {
    console.error('Error in manual cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cleanup'
    });
  }
});

module.exports = router; 