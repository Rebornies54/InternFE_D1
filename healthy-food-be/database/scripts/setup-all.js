const { testConnection } = require('../connection');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const setupAll = async () => {
  try {
    console.log('🚀 Starting complete database setup...\n');
    
    // Test connection first
    console.log('🔌 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot proceed without database connection');
      process.exit(1);
    }
    console.log('');
    
    // Step 1: Setup core database
    console.log('📋 Step 1: Setting up core database...');
    const setupDatabase = require('./setup');
    await setupDatabase();
    console.log('');
    
    // Step 2: Add blog tables
    console.log('📋 Step 2: Adding blog tables...');
    const addBlogTables = require('./migrations/add-blog-tables');
    await addBlogTables();
    console.log('');
    
    // Step 3: Add BMI table
    console.log('📋 Step 3: Adding BMI table...');
    const addBMITable = require('./migrations/add-bmi-table');
    await addBMITable();
    console.log('');
    
    // Step 4: Add food images
    console.log('📋 Step 4: Adding food images...');
    const addFoodImages = require('./migrations/add-food-images');
    await addFoodImages();
    console.log('');
    
    // Step 5: Add more foods
    console.log('📋 Step 5: Adding more food items...');
    const addMoreFoods = require('./data/add-more-foods');
    await addMoreFoods();
    console.log('');
    
    // Step 6: Add sample blogs
    console.log('📋 Step 6: Adding sample blog posts...');
    const addSampleBlogs = require('./data/add-sample-blogs');
    await addSampleBlogs();
    console.log('');
    
    console.log('🎉 Complete database setup finished successfully!');
    console.log('');
    console.log('📊 Database now contains:');
    console.log('   - Core tables (users, food_categories, food_items, user_food_logs)');
    console.log('   - Feature tables (user_bmi_data, blog_posts, blog_post_likes)');
    console.log('   - 50+ food items with nutritional information and images');
    console.log('   - Sample blog posts');
    console.log('');
    console.log('🚀 Your Healthy Food application is ready to use!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  setupAll();
}

module.exports = setupAll; 