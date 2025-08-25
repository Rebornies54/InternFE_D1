const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db'
};

// Mapping ảnh cho các thực phẩm còn thiếu
const missingImageUpdates = [
  // Thực phẩm còn thiếu ảnh
  { name: 'Bok Choy (raw)', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
  { name: 'Beef Tenderloin (raw)', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
  { name: 'Chicken (raw)', image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
  { name: 'Salmon (raw)', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop' },
  { name: 'Spinach (raw)', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
  { name: 'Carrots (raw)', image_url: 'https://images.unsplash.com/photo-1447175008436-170170753886?w=400&h=300&fit=crop' },
  { name: 'Tomatoes (raw)', image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop' },
  { name: 'Apples (raw)', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop' },
  { name: 'Bananas (raw)', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop' }
];

async function fixMissingImages() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully!');
    console.log(`🖼️  Fixing missing images for ${missingImageUpdates.length} food items...`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const foodUpdate of missingImageUpdates) {
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
    console.log(`📊 Total processed: ${missingImageUpdates.length} items`);
    
    // Get count of items with images
    const [imageResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM food_items WHERE image_url IS NOT NULL AND image_url != ""'
    );
    console.log(`🖼️  Food items with images: ${imageResult[0].total}`);
    
    // Get total count
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM food_items');
    console.log(`📈 Total food items: ${totalResult[0].total}`);
    console.log(`📸 Image coverage: ${((imageResult[0].total / totalResult[0].total) * 100).toFixed(1)}%`);
    
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
fixMissingImages().catch(console.error);
