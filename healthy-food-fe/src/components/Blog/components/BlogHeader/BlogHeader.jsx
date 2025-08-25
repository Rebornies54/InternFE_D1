import React from 'react';
import { BLOG_TABS, BLOG_HEADER } from '../../../../constants';
import './BlogHeader.css';

const BlogHeader = ({ onShowCreate, title, description, type = BLOG_TABS.BLOG }) => {
  const isBlog = type === BLOG_TABS.BLOG;
  
  return (
    <div className={`blog-header ${isBlog ? 'blog-header-blog' : 'blog-header-menu'}`}>
      <div className="blog-header-background"></div>
      <div className="blog-header-content">
        {isBlog && (
          <div className="blog-create-button-container">
            <button 
              className="create-blog-btn" 
              onClick={onShowCreate}
              title={BLOG_HEADER.CREATE_BLOG_TITLE}
              aria-label={BLOG_HEADER.CREATE_BLOG_ARIA_LABEL}
            >
              {BLOG_HEADER.CREATE_BLOG_BUTTON}
            </button>
          </div>
        )}
        <h1 className="blog-title">{title}</h1>
        {description && (
          <p className="blog-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default BlogHeader;
