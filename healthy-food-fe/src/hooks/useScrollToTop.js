import { useCallback } from 'react';

export const useScrollToTop = () => {
  const findScrollableElement = useCallback(() => {
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
        const style = getComputedStyle(element);
        const hasOverflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
        const hasScroll = element.scrollTop > 0;
        
        // Ưu tiên container có scroll hiện tại
        if (hasOverflowY && hasScroll) {
          return element;
        }
        
        // Nếu không có scroll hiện tại, trả về container đầu tiên có overflowY
        if (hasOverflowY) {
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
  }, []);

  const scrollToTop = useCallback((behavior = 'smooth') => {
    try {
      const scrollableElement = findScrollableElement();
      
      // Kiểm tra xem element có scroll được không
      if (scrollableElement && scrollableElement.scrollTo) {
        scrollableElement.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      } else {
        // Fallback cho window
        window.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      }
    } catch (error) {
      console.warn('Scroll to top error:', error);
      // Fallback cuối cùng
      try {
        window.scrollTo(0, 0);
      } catch (fallbackError) {
        console.error('Fallback scroll failed:', fallbackError);
      }
    }
  }, [findScrollableElement]);

  // Function để scroll to top cho modal và container đặc biệt
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
      console.warn('Modal scroll to top error:', error);
    }
  }, []);

  // Function để scroll to top với delay và retry logic
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
        console.warn(`Scroll attempt ${attempt + 1} failed:`, error);
        
        if (attempt < retryCount - 1) {
          setTimeout(() => {
            performScroll(attempt + 1);
          }, delay * (attempt + 1));
        } else {
          // Final fallback
          try {
            window.scrollTo(0, 0);
          } catch (finalError) {
            console.error('Final scroll attempt failed:', finalError);
          }
        }
      }
    };

    // Thực hiện scroll ngay lập tức
    performScroll();
    
    // Retry với delay để đảm bảo DOM đã được render
    for (let i = 1; i < retryCount; i++) {
      setTimeout(() => {
        performScroll(i);
      }, delay * i);
    }
  }, [findScrollableElement]);

  return { scrollToTop, scrollModalToTop, scrollToTopWithRetry };
}; 