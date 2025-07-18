import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTopTest() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('ScrollToTopTest: Pathname changed to:', pathname);
    console.log('ScrollToTopTest: Current scroll position:', window.scrollY);
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    console.log('ScrollToTopTest: After scroll to top:', window.scrollY);
  }, [pathname]);

  return null;
} 