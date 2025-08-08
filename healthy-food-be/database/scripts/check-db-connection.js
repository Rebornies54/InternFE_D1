const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('🔍 Database Connection Test');
console.log('==========================');
console.log('Environment Variables:');
console.log(`DB_HOST: ${process.env.DB_HOST || 'mysql'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'root'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'healthyfood'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 3306}`);
console.log('');

const testBasicConnection = async () => {
  console.log('1. Testing basic connection (without database)...');
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    await connection.ping();
    await connection.end();
    console.log('✅ Basic connection successful');
    return true;
  } catch (error) {
    console.error('❌ Basic connection failed:', error.message);
    return false;
  }
};

const testDatabaseConnection = async () => {
  console.log('\n2. Testing database connection...');
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

const testPoolConnection = async () => {
  console.log('\n3. Testing connection pool...');
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    await pool.end();
    console.log('✅ Connection pool successful');
    return true;
  } catch (error) {
    console.error('❌ Connection pool failed:', error.message);
    return false;
  }
};

const testDatabaseExists = async () => {
  console.log('\n4. Testing if database exists...');
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    const [rows] = await connection.execute('SHOW DATABASES LIKE ?', [dbConfig.database]);
    await connection.end();
    
    if (rows.length > 0) {
      console.log('✅ Database exists');
      return true;
    } else {
      console.log('❌ Database does not exist');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    return false;
  }
};

const testTablesExist = async () => {
  console.log('\n5. Testing if tables exist...');
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [tables] = await connection.execute('SHOW TABLES');
    await connection.end();
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      return true;
    } else {
      console.log('❌ No tables found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }
};

const testSampleQuery = async () => {
  console.log('\n6. Testing sample query...');
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    await connection.end();
    
    console.log(`✅ Sample query successful. Users count: ${rows[0].count}`);
    return true;
  } catch (error) {
    console.error('❌ Sample query failed:', error.message);
    return false;
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting database connection tests...\n');
  
  const results = {
    basicConnection: await testBasicConnection(),
    databaseConnection: await testDatabaseConnection(),
    poolConnection: await testPoolConnection(),
    databaseExists: await testDatabaseExists(),
    tablesExist: await testTablesExist(),
    sampleQuery: await testSampleQuery()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${test}: ${status}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Database connection is working properly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
  }
  
  return allPassed;
};

if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  testBasicConnection,
  testDatabaseConnection,
  testPoolConnection,
  testDatabaseExists,
  testTablesExist,
  testSampleQuery,
  runAllTests
};
