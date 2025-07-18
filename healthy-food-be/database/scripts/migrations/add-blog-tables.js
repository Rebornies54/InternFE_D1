const { pool } = require('../../connection');

async function addBlogTables() {
  try {
    console.log('🚀 Adding blog tables...');

    // Create blog_posts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content LONGTEXT NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created blog_posts table');

    // Create blog_post_likes table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_post_likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_post_like (user_id, post_id)
      )
    `);
    console.log('✅ Created blog_post_likes table');

    console.log('🎉 Blog tables setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up blog tables:', error);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addBlogTables();
}

module.exports = addBlogTables; 