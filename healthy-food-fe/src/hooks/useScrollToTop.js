import { useCallback } from 'react';

export const useScrollToTop = () => {
  const scrollToTop = useCallback((behavior = 'smooth') => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    } catch (error) {
      // Fallback for browsers that don't support smooth scroll
      window.scrollTo(0, 0);
    }
  }, []);

  return scrollToTop;
}; 