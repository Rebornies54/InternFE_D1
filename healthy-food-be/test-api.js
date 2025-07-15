const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Get food categories
    console.log('\n2. Testing food categories...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/food/categories`);
    console.log('✅ Food categories:', categoriesResponse.data.success ? 'Success' : 'Failed');

    // Test 3: Get food items
    console.log('\n3. Testing food items...');
    const itemsResponse = await axios.get(`${API_BASE_URL}/food/items/1`);
    console.log('✅ Food items:', itemsResponse.data.success ? 'Success' : 'Failed');

    // Test 4: Login
    console.log('\n4. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test1@gmail.com',
      password: '123456'
    });
    console.log('✅ Login:', loginResponse.data.success ? 'Success' : 'Failed');
    
    if (loginResponse.data.success) {
      const token = loginResponse.data.token;
      console.log('Token received:', token ? 'Yes' : 'No');

      // Test 5: Get profile with token
      console.log('\n5. Testing profile with token...');
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile:', profileResponse.data.success ? 'Success' : 'Failed');

      // Test 6: Get food logs with token
      console.log('\n6. Testing food logs with token...');
      const logsResponse = await axios.get(`${API_BASE_URL}/food/log`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Food logs:', logsResponse.data.success ? 'Success' : 'Failed');

      // Test 7: Add food log with token
      console.log('\n7. Testing add food log with token...');
      const addLogResponse = await axios.post(`${API_BASE_URL}/food/log`, {
        food_item_id: 1,
        quantity: 100,
        calories: 239,
        log_date: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Add food log:', addLogResponse.data.success ? 'Success' : 'Failed');

      // Test 8: Get daily statistics with token
      console.log('\n8. Testing daily statistics with token...');
      const statsResponse = await axios.get(`${API_BASE_URL}/food/statistics/daily`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: new Date().toISOString().split('T')[0] }
      });
      console.log('✅ Daily statistics:', statsResponse.data.success ? 'Success' : 'Failed');
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 