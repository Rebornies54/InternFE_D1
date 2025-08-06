const { pool } = require('../../../src/config/connection');

async function resetBlogViews() {
  let connection;
  try {
    console.log('🔄 Bắt đầu reset view count cho tất cả blog posts...');
    
    connection = await pool.getConnection();
    
    // Reset tất cả views_count về 0
    const [result] = await connection.execute(
      'UPDATE blog_posts SET views_count = 0'
    );
    
    console.log(`✅ Đã reset ${result.affectedRows} blog posts về 0 view`);
    
    // Kiểm tra kết quả
    const [posts] = await connection.execute(
      'SELECT id, title, views_count FROM blog_posts LIMIT 5'
    );
    
    console.log('📊 Kiểm tra kết quả (5 posts đầu tiên):');
    posts.forEach(post => {
      console.log(`  - ID ${post.id}: "${post.title}" - Views: ${post.views_count}`);
    });
    
    console.log('✅ Reset view count hoàn thành!');
    
  } catch (error) {
    console.error('❌ Lỗi khi reset view count:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Chạy migration nếu file được gọi trực tiếp
if (require.main === module) {
  resetBlogViews()
    .then(() => {
      console.log('🎉 Migration hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration thất bại:', error);
      process.exit(1);
    });
}

module.exports = { resetBlogViews }; 