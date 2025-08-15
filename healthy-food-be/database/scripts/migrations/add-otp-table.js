const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

// Cấu hình database cho local
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function createOTPTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS password_reset_otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used TINYINT(1) DEFAULT 0,
        attempt_count INT DEFAULT 0,
        last_attempt_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email_otp (email, otp),
        INDEX idx_expires_at (expires_at),
        INDEX idx_user_id (user_id),
        INDEX idx_email_created (email, created_at),
        INDEX idx_last_attempt (email, last_attempt_at),
        UNIQUE KEY unique_active_otp (email, used),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.execute(createTableQuery);
    console.log('✅ Bảng password_reset_otps đã được tạo thành công');

    // Tạo index để tối ưu hiệu suất (sử dụng try-catch để tránh lỗi nếu index đã tồn tại)
    try {
      await pool.execute('CREATE INDEX idx_email_otp_used ON password_reset_otps (email, otp, used)');
      console.log('✅ Index idx_email_otp_used đã được tạo');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Index idx_email_otp_used đã tồn tại');
      } else {
        console.error('❌ Lỗi khi tạo index idx_email_otp_used:', error.message);
      }
    }

    try {
      await pool.execute('CREATE INDEX idx_expires_used ON password_reset_otps (expires_at, used)');
      console.log('✅ Index idx_expires_used đã được tạo');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Index idx_expires_used đã tồn tại');
      } else {
        console.error('❌ Lỗi khi tạo index idx_expires_used:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng password_reset_otps:', error);
    throw error;
  }
}

async function dropOTPTable() {
  try {
    await pool.execute('DROP TABLE IF EXISTS password_reset_otps');
    console.log('✅ Bảng password_reset_otps đã được xóa');
  } catch (error) {
    console.error('❌ Lỗi khi xóa bảng password_reset_otps:', error);
    throw error;
  }
}

// Chạy migration nếu file được gọi trực tiếp
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'up') {
    createOTPTable()
      .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
      });
  } else if (command === 'down') {
    dropOTPTable()
      .then(() => {
        console.log('Rollback completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Rollback failed:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage: node add-otp-table.js [up|down]');
    process.exit(1);
  }
}

module.exports = {
  createOTPTable,
  dropOTPTable
};
