import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  BMIData,
  BMICalculationData,
  FoodCategory,
  FoodItem,
  FoodLog,
  FoodLogData,
  FoodLogBatchData,
  DailyStatistics,
  WeeklyStatistics,
  MonthlyStatistics,
  BlogPost,
  BlogPostData,
  BlogComment,
  BlogReply,
  CommentData,
  ReplyData,
  CommentsResponse,
  RepliesResponse,
  LikeResponse,
  BatchLikeResponse,
  PaginatedResponse
} from '../types';

// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (response: AxiosResponse) => {
    return response;
  },
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
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', credentials),

  register: (userData: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', userData),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/auth/me'),

  updateProfile: (userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/auth/profile', userData),

  uploadAvatar: (formData: FormData): Promise<AxiosResponse<ApiResponse<{ avatarUrl: string }>>> =>
    api.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getBMIData: (): Promise<AxiosResponse<ApiResponse<BMIData>>> =>
    api.get('/auth/bmi'),

  saveBMIData: (bmiData: BMICalculationData): Promise<AxiosResponse<ApiResponse<BMIData>>> =>
    api.post('/auth/bmi', bmiData),

  forgotPassword: (email: string): Promise<AxiosResponse<ApiResponse<{ otp: string }>>> =>
    api.post('/auth/forgot-password', { email }),

  verifyOTP: (email: string, otp: string): Promise<AxiosResponse<ApiResponse<{ verified: boolean }>>> =>
    api.post('/auth/verify-otp', { email, otp }),

  resetPassword: (email: string, otp: string, newPassword: string): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
};

// Food API
export const foodAPI = {
  getCategories: (): Promise<AxiosResponse<ApiResponse<FoodCategory[]>>> =>
    api.get('/food/categories'),

  getItemsByCategory: (categoryId: number): Promise<AxiosResponse<ApiResponse<FoodItem[]>>> =>
    api.get(`/food/items/${categoryId}`),

  getAllItems: (): Promise<AxiosResponse<ApiResponse<FoodItem[]>>> =>
    api.get('/food/items'),

  addFoodLog: (logData: FoodLogData): Promise<AxiosResponse<ApiResponse<FoodLog>>> =>
    api.post('/food/log', logData),

  // Batch API for adding multiple food logs
  addFoodLogsBatch: (logDataArray: FoodLogBatchData): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.post('/food/logs/batch', logDataArray),

  updateFoodLog: (logId: number, logData: Partial<FoodLogData>): Promise<AxiosResponse<ApiResponse<FoodLog>>> =>
    api.put(`/food/log/${logId}`, logData),

  getFoodLogs: (date: string): Promise<AxiosResponse<ApiResponse<FoodLog[]>>> =>
    api.get('/food/log', { params: { date } }),

  deleteFoodLog: (logId: number): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.delete(`/food/log/${logId}`),

  getDailyStatistics: (date: string): Promise<AxiosResponse<ApiResponse<DailyStatistics>>> =>
    api.get('/food/statistics/daily', { params: { date } }),

  getWeeklyStatistics: (startDate?: string, endDate?: string): Promise<AxiosResponse<ApiResponse<WeeklyStatistics>>> =>
    api.get('/food/statistics/weekly', { 
      params: { start_date: startDate, end_date: endDate } 
    }),

  getMonthlyStatistics: (year: number, month: number): Promise<AxiosResponse<ApiResponse<MonthlyStatistics>>> =>
    api.get('/food/statistics/monthly', { 
      params: { year, month } 
    }),
};

// Blog API
export const blogAPI = {
  getAllPosts: (): Promise<AxiosResponse<ApiResponse<BlogPost[]>>> =>
    api.get('/blog/posts'),

  getPostById: (postId: number): Promise<AxiosResponse<ApiResponse<BlogPost>>> =>
    api.get(`/blog/posts/${postId}`),

  createPost: (postData: BlogPostData): Promise<AxiosResponse<ApiResponse<BlogPost>>> =>
    api.post('/blog/posts', postData),

  updatePost: (postId: number, postData: Partial<BlogPostData>): Promise<AxiosResponse<ApiResponse<BlogPost>>> =>
    api.put(`/blog/posts/${postId}`, postData),

  deletePost: (postId: number): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.delete(`/blog/posts/${postId}`),

  getComments: (postId: number, page: number = 1, limit: number = 10, sortBy: string = 'newest'): Promise<AxiosResponse<CommentsResponse>> =>
    api.get(`/blog/posts/${postId}/comments`, { 
      params: { page, limit, sort_by: sortBy } 
    }),

  createComment: (postId: number, commentData: CommentData): Promise<AxiosResponse<ApiResponse<BlogComment>>> =>
    api.post(`/blog/posts/${postId}/comments`, commentData),

  updateComment: (commentId: number, commentData: CommentData): Promise<AxiosResponse<ApiResponse<BlogComment>>> =>
    api.put(`/blog/comments/${commentId}`, commentData),

  deleteComment: (commentId: number): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.delete(`/blog/comments/${commentId}`),

  getReplies: (commentId: number, page: number = 1, limit: number = 5): Promise<AxiosResponse<RepliesResponse>> =>
    api.get(`/blog/comments/${commentId}/replies`, { params: { page, limit } }),

  createReply: (commentId: number, replyData: ReplyData): Promise<AxiosResponse<ApiResponse<BlogReply>>> =>
    api.post(`/blog/comments/${commentId}/replies`, replyData),

  updateReply: (replyId: number, replyData: ReplyData): Promise<AxiosResponse<ApiResponse<BlogReply>>> =>
    api.put(`/blog/replies/${replyId}`, replyData),

  deleteReply: (replyId: number): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.delete(`/blog/replies/${replyId}`),

  likeComment: (commentId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.post(`/blog/comments/${commentId}/like`),

  unlikeComment: (commentId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.delete(`/blog/comments/${commentId}/like`),

  checkCommentLiked: (commentId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.get(`/blog/comments/${commentId}/like`),

  // Batch API for checking multiple comment likes
  checkCommentLikesBatch: (commentIds: number[]): Promise<AxiosResponse<BatchLikeResponse>> =>
    api.post('/blog/comments/likes/batch', { comment_ids: commentIds }),

  likePost: (postId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.post(`/blog/posts/${postId}/like`),

  unlikePost: (postId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.delete(`/blog/posts/${postId}/like`),

  checkPostLiked: (postId: number): Promise<AxiosResponse<LikeResponse>> =>
    api.get(`/blog/posts/${postId}/like`),

  incrementViewCount: (postId: number): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.post(`/blog/posts/${postId}/view`),

  getMyPosts: (): Promise<AxiosResponse<ApiResponse<BlogPost[]>>> =>
    api.get('/blog/posts/my'),

  getMyPostsPaginated: (page: number = 1, limit: number = 10): Promise<AxiosResponse<PaginatedResponse<BlogPost>>> =>
    api.get('/blog/posts/my', { params: { page, limit } }),
};

export default api;
