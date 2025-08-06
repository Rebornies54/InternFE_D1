const { pool } = require('../../../src/config/connection');

async function addBlogViews() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to database');

    // Thêm cột views_count vào bảng blog_posts
    const addViewsColumn = `
      ALTER TABLE blog_posts 
      ADD COLUMN views_count INT DEFAULT 0 
      AFTER likes_count
    `;

    await connection.execute(addViewsColumn);
    console.log('✅ Added views_count column to blog_posts table');

    // Cập nhật dữ liệu mẫu nếu có
    const updateSampleData = `
      UPDATE blog_posts 
      SET views_count = FLOOR(RAND() * 100) + 10 
      WHERE views_count = 0
    `;

    await connection.execute(updateSampleData);
    console.log('✅ Updated sample data with random view counts');

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
      console.log('✅ Database connection released');
    }
  }
}

// Chạy migration nếu file được thực thi trực tiếp
if (require.main === module) {
  addBlogViews()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addBlogViews; 