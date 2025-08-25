const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db'
};

async function showFoodStats() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully!');
    console.log('\n📊 FOOD DATABASE STATISTICS');
    console.log('=' .repeat(50));
    
    // Total food items
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM food_items');
    console.log(`\n🍽️  Total Food Items: ${totalResult[0].total}`);
    
    // Items with images
    const [imageResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM food_items WHERE image_url IS NOT NULL AND image_url != ""'
    );
    console.log(`🖼️  Items with Images: ${imageResult[0].total}`);
    console.log(`📸 Image Coverage: ${((imageResult[0].total / totalResult[0].total) * 100).toFixed(1)}%`);
    
    // Items by category
    console.log('\n📂 Items by Category:');
    console.log('-'.repeat(30));
    const [categoryResult] = await connection.execute(`
      SELECT 
        fc.name as category_name,
        COUNT(fi.id) as item_count,
        AVG(fi.calories) as avg_calories
      FROM food_categories fc
      LEFT JOIN food_items fi ON fc.id = fi.category_id
      GROUP BY fc.id, fc.name
      ORDER BY item_count DESC
    `);
    
    categoryResult.forEach(cat => {
      const avgCal = cat.avg_calories ? parseFloat(cat.avg_calories).toFixed(0) : '0';
      console.log(`  ${cat.category_name}: ${cat.item_count} items (avg ${avgCal} cal)`);
    });
    
    // Calorie ranges
    console.log('\n🔥 Calorie Ranges:');
    console.log('-'.repeat(30));
    const [calorieRanges] = await connection.execute(`
      SELECT 
        CASE 
          WHEN calories < 50 THEN 'Very Low (< 50 cal)'
          WHEN calories < 100 THEN 'Low (50-99 cal)'
          WHEN calories < 200 THEN 'Medium (100-199 cal)'
          WHEN calories < 400 THEN 'High (200-399 cal)'
          ELSE 'Very High (400+ cal)'
        END as calorie_range,
        COUNT(*) as count
      FROM food_items
      GROUP BY calorie_range
      ORDER BY MIN(calories)
    `);
    
    calorieRanges.forEach(range => {
      console.log(`  ${range.calorie_range}: ${range.count} items`);
    });
    
    // Top 10 highest calorie foods
    console.log('\n🔥 Top 10 Highest Calorie Foods:');
    console.log('-'.repeat(40));
    const [highCalorieFoods] = await connection.execute(`
      SELECT name, calories, protein, fat, carbs
      FROM food_items
      ORDER BY calories DESC
      LIMIT 10
    `);
    
    highCalorieFoods.forEach((food, index) => {
      console.log(`  ${index + 1}. ${food.name}: ${food.calories} cal (P:${food.protein}g, F:${food.fat}g, C:${food.carbs}g)`);
    });
    
    // Top 10 lowest calorie foods
    console.log('\n🥬 Top 10 Lowest Calorie Foods:');
    console.log('-'.repeat(40));
    const [lowCalorieFoods] = await connection.execute(`
      SELECT name, calories, protein, fat, carbs
      FROM food_items
      WHERE calories > 0
      ORDER BY calories ASC
      LIMIT 10
    `);
    
    lowCalorieFoods.forEach((food, index) => {
      console.log(`  ${index + 1}. ${food.name}: ${food.calories} cal (P:${food.protein}g, F:${food.fat}g, C:${food.carbs}g)`);
    });
    
    // Highest protein foods
    console.log('\n💪 Top 10 Highest Protein Foods:');
    console.log('-'.repeat(40));
    const [highProteinFoods] = await connection.execute(`
      SELECT name, calories, protein, fat, carbs
      FROM food_items
      ORDER BY protein DESC
      LIMIT 10
    `);
    
    highProteinFoods.forEach((food, index) => {
      console.log(`  ${index + 1}. ${food.name}: ${food.protein}g protein (${food.calories} cal)`);
    });
    
    // Highest fiber foods
    console.log('\n🌾 Top 10 Highest Fiber Foods:');
    console.log('-'.repeat(40));
    const [highFiberFoods] = await connection.execute(`
      SELECT name, calories, fiber, protein, carbs
      FROM food_items
      WHERE fiber > 0
      ORDER BY fiber DESC
      LIMIT 10
    `);
    
    highFiberFoods.forEach((food, index) => {
      console.log(`  ${index + 1}. ${food.name}: ${food.fiber}g fiber (${food.calories} cal)`);
    });
    
    // Vietnamese foods count
    console.log('\n🇻🇳 Vietnamese Foods:');
    console.log('-'.repeat(30));
    const [vietnameseFoods] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM food_items
      WHERE name LIKE '%Thịt%' 
         OR name LIKE '%Rau%' 
         OR name LIKE '%Đậu%'
         OR name LIKE '%Bánh%'
         OR name LIKE '%Chè%'
         OR name LIKE '%Gạo%'
         OR name LIKE '%Sữa%'
         OR name LIKE '%Nước%'
         OR name IN ('Xoài Cát Hòa Lộc', 'Nhãn Lồng', 'Vải Thiều', 'Chôm Chôm', 'Sầu Riêng', 'Măng Cụt', 'Bưởi Da Xanh', 'Cam Sành', 'Quýt Hồng', 'Chuối Sứ', 'Dừa Tươi')
    `);
    console.log(`  Vietnamese Traditional Foods: ${vietnameseFoods[0].count} items`);
    
    // Recent additions
    console.log('\n🆕 Recently Added Foods (Last 20):');
    console.log('-'.repeat(40));
    const [recentFoods] = await connection.execute(`
      SELECT name, category_id, calories, created_at
      FROM food_items
      ORDER BY created_at DESC
      LIMIT 20
    `);
    
    recentFoods.forEach((food, index) => {
      const date = new Date(food.created_at).toLocaleDateString('vi-VN');
      console.log(`  ${index + 1}. ${food.name} (${food.calories} cal) - ${date}`);
    });
    
    // Database health check
    console.log('\n🔍 Database Health Check:');
    console.log('-'.repeat(30));
    
    // Check for missing images
    const [missingImages] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM food_items
      WHERE image_url IS NULL OR image_url = ""
    `);
    console.log(`  Items without images: ${missingImages[0].count}`);
    
    // Check for zero calories
    const [zeroCalories] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM food_items
      WHERE calories = 0
    `);
    console.log(`  Items with 0 calories: ${zeroCalories[0].count}`);
    
    // Check for missing nutrition data
    const [missingNutrition] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM food_items
      WHERE protein = 0 AND fat = 0 AND carbs = 0
    `);
    console.log(`  Items missing nutrition data: ${missingNutrition[0].count}`);
    
    console.log('\n🎉 Database Statistics Complete!');
    console.log('=' .repeat(50));
    
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
showFoodStats().catch(console.error);
