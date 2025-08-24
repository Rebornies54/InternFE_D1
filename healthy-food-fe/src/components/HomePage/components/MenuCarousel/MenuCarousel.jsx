import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Salad } from 'lucide-react';
import { fadeInUp, staggerContainer, slideInRight } from '../shared/AnimationVariants';
import { navigateToPage } from '../shared/utils';
import MenuCard from './MenuCard';
import { UI_TEXT, MENU_ITEMS } from '../../../../constants';

const MenuCarousel = ({ navigate }) => {
  // Carousel drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Menu carousel functionality with infinite loop
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const originalMenuItems = MENU_ITEMS;

  // Create tripled array for infinite loop: [original] + [original] + [original]
  const menuItems = [
    ...originalMenuItems.map((item, index) => ({ ...item, uniqueId: `set1-${item.id}` })),
    ...originalMenuItems.map((item, index) => ({ ...item, uniqueId: `set2-${item.id}` })),
    ...originalMenuItems.map((item, index) => ({ ...item, uniqueId: `set3-${item.id}` }))
  ];

  // Auto slide for menu carousel with infinite loop
  useEffect(() => {
    const menuInterval = setInterval(() => {
      setCurrentMenuIndex((prev) => {
        const nextIndex = prev + 1;
        // If we reach the end of the tripled array, jump back to the middle set seamlessly
        if (nextIndex >= originalMenuItems.length * 2) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentMenuIndex(originalMenuItems.length);
            setIsTransitioning(false);
          }, 100);
          return originalMenuItems.length * 2 - 1; // Stay at the end temporarily
        }
        return nextIndex;
      });
    }, 6000); // Change every 6 seconds for smoother experience
    return () => clearInterval(menuInterval);
  }, [originalMenuItems.length]);

  // Drag handlers
  const handleDragStart = (e) => {
    // Ignore if clicking on navigation buttons
    if (e.target.closest('.carousel-nav-btn')) {
      return;
    }
    
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    setCurrentX(clientX);
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const dragThreshold = 80; // Reduced threshold for more responsive drag
    
    if (Math.abs(dragOffset) > dragThreshold) {
      if (dragOffset > 0) {
        // Move to previous item
        setCurrentMenuIndex((prev) => {
          const prevIndex = prev - 1;
          if (prevIndex < originalMenuItems.length) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMenuIndex(originalMenuItems.length * 2 - 1);
              setIsTransitioning(false);
            }, 100);
            return originalMenuItems.length;
          }
          return prevIndex;
        });
      } else {
        // Move to next item
        setCurrentMenuIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= originalMenuItems.length * 2) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMenuIndex(originalMenuItems.length);
              setIsTransitioning(false);
            }, 100);
            return originalMenuItems.length * 2 - 1;
          }
          return nextIndex;
        });
      }
    }
    
    setDragOffset(0);
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleTouchStart = (e) => {
      setIsDragging(true);
      const clientX = e.touches[0].clientX;
      setStartX(clientX);
      setCurrentX(clientX);
      setDragOffset(0);
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches[0].clientX;
      const deltaX = clientX - startX;
      setCurrentX(clientX);
      setDragOffset(deltaX);
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      const dragThreshold = 100;
      if (Math.abs(dragOffset) > dragThreshold) {
        if (dragOffset > 0) {
          // Move to previous item
          setCurrentMenuIndex((prev) => {
            const prevIndex = prev - 1;
            if (prevIndex < originalMenuItems.length) {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentMenuIndex(originalMenuItems.length * 2 - 1);
                setIsTransitioning(false);
              }, 100);
              return originalMenuItems.length;
            }
            return prevIndex;
          });
        } else {
          // Move to next item
          setCurrentMenuIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= originalMenuItems.length * 2) {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentMenuIndex(originalMenuItems.length);
                setIsTransitioning(false);
              }, 100);
              return originalMenuItems.length * 2 - 1;
            }
            return nextIndex;
          });
        }
      }
      setDragOffset(0);
    };

    // Add touch event listeners with passive: false
    carouselElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    carouselElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      carouselElement.removeEventListener('touchstart', handleTouchStart);
      carouselElement.removeEventListener('touchmove', handleTouchMove);
      carouselElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, dragOffset, originalMenuItems.length]);

  // Calculate transform for carousel track
  const getTrackTransform = () => {
    const baseTransform = -currentMenuIndex * 100;
    const dragTransform = (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;
    return `translateX(${baseTransform + dragTransform}%)`;
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleCardClick = () => {
    navigateToPage(navigate, '/home/calorie-calculation');
  };

  return (
    <motion.section 
      className="suggested-menu-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
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
            <Salad size={14} />
            <span>{UI_TEXT.MENU_BADGE}</span>
          </motion.div>
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            {UI_TEXT.MENU_TITLE}
          </motion.h2>
        </motion.div>
        <motion.button 
          onClick={() => navigateToPage(navigate, '/home/calorie-calculation')} 
          className="view-more-link"
          variants={slideInRight}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {UI_TEXT.MENU_VIEW_ALL} <ChevronRight size={16} />
        </motion.button>
      </motion.div>
      
      <div 
        className={`menu-carousel-container ${isDragging ? 'dragging' : ''} homepage-carousel-cursor`}
        ref={carouselRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="menu-carousel">
          <div 
            className="menu-carousel-track homepage-carousel-track-transformed"
            ref={trackRef}
            style={{
              transform: getTrackTransform(),
              transition: isDragging || isTransitioning ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {menuItems.map((item, index) => (
              <MenuCard
                key={item.uniqueId}
                item={item}
                isActive={index === currentMenuIndex}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MenuCarousel;
