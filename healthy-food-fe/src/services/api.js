import axios from 'axios';
import { API_CONFIG } from '../constants';

const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
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
  
  // Batch API for adding multiple food logs
  addFoodLogsBatch: (logDataArray) => api.post('/food/logs/batch', { logs: logDataArray }),
  
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
  
  getPostById: (postId) => api.get(`/blog/posts/${postId}`),
  
  createPost: (postData) => api.post('/blog/posts', postData),
  
  updatePost: (postId, postData) => api.put(`/blog/posts/${postId}`, postData),
  
  deletePost: (postId) => api.delete(`/blog/posts/${postId}`),
  
  getComments: (postId, page = 1, limit = 10, sortBy = 'newest') => 
    api.get(`/blog/posts/${postId}/comments`, { 
      params: { page, limit, sort_by: sortBy } 
    }),
  
  createComment: (postId, commentData) => api.post(`/blog/posts/${postId}/comments`, commentData),
  
  updateComment: (commentId, commentData) => api.put(`/blog/comments/${commentId}`, commentData),
  
  deleteComment: (commentId) => api.delete(`/blog/comments/${commentId}`),
  
  getReplies: (commentId, page = 1, limit = 5) => 
    api.get(`/blog/comments/${commentId}/replies`, { params: { page, limit } }),
  
  createReply: (commentId, replyData) => api.post(`/blog/comments/${commentId}/replies`, replyData),
  
  updateReply: (replyId, replyData) => api.put(`/blog/replies/${replyId}`, replyData),
  
  deleteReply: (replyId) => api.delete(`/blog/replies/${replyId}`),
  
  likeComment: (commentId) => api.post(`/blog/comments/${commentId}/like`),
  
  unlikeComment: (commentId) => api.delete(`/blog/comments/${commentId}/like`),
  
  toggleCommentLike: (commentId) => api.post(`/blog/comments/${commentId}/like`),
  
  checkCommentLiked: (commentId) => api.get(`/blog/comments/${commentId}/like`),
  
  // Batch API for checking multiple comment likes
  checkCommentLikesBatch: (commentIds) => api.post('/blog/comments/likes/batch', { comment_ids: commentIds }),
  
  likePost: (postId) => api.post(`/blog/posts/${postId}/like`),
  
  unlikePost: (postId) => api.delete(`/blog/posts/${postId}/like`),
  
  checkPostLiked: (postId) => api.get(`/blog/posts/${postId}/like`),
  
  incrementViewCount: (postId) => api.post(`/blog/posts/${postId}/view`),
  
  getMyPosts: () => api.get('/blog/posts/my'),
  
  getMyPostsPaginated: (page = 1, limit = 10) => 
    api.get('/blog/posts/my', { params: { page, limit } }),
};

export default api; 