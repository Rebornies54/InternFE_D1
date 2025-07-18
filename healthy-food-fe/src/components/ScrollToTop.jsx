import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Scroll to top whenever pathname changes
    const performScroll = () => {
      try {
        // If there's a hash in URL, scroll to that element
        if (hash) {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        
        // If no hash, scroll to top
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for browsers that don't support smooth scroll
        window.scrollTo(0, 0);
      }
    };

    // Check if pathname actually changed
    if (prevPathRef.current !== pathname) {
      // Use multiple approaches to ensure scroll happens
      const timer1 = setTimeout(() => {
        performScroll();
      }, 50);

      const timer2 = setTimeout(() => {
        performScroll();
      }, 150);

      const timer3 = setTimeout(() => {
        requestAnimationFrame(performScroll);
      }, 100);

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