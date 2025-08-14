import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  
  login: (credentials) => api.post('/auth/login', credentials),
  
  getCurrentUser: () => api.get('/auth/profile'),
  
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { 
    email, 
    otp, 
    newPassword 
  }),
  
  uploadAvatar: (formData) => api.post('/auth/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  getBMIData: () => api.get('/auth/bmi'),
  
  saveBMIData: (bmiData) => api.post('/auth/bmi', bmiData),
};

export const foodAPI = {
  getCategories: () => api.get('/food/categories'),
  
  getItemsByCategory: (categoryId) => api.get(`/food/items/${categoryId}`),
  
  getAllItems: () => api.get('/food/items'),
  
  addFoodLog: (logData) => api.post('/food/log', logData),
  
  updateFoodLog: (logId, logData) => api.put(`/food/log/${logId}`, logData),
  
  getFoodLogs: (date) => api.get('/food/log', { params: { date } }),
  
  deleteFoodLog: (logId) => api.delete(`/food/log/${logId}`),
  
  getDailyStatistics: (date) => api.get('/food/statistics/daily', { params: { date } }),
  
  getWeeklyStatistics: (startDate, endDate) => api.get('/food/statistics/weekly', { 
    params: { start_date: startDate, end_date: endDate } 
  }),
  
  getMonthlyStatistics: (year, month) => api.get('/food/statistics/monthly', { 
    params: { year, month } 
  }),
};

export const blogAPI = {
  getAllPosts: () => api.get('/blog/posts'),
  
  getPostById: (id) => api.get(`/blog/posts/${id}`),
  
  createPost: (postData) => api.post('/blog/posts', postData),
  
  updatePost: (id, postData) => api.put(`/blog/posts/${id}`, postData),
  
  deletePost: (id) => api.delete(`/blog/posts/${id}`),
  
  toggleLike: (id) => api.post(`/blog/posts/${id}/like`),
  
  checkLiked: (id) => api.get(`/blog/posts/${id}/liked`),
  
  getPostsByCategory: (category) => api.get(`/blog/posts/category/${category}`),
  
  searchPosts: (query) => api.get(`/blog/posts/search/${query}`),
  
  getMyBlogs: () => api.get('/blog/my-blogs'),

  uploadImage: (formData) => api.post('/blog/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  syncLikesCount: () => api.post('/blog/sync-likes-count'),

  // View count API
  incrementViewCount: (id) => api.post(`/blog/posts/${id}/view`),

  // Comment APIs
  getComments: (postId, page = 1, limit = 10, sortBy = 'newest') => 
    api.get(`/blog/posts/${postId}/comments`, { params: { page, limit, sort: sortBy } }),
  
  createComment: (postId, commentData) => 
    api.post(`/blog/posts/${postId}/comments`, commentData),
  
  updateComment: (commentId, commentData) => 
    api.put(`/blog/comments/${commentId}`, commentData),
  
  deleteComment: (commentId) => 
    api.delete(`/blog/comments/${commentId}`),
  
  getReplies: (commentId, page = 1, limit = 5) => 
    api.get(`/blog/comments/${commentId}/replies`, { params: { page, limit } }),
  
  toggleCommentLike: (commentId) => 
    api.post(`/blog/comments/${commentId}/like`),
  
  checkCommentLiked: (commentId) => 
    api.get(`/blog/comments/${commentId}/liked`),
  
  syncCommentLikesCount: () => api.post('/blog/sync-comment-likes-count'),
};

export default api; 