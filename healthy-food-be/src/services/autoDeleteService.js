const { pool } = require('../config/connection');

const autoDeleteOldBlogs = async () => {
  try {
    console.log('Running auto-delete old blogs job...');
    
    const query = `
      DELETE FROM blog_posts 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL 21 DAY)
    `;
    
    const [result] = await pool.execute(query);
    
    if (result.affectedRows > 0) {
      console.log(`Auto-deleted ${result.affectedRows} blogs older than 21 days`);
    } else {
      console.log('No blogs older than 21 days found');
    }
    
    return result.affectedRows;
  } catch (error) {
    console.error('Error in auto-delete old blogs job:', error);
    throw error;
  }
};

const scheduleAutoDelete = () => {
  // Chạy mỗi ngày lúc 2:00 AM
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 2 && now.getMinutes() === 0) {
      try {
        await autoDeleteOldBlogs();
      } catch (error) {
        console.error('Failed to run auto-delete job:', error);
      }
    }
  }, 60000); // Kiểm tra mỗi phút
};

module.exports = {
  autoDeleteOldBlogs,
  scheduleAutoDelete
}; 