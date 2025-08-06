const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
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
    
    // Tăng view count
    await pool.execute(
      'UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?',
      [id]
    );
    
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
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Kiểm tra post tồn tại
    const [posts] = await connection.execute(
      'SELECT id FROM blog_posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    // Kiểm tra trạng thái like hiện tại
    const [existingLikes] = await connection.execute(
      'SELECT id FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );
    
    let liked = false;
    
    if (existingLikes.length > 0) {
      // Nếu đã like thì unlike
      await connection.execute(
        'DELETE FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
        [userId, id]
      );
      
      // Cập nhật likes_count trong blog_posts
      await connection.execute(
        'UPDATE blog_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
        [id]
      );
      
      liked = false;
    } else {
      // Nếu chưa like thì like
      try {
        await connection.execute(
          'INSERT INTO blog_post_likes (user_id, post_id) VALUES (?, ?)',
          [userId, id]
        );
        
        // Cập nhật likes_count trong blog_posts
        await connection.execute(
          'UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ?',
          [id]
        );
        
        liked = true;
      } catch (insertError) {
        // Nếu insert thất bại do duplicate key, có thể do concurrent request
        if (insertError.code === 'ER_DUP_ENTRY') {
          // Kiểm tra lại trạng thái
          const [recheckLikes] = await connection.execute(
            'SELECT id FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
            [userId, id]
          );
          
          if (recheckLikes.length > 0) {
            // User đã like rồi, thực hiện unlike
            await connection.execute(
              'DELETE FROM blog_post_likes WHERE user_id = ? AND post_id = ?',
              [userId, id]
            );
            
            await connection.execute(
              'UPDATE blog_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
              [id]
            );
            
            liked = false;
          } else {
            // Retry insert một lần nữa
            await connection.execute(
              'INSERT INTO blog_post_likes (user_id, post_id) VALUES (?, ?)',
              [userId, id]
            );
            
            await connection.execute(
              'UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ?',
              [id]
            );
            
            liked = true;
          }
        } else {
          throw insertError;
        }
      }
    }
    
    await connection.commit();
    
    res.json({
      success: true,
      message: liked ? 'Đã thích bài viết' : 'Đã bỏ thích bài viết',
      liked: liked
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thao tác thích bài viết'
    });
  } finally {
    connection.release();
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
    
    // Trả về mảng rỗng thay vì 404 khi user không có bài viết
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

// Comment endpoints
router.post('/posts/:id/comments', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Nội dung comment không được để trống'
      });
    }
    
    // Kiểm tra post tồn tại
    const [posts] = await connection.execute(
      'SELECT id FROM blog_posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    // Kiểm tra parent comment nếu có
    if (parent_id) {
      const [parentComments] = await connection.execute(
        'SELECT id FROM blog_comments WHERE id = ? AND post_id = ?',
        [parent_id, id]
      );
      
      if (parentComments.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy comment cha'
        });
      }
    }
    
    // Tạo comment mới
    const [result] = await connection.execute(
      'INSERT INTO blog_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [id, userId, parent_id || null, content.trim()]
    );
    
    // Lấy thông tin comment vừa tạo
    const [newComment] = await connection.execute(`
      SELECT 
        bc.*,
        u.name as author_name,
        u.avatar_url as author_avatar
      FROM blog_comments bc
      LEFT JOIN users u ON bc.user_id = u.id
      WHERE bc.id = ?
    `, [result.insertId]);
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Tạo comment thành công',
      data: newComment[0]
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo comment'
    });
  } finally {
    connection.release();
  }
});

router.get('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Kiểm tra post tồn tại
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
    
    const postId = parseInt(id);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    const sortBy = req.query.sort || 'newest'; // newest, most_liked
    
    // Xác định ORDER BY clause dựa trên sort parameter
    let orderByClause = 'ORDER BY bc.created_at DESC'; // default
    if (sortBy === 'most_liked') {
      orderByClause = 'ORDER BY bc.likes_count DESC, bc.created_at DESC';
    } else if (sortBy === 'newest') {
      orderByClause = 'ORDER BY bc.created_at DESC';
    }
    
    // Lấy comments với thông tin user và replies
    const query = `
      SELECT 
        bc.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        (SELECT COUNT(*) FROM blog_comments WHERE parent_id = bc.id) as replies_count
      FROM blog_comments bc
      LEFT JOIN users u ON bc.user_id = u.id
      WHERE bc.post_id = ${postId} AND bc.parent_id IS NULL
      ${orderByClause}
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;
    
    const [comments] = await pool.query(query);
    
    // Lấy tổng số comments
    const countQuery = `SELECT COUNT(*) as total FROM blog_comments WHERE post_id = ${postId} AND parent_id IS NULL`;
    const [totalResult] = await pool.query(countQuery);
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_comments: total,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải comments'
    });
  }
});

router.get('/comments/:commentId/replies', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const commentId = parseInt(req.params.commentId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    
    console.log(`Fetching replies for comment ${commentId}, page: ${page}, limit: ${limit}, offset: ${offset}`);
    
    // Lấy replies của comment
    const [replies] = await connection.execute(
      'SELECT * FROM blog_comments WHERE parent_id = ? ORDER BY created_at ASC LIMIT ' + limit + ' OFFSET ' + offset,
      [commentId]
    );
    
    console.log(`Found ${replies.length} replies for comment ${commentId}`);
    
    // Lấy thông tin user cho từng reply
    const repliesWithUser = await Promise.all(replies.map(async (reply) => {
      const [userResult] = await connection.execute(
        'SELECT name, avatar_url FROM users WHERE id = ?',
        [reply.user_id]
      );
      return {
        ...reply,
        author_name: userResult[0]?.name || 'Unknown',
        author_avatar: userResult[0]?.avatar_url || null
      };
    }));
    
    // Lấy tổng số replies
    const [totalResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM blog_comments WHERE parent_id = ?',
      [commentId]
    );
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    console.log(`Total replies: ${total}, total pages: ${totalPages}`);
    
    res.json({
      success: true,
      data: {
        replies: repliesWithUser,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_replies: total,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching replies:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải replies'
    });
  } finally {
    connection.release();
  }
});

router.put('/comments/:commentId', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Nội dung comment không được để trống'
      });
    }
    
    // Kiểm tra comment tồn tại và thuộc về user
    const [comments] = await connection.execute(
      'SELECT id, user_id FROM blog_comments WHERE id = ?',
      [commentId]
    );
    
    if (comments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy comment'
      });
    }
    
    if (comments[0].user_id !== userId) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'Không có quyền chỉnh sửa comment này'
      });
    }
    
    // Cập nhật comment
    await connection.execute(
      'UPDATE blog_comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content.trim(), commentId]
    );
    
    // Lấy thông tin comment đã cập nhật
    const [updatedComment] = await connection.execute(`
      SELECT 
        bc.*,
        u.name as author_name,
        u.avatar_url as author_avatar
      FROM blog_comments bc
      LEFT JOIN users u ON bc.user_id = u.id
      WHERE bc.id = ?
    `, [commentId]);
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Cập nhật comment thành công',
      data: updatedComment[0]
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật comment'
    });
  } finally {
    connection.release();
  }
});

router.delete('/comments/:commentId', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { commentId } = req.params;
    const userId = req.user.userId;
    
    // Kiểm tra comment tồn tại và thuộc về user
    const [comments] = await connection.execute(
      'SELECT id, user_id, post_id FROM blog_comments WHERE id = ?',
      [commentId]
    );
    
    if (comments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy comment'
      });
    }
    
    if (comments[0].user_id !== userId) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa comment này'
      });
    }
    
    // Xóa comment và tất cả replies
    await connection.execute(
      'DELETE FROM blog_comments WHERE id = ? OR parent_id = ?',
      [commentId, commentId]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Xóa comment thành công'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa comment'
    });
  } finally {
    connection.release();
  }
});

router.post('/comments/:commentId/like', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { commentId } = req.params;
    const userId = req.user.userId;
    
    // Kiểm tra comment tồn tại
    const [comments] = await connection.execute(
      'SELECT id FROM blog_comments WHERE id = ?',
      [commentId]
    );
    
    if (comments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy comment'
      });
    }
    
    // Kiểm tra trạng thái like hiện tại
    const [existingLikes] = await connection.execute(
      'SELECT id FROM blog_comment_likes WHERE user_id = ? AND comment_id = ?',
      [userId, commentId]
    );
    
    let liked = false;
    
    if (existingLikes.length > 0) {
      // Nếu đã like thì unlike
      await connection.execute(
        'DELETE FROM blog_comment_likes WHERE user_id = ? AND comment_id = ?',
        [userId, commentId]
      );
      
      // Cập nhật likes_count trong blog_comments
      await connection.execute(
        'UPDATE blog_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
        [commentId]
      );
      
      liked = false;
    } else {
      // Nếu chưa like thì like
      try {
        await connection.execute(
          'INSERT INTO blog_comment_likes (user_id, comment_id) VALUES (?, ?)',
          [userId, commentId]
        );
        
        // Cập nhật likes_count trong blog_comments
        await connection.execute(
          'UPDATE blog_comments SET likes_count = likes_count + 1 WHERE id = ?',
          [commentId]
        );
        
        liked = true;
      } catch (insertError) {
        // Nếu insert thất bại do duplicate key, có thể do concurrent request
        if (insertError.code === 'ER_DUP_ENTRY') {
          // Kiểm tra lại trạng thái
          const [recheckLikes] = await connection.execute(
            'SELECT id FROM blog_comment_likes WHERE user_id = ? AND comment_id = ?',
            [userId, commentId]
          );
          
          if (recheckLikes.length > 0) {
            // User đã like rồi, thực hiện unlike
            await connection.execute(
              'DELETE FROM blog_comment_likes WHERE user_id = ? AND comment_id = ?',
              [userId, commentId]
            );
            
            await connection.execute(
              'UPDATE blog_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
              [commentId]
            );
            
            liked = false;
          } else {
            // Retry insert một lần nữa
            await connection.execute(
              'INSERT INTO blog_comment_likes (user_id, comment_id) VALUES (?, ?)',
              [userId, commentId]
            );
            
            await connection.execute(
              'UPDATE blog_comments SET likes_count = likes_count + 1 WHERE id = ?',
              [commentId]
            );
            
            liked = true;
          }
        } else {
          throw insertError;
        }
      }
    }
    
    await connection.commit();
    
    res.json({
      success: true,
      message: liked ? 'Đã thích comment' : 'Đã bỏ thích comment',
      liked: liked
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error toggling comment like:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thao tác thích comment'
    });
  } finally {
    connection.release();
  }
});

router.get('/comments/:commentId/liked', async (req, res) => {
  try {
    const { commentId } = req.params;
    
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
        'SELECT id FROM blog_comment_likes WHERE user_id = ? AND comment_id = ?',
        [userId, commentId]
      );
      
      res.json({
        success: true,
        liked: likes.length > 0,
        authenticated: true
      });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      res.json({
        success: true,
        liked: false,
        authenticated: false
      });
    }
  } catch (error) {
    console.error('Error checking comment like status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra trạng thái thích comment'
    });
  }
});

// Sync comment likes count for all comments
router.post('/sync-comment-likes-count', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Cập nhật likes_count cho tất cả comments dựa trên số lượng likes thực tế
    await connection.execute(`
      UPDATE blog_comments bc 
      SET likes_count = (
        SELECT COUNT(*) 
        FROM blog_comment_likes bcl 
        WHERE bcl.comment_id = bc.id
      )
    `);
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Đã đồng bộ likes count cho tất cả comments'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error syncing comment likes count:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đồng bộ comment likes count'
    });
  } finally {
    connection.release();
  }
});

// Sync likes count for all posts
router.post('/sync-likes-count', auth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Cập nhật likes_count cho tất cả posts dựa trên số lượng likes thực tế
    await connection.execute(`
      UPDATE blog_posts bp 
      SET likes_count = (
        SELECT COUNT(*) 
        FROM blog_post_likes bpl 
        WHERE bpl.post_id = bp.id
      )
    `);
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Đã đồng bộ likes count cho tất cả bài viết'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error syncing likes count:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đồng bộ likes count'
    });
  } finally {
    connection.release();
  }
});

// Tăng view count cho bài viết
router.post('/posts/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra bài viết có tồn tại không
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
    
    // Tăng view count
    await pool.execute(
      'UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Đã tăng view count'
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tăng view count'
    });
  }
});

module.exports = router; 