import { useEffect } from 'react';

export const usePageScroll = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}; 