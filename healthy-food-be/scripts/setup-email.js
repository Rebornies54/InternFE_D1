#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Setup Email Service cho Healthy Food');
console.log('=====================================\n');

console.log('📧 Để sử dụng email thật, bạn cần:');
console.log('1. Tạo Gmail App Password');
console.log('2. Cấu hình environment variables\n');

console.log('📋 Hướng dẫn tạo Gmail App Password:');
console.log('1. Vào https://myaccount.google.com/');
console.log('2. Chọn "Security"');
console.log('3. Bật "2-Step Verification" nếu chưa bật');
console.log('4. Chọn "App passwords"');
console.log('5. Tạo app password cho "Mail"');
console.log('6. Copy password 16 ký tự\n');

rl.question('Nhập Gmail của bạn: ', (email) => {
  rl.question('Nhập App Password (16 ký tự): ', (appPassword) => {
    rl.question('Nhập JWT Secret (hoặc Enter để tự tạo): ', (jwtSecret) => {
      
      // Tạo JWT secret nếu không có
      const finalJwtSecret = jwtSecret || require('crypto').randomBytes(64).toString('hex');
      
      // Tạo nội dung .env
      const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=0504Giavuong
DB_NAME=healthyfood
DB_PORT=3306

# JWT Configuration
JWT_SECRET=${finalJwtSecret}
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Email Configuration (Gmail)
EMAIL_USER=${email}
EMAIL_APP_PASSWORD=${appPassword}

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100000
`;

      // Ghi file .env
      const envPath = path.join(__dirname, '..', '.env');
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ File .env đã được tạo thành công!');
      console.log(`📁 Đường dẫn: ${envPath}`);
      
      console.log('\n🔧 Cấu hình đã được lưu:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 JWT Secret: ${finalJwtSecret.substring(0, 20)}...`);
      
      console.log('\n🚀 Bước tiếp theo:');
      console.log('1. Restart server: npm start');
      console.log('2. Test email service');
      console.log('3. Đăng ký tài khoản mới để nhận email chào mừng');
      console.log('4. Test tính năng forgot password');
      
      rl.close();
    });
  });
});

rl.on('close', () => {
  console.log('\n🎉 Setup hoàn tất! Chúc bạn thành công!');
  process.exit(0);
});
