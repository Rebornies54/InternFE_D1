import { useState } from 'react';

export const useError = (initialState = '') => {
  const [error, setError] = useState(initialState);
  
  const clearError = () => setError('');
  const setErrorMessage = (message) => setError(message);
  
  return {
    error,
    setError,
    clearError,
    setErrorMessage
  };
}; 