import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigationScroll = () => {
  const navigate = useNavigate();

  const navigateWithScroll = useCallback((to) => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Navigate to trigger ScrollToTop component
    navigate(to);
  }, [navigate]);

  return navigateWithScroll;
}; 