const { pool } = require('../../../src/config/connection');

async function addCommentTables() {
  try {
    console.log('Creating comment tables...');

    // Create blog_comments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        parent_id INT NULL,
        content TEXT NOT NULL,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id),
        INDEX idx_parent_id (parent_id)
      )
    `);

    // Create blog_comment_likes table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_comment_likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        comment_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_comment_like (user_id, comment_id)
      )
    `);

    console.log('Comment tables created successfully!');

    // Insert sample comments for existing posts
    const [posts] = await pool.execute('SELECT id FROM blog_posts LIMIT 3');
    
    if (posts.length > 0) {
      const sampleComments = [
        {
          post_id: posts[0].id,
          user_id: 1,
          content: 'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.',
          parent_id: null
        },
        {
          post_id: posts[0].id,
          user_id: 1,
          content: 'Tôi cũng thấy khoai tây rất tốt cho sức khỏe.',
          parent_id: null
        },
        {
          post_id: posts[1].id,
          user_id: 1,
          content: 'Rau củ quả thực sự rất quan trọng trong chế độ ăn hàng ngày.',
          parent_id: null
        },
        {
          post_id: posts[2].id,
          user_id: 1,
          content: 'Nấm là nguồn protein thực vật tuyệt vời!',
          parent_id: null
        }
      ];

      for (const comment of sampleComments) {
        await pool.execute(
          'INSERT INTO blog_comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
          [comment.post_id, comment.user_id, comment.content, comment.parent_id]
        );
      }

      console.log('Sample comments inserted successfully!');
    }

  } catch (error) {
    console.error('Error creating comment tables:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  addCommentTables()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addCommentTables }; 