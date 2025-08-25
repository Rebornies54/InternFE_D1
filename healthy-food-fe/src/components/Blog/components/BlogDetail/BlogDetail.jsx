import React from 'react';
import { Heart } from 'lucide-react';
import { UI_TEXT } from '../../../../constants';
import Comment from '../../Comment';
import './BlogDetail.css';

const BlogDetail = ({ post, onBack, onLike, isLiked, likeCount }) => {
  const logWarning = (message) => {
    console.warn(message);
  };

  return (
    <div className="blog-detail">
      <button className="back-button" onClick={onBack}>{UI_TEXT.BACK_TO_LIST}</button>
      <div className="blog-detail-header">
        <div className="blog-detail-info">
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-detail-category">{post.category}</span>
            <span className="blog-detail-date">{post.date}</span>
            {post.author_name && (
              <span className="blog-detail-author">{UI_TEXT.BY_AUTHOR} {post.author_name}</span>
            )}
          </div>
        </div>
        <div className="blog-detail-actions">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={() => onLike(post.id)}
          >
            <Heart size={20} />
            <span className="like-count">{likeCount}</span>
          </button>
        </div>
      </div>
      {post.image_url && post.image_url.trim() !== '' ? (
        <div className="blog-detail-image">
          <img 
            src={post.image_url} 
            alt={post.title}
            onError={(e) => {
              logWarning(`Failed to load blog detail image: ${post.image_url}`);
              e.target.style.display = 'none';
              const placeholder = e.target.parentNode.querySelector('.blog-detail-placeholder');
              if (placeholder) {
                placeholder.classList.remove('blog-detail-placeholder-hidden');
                placeholder.classList.add('blog-detail-placeholder-visible');
              }
            }}
          />
          <div 
            className="blog-detail-placeholder blog-detail-placeholder-hidden"
            ref={(el) => {
              if (el) {
                el.placeholderRef = el;
              }
            }}
          >
            <span>{UI_TEXT.BLOG_IMAGE_PLACEHOLDER}</span>
          </div>
        </div>
      ) : (
        <div className="blog-detail-image">
          <div className="blog-detail-placeholder blog-detail-placeholder-visible">
            <span>{UI_TEXT.BLOG_IMAGE_PLACEHOLDER}</span>
          </div>
        </div>
      )}
      <div className="blog-detail-content">
        {post.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
      
      {/* Comments Section */}
      <Comment postId={post.id} />
    </div>
  );
};

export default BlogDetail;
