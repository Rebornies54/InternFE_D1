import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  const findScrollableElement = () => {
    // Kiểm tra các container chính có scroll riêng
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

    // Kiểm tra body và documentElement
    if (document.body.scrollTop > 0) {
      return document.body;
    }
    
    if (document.documentElement.scrollTop > 0) {
      return document.documentElement;
    }

    // Fallback về body
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
        // Fallback cho window
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.warn('Scroll to top error:', error);
      
      // Retry logic với fallback
      if (retryCount < 2) {
        setTimeout(() => {
          try {
            const scrollableElement = findScrollableElement();
            scrollableElement.scrollTo(0, 0);
          } catch (fallbackError) {
            console.error('Fallback scroll failed:', fallbackError);
            // Thử lần cuối với window
            try {
              window.scrollTo(0, 0);
            } catch (finalError) {
              console.error('Final scroll attempt failed:', finalError);
            }
          }
        }, 100 * (retryCount + 1));
      }
    }
  };

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // Thực hiện scroll ngay lập tức
      performScroll();
      
      // Retry với delay để đảm bảo DOM đã được render
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