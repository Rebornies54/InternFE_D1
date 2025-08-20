const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Update Email App Password');
console.log('============================\n');

console.log('📋 Hướng dẫn tạo Gmail App Password:');
console.log('1. Vào https://myaccount.google.com/');
console.log('2. Chọn "Security"');
console.log('3. Bật "2-Step Verification" nếu chưa bật');
console.log('4. Chọn "App passwords"');
console.log('5. Tạo app password cho "Mail"');
console.log('6. Copy password 16 ký tự\n');

rl.question('Nhập App Password mới (16 ký tự): ', (appPassword) => {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    
    // Đọc file .env hiện tại
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Thay thế EMAIL_APP_PASSWORD
    const newEnvContent = envContent.replace(
      /EMAIL_APP_PASSWORD=.*/,
      `EMAIL_APP_PASSWORD=${appPassword}`
    );
    
    // Ghi lại file .env
    fs.writeFileSync(envPath, newEnvContent);
    
    console.log('\n✅ App Password đã được cập nhật!');
    console.log('🔄 Vui lòng restart server: npm start');
    
    rl.close();
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật:', error.message);
    rl.close();
  }
});
