import React, { useState, useEffect, useRef } from 'react';
import { blogAPI } from '../../services/api';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './Blog.css';

const BLOG_CATEGORIES = [
  { value: 'thực phẩm', label: 'Thực phẩm' },
  { value: 'thực đơn', label: 'Thực đơn' },
  { value: 'bí quyết', label: 'Bí quyết' },
  { value: 'câu chuyện', label: 'Câu chuyện' },
  { value: 'công thức', label: 'Công thức' },
];

const CreateBlog = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(BLOG_CATEGORIES[0].value);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState({ title: 0, description: 0, content: 0 });
  const fileInputRef = useRef(null);
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  useEffect(() => {
    setCharCount({
      title: title.length,
      description: description.length,
      content: content.length
    });
  }, [title, description, content]);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Vui lòng chọn file ảnh hợp lệ');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageChange(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectCategory = (categoryValue) => {
    setCategory(categoryValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let imageUrl = '';
      
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await blogAPI.uploadImage(formData);
        if (res.data.success) {
          imageUrl = res.data.url;
        }
      }
      
      await blogAPI.createPost({
        title,
        description: description || null,
        content,
        category,
        image_url: imageUrl || null
      });
      
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError('Đăng bài thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-modal-overlay" onClick={onClose}>
      <div className="create-blog-modal" onClick={e => e.stopPropagation()}>
        <div className="create-blog-header">
          <div className="create-blog-title-section">
            <h2>Viết Blog mới</h2>
            <p className="create-blog-subtitle">Chia sẻ kiến thức và kinh nghiệm của bạn</p>
          </div>
          <button className="create-blog-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="create-blog-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label">
              Tiêu đề <span className="required">*</span>
              <span className="char-count">{charCount.title}/100</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="Nhập tiêu đề bài viết..."
              className="form-input"
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              Mô tả ngắn
              <span className="char-count">{charCount.description}/200</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
              placeholder="Mô tả ngắn gọn về bài viết..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              Danh mục <span className="required">*</span>
            </label>
            <div className="category-selector">
              {BLOG_CATEGORIES.map(cat => (
                <div
                  key={cat.value}
                  className={`category-option ${category === cat.value ? 'selected' : ''}`}
                  onClick={() => selectCategory(cat.value)}
                >
                  <div className="category-icon">
                    {cat.value === 'thuc-pham' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                    )}
                    {cat.value === 'thuc-don' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
                        <path d="M19 11h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
                        <path d="M9 3H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"></path>
                        <path d="M19 3h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"></path>
                      </svg>
                    )}
                    {cat.value === 'bi-quyet' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    )}
                    {cat.value === 'dinh-duong' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    )}
                    {cat.value === 'suc-khoe' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    )}
                  </div>
                  <span className="category-label">{cat.label}</span>
                  {category === cat.value && (
                    <div className="selected-indicator">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Nội dung <span className="required">*</span>
              <span className="char-count">{charCount.content}/5000</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              maxLength={5000}
              placeholder="Viết nội dung bài blog của bạn..."
              className="form-textarea content-textarea"
              rows={8}
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              Ảnh minh họa
            </label>
            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
              {imagePreview && imagePreview.trim() !== '' ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <p>Click để chọn ảnh</p>
                  <span>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden-file-input"
              />
            </div>
          </div>

          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                  Đang đăng...
                </>
              ) : (
                'Đăng bài'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog; 