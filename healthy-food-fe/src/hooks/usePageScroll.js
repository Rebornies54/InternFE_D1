import { useEffect } from 'react';

export const usePageScroll = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
}; 