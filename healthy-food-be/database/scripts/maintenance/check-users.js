const { pool } = require('../../connection');
require('dotenv').config();

const checkUsers = async () => {
  try {
    console.log('Checking users in database...');
    
    const [users] = await pool.execute(`
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Created: ${user.created_at}`);
    });
    
    if (users.length === 0) {
      console.log('\nNo users found! You need to register a user first.');
    }
    
  } catch (error) {
    console.error('Error checking users:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  checkUsers();
}

module.exports = checkUsers; 