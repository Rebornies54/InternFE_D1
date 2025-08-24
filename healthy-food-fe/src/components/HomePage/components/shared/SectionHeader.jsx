import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn, fadeInUp, slideInRight } from './AnimationVariants';

const SectionHeader = ({ 
  badge, 
  title, 
  showViewMore = false, 
  viewMoreText = "Xem tất cả", 
  onViewMoreClick,
  icon: Icon 
}) => {
  return (
    <motion.div 
      className="section-header section-header-flex"
      variants={motion.staggerContainer}
    >
      <motion.div variants={fadeInUp}>
        <motion.div 
          className="section-badge"
          variants={scaleIn}
        >
          {Icon && <Icon size={14} />}
          <span>{badge}</span>
        </motion.div>
        <motion.h2 
          className="section-title"
          variants={fadeInUp}
        >
          {title}
        </motion.h2>
      </motion.div>
      {showViewMore && (
        <motion.div variants={slideInRight}>
          <button 
            onClick={onViewMoreClick}
            className="view-more-link"
          >
            {viewMoreText}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SectionHeader;
