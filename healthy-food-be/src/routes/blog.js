const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = 'blog_' + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

router.get('/test-auth', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working',
    user: req.user
  });
});

router.get('/posts', async (req, res) => {
  try {
    const query = `
      SELECT 
        bp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(bpl.id) as likes_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_likes bpl ON bp.id = bpl.post_id
      GROUP BY bp.id
      ORDER BY bp.created_at DESC
    `;
    
    const [posts] = await pool.execute(query);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách bài viết'
    });
  }
});



router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        bp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(bpl.id) as likes_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_likes bpl ON bp.id = bpl.post_id
      WHERE bp.id = ?
      GROUP BY bp.id
    `;
    
    const [posts] = await pool.execute(query, [id]);
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    res.json({
      success: true,
      data: posts[0]
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải bài viết'
    });
  }
});

router.post('/posts', auth, async (req, res) => {
  try {
    const { title, description, content, image_url, category } = req.body;
    const userId = req.user.userId;
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề, nội dung và danh mục là bắt buộc'
      });
    }
    
    const safeDescription = typeof description === 'undefined' ? null : description;
    const safeImageUrl = typeof image_url === 'undefined' ? null : image_url;
    const query = `
      INSERT INTO blog_posts (user_id, title, description, content, image_url, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      userId, title, safeDescription, content, safeImageUrl, category
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bài viết'
    });
  }
});

router.put('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, image_url, category } = req.body;
    const userId = req.user.userId;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề, nội dung và danh mục là bắt buộc'
      });
    }
    
    const [posts] = await pool.execute(
      'SELECT user_id FROM blog_posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền chỉnh sửa bài viết này'
      });
    }
    
    // Convert undefined to null for optional fields
    const safeDescription = description || null;
    const safeImageUrl = image_url || null;
    
    const query = `
      UPDATE blog_posts 
      SET title = ?, description = ?, content = ?, image_url = ?, category = ?
      WHERE id = ?
    `;
    
    await pool.execute(query, [title, safeDescription, content, safeImageUrl, category, id]);
    
    res.json({
      success: true,
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bài viết'
    });
  }
});

router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const [posts] = await pool.execute(
      'SELECT user_id FROM blog_posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa bài viết này'
      });
    }
    
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bài viết'
    });
  }
});

router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const [posts] = await pool.execute(
      'SELECT id FROM blog_posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    const [likes] = await pool.execute(
      'SELECT id FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );
    
    if (likes.length > 0) {
      await pool.execute(
        'DELETE FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
        [userId, id]
      );
      
      res.json({
        success: true,
        message: 'Đã bỏ thích bài viết',
        liked: false
      });
    } else {
      await pool.execute(
        'INSERT INTO blog_post_likes (user_id, post_id) VALUES (?, ?)',
        [userId, id]
      );
      
      res.json({
        success: true,
        message: 'Đã thích bài viết',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thao tác thích bài viết'
    });
  }
});

router.get('/posts/:id/liked', async (req, res) => {
  try {
    const { id } = req.params;
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        success: true,
        liked: false,
        authenticated: false
      });
    }
    
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      
      const [likes] = await pool.execute(
        'SELECT id FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
        [userId, id]
      );
      
      res.json({
        success: true,
        liked: likes.length > 0,
        authenticated: true
      });
    } catch (tokenError) {
      res.json({
        success: true,
        liked: false,
        authenticated: false
      });
    }
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra trạng thái thích'
    });
  }
});

router.get('/posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const query = `
      SELECT 
        bp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(bpl.id) as likes_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_likes bpl ON bp.id = bpl.post_id
      WHERE bp.category = ?
      GROUP BY bp.id
      ORDER BY bp.created_at DESC
    `;
    
    const [posts] = await pool.execute(query, [category]);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải bài viết theo danh mục'
    });
  }
});

router.get('/posts/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = `%${query}%`;
    
    const sqlQuery = `
      SELECT 
        bp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(bpl.id) as likes_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_likes bpl ON bp.id = bpl.post_id
      WHERE bp.title LIKE ? OR bp.description LIKE ? OR bp.content LIKE ?
      GROUP BY bp.id
      ORDER BY bp.created_at DESC
    `;
    
    const [posts] = await pool.execute(sqlQuery, [searchQuery, searchQuery, searchQuery]);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm bài viết'
    });
  }
});

router.get('/my-blogs', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching blogs for user ID:', userId);
    
    const query = `
      SELECT 
        bp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(bpl.id) as likes_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_likes bpl ON bp.id = bpl.post_id
      WHERE bp.user_id = ?
      GROUP BY bp.id
      ORDER BY bp.created_at DESC
    `;
    
    const [posts] = await pool.execute(query, [userId]);
    console.log(`Found ${posts.length} posts for user ${userId}`);
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải bài viết của bạn'
    });
  }
});

router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router; 