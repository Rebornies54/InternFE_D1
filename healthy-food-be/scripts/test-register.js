async function testRegister() {
  try {
    console.log('🧪 Testing registration...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      phone: '0123456789',
      gender: 'male',
      birthday: '1990-01-01',
      province: 'tokyo',
      district: 'Ishikari',
      address: 'Test Address'
    };

    console.log('📤 Sending request with data:', testData);

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('Response:', data);
    } else {
      console.error('❌ Registration failed!');
      console.error('Status:', response.status);
      console.error('Data:', data);
    }

  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Error:', error.message);
  }
}

// Chạy test
testRegister();
