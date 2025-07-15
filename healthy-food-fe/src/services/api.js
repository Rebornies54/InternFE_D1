import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register
  register: (userData) => api.post('/auth/register', userData),
  
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user info
  getCurrentUser: () => api.get('/auth/profile'),
  
  // Update profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Change password
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  
  // Upload avatar
  uploadAvatar: (formData) => api.post('/auth/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Food API
export const foodAPI = {
  // Get all categories
  getCategories: () => api.get('/food/categories'),
  
  // Get food items by category
  getItemsByCategory: (categoryId) => api.get(`/food/items/${categoryId}`),
  
  // Get all food items
  getAllItems: () => api.get('/food/items'),
  
  // Add food log
  addFoodLog: (logData) => api.post('/food/log', logData),
  
  // Update food log
  updateFoodLog: (logId, logData) => api.put(`/food/log/${logId}`, logData),
  
  // Get user's food logs
  getFoodLogs: (date) => api.get('/food/log', { params: { date } }),
  
  // Delete food log
  deleteFoodLog: (logId) => api.delete(`/food/log/${logId}`),
  
  // Get daily statistics
  getDailyStatistics: (date) => api.get('/food/statistics/daily', { params: { date } }),
  
  // Get weekly statistics
  getWeeklyStatistics: (startDate, endDate) => api.get('/food/statistics/weekly', { 
    params: { start_date: startDate, end_date: endDate } 
  }),
  
  // Get monthly statistics
  getMonthlyStatistics: (year, month) => api.get('/food/statistics/monthly', { 
    params: { year, month } 
  }),
};

export default api; 