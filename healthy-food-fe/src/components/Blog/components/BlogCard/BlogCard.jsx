import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '../../../AnimatedComponents';
import { UI_TEXT } from '../../../../constants';
import './BlogCard.css';

const BlogCard = ({ post, onClick, onLike, isLiked, likeCount }) => {
  const logWarning = (message) => {
    console.warn(message);
  };

  return (
    <AnimatedCard className="blog-card">
      <div className="blog-card-image" onClick={() => onClick(post)}>
        {post.image_url && post.image_url.trim() !== '' ? (
          <img 
            src={post.image_url} 
            alt={post.title}
            onError={(e) => {
              logWarning(`Failed to load blog image: ${post.image_url}`);
              e.target.style.display = 'none';
              const placeholder = e.target.parentNode.querySelector('.blog-image-placeholder');
              if (placeholder) {
                placeholder.classList.remove('blog-image-placeholder-hidden');
                placeholder.classList.add('blog-image-placeholder-visible');
              }
            }}
          />
        ) : null}
        <div 
          className={`blog-image-placeholder ${(post.image_url && post.image_url.trim() !== '') ? 'blog-image-placeholder-hidden' : 'blog-image-placeholder-visible'}`}
        >
          <span>{UI_TEXT.BLOG_IMAGE_PLACEHOLDER}</span>
        </div>
        <div className="blog-card-view-count">
          <Eye size={14} />
          <span>{post.views_count || 0}</span>
        </div>
      </div>
      <div className="blog-card-content" onClick={() => onClick(post)}>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-desc">{post.description}</p>
        <div className="blog-card-meta">
          <span className="blog-card-category">{post.category}</span>
          <span className="blog-card-date">{post.date}</span>
        </div>
      </div>
      <div className="blog-card-actions" onClick={(e) => e.stopPropagation()}>
        <AnimatedButton 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={16} />
          <span className="like-count">{likeCount}</span>
        </AnimatedButton>
      </div>
    </AnimatedCard>
  );
};

export default BlogCard;
