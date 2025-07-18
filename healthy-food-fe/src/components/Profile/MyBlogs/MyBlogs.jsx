import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { blogAPI } from '../../../services/api';
import './MyBlogs.css';

const MyBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBlog, setEditingBlog] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getMyBlogs();
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching my blogs:', error);
      setError('Lỗi khi tải bài viết của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      const response = await blogAPI.deletePost(blogId);
      if (response.data.success) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Lỗi khi xóa bài viết');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      description: blog.description || '',
      content: blog.content,
      category: blog.category
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await blogAPI.updatePost(editingBlog.id, editForm);
      if (response.data.success) {
        setBlogs(blogs.map(blog => 
          blog.id === editingBlog.id 
            ? { ...blog, ...editForm }
            : blog
        ));
        setEditingBlog(null);
        setEditForm({
          title: '',
          description: '',
          content: '',
          category: ''
        });
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Lỗi khi cập nhật bài viết');
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setEditForm({
      title: '',
      description: '',
      content: '',
      category: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="my-blogs-loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="my-blogs-error">{error}</div>;
  }

  return (
    <div className="my-blogs-container">
      <div className="my-blogs-header">
        <h2>Quản lý bài viết của tôi</h2>
        <p>Tổng cộng: {blogs.length} bài viết</p>
      </div>

      {blogs.length === 0 ? (
        <div className="my-blogs-empty">
          <p>Bạn chưa có bài viết nào</p>
        </div>
      ) : (
        <div className="my-blogs-list">
          {blogs.map(blog => (
            <div key={blog.id} className="my-blog-item">
              {editingBlog?.id === blog.id ? (
                <div className="my-blog-edit-form">
                  <div className="form-group">
                    <label>Tiêu đề:</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nội dung:</label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Danh mục:</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Thực phẩm">Thực phẩm</option>
                      <option value="Thực đơn">Thực đơn</option>
                      <option value="Bí quyết">Bí quyết</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button onClick={handleUpdate} className="btn-save">Lưu</button>
                    <button onClick={handleCancelEdit} className="btn-cancel">Hủy</button>
                  </div>
                </div>
              ) : (
                <div className="my-blog-content">
                  <div className="blog-info">
                    <h3>{blog.title}</h3>
                    <p className="blog-description">{blog.description}</p>
                    <div className="blog-meta">
                      <span>Danh mục: {blog.category}</span>
                      <span>Ngày tạo: {formatDate(blog.created_at)}</span>
                      <span>Lượt thích: {blog.likes_count}</span>
                    </div>
                  </div>
                  <div className="blog-actions">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="btn-edit"
                    >
                      Chỉnh sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs; 