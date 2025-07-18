const { pool } = require('../../connection');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const checkUsers = async () => {
  try {
    console.log('👥 Checking users in database...');
    
    // Get all users
    const [users] = await pool.execute('SELECT id, name, email, created_at FROM users');
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Created: ${user.created_at}`);
    });
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found! You need to register a user first.');
      console.log('   You can register through the frontend or create a test user.');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (require.main === module) {
  checkUsers();
}

module.exports = checkUsers; 