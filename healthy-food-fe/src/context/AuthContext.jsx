import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBmi, setCurrentBmi] = useState(() => {
    const stored = localStorage.getItem('currentBmi');
    return stored ? Number(stored) : null;
  });

  const refreshCurrentBmi = async () => {
    try {
      const res = await authAPI.getBMIData();
      if (res.data?.success && res.data?.data) {
        const bmiVal = Number(res.data.data.bmi);
        setCurrentBmi(bmiVal);
        localStorage.setItem('currentBmi', String(bmiVal));
      } else {
        setCurrentBmi(null);
        localStorage.removeItem('currentBmi');
      }
    } catch (_) {
      // ignore
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.data);
          await refreshCurrentBmi();
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('currentBmi');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      await refreshCurrentBmi();
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = 'Email or password is incorrect';
      } else if (error.response?.status === 404) {
        message = 'Email does not exist in the system';
      } else if (error.response?.status === 400) {
        message = 'Invalid login data';
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentBmi');
    setUser(null);
    setError(null);
    setCurrentBmi(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await authAPI.changePassword(passwordData);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authAPI.forgotPassword(email);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      setError(message);
      return { success: false, message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      const response = await authAPI.verifyOTP(email, otp);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      setError(null);
      const response = await authAPI.resetPassword(email, otp, newPassword);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    currentBmi,
    setCurrentBmi: (bmiVal) => {
      if (typeof bmiVal === 'number' && !Number.isNaN(bmiVal)) {
        setCurrentBmi(bmiVal);
        localStorage.setItem('currentBmi', String(bmiVal));
      } else {
        setCurrentBmi(null);
        localStorage.removeItem('currentBmi');
      }
    },
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyOTP,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider }; 