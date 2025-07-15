import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only scroll when pathname actually changes
    if (prevPathRef.current !== pathname) {
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
        } catch {
          // Fallback for browsers that don't support smooth scroll
          window.scrollTo(0, 0);
        }
      };

      // Ensure DOM is fully rendered before scrolling
      const timer = setTimeout(() => {
        requestAnimationFrame(performScroll);
      }, 150);

      prevPathRef.current = pathname;
      
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}