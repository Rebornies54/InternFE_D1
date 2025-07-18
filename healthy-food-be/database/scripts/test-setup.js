const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const testSetup = async () => {
  try {
    console.log('🧪 Testing database setup...\n');
    
    // Test connection
    console.log('🔌 Testing database connection...');
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    console.log('');
    
    // Test basic queries
    console.log('📊 Testing basic queries...');
    const [tables] = await pool.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);
    
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Found ${users[0].count} users`);
    
    const [foods] = await pool.execute('SELECT COUNT(*) as count FROM food_items');
    console.log(`✅ Found ${foods[0].count} food items`);
    
    const [blogs] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    console.log(`✅ Found ${blogs[0].count} blog posts`);
    
    await pool.end();
    
    console.log('\n🎉 All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testSetup();
}

module.exports = testSetup; 