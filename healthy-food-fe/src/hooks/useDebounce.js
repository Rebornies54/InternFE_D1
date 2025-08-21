import { useRef, useEffect } from 'react';

/**
 * Custom hook để debounce function calls
 * @param {Function} callback - Function cần debounce
 * @param {number} delay - Delay time (ms)
 * @returns {Function} - Debounced function
 */
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  
  return debouncedCallback;
};

export default useDebounce;