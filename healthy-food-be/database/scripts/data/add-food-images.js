const { pool } = require('../../connection');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const addFoodImages = async () => {
  try {
    console.log('Adding image URLs for food items...');
    
    // Food image mappings - using placeholder images from Unsplash
    const foodImages = {
      // Meat / Eggs / Seafood
      'Chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      'Pork': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
      'Beef': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      'Egg': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
      'Salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
      'Tuna': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      'Shrimp': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'Cod': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'Turkey': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      'Duck': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
      
      // Vegetables & Legumes
      'Broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
      'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      'Carrots': 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop',
      'Tomatoes': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop',
      'Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      'Onions': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      'Bell Peppers': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      'Cucumber': 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop',
      'Lentils': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      'Chickpeas': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      'Bok Choy': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      'Bean Sprouts': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
      
      // Fruits
      'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      'Orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
      'Grapes': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=300&fit=crop',
      'Strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
      'Pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      'Mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
      'Watermelon': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop',
      'Peaches': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
      'Pears': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      'Dragon Fruit': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      
      // Grains / Cereals / Breads
      'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      'Quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'Corn': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'Barley': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'Buckwheat': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'Rice Noodles': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      
      // Beverages & Dairy Products
      'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      'Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      'Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
      'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
      'Apple Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
      'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      'Coconut Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      'Soy Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      
      // Snacks & Processed Foods
      'Popcorn': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'Chocolate': 'https://images.unsplash.com/photo-1548907040-4baa63636f38?w=400&h=300&fit=crop',
      'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
      'Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Banh Mi': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
    };
    
    // Get all food items
    const [foodItems] = await pool.execute('SELECT id, name FROM food_items WHERE image_url IS NULL');
    
    console.log(`Found ${foodItems.length} food items without images`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const food of foodItems) {
      let imageUrl = null;
      
      // Try to find matching image by food name
      for (const [key, url] of Object.entries(foodImages)) {
        if (food.name.toLowerCase().includes(key.toLowerCase())) {
          imageUrl = url;
          break;
        }
      }
      
      if (imageUrl) {
        try {
          await pool.execute(
            'UPDATE food_items SET image_url = ? WHERE id = ?',
            [imageUrl, food.id]
          );
          console.log(`Updated: ${food.name} -> ${imageUrl}`);
          updatedCount++;
        } catch (error) {
          console.error(`Error updating ${food.name}:`, error.message);
        }
      } else {
        console.log(`No image found for: ${food.name}`);
        notFoundCount++;
      }
    }
    
    console.log('\nSummary:');
    console.log(`   - Successfully updated: ${updatedCount} items`);
    console.log(`   - No image found for: ${notFoundCount} items`);
    
    // Show final stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(image_url) as with_images,
        COUNT(*) - COUNT(image_url) as without_images
      FROM food_items
    `);
    
    console.log('\nFinal database stats:');
    console.log(`   - Total food items: ${stats[0].total}`);
    console.log(`   - With images: ${stats[0].with_images}`);
    console.log(`   - Without images: ${stats[0].without_images}`);
    
    console.log('\nFood images addition completed!');
    
  } catch (error) {
    console.error('Error adding food images:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  addFoodImages();
}

module.exports = addFoodImages;

