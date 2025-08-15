async function testForgotPassword() {
  try {
    console.log('🧪 Testing forgot password...');
    
    const email = 'test@example.com';

    console.log('📤 Sending forgot password request for:', email);

    const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Forgot password request successful!');
      console.log('Response:', data);
      
      if (data.data && data.data.otp) {
        console.log('🔑 OTP for testing:', data.data.otp);
        
        // Test verify OTP
        await testVerifyOTP(email, data.data.otp);
      }
    } else {
      console.error('❌ Forgot password request failed!');
      console.error('Status:', response.status);
      console.error('Data:', data);
    }

  } catch (error) {
    console.error('❌ Forgot password test failed!');
    console.error('Error:', error.message);
  }
}

async function testVerifyOTP(email, otp) {
  try {
    console.log('\n🧪 Testing OTP verification...');
    console.log('📤 Verifying OTP:', otp);

    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ OTP verification successful!');
      console.log('Response:', data);
      
      // Test reset password
      await testResetPassword(email, otp);
    } else {
      console.error('❌ OTP verification failed!');
      console.error('Status:', response.status);
      console.error('Data:', data);
    }

  } catch (error) {
    console.error('❌ OTP verification test failed!');
    console.error('Error:', error.message);
  }
}

async function testResetPassword(email, otp) {
  try {
    console.log('\n🧪 Testing password reset...');
    
    const newPassword = 'newpassword123';

    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Password reset successful!');
      console.log('Response:', data);
      
      // Test login with new password
      await testLoginWithNewPassword(email, newPassword);
    } else {
      console.error('❌ Password reset failed!');
      console.error('Status:', response.status);
      console.error('Data:', data);
    }

  } catch (error) {
    console.error('❌ Password reset test failed!');
    console.error('Error:', error.message);
  }
}

async function testLoginWithNewPassword(email, password) {
  try {
    console.log('\n🧪 Testing login with new password...');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login with new password successful!');
      console.log('Response:', data);
    } else {
      console.error('❌ Login with new password failed!');
      console.error('Status:', response.status);
      console.error('Data:', data);
    }

  } catch (error) {
    console.error('❌ Login test failed!');
    console.error('Error:', error.message);
  }
}

// Chạy test
testForgotPassword();
