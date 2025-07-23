import { useState } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const withLoading = async (asyncFunction) => {
    try {
      startLoading();
      return await asyncFunction();
    } finally {
      stopLoading();
    }
  };
  
  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}; 