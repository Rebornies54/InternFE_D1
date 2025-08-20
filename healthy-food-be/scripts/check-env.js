require('dotenv').config();

console.log('🔍 Checking .env configuration...');
console.log('================================');

console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('🔑 EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'SET (hidden)' : 'NOT SET');
console.log('🌐 JWT_SECRET:', process.env.JWT_SECRET ? 'SET (hidden)' : 'NOT SET');
console.log('🏠 DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('👤 DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('🗄️ DB_NAME:', process.env.DB_NAME || 'NOT SET');

console.log('\n📋 Environment check completed!');
