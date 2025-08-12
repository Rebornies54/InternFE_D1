const mysql = require('mysql2/promise');
require('dotenv').config();

const addFoodImagesSimple = async () => {
  let connection;
  
  try {
    console.log('Connecting to database...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'healthy_food_db'
    });
    
    console.log('Connected to database successfully!');
    
    // Simple food image mappings
    const foodImageUpdates = [
      { name: 'Chicken', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
      { name: 'Pork', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' },
      { name: 'Beef', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
      { name: 'Egg', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop' },
      { name: 'Salmon', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop' },
      { name: 'Tuna', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop' },
      { name: 'Shrimp', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { name: 'Cod', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { name: 'Turkey', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
      { name: 'Duck', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' },
      { name: 'Broccoli', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop' },
      { name: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
      { name: 'Carrots', image: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop' },
      { name: 'Tomatoes', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop' },
      { name: 'Potatoes', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
      { name: 'Onions', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
      { name: 'Bell Peppers', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
      { name: 'Cucumber', image: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop' },
      { name: 'Lentils', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
      { name: 'Chickpeas', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
      { name: 'Apple', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop' },
      { name: 'Banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop' },
      { name: 'Orange', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop' },
      { name: 'Grapes', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=300&fit=crop' },
      { name: 'Strawberries', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop' },
      { name: 'Pineapple', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' },
      { name: 'Mango', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
      { name: 'Watermelon', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop' },
      { name: 'Peaches', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
      { name: 'Pears', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop' },
      { name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
      { name: 'Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
      { name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop' },
      { name: 'Quinoa', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
      { name: 'Corn', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
      { name: 'Barley', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
      { name: 'Buckwheat', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
      { name: 'Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
      { name: 'Yogurt', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
      { name: 'Cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop' },
      { name: 'Orange Juice', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
      { name: 'Apple Juice', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
      { name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' },
      { name: 'Tea', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop' },
      { name: 'Coconut Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
      { name: 'Soy Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
      { name: 'Popcorn', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
      { name: 'Chocolate', image: 'https://images.unsplash.com/photo-1548907040-4baa63636f38?w=400&h=300&fit=crop' },
      { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
      { name: 'Cookies', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
      { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
      { name: 'Banh Mi', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' }
    ];
    
    console.log(`Updating ${foodImageUpdates.length} food items with images...`);
    
    let updatedCount = 0;
    
    for (const foodUpdate of foodImageUpdates) {
      try {
        const [result] = await connection.execute(
          'UPDATE food_items SET image_url = ? WHERE name LIKE ?',
          [foodUpdate.image, `%${foodUpdate.name}%`]
        );
        
        if (result.affectedRows > 0) {
          console.log(`Updated: ${foodUpdate.name} -> ${result.affectedRows} items`);
          updatedCount += result.affectedRows;
        }
      } catch (error) {
        console.error(`Error updating ${foodUpdate.name}:`, error.message);
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} food items with images!`);
    
    // Show final stats
    const [stats] = await connection.execute(`
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
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
};

if (require.main === module) {
  addFoodImagesSimple();
}

module.exports = addFoodImagesSimple;

