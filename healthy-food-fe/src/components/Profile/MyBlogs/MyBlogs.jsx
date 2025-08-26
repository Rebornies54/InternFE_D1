// Fixed import
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { blogAPI } from '../../../services/api';
import { MY_BLOGS } from '../../../constants';
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
    category: '',
    image_url: null
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
      setError(MY_BLOGS.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm(MY_BLOGS.MESSAGES.DELETE_CONFIRM)) {
      return;
    }

    try {
      const response = await blogAPI.deletePost(blogId);
      if (response.data.success) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      }
    } catch (error) {
      alert(MY_BLOGS.MESSAGES.DELETE_ERROR);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      description: blog.description || '',
      content: blog.content,
      category: blog.category,
      image_url: blog.image_url || null
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
          category: '',
          image_url: null
        });
      }
    } catch (error) {
      alert(MY_BLOGS.MESSAGES.UPDATE_ERROR);
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setEditForm({
      title: '',
      description: '',
      content: '',
      category: '',
      image_url: null
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="my-blogs-loading">{MY_BLOGS.LOADING}</div>;
  }

  if (error) {
    return <div className="my-blogs-error">{error}</div>;
  }

  return (
    <div className="my-blogs-container">
      <div className="my-blogs-header">
        <h2>{MY_BLOGS.TITLE}</h2>
        <p>{MY_BLOGS.SUBTITLE.replace('{count}', blogs.length)}</p>
      </div>

      {blogs.length === 0 ? (
        <div className="my-blogs-empty">
          <p>{MY_BLOGS.EMPTY_MESSAGE}</p>
        </div>
      ) : (
        <div className="my-blogs-list">
          {blogs.map(blog => (
            <div key={blog.id} className="my-blog-item">
              {editingBlog?.id === blog.id ? (
                <div className="my-blog-edit-form">
                  <div className="form-group">
                    <label>{MY_BLOGS.LABELS.TITLE}</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>{MY_BLOGS.LABELS.DESCRIPTION}</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>{MY_BLOGS.LABELS.CONTENT}</label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>{MY_BLOGS.LABELS.CATEGORY}</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    >
                      <option value="">{MY_BLOGS.PLACEHOLDERS.SELECT_CATEGORY}</option>
                      <option value="Thực phẩm">{MY_BLOGS.CATEGORIES.FOOD}</option>
                      <option value="Thực đơn">{MY_BLOGS.CATEGORIES.MENU}</option>
                      <option value="Bí quyết">{MY_BLOGS.CATEGORIES.TIPS}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{MY_BLOGS.LABELS.CURRENT_IMAGE}</label>
                    {editForm.image_url && editForm.image_url.trim() !== '' ? (
                      <div className="current-image">
                        <img src={editForm.image_url} alt="Current" className="my-blogs-current-image" />
                        <p>{MY_BLOGS.MESSAGES.CURRENT_IMAGE_KEPT}</p>
                      </div>
                    ) : (
                      <p>{MY_BLOGS.MESSAGES.NO_IMAGE}</p>
                    )}
                  </div>
                  <div className="edit-actions">
                    <button onClick={handleUpdate} className="btn-save">{MY_BLOGS.BUTTONS.SAVE}</button>
                    <button onClick={handleCancelEdit} className="btn-cancel">{MY_BLOGS.BUTTONS.CANCEL}</button>
                  </div>
                </div>
              ) : (
                <div className="my-blog-content">
                  <div className="blog-info">
                    <h3>{blog.title}</h3>
                    <p className="blog-description">{blog.description}</p>
                    {blog.image_url && blog.image_url.trim() !== '' && (
                      <div className="blog-image">
                        <img 
                          src={blog.image_url} 
                          alt={blog.title} 
                          className="my-blogs-preview-image"
                          onError={(e) => {
                            logWarning(MY_BLOGS.MESSAGES.IMAGE_LOAD_ERROR.replace('{url}', blog.image_url));
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="blog-meta">
                      <span>{MY_BLOGS.META.CATEGORY.replace('{category}', blog.category)}</span>
                      <span>{MY_BLOGS.META.CREATED_DATE.replace('{date}', formatDate(blog.created_at))}</span>
                      <span>{MY_BLOGS.META.LIKES_COUNT.replace('{count}', blog.likes_count)}</span>
                    </div>
                  </div>
                  <div className="blog-actions">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="btn-edit"
                    >
                      {MY_BLOGS.BUTTONS.EDIT}
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="btn-delete"
                    >
                      {MY_BLOGS.BUTTONS.DELETE}
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