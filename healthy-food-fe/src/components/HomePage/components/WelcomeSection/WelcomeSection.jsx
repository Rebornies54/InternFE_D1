import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, BarChart3, Calendar, Coffee } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../shared/AnimationVariants';
import { navigateToPage } from '../shared/utils';
import { UI_TEXT, WELCOME_STATS } from '../../../../constants';

const WelcomeSection = ({ user, currentBmi, navigate }) => {
  return (
    <motion.section 
      className="welcome-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <motion.div 
        className="welcome-card"
        variants={scaleIn}
      >
        <motion.div 
          className="welcome-user-info"
          variants={staggerContainer}
        >
          <motion.div 
            className="user-avatar"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
          >
            {user.avatar && user.avatar.trim() !== '' ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user.name.charAt(0)}</div>
            )}
          </motion.div>
          <motion.div 
            className="user-details"
            variants={fadeInUp}
          >
            <h2>{UI_TEXT.WELCOME_TITLE}</h2>
            <p className="user-name">{user.name}</p>
          </motion.div>
        </motion.div>
        <motion.div 
          className="user-stats"
          variants={staggerContainer}
        >
          <motion.div 
            className="user-stat-card"
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <motion.div 
              className="stat-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Target size={20} />
            </motion.div>
            <div className="stat-info">
              <span className="stat-value">{currentBmi?.toFixed ? currentBmi.toFixed(1) : '—'}</span>
              <span className="stat-label">{UI_TEXT.WELCOME_BMI_LABEL}</span>
            </div>
          </motion.div>
          <motion.div 
            className="user-stat-card"
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <motion.div 
              className="stat-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <BarChart3 size={20} />
            </motion.div>
            <div className="stat-info">
              <span className="stat-value">{WELCOME_STATS.TARGET_CALORIES.toLocaleString()}</span>
              <span className="stat-label">{UI_TEXT.WELCOME_CALORIE_LABEL}</span>
            </div>
          </motion.div>
          <motion.div 
            className="user-stat-card"
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <motion.div 
              className="stat-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Calendar size={20} />
            </motion.div>
            <div className="stat-info">
              <span className="stat-value">{WELCOME_STATS.TRACKING_DAYS}</span>
              <span className="stat-label">{UI_TEXT.WELCOME_DAYS_LABEL}</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="welcome-actions"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Link to="/home/dashboard" className="btn-primary">
              <BarChart3 size={16} /> {UI_TEXT.WELCOME_DASHBOARD_BUTTON}
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <button 
              onClick={() => navigateToPage(navigate, '/home/calorie-calculation')}
              className="btn-outline"
            >
              <Coffee size={16} /> {UI_TEXT.WELCOME_LOG_MEAL_BUTTON}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default WelcomeSection;
