const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306
};

async function resetRateLimit() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('🔄 Resetting rate limiting for testing...');
    
    // Xóa tất cả OTP cũ
    await pool.execute('DELETE FROM password_reset_otps');
    console.log('✅ Đã xóa tất cả OTP cũ');
    
    // Reset attempt count
    console.log('✅ Rate limiting đã được reset');
    
    console.log('🎉 Bây giờ bạn có thể test forgot password lại!');
    
  } catch (error) {
    console.error('❌ Lỗi khi reset rate limiting:', error);
  } finally {
    await pool.end();
  }
}

resetRateLimit();
