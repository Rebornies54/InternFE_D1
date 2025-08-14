import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigationScroll = () => {
  const navigate = useNavigate();

  const navigateWithScroll = useCallback((to) => {
    window.scrollTo(0, 0);
    
    navigate(to);
  }, [navigate]);

  return navigateWithScroll;
}; 