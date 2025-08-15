const { pool } = require('../config/connection');
const bcrypt = require('bcryptjs');
const EmailService = require('./emailService');

class OTPService {
  // Cấu hình rate limiting
  static RATE_LIMIT = {
    MIN_INTERVAL: 10, // 10 giây giữa các lần gửi OTP (giảm cho development)
    MAX_ATTEMPTS_PER_HOUR: 10, // Tối đa 10 lần gửi OTP trong 1 giờ
    MAX_ATTEMPTS_PER_DAY: 20, // Tối đa 20 lần gửi OTP trong 1 ngày
    OTP_EXPIRY: 10 * 60, // 10 phút
    MAX_VERIFY_ATTEMPTS: 5 // Tối đa 5 lần nhập sai OTP
  };

  // Kiểm tra rate limit
  static async checkRateLimit(email) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      // Kiểm tra OTP gần nhất
      const [recentOTP] = await pool.execute(
        `SELECT created_at, last_attempt_at 
         FROM password_reset_otps 
         WHERE email = ? AND used = 0 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [email]
      );

      if (recentOTP.length > 0) {
        const lastCreated = new Date(recentOTP[0].created_at);
        const timeSinceLastOTP = (now - lastCreated) / 1000;

        if (timeSinceLastOTP < this.RATE_LIMIT.MIN_INTERVAL) {
          const remainingTime = Math.ceil(this.RATE_LIMIT.MIN_INTERVAL - timeSinceLastOTP);
          throw new Error(`Vui lòng đợi ${remainingTime} giây trước khi gửi OTP mới`);
        }
      }

      // Kiểm tra số lần gửi trong 1 giờ
      const [hourlyAttempts] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM password_reset_otps 
         WHERE email = ? AND created_at > ?`,
        [email, oneHourAgo]
      );

      if (hourlyAttempts[0].count >= this.RATE_LIMIT.MAX_ATTEMPTS_PER_HOUR) {
        throw new Error('Bạn đã gửi quá nhiều OTP trong 1 giờ. Vui lòng thử lại sau');
      }

      // Kiểm tra số lần gửi trong 1 ngày
      const [dailyAttempts] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM password_reset_otps 
         WHERE email = ? AND created_at > ?`,
        [email, oneDayAgo]
      );

      if (dailyAttempts[0].count >= this.RATE_LIMIT.MAX_ATTEMPTS_PER_DAY) {
        throw new Error('Bạn đã gửi quá nhiều OTP trong 1 ngày. Vui lòng thử lại vào ngày mai');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Tạo OTP mới với transaction
  static async createOTP(email) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Kiểm tra rate limit
      await this.checkRateLimit(email);

      // Lấy thông tin user
      const [users] = await connection.execute(
        'SELECT id, name FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        throw new Error('Email không tồn tại trong hệ thống');
      }

      const user = users[0];

      // Vô hiệu hóa OTP cũ (nếu có)
      await connection.execute(
        'UPDATE password_reset_otps SET used = 1 WHERE email = ? AND used = 0',
        [email]
      );

      // Tạo OTP mới
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + this.RATE_LIMIT.OTP_EXPIRY * 1000);

      // Lưu OTP mới
      await connection.execute(
        `INSERT INTO password_reset_otps 
         (user_id, email, otp, expires_at, attempt_count, last_attempt_at) 
         VALUES (?, ?, ?, ?, 0, NOW())`,
        [user.id, email, otp, expiresAt]
      );

      await connection.commit();

      // Gửi email OTP thật
      try {
        await EmailService.sendOTP(email, otp, user.name);
        console.log(`✅ OTP đã được gửi đến ${email}`);
      } catch (emailError) {
        console.error('❌ Lỗi khi gửi email OTP:', emailError.message);
        // Trong môi trường development, vẫn trả về OTP để test
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔧 Development mode: OTP = ${otp}`);
        }
      }

      return {
        otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Chỉ trả về OTP trong development
        expiresAt,
        message: `OTP đã được gửi đến ${email}`
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Xác thực OTP với attempt tracking
  static async verifyOTP(email, otp) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Tìm OTP hợp lệ
      const [otpRecords] = await connection.execute(
        `SELECT * FROM password_reset_otps 
         WHERE email = ? AND otp = ? AND expires_at > NOW() AND used = 0`,
        [email, otp]
      );

      if (otpRecords.length === 0) {
        // Tăng số lần thử sai
        await connection.execute(
          `UPDATE password_reset_otps 
           SET attempt_count = attempt_count + 1, last_attempt_at = NOW() 
           WHERE email = ? AND used = 0`,
          [email]
        );

        // Kiểm tra xem có vượt quá số lần thử không
        const [attempts] = await connection.execute(
          `SELECT attempt_count FROM password_reset_otps 
           WHERE email = ? AND used = 0`,
          [email]
        );

        if (attempts.length > 0 && attempts[0].attempt_count >= this.RATE_LIMIT.MAX_VERIFY_ATTEMPTS) {
          // Vô hiệu hóa OTP nếu thử sai quá nhiều
          await connection.execute(
            'UPDATE password_reset_otps SET used = 1 WHERE email = ? AND used = 0',
            [email]
          );
          throw new Error('Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu OTP mới');
        }

        throw new Error('OTP không hợp lệ hoặc đã hết hạn');
      }

      const otpRecord = otpRecords[0];

      // Reset attempt count khi OTP đúng
      await connection.execute(
        'UPDATE password_reset_otps SET attempt_count = 0 WHERE id = ?',
        [otpRecord.id]
      );

      await connection.commit();

      return {
        success: true,
        message: 'OTP hợp lệ',
        otpRecord
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Reset password với OTP
  static async resetPassword(email, otp, newPassword) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Xác thực OTP
      const verifyResult = await this.verifyOTP(email, otp);
      
      if (!verifyResult.success) {
        throw new Error('OTP không hợp lệ');
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Cập nhật mật khẩu
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );

      // Đánh dấu OTP đã sử dụng
      await connection.execute(
        'UPDATE password_reset_otps SET used = 1 WHERE email = ? AND otp = ? AND used = 0',
        [email, otp]
      );

      await connection.commit();

      return {
        success: true,
        message: 'Mật khẩu đã được đặt lại thành công'
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cleanup OTP hết hạn (có thể chạy định kỳ)
  static async cleanupExpiredOTPs() {
    try {
      await pool.execute(
        'DELETE FROM password_reset_otps WHERE expires_at < NOW() OR used = 1'
      );
      console.log('✅ Đã dọn dẹp OTP hết hạn');
    } catch (error) {
      console.error('❌ Lỗi khi dọn dẹp OTP:', error);
    }
  }

  // Lấy thống kê OTP cho admin
  static async getOTPStats(email = null) {
    try {
      let query = `
        SELECT 
          email,
          COUNT(*) as total_attempts,
          SUM(CASE WHEN used = 1 THEN 1 ELSE 0 END) as used_count,
          SUM(CASE WHEN expires_at < NOW() THEN 1 ELSE 0 END) as expired_count,
          MAX(created_at) as last_attempt
        FROM password_reset_otps
      `;
      
      const params = [];
      if (email) {
        query += ' WHERE email = ?';
        params.push(email);
      }
      
      query += ' GROUP BY email ORDER BY last_attempt DESC';
      
      const [stats] = await pool.execute(query, params);
      return stats;
    } catch (error) {
      console.error('❌ Lỗi khi lấy thống kê OTP:', error);
      throw error;
    }
  }
}

module.exports = OTPService;
