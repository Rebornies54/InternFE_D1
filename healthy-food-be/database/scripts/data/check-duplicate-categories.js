const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../../../.env' });

const checkDuplicateCategories = async () => {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'healthy_food_db'
    });

    console.log('✅ Connected to database successfully!');

    // Check for duplicate categories
    const [categories] = await connection.execute(`
      SELECT id, name, COUNT(*) as count
      FROM food_categories 
      GROUP BY id, name
      HAVING COUNT(*) > 1
    `);

    if (categories.length > 0) {
      console.log('❌ Found duplicate categories:');
      categories.forEach(cat => {
        console.log(`   ID: ${cat.id}, Name: ${cat.name}, Count: ${cat.count}`);
      });

      // Get all categories to see the full picture
      const [allCategories] = await connection.execute(`
        SELECT * FROM food_categories ORDER BY id, name
      `);

      console.log('\n📊 All categories in database:');
      allCategories.forEach(cat => {
        console.log(`   ID: ${cat.id}, Name: ${cat.name}`);
      });

      // Remove duplicates keeping only the first occurrence
      console.log('\n🧹 Removing duplicate categories...');
      
      const [duplicateIds] = await connection.execute(`
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
          FROM food_categories
        ) t WHERE rn > 1
      `);

      if (duplicateIds.length > 0) {
        const idsToDelete = duplicateIds.map(row => row.id);
        await connection.execute(`
          DELETE FROM food_categories 
          WHERE id IN (${idsToDelete.map(() => '?').join(',')})
        `, idsToDelete);
        
        console.log(`✅ Removed ${duplicateIds.length} duplicate categories`);
      }

    } else {
      console.log('✅ No duplicate categories found!');
    }

    // Final check
    const [finalCategories] = await connection.execute(`
      SELECT COUNT(*) as total_categories FROM food_categories
    `);

    console.log(`\n📊 Final category count: ${finalCategories[0].total_categories}`);

    // Show final categories
    const [finalCategoryList] = await connection.execute(`
      SELECT id, name FROM food_categories ORDER BY id
    `);

    console.log('\n📋 Final categories:');
    finalCategoryList.forEach(cat => {
      console.log(`   ID: ${cat.id}, Name: ${cat.name}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

checkDuplicateCategories();
