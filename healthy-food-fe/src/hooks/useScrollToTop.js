// Fixed import
import { useCallback } from 'react';

export const useScrollToTop = () => {
  const findScrollableElement = useCallback(() => {
    
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
        const style = getComputedStyle(element);
        const hasOverflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
        const hasScroll = element.scrollTop > 0;

        if (hasOverflowY && hasScroll) {
          return element;
        }

        if (hasOverflowY) {
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
  }, []);

  const scrollToTop = useCallback((behavior = 'smooth') => {
    try {
      const scrollableElement = findScrollableElement();

      if (scrollableElement && scrollableElement.scrollTo) {
        scrollableElement.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      } else {
        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      }
    } catch (error) {
      logWarning('Scroll to top error:', error);
      
      try {
        window.scrollTo(0, 0);
      } catch (fallbackError) {
        logError('Fallback scroll failed:', fallbackError);
      }
    }
  }, [findScrollableElement]);

  const scrollModalToTop = useCallback((modalSelector, behavior = 'smooth') => {
    try {
      const modal = document.querySelector(modalSelector);
      if (modal && modal.scrollTo) {
        modal.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      }
    } catch (error) {
      logWarning('Modal scroll to top error:', error);
    }
  }, []);

  const scrollToTopWithRetry = useCallback((delay = 100, retryCount = 3) => {
    const performScroll = (attempt = 0) => {
      try {
        const scrollableElement = findScrollableElement();
        
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
        logWarning(`Scroll attempt ${attempt + 1} failed:`, error);
        
        if (attempt < retryCount - 1) {
          // Sử dụng requestAnimationFrame thay vì setTimeout cho retry
          requestAnimationFrame(() => {
            setTimeout(() => {
              performScroll(attempt + 1);
            }, delay * (attempt + 1));
          });
        } else {
          // Final fallback
          try {
            window.scrollTo(0, 0);
          } catch (finalError) {
            logError('Final scroll attempt failed:', finalError);
          }
        }
      }
    };

    performScroll();
  }, [findScrollableElement]);

  return { scrollToTop, scrollModalToTop, scrollToTopWithRetry };
}; 