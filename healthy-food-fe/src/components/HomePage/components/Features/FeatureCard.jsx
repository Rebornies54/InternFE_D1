import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { fadeInUp } from '../shared/AnimationVariants';

const FeatureCard = ({ icon: Icon, title, description, onClick, iconClass = '' }) => {
  return (
    <motion.div 
      className="feature-card"
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className={`feature-icon ${iconClass}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon size={24} />
      </motion.div>
      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <motion.button 
        onClick={onClick}
        className="feature-link"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
};

export default FeatureCard;
