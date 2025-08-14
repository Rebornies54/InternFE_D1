// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  API_ENDPOINT: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  BLOG_PAGE_SIZE: 8,
  COMMENT_PAGE_SIZE: 10,
  REPLY_PAGE_SIZE: 5,
  DASHBOARD_PAGE_SIZE: 10,
};

// Animation Configuration
export const ANIMATION = {
  DEFAULT_DURATION: 0.5,
  DEFAULT_DELAY: 0,
  STAGGER_DELAY: 0.1,
  PRIMARY_COLOR: '#2C7BE5',
  LOADING_SPINNER_SIZE: 40,
  PROGRESS_BAR_COLOR: '#2C7BE5',
};

// Validation Limits
export const VALIDATION = {
  MIN_AGE: 15,
  MAX_AGE: 80,
  MIN_WEIGHT: 1,
  MAX_WEIGHT: 70,
  MIN_HEIGHT: 1,
  MAX_HEIGHT: 300,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
};

// Local Storage Keys (Giữ nguyên keys cũ để đảm bảo backward compatibility)
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CURRENT_BMI: 'currentBmi',
  CALORIE_DATA: 'calorieCalculationData',
  BLOG_MENUS: 'blogExpandedMenus',
};

// Error Messages
export const ERROR_MESSAGES = {
  REGISTRATION_FAILED: 'Registration failed',
  UPDATE_FAILED: 'Update failed',
  PASSWORD_CHANGE_FAILED: 'Password change failed',
  OTP_SEND_FAILED: 'Failed to send OTP',
  INVALID_OTP: 'Invalid OTP',
  RESET_PASSWORD_FAILED: 'Failed to reset password',
  LOGIN_FAILED: 'Login failed',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
  FOOD_FETCH_FAILED: 'Failed to load food items',
  CATEGORY_FETCH_FAILED: 'Failed to load food categories',
  BLOG_FETCH_FAILED: 'Failed to load blog posts',
  LIKES_FETCH_FAILED: 'Failed to load likes',
  LIKE_TOGGLE_FAILED: 'Failed to update like',
  COMMENTS_FETCH_FAILED: 'Failed to load comments',
  COMMENT_CREATE_FAILED: 'Failed to create comment',
  COMMENT_UPDATE_FAILED: 'Failed to update comment',
  COMMENT_DELETE_FAILED: 'Failed to delete comment',
  REPLY_CREATE_FAILED: 'Failed to create reply',
  REPLY_TOGGLE_LIKE_FAILED: 'Failed to update reply like',
  DATE_FORMAT_ERROR: 'Error formatting date',
  SCROLL_ERROR: 'Error during scroll',
  IMAGE_LOAD_ERROR: 'Failed to load image',
};

// UI Constants
export const UI = {
  CALENDAR_DAYS_IN_VIEW: 42,
  DATE_FORMAT_PADDING: 2,
  DRAG_THRESHOLD: 100,
  MAX_HISTORY_ENTRIES: 10,
  OTP_LENGTH: 6,
  OTP_PLACEHOLDER: '000000',
};

// Blog Categories
export const BLOG_CATEGORIES = [
  { value: 'thực phẩm', label: 'Thực phẩm' },
  { value: 'thực đơn', label: 'Thực đơn' },
  { value: 'bí quyết', label: 'Bí quyết' },
  { value: 'câu chuyện', label: 'Câu chuyện' },
  { value: 'công thức', label: 'Công thức' },
];

// Default Values
export const DEFAULTS = {
  SELECTED_CATEGORY: 1,
  QUANTITY: 100,
  EDIT_QUANTITY: 100,
  EDIT_CALORIES: 0,
  CURRENT_PAGE: 1,
  ACTIVE_IMG: 0,
  PROGRESS: 0,
  ACTIVE_TAB: 'basic',
  CURRENT_STEP: 'email',
  TAB: 'profile',
  SORT_BY: 'newest',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  SUCCESS: 200,
  CREATED: 201,
};

// Time Constants
export const TIME = {
  MILLISECONDS_PER_HOUR: 1000 * 60 * 60,
  MILLISECONDS_PER_DAY: 1000 * 60 * 60 * 24,
  LOGIN_DELAY: 100,
  ANIMATION_DELAY: 100,
};

// BMI Categories
export const BMI_CATEGORIES = {
  UNDERWEIGHT: 'underweight',
  NORMAL: 'normal',
  OVERWEIGHT: 'overweight',
  OBESE: 'obese',
};

// Activity Levels
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHTLY_ACTIVE: 'lightly_active',
  MODERATELY_ACTIVE: 'moderately_active',
  VERY_ACTIVE: 'very_active',
  EXTREMELY_ACTIVE: 'extremely_active',
};
