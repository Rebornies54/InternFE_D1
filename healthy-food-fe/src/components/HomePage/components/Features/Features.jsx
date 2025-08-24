import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, Calendar, BookOpen, Star } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../shared/AnimationVariants';
import { navigateToPage } from '../shared/utils';
import FeatureCard from './FeatureCard';
import { UI_TEXT, FEATURES_DATA } from '../../../../constants';

const Features = ({ navigate }) => {
  // Map icon names to actual icon components
  const iconMap = {
    Target,
    BarChart3,
    Calendar,
    BookOpen
  };

  const features = FEATURES_DATA.map(feature => ({
    ...feature,
    icon: iconMap[feature.icon]
  }));

  return (
    <motion.section 
      className="features-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <motion.div 
        className="section-header"
        variants={staggerContainer}
      >
        <motion.div 
          className="section-badge"
          variants={scaleIn}
        >
          <Star size={14} />
          <span>{UI_TEXT.FEATURES_BADGE}</span>
        </motion.div>
        <motion.h2 
          className="section-title"
          variants={fadeInUp}
        >
          {UI_TEXT.FEATURES_TITLE}
        </motion.h2>
      </motion.div>
      <motion.div 
        className="features-grid"
        variants={staggerContainer}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            iconClass={feature.iconClass}
            onClick={() => navigateToPage(navigate, feature.path)}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Features;
