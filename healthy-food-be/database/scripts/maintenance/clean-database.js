const { pool } = require('../../connection');
const path = require('path');

// Load .env from the correct path
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const cleanDatabase = async () => {
  try {
    console.log('🧹 Cleaning database...');
    console.log('🔧 Database config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    // Get all tables
    const [tables] = await pool.execute('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    console.log('📊 Current tables:', tableNames);
    
    // Check for duplicates
    const tableCounts = {};
    tableNames.forEach(name => {
      tableCounts[name] = (tableCounts[name] || 0) + 1;
    });
    
    const duplicates = Object.entries(tableCounts).filter(([name, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  Found duplicate tables:');
      duplicates.forEach(([name, count]) => {
        console.log(`   - ${name}: ${count} instances`);
      });
      
      console.log('\n🔧 Cleaning duplicates...');
      
      // For each duplicate table, keep only one instance
      for (const [tableName, count] of duplicates) {
        if (count > 1) {
          console.log(`   - Keeping one instance of ${tableName}, removing ${count - 1} duplicates`);
          
          // Get all instances of this table
          const [instances] = await pool.execute(`SHOW TABLES LIKE '${tableName}'`);
          
          // Keep the first one, drop the rest
          for (let i = 1; i < instances.length; i++) {
            const instanceName = Object.values(instances[i])[0];
            try {
              await pool.execute(`DROP TABLE IF EXISTS \`${instanceName}\``);
              console.log(`     ✅ Dropped duplicate: ${instanceName}`);
            } catch (error) {
              console.error(`     ❌ Error dropping ${instanceName}:`, error.message);
            }
          }
        }
      }
    } else {
      console.log('\n✅ No duplicate tables found!');
    }
    
    // Show final table list
    const [finalTables] = await pool.execute('SHOW TABLES');
    console.log('\n📊 Final tables in database:');
    finalTables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    // Check table structures
    console.log('\n📋 Table structures:');
    for (const table of finalTables) {
      const tableName = Object.values(table)[0];
      console.log(`\n🔍 ${tableName}:`);
      
      try {
        const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
        columns.forEach(col => {
          console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''} ${col.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
        });
        
        // Count records
        const [count] = await pool.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   📊 Records: ${count[0].count}`);
      } catch (error) {
        console.error(`   ❌ Error describing ${tableName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Database cleaning completed!');
    
  } catch (error) {
    console.error('❌ Database cleaning failed:', error.message);
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (require.main === module) {
  cleanDatabase();
}

module.exports = cleanDatabase; 