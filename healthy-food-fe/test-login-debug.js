import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const testLogin = async () => {
  const loginData = {
    email: 'test4@gmail.com',
    password: '0504Giavuong'
  };

  console.log('🔍 [TEST] Testing login with:', { email: loginData.email, password: '***' });
  console.log('🔍 [TEST] API Base URL:', API_BASE_URL);

  try {
    console.log('🔍 [TEST] Making POST request to /auth/login...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ [TEST] Login successful!');
    console.log('🔍 [TEST] Response status:', response.status);
    console.log('🔍 [TEST] Response data:', response.data);
    
    if (response.data.token) {
      console.log('✅ [TEST] Token received:', response.data.token.substring(0, 20) + '...');
    }

  } catch (error) {
    console.log('❌ [TEST] Login failed!');
    console.log('🔍 [TEST] Error type:', error.name);
    console.log('🔍 [TEST] Error message:', error.message);
    
    if (error.response) {
      console.log('🔍 [TEST] Response status:', error.response.status);
      console.log('🔍 [TEST] Response data:', error.response.data);
      console.log('🔍 [TEST] Response headers:', error.response.headers);
    } else if (error.request) {
      console.log('🔍 [TEST] No response received');
      console.log('🔍 [TEST] Request details:', error.request);
    } else {
      console.log('🔍 [TEST] Error setting up request:', error.message);
    }
  }
};

// Test backend connection first
const testBackendConnection = async () => {
  try {
    console.log('🔍 [TEST] Testing backend connection...');
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      timeout: 5000
    });
    console.log('✅ [TEST] Backend is reachable');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ [TEST] Backend is reachable (401 expected for profile without auth)');
    } else {
      console.log('❌ [TEST] Backend connection failed:', error.message);
    }
  }
};

const runTests = async () => {
  console.log('🚀 [TEST] Starting login debug tests...\n');
  
  await testBackendConnection();
  console.log('');
  
  await testLogin();
  console.log('\n🏁 [TEST] Tests completed');
};

runTests();
