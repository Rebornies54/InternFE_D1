const EmailService = require('../src/services/emailService');

async function testEmailService() {
  try {
    console.log('🧪 Testing Email Service...');
    
    // Test connection
    console.log('📧 Testing email connection...');
    const connectionTest = await EmailService.testConnection();
    
    if (connectionTest) {
      console.log('✅ Email connection successful!');
      
      // Test send OTP email
      console.log('📤 Testing OTP email...');
      await EmailService.sendOTP('test@example.com', '123456', 'Test User');
      
      // Test send welcome email
      console.log('📤 Testing welcome email...');
      await EmailService.sendWelcomeEmail('test@example.com', 'Test User');
      
      console.log('✅ All email tests completed!');
    } else {
      console.log('❌ Email connection failed. Check your .env configuration.');
    }

  } catch (error) {
    console.error('❌ Email service test failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Tip: Make sure you have:');
      console.log('1. Created Gmail App Password');
      console.log('2. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env file');
      console.log('3. Enabled 2-Step Verification on your Gmail account');
    }
  }
}

// Chạy test
testEmailService();
