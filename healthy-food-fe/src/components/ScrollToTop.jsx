import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Chỉ scroll khi pathname thực sự thay đổi
    if (prevPathRef.current !== pathname) {
      const performScroll = () => {
        try {
          // Nếu có hash trong URL, scroll đến element đó
          if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              return;
            }
          }
          
          // Nếu không có hash, scroll lên đầu
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } catch (error) {
          // Fallback cho browser không support smooth scroll
          window.scrollTo(0, 0);
        }
      };

      // Đảm bảo DOM đã được render hoàn toàn trước khi scroll
      const timer = setTimeout(() => {
        requestAnimationFrame(performScroll);
      }, 150);

      prevPathRef.current = pathname;
      
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}