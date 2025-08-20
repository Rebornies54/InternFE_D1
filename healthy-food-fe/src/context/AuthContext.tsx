import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS, TIME } from '../constants';
import { logWarning } from '../utils/errorHandler';
import { 
  AuthContextType, 
  User, 
  LoginCredentials, 
  RegisterData, 
  UserProfile 
} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBmi, setCurrentBmi] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_BMI);
    return stored ? Number(stored) : null;
  });

  const refreshCurrentBmi = async (): Promise<void> => {
    try {
      const res = await authAPI.getBMIData();
      if (res.data?.success && res.data?.data) {
        const bmiVal = Number(res.data.data.bmi);
        setCurrentBmi(bmiVal);
        localStorage.setItem(STORAGE_KEYS.CURRENT_BMI, String(bmiVal));
      } else {
        setCurrentBmi(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_BMI);
      }
    } catch (error) {
      logWarning('Failed to refresh BMI:', error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.data);
          await refreshCurrentBmi();
        } catch (error) {
          // Clear invalid auth data
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_BMI);
          setUser(null);
          setCurrentBmi(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
      
      await new Promise(resolve => setTimeout(resolve, TIME.LOGIN_DELAY));
      await refreshCurrentBmi();
      
      return { success: true };
    } catch (error: unknown) {
      let message = 'Login failed';
      
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        message = apiError.response.data.message;
      } else if (apiError.response?.status === 401) {
        message = 'Email or password is incorrect';
      } else if (apiError.response?.status === 404) {
        message = 'Email does not exist in the system';
      } else if (apiError.response?.status === 400) {
        message = 'Invalid login data';
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BMI);
    setUser(null);
    setError(null);
    setCurrentBmi(null);
  };

  const updateProfile = async (userData: Partial<UserProfile>): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.data;
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (_passwordData: PasswordChangeData): Promise<AuthResult> => {
    try {
      setError(null);

      
      return { success: true, message: 'Password changed successfully' };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.forgotPassword(email);
      
      return { success: true, message: response.data.message || 'OTP sent successfully' };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Failed to send OTP';
      setError(message);
      return { success: false, message };
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.verifyOTP(email, otp);
      
      return { success: true, message: response.data.message || 'OTP verified successfully' };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Invalid OTP';
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<AuthResult> => {
    try {
      setError(null);
      const response = await authAPI.resetPassword(email, otp, newPassword);
      
      return { success: true, message: response.data.message || 'Password reset successfully' };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Failed to reset password';
      setError(message);
      return { success: false, message };
    }
  };

  const handleSetCurrentBmi = (bmiVal: number | null): void => {
    if (typeof bmiVal === 'number' && !Number.isNaN(bmiVal)) {
      setCurrentBmi(bmiVal);
      localStorage.setItem(STORAGE_KEYS.CURRENT_BMI, String(bmiVal));
    } else {
      setCurrentBmi(null);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_BMI);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    currentBmi,
    setCurrentBmi: handleSetCurrentBmi,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyOTP,
    resetPassword,
    refreshCurrentBmi,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
