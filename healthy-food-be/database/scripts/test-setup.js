const { pool } = require('../connection');
require('dotenv').config();

const testSetup = async () => {
  try {
    console.log('Testing database setup...');
    
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection successful');
    
    console.log('Testing basic queries...');
    
    const [tables] = await pool.execute('SHOW TABLES');
    console.log(`Found ${tables.length} tables in database`);
    
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`Found ${users[0].count} users`);
    
    const [foods] = await pool.execute('SELECT COUNT(*) as count FROM food_items');
    console.log(`Found ${foods[0].count} food items`);
    
    const [blogs] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    console.log(`Found ${blogs[0].count} blog posts`);
    
    console.log('\nAll tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  testSetup();
}

module.exports = testSetup; 