import { ErrorMessages, StorageKeys, PaginationDefaults, TimeConstants, ActivityLevel, Formula, UnitSystem, BlogCategory } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: PaginationDefaults.DEFAULT_PAGE_SIZE,
  COMMENT_PAGE_SIZE: PaginationDefaults.COMMENT_PAGE_SIZE,
  REPLY_PAGE_SIZE: PaginationDefaults.REPLY_PAGE_SIZE,
} as const;

export const DEFAULTS = {
  CURRENT_PAGE: 1,
  SELECTED_CATEGORY: '',
  QUANTITY: 100,
  EDIT_QUANTITY: 100,
  EDIT_CALORIES: 0,
  SORT_BY: 'newest' as const,
} as const;

export const STORAGE_KEYS = {
  TOKEN: StorageKeys.TOKEN,
  USER: StorageKeys.USER,
  CURRENT_BMI: StorageKeys.CURRENT_BMI,
  CALORIE_DATA: StorageKeys.CALORIE_DATA,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: ErrorMessages.NETWORK_ERROR,
  FOOD_FETCH_FAILED: ErrorMessages.FOOD_FETCH_FAILED,
  CATEGORY_FETCH_FAILED: ErrorMessages.CATEGORY_FETCH_FAILED,
  BLOG_FETCH_FAILED: ErrorMessages.BLOG_FETCH_FAILED,
  COMMENTS_FETCH_FAILED: ErrorMessages.COMMENTS_FETCH_FAILED,
  REPLIES_FETCH_FAILED: ErrorMessages.REPLIES_FETCH_FAILED,
  COMMENT_CREATE_FAILED: ErrorMessages.COMMENT_CREATE_FAILED,
  COMMENT_UPDATE_FAILED: ErrorMessages.COMMENT_UPDATE_FAILED,
  COMMENT_DELETE_FAILED: ErrorMessages.COMMENT_DELETE_FAILED,
  LIKES_FETCH_FAILED: ErrorMessages.LIKES_FETCH_FAILED,
  LIKE_TOGGLE_FAILED: ErrorMessages.LIKE_TOGGLE_FAILED,
} as const;

export const TIME = {
  LOGIN_DELAY: TimeConstants.LOGIN_DELAY,
  ERROR_TIMEOUT: TimeConstants.ERROR_TIMEOUT,
  DEBOUNCE_DELAY: TimeConstants.DEBOUNCE_DELAY,
} as const;

// UI constants
export const UI = {
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 100,
} as const;

// Activity levels for calorie calculation
export const ACTIVITY_LEVELS: readonly ActivityLevel[] = [
  'Sedentary: Little or no exercise',
  'Lightly active: Light exercise/sports 1-3 days/week',
  'Moderately active: Moderate exercise/sports 3-5 days/week',
  'Very active: Hard exercise/sports 6-7 days a week',
  'Extra active: Very hard exercise/sports, physical job',
] as const;

// Formulas for calorie calculation
export const FORMULAS: readonly Formula[] = [
  'mifflin',
  'harris',
  'katch',
] as const;

export const UNIT_SYSTEMS: readonly UnitSystem[] = [
  'metric',
  'imperial',
] as const;

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'nutrition',
  'recipes',
  'fitness',
  'wellness',
  'tips',
  'news',
] as const;

export const BMI_CATEGORIES = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal weight',
  OVERWEIGHT: 'Overweight',
  OBESE: 'Obese',
} as const;

export const BMI_RANGES = {
  UNDERWEIGHT: { min: 0, max: 18.4 },
  NORMAL: { min: 18.5, max: 24.9 },
  OVERWEIGHT: { min: 25.0, max: 29.9 },
  OBESE: { min: 30.0, max: 100 },
} as const;

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  'Sedentary: Little or no exercise': 1.2,
  'Lightly active: Light exercise/sports 1-3 days/week': 1.375,
  'Moderately active: Moderate exercise/sports 3-5 days/week': 1.55,
  'Very active: Hard exercise/sports 6-7 days a week': 1.725,
  'Extra active: Very hard exercise/sports, physical job': 1.9,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  COMMENT_MAX_LENGTH: 1000,
  POST_TITLE_MAX_LENGTH: 200,
  POST_CONTENT_MAX_LENGTH: 10000,
  FILE_MAX_SIZE: 5 * 1024 * 1024, 
} as const;

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'most_liked', label: 'Nhiều like nhất' },
] as const;

export const CHART_COLORS = {
  PRIMARY: '#2196f3',
  SECONDARY: '#9c27b0',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#00bcd4',
} as const;

export const THEME_COLORS = {
  PRIMARY: '#2196f3',
  SECONDARY: '#9c27b0',
  BACKGROUND: '#ffffff',
  SURFACE: '#f5f5f5',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#e0e0e0',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const;

export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1200,
} as const;

export const Z_INDEX = {
  MODAL: 1000,
  DROPDOWN: 100,
  TOOLTIP: 200,
  HEADER: 50,
  FOOTER: 10,
} as const;
