const { pool } = require('../../connection');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const addMoreFoods = async () => {
  try {
    console.log('🍽️  Adding more foods from FAO data...');
    
    // Additional foods based on FAO composition tables
    const additionalFoods = [
      // Meat / Eggs / Seafood (Category 1)
      [1, 'Turkey (raw)', '100g', 189, 29.0, 7.0, 0.0],
      [1, 'Duck (raw)', '100g', 337, 19.0, 28.0, 0.0],
      [1, 'Tuna (raw)', '100g', 144, 23.0, 5.0, 0.0],
      [1, 'Shrimp (raw)', '100g', 99, 24.0, 0.3, 0.2],
      [1, 'Cod (raw)', '100g', 82, 18.0, 0.7, 0.0],
      
      // Vegetables & Legumes (Category 2)
      [2, 'Onions (raw)', '100g', 40, 1.1, 0.1, 9.0],
      [2, 'Bell Peppers (raw)', '100g', 20, 0.9, 0.2, 4.6],
      [2, 'Cucumber (raw)', '100g', 16, 0.7, 0.1, 3.6],
      [2, 'Lentils (cooked)', '100g', 116, 9.0, 0.4, 20.0],
      [2, 'Chickpeas (cooked)', '100g', 164, 9.0, 2.6, 27.0],
      
      // Fruits (Category 3)
      [3, 'Pineapple (raw)', '100g', 50, 0.5, 0.1, 13.0],
      [3, 'Mango (raw)', '100g', 60, 0.8, 0.4, 15.0],
      [3, 'Watermelon (raw)', '100g', 30, 0.6, 0.2, 8.0],
      [3, 'Peaches (raw)', '100g', 39, 0.9, 0.3, 10.0],
      [3, 'Pears (raw)', '100g', 57, 0.4, 0.1, 15.0],
      
      // Grains / Cereals / Breads (Category 4) - FAO data
      [4, 'Pasta (cooked)', '100g', 131, 5.0, 1.1, 25.0],
      [4, 'Quinoa (cooked)', '100g', 120, 4.4, 1.9, 22.0],
      [4, 'Corn (cooked)', '100g', 86, 3.2, 1.2, 19.0],
      [4, 'Barley (cooked)', '100g', 123, 2.3, 0.4, 28.0],
      [4, 'Buckwheat (cooked)', '100g', 92, 3.4, 0.6, 20.0],
      
      // Beverages & Dairy Products (Category 5)
      [5, 'Orange Juice', '100g', 45, 0.7, 0.2, 10.0],
      [5, 'Apple Juice', '100g', 46, 0.1, 0.1, 11.0],
      [5, 'Coffee (black)', '100g', 2, 0.3, 0.0, 0.0],
      [5, 'Tea (black)', '100g', 1, 0.0, 0.0, 0.0],
      [5, 'Coconut Milk', '100g', 230, 2.3, 24.0, 6.0],
      
      // Snacks & Processed Foods (Category 6)
      [6, 'Popcorn (air-popped)', '100g', 375, 11.0, 4.0, 74.0],
      [6, 'Chocolate (dark)', '100g', 546, 4.9, 31.0, 61.0],
      [6, 'Ice Cream (vanilla)', '100g', 207, 3.5, 11.0, 24.0],
      [6, 'Cookies (chocolate chip)', '100g', 502, 5.0, 25.0, 63.0],
      [6, 'Cake (chocolate)', '100g', 371, 5.0, 15.0, 53.0],
      
      // Additional popular foods for Vietnamese context
      [1, 'Pork Belly (raw)', '100g', 518, 9.0, 53.0, 0.0],
      [1, 'Beef Tenderloin (raw)', '100g', 250, 26.0, 15.0, 0.0],
      [2, 'Bok Choy (raw)', '100g', 13, 1.5, 0.2, 2.2],
      [2, 'Bean Sprouts (raw)', '100g', 30, 3.0, 0.2, 6.0],
      [3, 'Dragon Fruit (raw)', '100g', 60, 1.1, 0.4, 13.0],
      [4, 'Rice Noodles (cooked)', '100g', 109, 2.0, 0.2, 25.0],
      [5, 'Soy Milk', '100g', 33, 3.3, 1.8, 2.0],
      [6, 'Banh Mi (Vietnamese sandwich)', '100g', 280, 8.0, 12.0, 35.0]
    ];
    
    console.log(`📝 Adding ${additionalFoods.length} new food items...`);
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const food of additionalFoods) {
      try {
        await pool.execute(
          'INSERT INTO food_items (category_id, name, unit, calories, protein, fat, carbs) VALUES (?, ?, ?, ?, ?, ?, ?)',
          food
        );
        console.log(`✅ Added: ${food[1]}`);
        successCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipped (already exists): ${food[1]}`);
          skipCount++;
        } else {
          console.error(`❌ Error adding ${food[1]}:`, error.message);
        }
      }
    }
    
    // Show final count
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM food_items');
    console.log('\n📊 Summary:');
    console.log(`   - Successfully added: ${successCount} items`);
    console.log(`   - Skipped (duplicates): ${skipCount} items`);
    console.log(`   - Total food items in database: ${totalCount[0].count}`);
    
    // Show items by category
    console.log('\n🍽️  Food items by category:');
    const [categories] = await pool.execute(`
      SELECT fc.name as category_name, COUNT(fi.id) as item_count 
      FROM food_categories fc 
      LEFT JOIN food_items fi ON fc.id = fi.category_id 
      GROUP BY fc.id, fc.name 
      ORDER BY fc.id
    `);
    
    categories.forEach(cat => {
      console.log(`   - ${cat.category_name}: ${cat.item_count} items`);
    });
    
    console.log('\n🎉 Food items addition completed!');
    
  } catch (error) {
    console.error('❌ Error adding foods:', error.message);
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (require.main === module) {
  addMoreFoods();
}

module.exports = addMoreFoods; 