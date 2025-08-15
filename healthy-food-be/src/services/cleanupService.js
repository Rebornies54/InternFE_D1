const OTPService = require('./otpService');
const cron = require('node-cron');

class CleanupService {
  static init() {
    // Chạy cleanup mỗi giờ
    cron.schedule('0 * * * *', async () => {
      console.log('🕐 Bắt đầu cleanup OTP hết hạn...');
      try {
        await OTPService.cleanupExpiredOTPs();
        console.log('✅ Cleanup OTP hoàn thành');
      } catch (error) {
        console.error('❌ Lỗi khi cleanup OTP:', error);
      }
    });

    // Chạy cleanup mỗi ngày lúc 2 giờ sáng
    cron.schedule('0 2 * * *', async () => {
      console.log('🌙 Bắt đầu cleanup dữ liệu cũ...');
      try {
        await this.cleanupOldData();
        console.log('✅ Cleanup dữ liệu cũ hoàn thành');
      } catch (error) {
        console.error('❌ Lỗi khi cleanup dữ liệu cũ:', error);
      }
    });

    console.log('🚀 CleanupService đã được khởi tạo');
  }

  static async cleanupOldData() {
    const { pool } = require('../config/connection');
    
    try {
      // Xóa OTP đã sử dụng hoặc hết hạn quá 7 ngày
      await pool.execute(
        'DELETE FROM password_reset_otps WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      // Xóa logs cũ (nếu có)
      // await pool.execute('DELETE FROM system_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)');

      console.log('✅ Đã dọn dẹp dữ liệu cũ');
    } catch (error) {
      console.error('❌ Lỗi khi dọn dẹp dữ liệu cũ:', error);
      throw error;
    }
  }

  // Chạy cleanup thủ công
  static async manualCleanup() {
    try {
      await OTPService.cleanupExpiredOTPs();
      await this.cleanupOldData();
      console.log('✅ Manual cleanup hoàn thành');
    } catch (error) {
      console.error('❌ Lỗi khi manual cleanup:', error);
      throw error;
    }
  }
}

module.exports = CleanupService;
