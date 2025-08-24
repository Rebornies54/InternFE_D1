import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Target, BookOpen } from 'lucide-react';

const BannerSlide = ({ banner, isActive }) => {
  return (
    <div className={`banner-slide ${isActive ? 'active' : ''}`}>
      <div className="banner-content">
        <div className="banner-text">
          <div className="banner-badge">
            <Zap size={14} />
            <span>{banner.badge}</span>
          </div>
          <h1 className="banner-title">
            {banner.title}
          </h1>
          <p className="banner-subtitle">
            {banner.subtitle}
          </p>
          <div className="banner-actions">
            <Link to={banner.primaryPath} className="banner-primary-btn">
              <Target size={16} />
              {banner.primaryButton}
            </Link>
            <Link to={banner.secondaryPath} className="banner-secondary-btn">
              <BookOpen size={16} />
              {banner.secondaryButton}
            </Link>
          </div>
        </div>
        <div className="banner-image">
          <img 
            src={banner.image} 
            alt={banner.title} 
          />
        </div>
      </div>
    </div>
  );
};

export default BannerSlide;
