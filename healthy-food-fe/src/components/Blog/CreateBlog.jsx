import React, { useState } from 'react';
import { blogAPI } from '../../services/api';
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let imageUrl = '';
    try {
      // Upload image if any
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await blogAPI.uploadImage(formData);
        if (res.data.success) {
          imageUrl = res.data.url;
        }
      }
      // Create post
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
          <h2>Viết Blog mới</h2>
          <button className="create-blog-close" onClick={onClose}>✕</button>
        </div>
        <form className="create-blog-form" onSubmit={handleSubmit}>
          <label>Tiêu đề *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} />

          <label>Mô tả ngắn</label>
          <input value={description} onChange={e => setDescription(e.target.value)} maxLength={200} />

          <label>Danh mục *</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {BLOG_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <label>Nội dung *</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} />

          <label>Ảnh minh họa</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="create-blog-image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          {error && <div className="create-blog-error">{error}</div>}
          <button type="submit" className="create-blog-submit" disabled={loading}>
            {loading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog; 