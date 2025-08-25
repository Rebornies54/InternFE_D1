import React from 'react';
import { BLOG_CARD_GRID } from '../../../../constants';
import BlogCard from '../BlogCard';
import './BlogCardGrid.css';

const BlogCardGrid = ({ posts, onPostClick, onLike, userLikes, postsLoading }) => {
  if (postsLoading) {
    return (
      <div className="blog-loading">
        <p>{BLOG_CARD_GRID.LOADING_TEXT}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts-message">
        <p>{BLOG_CARD_GRID.NO_POSTS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <div className="blog-card-grid">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          onClick={onPostClick}
          onLike={onLike}
          isLiked={userLikes.has(post.id)}
          likeCount={post.likes_count || 0}
        />
      ))}
    </div>
  );
};

export default BlogCardGrid;
