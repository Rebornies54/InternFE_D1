const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2lhdnVvbmcya3RocmVlQGdtYWlsLmNvbSIsImlhdCI6MTc1MjU1MDAzNSwiZXhwIjoxNzUzMTU0ODM1fQ.jzPZVzCbKYTZH012XJNDLJBYDqnausjC0tton9C1uUE';

const testAPI = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Food logs
    console.log('1. Testing food logs...');
    const logsResult = await testAPI('/food/log');
    console.log('Food logs:', logsResult);

    // Test 2: Daily statistics
    console.log('\n2. Testing daily statistics...');
    const statsResult = await testAPI('/food/statistics/daily?date=2025-07-15');
    console.log('Daily stats:', statsResult);

    // Test 3: Add food log
    console.log('\n3. Testing add food log...');
    const addLogResult = await testAPI('/food/log', 'POST', {
      food_item_id: 2,
      quantity: 150,
      calories: 360,
      log_date: '2025-07-15'
    });
    console.log('Add log:', addLogResult);

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
};

runTests(); 