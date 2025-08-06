const mysql = require('mysql2/promise');
const { dbConfig } = require('../../connection');

async function deleteTest1Blogs() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Tìm user test1
    const [users] = await connection.execute(
      'SELECT id, name, email FROM users WHERE name = ? OR email = ?',
      ['test1', 'test1@example.com']
    );

    if (users.length === 0) {
      console.log('❌ User "test1" not found');
      return;
    }

    const test1User = users[0];
    console.log(`📋 Found user: ${test1User.name} (ID: ${test1User.id})`);

    // Đếm số bài blog của test1
    const [blogCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM blog_posts WHERE user_id = ?',
      [test1User.id]
    );

    console.log(`📊 Found ${blogCount[0].count} blog posts by test1`);

    if (blogCount[0].count === 0) {
      console.log('✅ No blog posts to delete');
      return;
    }

    // Xóa tất cả bài blog của test1
    const [deleteResult] = await connection.execute(
      'DELETE FROM blog_posts WHERE user_id = ?',
      [test1User.id]
    );

    console.log(`✅ Successfully deleted ${deleteResult.affectedRows} blog posts`);

    // Kiểm tra lại
    const [remainingBlogs] = await connection.execute(
      'SELECT COUNT(*) as count FROM blog_posts WHERE user_id = ?',
      [test1User.id]
    );

    console.log(`📊 Remaining blog posts by test1: ${remainingBlogs[0].count}`);

    // Hiển thị danh sách blog còn lại trong hệ thống
    const [allBlogs] = await connection.execute(`
      SELECT bp.id, bp.title, u.name as author, bp.created_at 
      FROM blog_posts bp 
      JOIN users u ON bp.user_id = u.id 
      ORDER BY bp.created_at DESC
    `);

    console.log('\n📝 Remaining blog posts in system:');
    allBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. "${blog.title}" by ${blog.author} (${blog.created_at})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Chạy script
deleteTest1Blogs()
  .then(() => {
    console.log('🎉 Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
