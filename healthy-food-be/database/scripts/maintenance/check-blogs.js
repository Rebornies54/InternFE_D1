const { pool } = require('../../connection');

const checkBlogs = async () => {
  try {
    console.log('Checking blog posts in database...');
    
    const [blogs] = await pool.execute(`
      SELECT 
        bp.id,
        bp.title,
        bp.user_id,
        u.name as author_name,
        bp.created_at,
        bp.category
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      ORDER BY bp.created_at DESC
    `);
    
    console.log(`Found ${blogs.length} blog posts:`);
    blogs.forEach(blog => {
      console.log(`   - ID: ${blog.id}, Title: "${blog.title}", Author: ${blog.author_name} (User ID: ${blog.user_id}), Category: ${blog.category}, Created: ${blog.created_at}`);
    });
    
    console.log('\nBlog posts by user:');
    const [userBlogs] = await pool.execute(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        COUNT(bp.id) as blog_count
      FROM users u
      LEFT JOIN blog_posts bp ON u.id = bp.user_id
      GROUP BY u.id, u.name
      ORDER BY u.id
    `);
    
    userBlogs.forEach(user => {
      console.log(`   - User ${user.user_id} (${user.user_name}): ${user.blog_count} blogs`);
    });
    
  } catch (error) {
    console.error('Error checking blogs:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  checkBlogs();
}

module.exports = checkBlogs; 