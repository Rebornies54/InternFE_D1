import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Coffee } from 'lucide-react';
import { fadeInUp } from '../shared/AnimationVariants';
import { logWarning } from '../shared/utils';
import { UI_TEXT } from '../../../../constants';

const BlogCard = ({ post, onCardClick }) => {
  return (
    <motion.div 
      className="blog-card"
      variants={fadeInUp}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="blog-card-image">
        {post.image_url && post.image_url.trim() !== '' ? (
          <img 
            src={post.image_url} 
            alt={post.title}
            onError={(e) => {
              logWarning(`Failed to load homepage blog image: ${post.image_url}`);
              e.target.style.display = 'none';
              const placeholder = e.target.parentNode.querySelector('.blog-placeholder');
              if (placeholder) {
                placeholder.classList.remove('homepage-blog-placeholder-hidden');
                placeholder.classList.add('homepage-blog-placeholder-visible');
              }
            }}
          />
        ) : null}
        <div 
          className={`blog-placeholder ${(post.image_url && post.image_url.trim() !== '') ? 'homepage-blog-placeholder-hidden' : 'homepage-blog-placeholder-visible'}`}
        >
          <Coffee size={24} />
        </div>
        <span className="blog-category">{post.category}</span>
      </div>
      <div className="blog-card-content">
        <div className="blog-meta">
          <span className="blog-date">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="blog-reading-time">
            <Clock size={14} /> {UI_TEXT.BLOG_READING_TIME}
          </span>
        </div>
        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-excerpt">
          {post.description || post.content.substring(0, 100)}...
        </p>
        <button 
          onClick={onCardClick}
          className="blog-read-more"
        >
          {UI_TEXT.BLOG_READ_MORE} <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default BlogCard;
