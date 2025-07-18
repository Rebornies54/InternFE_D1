const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // Added for public route

// Multer config for blog image upload
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

// Test route to check authentication
router.get('/test-auth', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working',
    user: req.user
  });
});

// Get all blog posts with likes count and user info (temporarily remove auth for testing)
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

// Get blog post by ID with likes count and user info
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

// Create new blog post
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
    
    // Đảm bảo không có undefined
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

// Update blog post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, image_url, category } = req.body;
    const userId = req.user.userId;
    
    // Check if post exists and belongs to user
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
    
    const query = `
      UPDATE blog_posts 
      SET title = ?, description = ?, content = ?, image_url = ?, category = ?
      WHERE id = ?
    `;
    
    await pool.execute(query, [title, description, content, image_url, category, id]);
    
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

// Delete blog post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Check if post exists and belongs to user
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

// Like/Unlike blog post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Check if post exists
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
    
    // Check if user already liked the post
    const [likes] = await pool.execute(
      'SELECT id FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );
    
    if (likes.length > 0) {
      // Unlike
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
      // Like
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

// Check if user liked a post (public route - returns false if not authenticated)
router.get('/posts/:id/liked', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is authenticated by looking for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        success: true,
        liked: false,
        authenticated: false
      });
    }
    
    // Try to verify token
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
      // Invalid token, return not liked
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

// Get posts by category
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

// Search posts
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

// Upload blog image
router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router; 