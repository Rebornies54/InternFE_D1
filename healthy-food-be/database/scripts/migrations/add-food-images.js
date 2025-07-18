const { pool } = require('../../connection');

// Food images mapping - sử dụng Unsplash hoặc placeholder images
const foodImages = {
  // Meat / Eggs / Seafood
  'Chicken (raw)': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
  'Pork (raw)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'Beef (raw)': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  'Beef Tenderloin (raw)': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  'Egg (chicken)': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  'Salmon (raw)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
  'Tuna (raw)': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'Shrimp (raw)': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'Cod (raw)': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'Turkey (raw)': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
  'Duck (raw)': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',

  // Vegetables & Legumes
  'Broccoli (raw)': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
  'Spinach (raw)': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
  'Carrots (raw)': 'https://images.unsplash.com/photo-1447175008436-170170d8864b?w=400&h=300&fit=crop',
  'Tomatoes (raw)': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop',
  'Potatoes (raw)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
  'Onions (raw)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
  'Bell Peppers (raw)': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  'Cucumber (raw)': 'https://cdn.pixabay.com/photo/2015/03/23/08/04/cucumber-685704_1280.jpg',
  'Lentils (cooked)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
  'Chickpeas (cooked)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',

  // Fruits
  'Apples (raw)': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
  'Bananas (raw)': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'Oranges (raw)': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
  'Strawberries (raw)': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
  'Grapes (raw)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
  'Pineapple (raw)': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
  'Mango (raw)': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
  'Watermelon (raw)': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop',
  'Peaches (raw)': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
  'Pears (raw)': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',

  // Grains / Cereals / Breads
  'White Rice (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Brown Rice (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'White Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'Oatmeal (cooked)': 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop',
  'Pasta (cooked)': 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop',
  'Quinoa (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Corn (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Barley (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Buckwheat (cooked)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',

  // Beverages & Dairy Products
  'Whole Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
  'Skim Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
  'Yogurt (plain)': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  'Cheese (cheddar)': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  'Butter': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'Apple Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'Coffee (black)': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  'Tea (black)': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
  'Coconut Milk': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',

  // Snacks & Processed Foods
  'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
  'Popcorn (air-popped)': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
  'Chocolate (dark)': 'https://images.unsplash.com/photo-1548907040-4baa9ee7f64b?w=400&h=300&fit=crop',
  'Ice Cream (vanilla)': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
  'Cookies (chocolate chip)': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
  'Cake (chocolate)': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'Pizza (cheese)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'Hamburger (fast food)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'French Fries': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
  'Soda (cola)': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
};

async function addFoodImages() {
  try {
    console.log('🚀 Adding food images to database...');
    
    // First, ensure image_url column exists
    try {
      await pool.execute(`
        ALTER TABLE food_items 
        ADD COLUMN image_url VARCHAR(500) DEFAULT NULL 
        AFTER fiber
      `);
      console.log('✅ Added image_url column to food_items table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ image_url column already exists');
      } else {
        throw error;
      }
    }
    
    // Get all food items
    const [foodItems] = await pool.execute('SELECT id, name FROM food_items');
    
    let updatedCount = 0;
    
    for (const food of foodItems) {
      const imageUrl = foodImages[food.name];
      
      if (imageUrl) {
        await pool.execute(
          'UPDATE food_items SET image_url = ? WHERE id = ?',
          [imageUrl, food.id]
        );
        updatedCount++;
        console.log(`✅ Updated image for: ${food.name}`);
      } else {
        console.log(`⚠️  No image found for: ${food.name}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} food items with images`);
    
  } catch (error) {
    console.error('❌ Error adding food images:', error);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addFoodImages();
}

module.exports = addFoodImages; 