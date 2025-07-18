const { pool } = require('../../connection');

const autoDeleteOldBlogs = async () => {
  try {
    console.log('Checking for blogs older than 21 days...');
    
    const query = `
      DELETE FROM blog_posts 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL 21 DAY)
    `;
    
    const [result] = await pool.execute(query);
    
    if (result.affectedRows > 0) {
      console.log(`Deleted ${result.affectedRows} blogs older than 21 days`);
    } else {
      console.log('No blogs older than 21 days found');
    }
    
    console.log('Auto-delete old blogs completed!');
    
  } catch (error) {
    console.error('Error auto-deleting old blogs:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  autoDeleteOldBlogs();
}

module.exports = autoDeleteOldBlogs; 