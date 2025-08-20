import { logWarning, logError } from '../utils/errorHandler';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  const findScrollableElement = () => {
    
    const containerSelectors = [
      '.home-container',
      '.blog-container',
      '.calorie-index-container',
      '.body-index-container',
      '.profile-container',
      '.content-wrapper',
      '.home-main'
    ];

    for (const selector of containerSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const isScrollable = element.scrollHeight > element.clientHeight || 
                           element.style.overflowY === 'auto' ||
                           element.style.overflowY === 'scroll' ||
                           getComputedStyle(element).overflowY === 'auto' ||
                           getComputedStyle(element).overflowY === 'scroll';
        
        if (isScrollable && element.scrollTop > 0) {
          return element;
        }
      }
    }

    if (document.body.scrollTop > 0) {
      return document.body;
    }
    
    if (document.documentElement.scrollTop > 0) {
      return document.documentElement;
    }

    return document.body;
  };

  const performScroll = (retryCount = 0) => {
    try {
      const scrollableElement = findScrollableElement();
      
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      
      if (scrollableElement && scrollableElement.scrollTo) {
        scrollableElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      logWarning('Scroll to top error:', error);

      if (retryCount < 2) {
        setTimeout(() => {
          try {
            const scrollableElement = findScrollableElement();
            scrollableElement.scrollTo(0, 0);
          } catch (fallbackError) {
            logError('Fallback scroll failed:', fallbackError);
            
            try {
              window.scrollTo(0, 0);
            } catch (finalError) {
              logError('Final scroll attempt failed:', finalError);
            }
          }
        }, 100 * (retryCount + 1));
      }
    }
  };

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      
      performScroll();

      const timer1 = setTimeout(() => {
        performScroll(1);
      }, 100);

      const timer2 = setTimeout(() => {
        performScroll(2);
      }, 300);

      const timer3 = setTimeout(() => {
        requestAnimationFrame(() => performScroll(3));
      }, 500);

      prevPathRef.current = pathname;
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [pathname, hash]);

  return null;
}