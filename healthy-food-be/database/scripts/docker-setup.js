const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const waitForDatabase = async (maxRetries = 30, delay = 2000) => {
  console.log('Waiting for database to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
      });
      
      await connection.ping();
      await connection.end();
      console.log('Database is ready!');
      return true;
    } catch (error) {
      console.log(`Attempt ${i + 1}/${maxRetries}: Database not ready yet...`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error('Database connection failed after maximum retries');
};

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    console.log(`Database '${dbConfig.database}' created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error.message);
    throw error;
  }
};

const setupTables = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    
    // Read and execute schema.sql
    const fs = require('fs');
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    await connection.end();
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up tables:', error.message);
    throw error;
  }
};

const addSampleData = async () => {
  try {
    console.log('Adding sample data...');
    
    // Add more foods
    const addMoreFoods = require('./data/add-more-foods');
    await addMoreFoods();
    
    // Add sample blogs
    const addSampleBlogs = require('./data/add-sample-blogs');
    await addSampleBlogs();
    
    console.log('Sample data added successfully');
  } catch (error) {
    console.error('Error adding sample data:', error.message);
    // Don't throw error for sample data
  }
};

const setupAll = async () => {
  try {
    console.log('🚀 Starting Docker database setup...\n');
    
    // Wait for database to be ready
    await waitForDatabase();
    
    // Create database if not exists
    await createDatabase();
    
    // Setup tables
    await setupTables();
    
    // Add sample data
    await addSampleData();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('📊 Database now contains:');
    console.log('   - Core tables (users, food_categories, food_items, user_food_logs)');
    console.log('   - Feature tables (user_bmi_data, blog_posts, blog_post_likes)');
    console.log('   - 50+ food items with nutritional information');
    console.log('   - Sample blog posts');
    console.log('\n🎉 Your Healthy Food application is ready to use!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  setupAll();
}

module.exports = setupAll;
