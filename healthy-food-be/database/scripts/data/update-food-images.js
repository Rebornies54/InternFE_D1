const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db'
};

// Mapping ảnh cho các thực phẩm hiện có
const foodImageUpdates = [
  // Meat / Eggs / Seafood
  { name: 'Chicken (raw)', image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
  { name: 'Pork (raw)', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
  { name: 'Beef (raw)', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
  { name: 'Egg (chicken)', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop' },
  { name: 'Salmon (raw)', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop' },
  { name: 'Tuna (raw)', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
  { name: 'Shrimp (raw)', image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop' },
  { name: 'Cod (raw)', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
  { name: 'Turkey (raw)', image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
  { name: 'Duck (raw)', image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },

  // Vegetables & Legumes
  { name: 'Broccoli (raw)', image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop' },
  { name: 'Spinach (raw)', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
  { name: 'Carrots (raw)', image_url: 'https://images.unsplash.com/photo-1447175008436-170170753886?w=400&h=300&fit=crop' },
  { name: 'Tomatoes (raw)', image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop' },
  { name: 'Potatoes (raw)', image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
  { name: 'Onions (raw)', image_url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop' },
  { name: 'Bell Peppers (raw)', image_url: 'https://images.unsplash.com/photo-1525607551316-5a1323a14c54?w=400&h=300&fit=crop' },
  { name: 'Cucumber (raw)', image_url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop' },
  { name: 'Lentils (cooked)', image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop' },
  { name: 'Chickpeas (cooked)', image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop' },

  // Fruits
  { name: 'Apples (raw)', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop' },
  { name: 'Bananas (raw)', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop' },
  { name: 'Oranges (raw)', image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop' },
  { name: 'Strawberries (raw)', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop' },
  { name: 'Grapes (raw)', image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop' },
  { name: 'Pineapple (raw)', image_url: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=400&h=300&fit=crop' },
  { name: 'Mango (raw)', image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
  { name: 'Watermelon (raw)', image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' },
  { name: 'Peaches (raw)', image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop' },
  { name: 'Pears (raw)', image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop' },

  // Grains / Cereals / Breads
  { name: 'White Rice (cooked)', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
  { name: 'Brown Rice (cooked)', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
  { name: 'Whole Wheat Bread', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
  { name: 'White Bread', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
  { name: 'Oatmeal (cooked)', image_url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop' },
  { name: 'Pasta (cooked)', image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop' },
  { name: 'Quinoa (cooked)', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { name: 'Corn (cooked)', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
  { name: 'Barley (cooked)', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
  { name: 'Buckwheat (cooked)', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },

  // Beverages & Dairy Products
  { name: 'Whole Milk', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
  { name: 'Skim Milk', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
  { name: 'Yogurt (plain)', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
  { name: 'Cheese (cheddar)', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
  { name: 'Butter', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
  { name: 'Orange Juice', image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
  { name: 'Apple Juice', image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
  { name: 'Coffee (black)', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
  { name: 'Tea (black)', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
  { name: 'Coconut Milk', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },

  // Snacks & Processed Foods
  { name: 'Potato Chips', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
  { name: 'Popcorn (air-popped)', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
  { name: 'Chocolate (dark)', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop' },
  { name: 'Ice Cream (vanilla)', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
  { name: 'Cookies (chocolate chip)', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop' },
  { name: 'Cake (chocolate)', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop' },
  { name: 'Pizza (cheese)', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
  { name: 'Hamburger (fast food)', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
  { name: 'French Fries', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
  { name: 'Soda (cola)', image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' }
];

async function updateFoodImages() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully!');
    console.log(`🖼️  Updating images for ${foodImageUpdates.length} food items...`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const foodUpdate of foodImageUpdates) {
      try {
        // Update food item image
        const [result] = await connection.execute(
          'UPDATE food_items SET image_url = ? WHERE name = ?',
          [foodUpdate.image_url, foodUpdate.name]
        );
        
        if (result.affectedRows > 0) {
          console.log(`✅ Updated: ${foodUpdate.name}`);
          updatedCount++;
        } else {
          console.log(`❌ Not found: ${foodUpdate.name}`);
          notFoundCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error updating ${foodUpdate.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} items`);
    console.log(`❌ Not found: ${notFoundCount} items`);
    console.log(`📊 Total processed: ${foodImageUpdates.length} items`);
    
    // Get count of items with images
    const [imageResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM food_items WHERE image_url IS NOT NULL AND image_url != ""'
    );
    console.log(`🖼️  Food items with images: ${imageResult[0].total}`);
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
updateFoodImages().catch(console.error);
