import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  const findScrollableElement = () => {
    // Check if body is scrollable (this is where the actual scrolling happens)
    if (document.body.scrollTop > 0) {
      return document.body;
    }
    
    // Check if documentElement is scrollable
    if (document.documentElement.scrollTop > 0) {
      return document.documentElement;
    }
    
    // Check common containers
    const selectors = [
      '.home-container',
      '.content-wrapper', 
      '.home-main',
      '.blog-container',
      '.calorie-index-container',
      '.body-index-container',
      '.profile-container'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Check if element is scrollable
        const isScrollable = element.scrollHeight > element.clientHeight || 
                           element.style.overflowY === 'auto' ||
                           element.style.overflowY === 'scroll' ||
                           getComputedStyle(element).overflowY === 'auto' ||
                           getComputedStyle(element).overflowY === 'scroll';
        
        if (isScrollable) {
          return element;
        }
      }
    }
    
    // Fallback to document.body since that's where scrolling actually happens
    return document.body;
  };

  useEffect(() => {
    const performScroll = () => {
      try {
        const scrollableElement = findScrollableElement();
        
        if (hash) {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        
        // Always scroll to top when pathname changes
        scrollableElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        console.error('ScrollToTop: Error during scroll:', error);
        const scrollableElement = findScrollableElement();
        scrollableElement.scrollTo(0, 0);
      }
    };

    if (prevPathRef.current !== pathname) {
      const timer1 = setTimeout(() => {
        performScroll();
      }, 100);

      const timer2 = setTimeout(() => {
        performScroll();
      }, 300);

      const timer3 = setTimeout(() => {
        requestAnimationFrame(performScroll);
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