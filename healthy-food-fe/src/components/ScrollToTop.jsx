import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const performScroll = () => {
      try {
        if (hash) {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        
        // Always scroll to top when pathname changes, regardless of current position
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        console.error('ScrollToTop: Error during scroll:', error);
        window.scrollTo(0, 0);
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