const { pool } = require('./connection');
require('dotenv').config();

const checkTables = async () => {
  try {
    console.log('🔍 Checking database tables...');
    
    // Get all tables
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('\n📊 Found tables:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    // Check table structures
    console.log('\n📋 Table structures:');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n🔍 ${tableName}:`);
      
      const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''} ${col.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
      });
      
      // Count records
      const [count] = await pool.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   📊 Records: ${count[0].count}`);
    }
    
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await pool.end();
  }
};

// Run check if this file is executed directly
if (require.main === module) {
  checkTables();
}

module.exports = checkTables; 