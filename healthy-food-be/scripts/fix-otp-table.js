const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306
};

async function fixOTPTable() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('🔧 Fixing OTP table constraints...');
    
    // Xóa unique constraint cũ
    try {
      await pool.execute('ALTER TABLE password_reset_otps DROP INDEX unique_active_otp');
      console.log('✅ Đã xóa unique constraint cũ');
    } catch (error) {
      console.log('ℹ️ Unique constraint không tồn tại hoặc đã được xóa');
    }
    
    // Xóa các OTP cũ và đã sử dụng
    await pool.execute('DELETE FROM password_reset_otps WHERE used = 1 OR expires_at < NOW()');
    console.log('✅ Đã dọn dẹp OTP cũ');
    
    // Tạo unique constraint mới chỉ cho OTP chưa sử dụng
    try {
      await pool.execute(`
        ALTER TABLE password_reset_otps 
        ADD CONSTRAINT unique_active_otp 
        UNIQUE (email, used) 
        WHERE used = 0
      `);
      console.log('✅ Đã tạo unique constraint mới');
    } catch (error) {
      console.log('ℹ️ Unique constraint đã tồn tại');
    }
    
    console.log('🎉 OTP table đã được sửa thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi sửa OTP table:', error);
  } finally {
    await pool.end();
  }
}

fixOTPTable();
