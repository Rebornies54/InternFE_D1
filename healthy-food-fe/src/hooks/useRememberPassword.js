import { useState, useEffect } from 'react';

const useRememberPassword = () => {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState(null);

  // Load saved credentials on component mount
  useEffect(() => {
    const saved = localStorage.getItem('rememberedCredentials');
    if (saved) {
      try {
        const credentials = JSON.parse(saved);
        setSavedCredentials(credentials);
        setRememberPassword(true);
      } catch (error) {
        console.error('Error parsing saved credentials:', error);
        localStorage.removeItem('rememberedCredentials');
      }
    }
  }, []);

  // Save credentials to localStorage
  const saveCredentials = (email, password) => {
    if (rememberPassword) {
      const credentials = { email, password };
      localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
    } else {
      localStorage.removeItem('rememberedCredentials');
    }
  };

  // Clear saved credentials
  const clearCredentials = () => {
    localStorage.removeItem('rememberedCredentials');
    setSavedCredentials(null);
    setRememberPassword(false);
  };

  return {
    rememberPassword,
    setRememberPassword,
    savedCredentials,
    saveCredentials,
    clearCredentials
  };
};

export default useRememberPassword;
