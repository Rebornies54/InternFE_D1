const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../../../.env' });

const showFoodStats = async () => {
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

    // Get all food items that don't have images
    const [itemsWithoutImages] = await connection.execute(`
      SELECT id, name, category_id, calories 
      FROM food_items 
      WHERE image_url IS NULL OR image_url = '' OR image_url = 'null'
      ORDER BY category_id, name
    `);

    console.log(`📊 Found ${itemsWithoutImages.length} food items without images`);

    if (itemsWithoutImages.length === 0) {
      console.log('✅ All food items already have images!');
      return;
    }

    // Sample images for different categories
    const categoryImages = {
      1: [ // Meat & Eggs
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
      ],
      2: [ // Vegetables & Legumes
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop'
      ],
      3: [ // Fruits
        'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop'
      ],
      4: [ // Grains & Cereals
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
      ],
      5: [ // Dairy & Alternatives
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
      ],
      6: [ // Snacks & Beverages
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
      ]
    };

    // Update each food item with an appropriate image
    let updatedCount = 0;
    for (const item of itemsWithoutImages) {
      const categoryId = item.category_id;
      const images = categoryImages[categoryId] || categoryImages[1]; // Default to meat if category not found
      const randomImage = images[Math.floor(Math.random() * images.length)];
      
      await connection.execute(`
        UPDATE food_items 
        SET image_url = ? 
        WHERE id = ?
      `, [randomImage, item.id]);
      
      updatedCount++;
      console.log(`✅ Updated: ${item.name} (ID: ${item.id}) with image`);
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} food items with images!`);

    // Verify the update
    const [finalCheck] = await connection.execute(`
      SELECT COUNT(*) as total_items,
             SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' AND image_url != 'null' THEN 1 ELSE 0 END) as items_with_images
      FROM food_items
    `);

    const stats = finalCheck[0];
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total items: ${stats.total_items}`);
    console.log(`   Items with images: ${stats.items_with_images}`);
    console.log(`   Items without images: ${stats.total_items - stats.items_with_images}`);
    console.log(`   Image coverage: ${((stats.items_with_images / stats.total_items) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

showFoodStats();
