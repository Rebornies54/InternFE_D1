const { pool } = require('./connection');
require('dotenv').config();

const createMissingTables = async () => {
  try {
    console.log('🔧 Creating missing tables...');
    
    // Check existing tables first
    const [existingTables] = await pool.execute('SHOW TABLES');
    const tableNames = existingTables.map(table => Object.values(table)[0]);
    console.log('📊 Existing tables:', tableNames);
    
    const statements = [
      // Create users table if not exists
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        gender ENUM('male', 'female', 'other'),
        birthday DATE,
        province VARCHAR(100),
        district VARCHAR(100),
        address TEXT,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      // Create food_items table if not exists
      `CREATE TABLE IF NOT EXISTS food_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        unit VARCHAR(50) DEFAULT '100g',
        calories DECIMAL(8,2) NOT NULL,
        protein DECIMAL(8,2) DEFAULT 0,
        fat DECIMAL(8,2) DEFAULT 0,
        carbs DECIMAL(8,2) DEFAULT 0,
        fiber DECIMAL(8,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE CASCADE
      )`
    ];
    
    console.log(`📝 Found ${statements.length} tables to create`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await pool.execute(statement);
        console.log(`✅ Created table ${i + 1}/${statements.length}`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠️  Table already exists: ${error.message}`);
        } else {
          console.error(`❌ Error creating table ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    // Insert sample food items if food_items table exists
    if (tableNames.includes('food_items') || await checkTableExists('food_items')) {
      console.log('\n🍽️  Inserting sample food items...');
      
      const foodItems = [
        // Meat / Eggs / Seafood
        [1, 'Chicken (raw)', '100g', 239, 23.0, 14.0, 0.0],
        [1, 'Pork (raw)', '100g', 242, 27.0, 14.0, 0.0],
        [1, 'Beef (raw)', '100g', 250, 26.0, 15.0, 0.0],
        [1, 'Egg (chicken)', '100g', 155, 13.0, 11.0, 1.0],
        [1, 'Salmon (raw)', '100g', 208, 20.0, 13.0, 0.0],
        
        // Vegetables & Legumes
        [2, 'Broccoli (raw)', '100g', 34, 2.8, 0.4, 7.0],
        [2, 'Spinach (raw)', '100g', 23, 2.9, 0.4, 3.6],
        [2, 'Carrots (raw)', '100g', 41, 0.9, 0.2, 10.0],
        [2, 'Tomatoes (raw)', '100g', 18, 0.9, 0.2, 3.9],
        [2, 'Potatoes (raw)', '100g', 77, 2.0, 0.1, 17.0],
        
        // Fruits
        [3, 'Apples (raw)', '100g', 52, 0.3, 0.2, 14.0],
        [3, 'Bananas (raw)', '100g', 89, 1.1, 0.3, 23.0],
        [3, 'Oranges (raw)', '100g', 47, 0.9, 0.1, 12.0],
        [3, 'Strawberries (raw)', '100g', 32, 0.7, 0.3, 8.0],
        [3, 'Grapes (raw)', '100g', 62, 0.6, 0.2, 16.0],
        
        // Grains / Cereals / Breads
        [4, 'White Rice (cooked)', '100g', 130, 2.7, 0.3, 28.0],
        [4, 'Brown Rice (cooked)', '100g', 111, 2.6, 0.9, 23.0],
        [4, 'Whole Wheat Bread', '100g', 247, 13.0, 4.2, 41.0],
        [4, 'White Bread', '100g', 265, 9.0, 3.2, 49.0],
        [4, 'Oatmeal (cooked)', '100g', 68, 2.4, 1.4, 12.0],
        
        // Beverages & Dairy Products
        [5, 'Whole Milk', '100g', 61, 3.2, 3.3, 4.8],
        [5, 'Skim Milk', '100g', 42, 3.4, 0.1, 5.0],
        [5, 'Yogurt (plain)', '100g', 59, 10.0, 0.4, 3.6],
        [5, 'Cheese (cheddar)', '100g', 403, 25.0, 33.0, 1.3],
        [5, 'Butter', '100g', 717, 0.9, 81.0, 0.1],
        
        // Snacks & Processed Foods
        [6, 'Potato Chips', '100g', 536, 7.0, 35.0, 53.0],
        [6, 'Popcorn (air-popped)', '100g', 375, 11.0, 4.0, 74.0],
        [6, 'Chocolate (dark)', '100g', 546, 4.9, 31.0, 61.0],
        [6, 'Ice Cream (vanilla)', '100g', 207, 3.5, 11.0, 24.0],
        [6, 'Cookies (chocolate chip)', '100g', 502, 5.0, 25.0, 63.0]
      ];
      
      for (const item of foodItems) {
        try {
          await pool.execute(
            'INSERT INTO food_items (category_id, name, unit, calories, protein, fat, carbs) VALUES (?, ?, ?, ?, ?, ?, ?)',
            item
          );
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️  Food item already exists: ${item[1]}`);
          } else {
            console.error(`❌ Error inserting food item ${item[1]}:`, error.message);
          }
        }
      }
      
      console.log('✅ Sample food items inserted!');
    }
    
    console.log('\n🎉 Missing tables creation completed!');
    
    // Show final table list
    const [finalTables] = await pool.execute('SHOW TABLES');
    console.log('\n📊 Final tables in database:');
    finalTables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating missing tables:', error.message);
  } finally {
    await pool.end();
  }
};

const checkTableExists = async (tableName) => {
  try {
    const [result] = await pool.execute(`SHOW TABLES LIKE '${tableName}'`);
    return result.length > 0;
  } catch (error) {
    return false;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createMissingTables();
}

module.exports = createMissingTables; 