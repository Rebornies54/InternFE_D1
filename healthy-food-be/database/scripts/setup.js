const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { pool } = require('../connection');

const setupDatabase = async () => {
  try {
    console.log('Starting database setup...');
    
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await pool.execute(statement);
        console.log(`Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_ENTRY' ||
            error.message.includes('already exists')) {
          console.log(`Skipped statement ${i + 1} (already exists): ${error.message}`);
        } else {
          console.error(`Error executing statement ${i + 1}:`, error.message);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
          throw error;
        }
      }
    }
    
    console.log('Database setup completed successfully!');
    console.log('');
    console.log('Database tables created:');
    console.log('   - users');
    console.log('   - food_categories');
    console.log('   - food_items');
    console.log('   - user_food_logs');
    console.log('   - user_bmi_data');
    console.log('   - blog_posts');
    console.log('   - blog_post_likes');
    console.log('');
    console.log('Sample data inserted:');
    console.log('   - 6 food categories');
    console.log('   - 50+ food items with nutritional information');
    console.log('   - Sample blog posts');
    console.log('');
    console.log('Ready to start the server!');
    
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 