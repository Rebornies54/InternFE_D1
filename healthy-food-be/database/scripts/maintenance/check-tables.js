const { pool } = require('../../connection');
require('dotenv').config();

const checkTables = async () => {
  try {
    console.log('Checking database tables...');
    
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('\nFound tables:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    console.log('\nTable structures:');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n${tableName}:`);
      
      const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''} ${col.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
      });
      
      const [count] = await pool.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   Records: ${count[0].count}`);
    }
    
    console.log('\nDatabase check completed!');
    
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  checkTables();
}

module.exports = checkTables; 