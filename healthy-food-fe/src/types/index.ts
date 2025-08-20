
// Branded types for better type safety
export type UserId = number & { readonly brand: unique symbol };
export type FoodId = number & { readonly brand: unique symbol };
export type BlogId = number & { readonly brand: unique symbol };

// Strict null types
export type NonNullableString = string & { readonly brand: unique symbol };
export type NonNullableNumber = number & { readonly brand: unique symbol };

// Domain-specific types
export type Email = string & { readonly brand: unique symbol };
export type Password = string & { readonly brand: unique symbol };
export type PhoneNumber = string & { readonly brand: unique symbol };
export type DateString = string & { readonly brand: unique symbol };

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthday?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  avatar?: string;
  birthdayDay?: string;
  birthdayMonth?: string;
  birthdayYear?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthday?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface FoodCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  image_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodLog {
  id: number;
  user_id: number;
  food_item_id: number;
  food_name: string;
  quantity: number;
  calories: number;
  log_date: string;
  created_at: string;
  updated_at: string;
}

export interface FoodLogData {
  food_item_id: number;
  quantity: number;
  calories: number;
  log_date: string;
}

export interface FoodLogBatchData {
  logs: FoodLogData[];
}

export interface BMIData {
  id: number;
  user_id: number;
  height: number;
  weight: number;
  bmi: number;
  bmi_category: string;
  created_at: string;
  updated_at: string;
}

export interface BMICalculationData {
  height: number;
  weight: number;
  bmi: number;
  bmi_category: string;
}

export interface BlogPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  date?: string;
  author?: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export interface BlogPostData {
  title: string;
  content: string;
  category: string;
  image_url?: string;
}

export interface BlogComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export interface BlogReply {
  id: number;
  comment_id: number;
  user_id: number;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export interface CommentData {
  content: string;
}

export interface ReplyData {
  content: string;
}

export interface DailyStatistics {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  total_fiber: number;
  food_count: number;
  top_foods: Array<{
    food_name: string;
    total_calories: number;
    total_quantity: number;
  }>;
}

export interface WeeklyStatistics {
  total_calories: number;
  average_daily_calories: number;
  daily_breakdown: Array<{
    log_date: string;
    daily_calories: number;
  }>;
}

export interface MonthlyStatistics {
  total_calories: number;
  average_daily_calories: number;
  weekly_breakdown: Array<{
    week_start: string;
    week_end: string;
    weekly_calories: number;
  }>;
  category_breakdown: Array<{
    category_name: string;
    total_calories: number;
    percentage: number;
  }>;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CommentPagination extends Pagination {
  total_comments: number;
}

export interface ReplyPagination extends Pagination {
  total_replies: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface CommentsResponse extends ApiResponse<{
  comments: BlogComment[];
  pagination: CommentPagination;
}> {}

export interface RepliesResponse extends ApiResponse<{
  replies: BlogReply[];
  pagination: ReplyPagination;
}> {}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  message?: string;
}

export interface BatchLikeResponse {
  success: boolean;
  data: {
    likedCommentIds: number[];
  };
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface LoadingState {
  loading: boolean;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export interface ErrorState {
  error: string | null;
  setError: (error: string) => void;
  clearError: () => void;
}

export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  currentBmi: number | null;
  setCurrentBmi: (bmiVal: number | null) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  updateProfile: (userData: Partial<UserProfile>) => Promise<{ success: boolean; user?: User; message?: string }>;
  changePassword: (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  refreshCurrentBmi: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface PendingFoodItem extends FoodItem {
  quantity: number;
}

export interface FoodContextType {
  pendingFoods: PendingFoodItem[];
  addToPendingFoods: (food: FoodItem, quantity?: number) => void;
  removeFromPendingFoods: (foodId: number) => void;
  updatePendingFoodQuantity: (foodId: number, quantity: number) => void;
  clearPendingFoods: () => void;
  getPendingTotalCalories: () => number;
}

export interface BlogContextType {
  posts: BlogPost[];
  postsLoading: boolean;
  userLikes: Set<number>;
  foodItems: FoodItem[];
  foodCategories: FoodCategory[];
  loading: boolean;
  error: string | null;
  comments: BlogComment[];
  commentsLoading: boolean;
  replies: Record<number, BlogReply[]>;
  repliesLoading: Record<number, boolean>;
  commentPagination: CommentPagination;
  commentLikes: Set<number>;
  replyLikes: Record<number, Set<number>>;
  repliesPagination: Record<number, ReplyPagination>;
  toggleLike: (postId: number) => Promise<void>;
  fetchComments: (postId: number, page?: number, limit?: number) => Promise<void>;
  createComment: (postId: number, commentData: CommentData) => Promise<{ success: boolean; comment?: BlogComment; message?: string }>;
  updateComment: (commentId: number, commentData: CommentData) => Promise<{ success: boolean; comment?: BlogComment; message?: string }>;
  deleteComment: (commentId: number) => Promise<{ success: boolean; message?: string }>;
  fetchReplies: (commentId: number, page?: number, limit?: number) => Promise<void>;
  toggleCommentLike: (commentId: number) => Promise<void>;
  clearComments: () => void;
  incrementViewCount: (postId: number) => Promise<void>;
}

export interface CalorieContextType {
  calorieData: {
    age: number;
    gender: Gender;
    height: number;
    weight: number;
    activityLevel: ActivityLevel;
    bodyFat: string;
    formula: Formula;
    unitSystem: UnitSystem;
    tdee: number;
    bmr: number;
    showResults: boolean;
    calculatedDate: string | null;
    history: Array<{
      date: string;
      weight: number;
      height: number;
      age: number;
      gender: Gender;
      activityLevel: ActivityLevel;
      bmr: number;
      tdee: number;
    }>;
  };
  updateCalorieData: (newData: Partial<CalorieContextType['calorieData']>) => void;
  resetCalorieData: () => void;
  performCalculation: () => { success: boolean; bmr?: number; tdee?: number; message?: string };
  getCalorieGoals: (tdee: number) => {
    maintenance: number;
    weightLoss: { mild: number; moderate: number; aggressive: number };
    weightGain: { mild: number; moderate: number; aggressive: number };
  };
  calculateBMR: (data: CalorieContextType['calorieData']) => { success: boolean; bmr?: number; message?: string };
  calculateTDEE: (bmr: number, activityLevel: ActivityLevel) => number;
  convertUnits: (unitSystem: UnitSystem) => void;
}

export interface FormEvent {
  target: {
    value: string;
    name: string;
  };
}

export interface FileEvent {
  target: {
    files: FileList | null;
  };
}

export interface MouseEvent {
  target: EventTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel = 
  | 'Sedentary: Little or no exercise'
  | 'Lightly active: Light exercise/sports 1-3 days/week'
  | 'Moderately active: Moderate exercise/sports 3-5 days/week'
  | 'Very active: Hard exercise/sports 6-7 days a week'
  | 'Extra active: Very hard exercise/sports, physical job';

export type Formula = 'mifflin' | 'harris' | 'katch';

export type UnitSystem = 'metric' | 'imperial';

export type SortOrder = 'newest' | 'oldest' | 'most_liked';

export type BlogCategory = 
  | 'nutrition'
  | 'recipes'
  | 'fitness'
  | 'wellness'
  | 'tips'
  | 'news';

export enum ErrorMessages {
  NETWORK_ERROR = 'Network error. Please check your connection.',
  FOOD_FETCH_FAILED = 'Failed to fetch food data.',
  CATEGORY_FETCH_FAILED = 'Failed to fetch categories.',
  BLOG_FETCH_FAILED = 'Failed to fetch blog posts.',
  COMMENTS_FETCH_FAILED = 'Failed to fetch comments.',
  REPLIES_FETCH_FAILED = 'Failed to fetch replies.',
  COMMENT_CREATE_FAILED = 'Failed to create comment.',
  COMMENT_UPDATE_FAILED = 'Failed to update comment.',
  COMMENT_DELETE_FAILED = 'Failed to delete comment.',
  LIKES_FETCH_FAILED = 'Failed to fetch likes.',
  LIKE_TOGGLE_FAILED = 'Failed to toggle like.',
}

export enum StorageKeys {
  TOKEN = 'token',
  USER = 'user',
  CURRENT_BMI = 'currentBmi',
  CALORIE_DATA = 'calorieData',
}

export enum PaginationDefaults {
  DEFAULT_PAGE_SIZE = 10,
  COMMENT_PAGE_SIZE = 10,
  REPLY_PAGE_SIZE = 5,
}

export enum TimeConstants {
  LOGIN_DELAY = 1000,
  ERROR_TIMEOUT = 5000,
  DEBOUNCE_DELAY = 300,
}
