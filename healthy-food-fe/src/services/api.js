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
  
  // Get user's BMI data
  getBMIData: () => api.get('/auth/bmi'),
  
  // Save/Update user's BMI data
  saveBMIData: (bmiData) => api.post('/auth/bmi', bmiData),
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

// Blog API
export const blogAPI = {
  // Get all posts
  getAllPosts: () => api.get('/blog/posts'),
  
  // Get post by ID
  getPostById: (id) => api.get(`/blog/posts/${id}`),
  
  // Create new post
  createPost: (postData) => api.post('/blog/posts', postData),
  
  // Update post
  updatePost: (id, postData) => api.put(`/blog/posts/${id}`, postData),
  
  // Delete post
  deletePost: (id) => api.delete(`/blog/posts/${id}`),
  
  // Like/Unlike post
  toggleLike: (id) => api.post(`/blog/posts/${id}/like`),
  
  // Check if user liked post
  checkLiked: (id) => api.get(`/blog/posts/${id}/liked`),
  
  // Get posts by category
  getPostsByCategory: (category) => api.get(`/blog/posts/category/${category}`),
  
  // Search posts
  searchPosts: (query) => api.get(`/blog/posts/search/${query}`),

  // Upload blog image
  uploadImage: (formData) => api.post('/blog/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api; 