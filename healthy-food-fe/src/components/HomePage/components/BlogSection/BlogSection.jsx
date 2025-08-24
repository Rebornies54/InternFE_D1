import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer, slideInRight } from '../shared/AnimationVariants';
import { navigateToPage } from '../shared/utils';
import BlogCard from './BlogCard';
import { UI_TEXT } from '../../../../constants';

const BlogSection = ({ posts, navigate }) => {
  return (
    <motion.section 
      className="blog-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <motion.div 
        className="section-header section-header-flex"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <motion.div 
            className="section-badge"
            variants={fadeInUp}
          >
            <BookOpen size={14} />
            <span>{UI_TEXT.BLOG_BADGE}</span>
          </motion.div>
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            {UI_TEXT.BLOG_TITLE}
          </motion.h2>
        </motion.div>
        <motion.div variants={slideInRight}>
          <Link to="/home/blog" className="view-more-link">
            {UI_TEXT.BLOG_VIEW_ALL} <ChevronRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
      <motion.div 
        className="blog-grid"
        variants={staggerContainer}
      >
        {posts.map((post, index) => (
          <BlogCard
            key={post.id} 
            post={post}
            onCardClick={() => navigateToPage(navigate, '/home/blog')}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default BlogSection;
