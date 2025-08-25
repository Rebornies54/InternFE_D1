// Type definitions for constants
type ActivityLevel = 
  | 'Sedentary: Little or no exercise'
  | 'Lightly active: Light exercise/sports 1-3 days/week'
  | 'Moderately active: Moderate exercise/sports 3-5 days/week'
  | 'Very active: Hard exercise/sports 6-7 days a week'
  | 'Extra active: Very hard exercise/sports, physical job';

type Formula = 'mifflin' | 'harris' | 'katch';
type UnitSystem = 'metric' | 'imperial';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  API_ENDPOINT: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  BLOG_PAGE_SIZE: 8,
  COMMENT_PAGE_SIZE: 10,
  REPLY_PAGE_SIZE: 5,
  DASHBOARD_PAGE_SIZE: 10,
} as const;

export const DEFAULTS = {
  CURRENT_PAGE: 1,
  SELECTED_CATEGORY: '',
  QUANTITY: 100,
  EDIT_QUANTITY: 100,
  EDIT_CALORIES: 0,
  SORT_BY: 'newest' as const,
  ACTIVE_IMG: 0,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CURRENT_BMI: 'currentBmi',
  CALORIE_DATA: 'calorieCalculationData',
  BLOG_MENUS: 'blogExpandedMenus',
} as const;

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
} as const;

export const TIME = {
  LOGIN_DELAY: 100,
  ERROR_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 300,
  MILLISECONDS_PER_HOUR: 3600000, // 1 hour in milliseconds
  MILLISECONDS_PER_DAY: 86400000, // 1 day in milliseconds
  ANIMATION_DELAY: 100,
} as const;

export const ANIMATION = {
  DEFAULT_DURATION: 0.5,
  DEFAULT_DELAY: 0,
  STAGGER_DELAY: 0.1,
  PRIMARY_COLOR: '#2C7BE5',
  LOADING_SPINNER_SIZE: 40,
  PROGRESS_BAR_COLOR: '#2C7BE5',
} as const;

export const UI = {
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 100,
  DATE_FORMAT_PADDING: 2,
  CALENDAR_DAYS_IN_VIEW: 42,
} as const;

export const ACTIVITY_LEVELS: readonly ActivityLevel[] = [
  'Sedentary: Little or no exercise',
  'Lightly active: Light exercise/sports 1-3 days/week',
  'Moderately active: Moderate exercise/sports 3-5 days/week',
  'Very active: Hard exercise/sports 6-7 days a week',
  'Extra active: Very hard exercise/sports, physical job',
] as const;

export const FORMULAS: readonly Formula[] = [
  'mifflin',
  'harris',
  'katch',
] as const;

export const UNIT_SYSTEMS: readonly UnitSystem[] = [
  'metric',
  'imperial',
] as const;

export const BLOG_CATEGORIES = [
  { value: 'nutrition', label: 'Dinh dưỡng' },
  { value: 'recipes', label: 'Công thức' },
  { value: 'fitness', label: 'Thể dục' },
  { value: 'wellness', label: 'Sức khỏe' },
  { value: 'tips', label: 'Mẹo vặt' },
  { value: 'news', label: 'Tin tức' },
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
  MIN_AGE: 15,
  MAX_AGE: 80,
  MIN_WEIGHT: 1,
  MAX_WEIGHT: 70,
  MIN_HEIGHT: 1,
  MAX_HEIGHT: 300,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  COMMENT_MAX_LENGTH: 1000,
  POST_TITLE_MAX_LENGTH: 200,
  POST_CONTENT_MAX_LENGTH: 10000,
  FILE_MAX_SIZE: 5242880, // 5MB in bytes 
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

// Blog Component Constants
export const BLOG_TABS = {
  BLOG: 'blog',
  MENU: 'menu',
} as const;

export const BLOG_TAB_LABELS = {
  BLOG: 'Blog',
  MENU_LIST: 'Menu List',
} as const;

export const BLOG_HEADER = {
  BLOG_TITLE: 'Bí Quyết Ăn Uống Lành Mạnh',
  CREATE_BLOG_BUTTON: 'Viết Blog',
  CREATE_BLOG_TITLE: 'Viết blog mới',
  CREATE_BLOG_ARIA_LABEL: 'Tạo bài viết blog mới',
} as const;

export const BLOG_ACTIONS = {
  VIEW_DETAILS: 'Xem chi tiết',
  BACK_TO_FOODS: '← Quay lại danh sách thực phẩm',
  BACK_TO_LIST: '← Quay lại danh sách',
} as const;

// Blog Card Grid Constants
export const BLOG_CARD_GRID = {
  LOADING_TEXT: 'Đang tải bài viết...',
  NO_POSTS_MESSAGE: 'Không tìm thấy bài viết phù hợp với tiêu chí tìm kiếm của bạn.',
} as const;

// Food Components Constants
export const FOOD = {
  LOADING_TEXT: 'Đang tải danh sách thực phẩm...',
  NO_FOODS_MESSAGE: 'Không tìm thấy thực phẩm nào phù hợp với tiêu chí tìm kiếm.',
  NO_FOODS_SUGGESTION: 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.',
  PAGINATION_PREVIOUS: 'Previous',
  PAGINATION_NEXT: 'Next',
  PAGINATION_PAGE_INFO: 'Page',
  PAGINATION_OF: 'of',
  DETAILS_TITLE: 'Chi tiết',
  CALORIES_UNIT: 'cal',
  PROTEIN_UNIT: 'g protein',
  CARBS_UNIT: 'g carbs',
  FAT_UNIT: 'g fat',
  NUTRITION_TABLE_HEADERS: {
    FOOD: 'Food',
    SERVING: 'Serving',
    CALORIES: 'Calories',
  },
} as const;

export const FOOD_DESCRIPTION = {
  NUTRITION_RICH: 'rất giàu dinh dưỡng, chứa nhiều vitamin và khoáng chất.',
  CARB_DESCRIPTION: 'Mặc dù có hàm lượng carb cao hơn, những carbohydrate phức tạp giàu tinh bột này được chuyển hóa thành năng lượng và sẽ giúp bạn cảm thấy no lâu hơn.',
  CALORIE_TABLE_REFERENCE: 'Hãy xem Bảng Calorie',
  PRODUCT_REFERENCE: 'và Sản phẩm',
  MORE_INFO: 'của chúng tôi dưới đây để biết thêm thông tin dinh dưỡng.',
} as const;

// Create Blog Constants
export const CREATE_BLOG = {
  TITLE: 'Viết Blog mới',
  FORM_LABELS: {
    TITLE: 'Tiêu đề',
    DESCRIPTION: 'Mô tả',
    CONTENT: 'Nội dung',
    CATEGORY: 'Danh mục',
    IMAGE: 'Hình ảnh',
  },
  PLACEHOLDERS: {
    TITLE: 'Nhập tiêu đề bài viết...',
    DESCRIPTION: 'Mô tả ngắn gọn về bài viết...',
    CONTENT: 'Viết nội dung bài blog của bạn...',
  },
  BUTTONS: {
    SELECT_IMAGE: 'Chọn ảnh',
    REMOVE_IMAGE: 'Xóa ảnh',
    PUBLISH: 'Đăng bài',
    CANCEL: 'Hủy',
  },
  STATUS: {
    PUBLISHING: 'Đang đăng...',
    UPLOADING: 'Đang tải lên...',
  },
  VALIDATION: {
    TITLE_REQUIRED: 'Tiêu đề là bắt buộc',
    CONTENT_REQUIRED: 'Nội dung là bắt buộc',
    CATEGORY_REQUIRED: 'Danh mục là bắt buộc',
    IMAGE_SIZE_LIMIT: 'Kích thước ảnh không được vượt quá 5MB',
    IMAGE_FORMAT: 'Chỉ hỗ trợ định dạng JPG, PNG, GIF',
  },
  SUPPORT_TEXT: 'Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)',
  CLICK_TO_SELECT: 'Click để chọn ảnh',
} as const;

// Comment Component Constants
export const COMMENT = {
  SECTION_TITLE: 'Bình luận',
  NO_COMMENTS: 'Chưa có bình luận nào. Hãy là người đầu tiên bình luận!',
  LOADING_COMMENTS: 'Đang tải bình luận...',
  LOADING_MORE: 'Đang tải thêm...',
  LOAD_MORE: 'Tải thêm bình luận',
  NO_MORE_COMMENTS: 'Không còn bình luận nào',
  PLACEHOLDERS: {
    COMMENT: 'Viết bình luận...',
    REPLY: 'Viết trả lời...',
    EDIT_COMMENT: 'Chỉnh sửa bình luận...',
  },
  BUTTONS: {
    POST_COMMENT: 'Đăng bình luận',
    POSTING: 'Đang đăng...',
    REPLY: 'Trả lời',
    REPLYING: 'Đang trả lời...',
    EDIT: 'Chỉnh sửa',
    SAVE: 'Lưu',
    SAVING: 'Đang lưu...',
    CANCEL: 'Hủy',
    DELETE: 'Xóa',
    DELETING: 'Đang xóa...',
    SHOW_REPLIES: 'Xem trả lời',
    HIDE_REPLIES: 'Ẩn trả lời',
    SHOW_OPTIONS: 'Tùy chọn',
  },
  ACTIONS: {
    REPLY_TO: 'Trả lời',
    EDIT_COMMENT: 'Chỉnh sửa bình luận',
    DELETE_COMMENT: 'Xóa bình luận',
    SHOW_OPTIONS: 'Hiển thị tùy chọn',
  },
  MESSAGES: {
    COMMENT_POSTED: 'Bình luận đã được đăng thành công!',
    REPLY_POSTED: 'Trả lời đã được đăng thành công!',
    COMMENT_UPDATED: 'Bình luận đã được cập nhật!',
    COMMENT_DELETED: 'Bình luận đã được xóa!',
    LOGIN_REQUIRED: 'Vui lòng đăng nhập để bình luận',
    EMPTY_COMMENT: 'Bình luận không được để trống',
    EMPTY_REPLY: 'Trả lời không được để trống',
    DELETE_CONFIRMATION: 'Bạn có chắc chắn muốn xóa bình luận này?',
    TRY_AGAIN: 'Thử lại',
  },
  TIME: {
    JUST_NOW: 'Vừa xong',
    MINUTES_AGO: 'phút trước',
    HOURS_AGO: 'giờ trước',
    DAYS_AGO: 'ngày trước',
    WEEKS_AGO: 'tuần trước',
    MONTHS_AGO: 'tháng trước',
    YEARS_AGO: 'năm trước',
  },
  SORT: {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    MOST_LIKED: 'most_liked',
    LABELS: {
      NEWEST: 'Mới nhất',
      OLDEST: 'Cũ nhất',
      MOST_LIKED: 'Nhiều like nhất',
    },
  },
  REPLIES: {
    COUNT_TEXT: 'trả lời',
  },
} as const;

// BodyIndex Component Constants
export const BMI = {
  TITLE: 'Calorie Index (BMI) Calculation',
  HEIGHT_LABEL: 'Height (cm)',
  WEIGHT_LABEL: 'Weight (kg)',
  HEIGHT_PLACEHOLDER: 'Enter height',
  WEIGHT_PLACEHOLDER: 'Enter weight',
  CALCULATE_BUTTON: 'Calculate BMI',
  LOADING_TEXT: 'Loading your BMI data...',
  INFO_TEXT: "BMI is a measurement of a person's leanness or corpulence based on their height and weight.",
  RECOMMENDATIONS_TITLE: 'Recommended Dishes',
  NO_RECOMMENDATIONS: 'No recommendations available for your BMI category.',
  CALCULATE_FIRST: 'Calculate your BMI to see personalized food recommendations.',
} as const;

export const BMI_CATEGORY_CLASSES = {
  UNDERWEIGHT: 'underweight',
  NORMAL: 'normal',
  OVERWEIGHT: 'overweight',
  OBESE: 'obese',
} as const;

export const BMI_RANGE_LABELS = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Overweight',
  OBESE: 'Obese',
} as const;

export const BMI_RANGE_VALUES = {
  UNDERWEIGHT: '<18.5',
  NORMAL: '18.5-24.9',
  OVERWEIGHT: '25-29.9',
  OBESE: '>30',
} as const;

export const FOOD_CATEGORY_CLASSES = {
  MEAT: 'meat',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  DAIRY: 'dairy',
  SNACKS: 'snacks',
  DEFAULT: 'default',
} as const;

export const FOOD_CATEGORY_MAPPING = {
  1: 'meat',
  2: 'vegetables',
  3: 'fruits',
  4: 'grains',
  5: 'dairy',
  6: 'snacks',
} as const;

export const FOOD_FALLBACK_IMAGES = {
  MEAT: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
  VEGETABLES: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
  FRUITS: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
  GRAINS: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  DAIRY: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
  SNACKS: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
} as const;

export const CALORIE_CALCULATION = {
  TITLE: 'Calorie Calculation',
  TOTAL_CALORIES: 'total calories',
  CALORIES_PER_UNIT: 'cal per',
  GRAMS_UNIT: 'g',
  CALORIES_UNIT: 'cal',
  VIEW_DETAILS: 'View Details',
  ADD_TO_CALORIE: 'Add to Calorie Calc',
} as const;

export const NUTRITION_LABELS = {
  PROTEIN: 'Protein',
  FAT: 'Fat',
  CARBS: 'Carbs',
  FIBER: 'Fiber',
  CALORIES: 'Calories',
  CARBOHYDRATES: 'Carbohydrates',
} as const;

export const UI_TEXT = {
  
  LOADING: 'Loading...',
  UPLOADING: 'Uploading...',
  SELECT_IMAGE: 'Select Image',

  ENTER_EMAIL: 'Enter your email',
  ENTER_PASSWORD: 'Enter your password',
  ENTER_CURRENT_PASSWORD: 'Current password',
  ENTER_NEW_PASSWORD: 'New password',
  CONFIRM_NEW_PASSWORD: 'Confirm new password',
  ENTER_PHONE: 'Enter your phone number',
  ENTER_ADDRESS: 'Enter your address',
  ENTER_HEIGHT: 'Enter height...',
  ENTER_WEIGHT: 'Enter weight',
  ENTER_FULL_NAME: 'Full Name',
  ENTER_PHONE_NUMBER: 'Phone Number',

  ENTER_BLOG_TITLE: 'Nhập tiêu đề bài viết...',
  ENTER_BLOG_DESCRIPTION: 'Mô tả ngắn gọn về bài viết...',
  ENTER_BLOG_CONTENT: 'Viết nội dung bài blog của bạn...',
  ENTER_COMMENT: 'Viết bình luận...',
  EDIT_COMMENT: 'Chỉnh sửa bình luận...',
  ENTER_REPLY: 'Viết trả lời...',

  SEARCH_FOOD: 'Tìm kiếm thực phẩm...',
  SEARCH_POSTS: 'Tìm kiếm bài viết...',

  SELECT_DATE: 'Select date',
  DATE_FORMAT: 'DD.MM.YYYY',

  SELECT_GENDER: 'Select gender',
  SELECT_PROVINCE: 'Select province',
  SELECT_DISTRICT: 'Select district',

  QUANTITY_PLACEHOLDER: 'Quantity (g)',
  CALORIES_PLACEHOLDER: 'Calories',

  OTP_PLACEHOLDER: '000000',

  IMAGE_LOAD_FAILED: 'Avatar image failed to load. This might be due to server issues or file not found.',
  BMI_REFRESH_FAILED: 'Failed to refresh BMI',
  CATEGORIES_FETCH_FAILED: 'Error fetching categories',
  SCROLL_ERROR: 'Scroll to top error',
  FALLBACK_SCROLL_FAILED: 'Fallback scroll failed',
  FINAL_SCROLL_FAILED: 'Final scroll attempt failed',
  CREDENTIALS_PARSE_ERROR: 'Error parsing saved credentials',
  BLOG_IMAGE_LOAD_FAILED: 'Failed to load blog image',
  FOOD_IMAGE_LOAD_FAILED: 'Failed to load food image',
  MY_BLOG_IMAGE_LOAD_FAILED: 'Failed to load my blog image',

  COMMENTS_FETCH_ERROR: 'Error fetching comments',
  COMMENTS_LOAD_MORE_ERROR: 'Error loading more comments',
  COMMENT_CREATE_ERROR: 'Error creating comment',
  COMMENT_UPDATE_ERROR: 'Error updating comment',
  COMMENT_DELETE_ERROR: 'Error deleting comment',
  REPLY_CREATE_ERROR: 'Error creating reply',
  COMMENT_LIKE_TOGGLE_ERROR: 'Error toggling comment like',
  REPLY_LIKE_TOGGLE_ERROR: 'Error toggling reply like',
  
  // Blog specific text
  BLOG_IMAGE_PLACEHOLDER: 'Ảnh minh họa',
  ALL_CATEGORIES: 'Tất cả danh mục',
  BACK_TO_LIST: '← Quay lại danh sách',
  BY_AUTHOR: 'Bởi',
  FILTER_BY_CATEGORY: 'Lọc theo danh mục:',
  CLICK_TO_SELECT_IMAGE: 'Click để chọn ảnh',
  SUPPORT_FORMATS: 'Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)',
  CANCEL: 'Hủy',
  PUBLISHING: 'Đang đăng...',
  PUBLISH_POST: 'Đăng bài',
  PUBLISH_FAILED: 'Đăng bài thất bại. Vui lòng thử lại!',
  INVALID_IMAGE_FILE: 'Vui lòng chọn file ảnh hợp lệ',
  CONTENT: 'Nội dung',
  REMEMBER_PASSWORD: 'Lưu mật khẩu',
  FORGOT_PASSWORD: 'Forgot Password?',
  DONT_HAVE_ACCOUNT: "Don't have an account?",
  REGISTER_NOW: 'Register now',
  
  // Banner section
  BANNER_BADGE: 'Nền tảng dinh dưỡng #1 Việt Nam',
  BANNER_TITLE: 'Dinh dưỡng thông minh cho cuộc sống khỏe mạnh',
  BANNER_SUBTITLE: 'Công cụ theo dõi dinh dưỡng cá nhân hóa giúp bạn đạt được mục tiêu sức khỏe',
  BANNER_BMI_BUTTON: 'Kiểm tra BMI',
  BANNER_BLOG_BUTTON: 'Khám phá blog',
  BANNER_IMAGE_URL: 'https://cdn.pixabay.com/photo/2024/06/03/23/32/food-8807457_1280.jpg',
  
  // Menu carousel section
  MENU_BADGE: 'Được yêu thích',
  MENU_TITLE: 'Thực đơn gợi ý hôm nay',
  MENU_VIEW_ALL: 'Xem tất cả công thức',
  MENU_CARD_DETAILS: 'Xem chi tiết',
  
  // Features section
  FEATURES_BADGE: 'Tính năng',
  FEATURES_TITLE: 'Công cụ theo dõi dinh dưỡng thông minh',
  
  // Blog section
  BLOG_BADGE: 'Blog',
  BLOG_TITLE: 'Bài viết mới nhất',
  BLOG_VIEW_ALL: 'Xem tất cả bài viết',
  BLOG_READ_MORE: 'Đọc tiếp',
  BLOG_READING_TIME: '5 phút đọc',
  
  // Welcome section
  WELCOME_TITLE: 'Chào mừng trở lại!',
  WELCOME_BMI_LABEL: 'BMI hiện tại',
  WELCOME_CALORIE_LABEL: 'Calo mục tiêu',
  WELCOME_DAYS_LABEL: 'Ngày theo dõi',
  WELCOME_DASHBOARD_BUTTON: 'Dashboard của tôi',
  WELCOME_LOG_MEAL_BUTTON: 'Ghi chép bữa ăn',
  
  // Nutrition labels
  NUTRITION_PROTEIN: 'Protein',
  NUTRITION_CARBS: 'Carbs',
  NUTRITION_FATS: 'Fats',
  
  // Meal types
  MEAL_BREAKFAST: 'Bữa sáng',
  MEAL_LUNCH: 'Bữa trưa',
  MEAL_DINNER: 'Bữa tối',
  MEAL_SNACK: 'Bữa phụ',
} as const;

// Banner data
export const BANNER_DATA = [
  {
    id: 1,
    badge: 'Nền tảng dinh dưỡng #1 Việt Nam',
    title: 'Dinh dưỡng thông minh cho cuộc sống khỏe mạnh',
    subtitle: 'Công cụ theo dõi dinh dưỡng cá nhân hóa giúp bạn đạt được mục tiêu sức khỏe',
    image: 'https://cdn.pixabay.com/photo/2024/06/03/23/32/food-8807457_1280.jpg',
    primaryButton: 'Kiểm tra BMI',
    secondaryButton: 'Khám phá blog',
    primaryPath: '/home/body-index',
    secondaryPath: '/home/blog',
    layout: 'center'
  },
  {
    id: 2,
    badge: 'Thực phẩm tươi ngon',
    title: 'Khám phá thế giới ẩm thực lành mạnh',
    subtitle: 'Từ những nguyên liệu tươi ngon đến những công thức nấu ăn bổ dưỡng cho gia đình',
    image: 'https://cdn.pixabay.com/photo/2023/12/30/14/21/coffee-8478202_1280.jpg',
    primaryButton: 'Kiểm tra BMI',
    secondaryButton: 'Khám phá blog',
    primaryPath: '/home/body-index',
    secondaryPath: '/home/blog',
    layout: 'center'
  },
  {
    id: 3,
    badge: 'Trái cây theo mùa',
    title: 'Tận hưởng hương vị tự nhiên từ thiên nhiên',
    subtitle: 'Những loại trái cây tươi ngon giàu vitamin và khoáng chất cho sức khỏe tối ưu',
    image: 'https://cdn.pixabay.com/photo/2024/10/01/02/17/ai-generated-9087007_1280.jpg',
    primaryButton: 'Kiểm tra BMI',
    secondaryButton: 'Khám phá blog',
    primaryPath: '/home/body-index',
    secondaryPath: '/home/blog',
    layout: 'center'
  }
] as const;

// Menu items data
export const MENU_ITEMS = [
  {
    id: 1,
    title: "Cháo yến mạch trái cây",
    meal: "Bữa sáng",
    calories: "420 kcal",
    image: "https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg",
    nutrition: { protein: "15g", carbs: "60g", fats: "12g" },
    description: "Bữa sáng giàu chất xơ với yến mạch, táo, chuối và hạt chia"
  },
  {
    id: 2,
    title: "Salad gà nướng rau củ",
    meal: "Bữa trưa",
    calories: "650 kcal",
    image: "https://cdn.pixabay.com/photo/2024/02/02/12/34/lettuce-8548078_1280.jpg",
    nutrition: { protein: "40g", carbs: "45g", fats: "25g" },
    description: "Salad đầy đủ dinh dưỡng với ức gà nướng, bơ, cà chua và dầu olive"
  },
  {
    id: 3,
    title: "Cá hồi nướng với khoai lang",
    meal: "Bữa tối",
    calories: "520 kcal",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg",
    nutrition: { protein: "35g", carbs: "40g", fats: "22g" },
    description: "Cá hồi giàu omega-3 với khoai lang nướng và rau xanh hấp"
  },
  {
    id: 4,
    title: "Smoothie bowl trái cây",
    meal: "Bữa phụ",
    calories: "280 kcal",
    image: "https://cdn.pixabay.com/photo/2024/02/27/06/18/ai-generated-8599511_1280.jpg",
    nutrition: { protein: "8g", carbs: "45g", fats: "8g" },
    description: "Smoothie bowl tươi mát với các loại trái cây theo mùa"
  },
  {
    id: 5,
    title: "Bánh mì nguyên cám trứng và bơ",
    meal: "Bữa sáng",
    calories: "450 kcal",
    image: "https://cdn.pixabay.com/photo/2020/03/23/16/56/homemade-4961416_1280.jpg",
    nutrition: { protein: "20g", carbs: "35g", fats: "22g" },
    description: "Bữa sáng tiện lợi với bánh mì nguyên cám, trứng luộc và bơ chín"
  },
  {
    id: 6,
    title: "Bún thịt nướng rau sống",
    meal: "Bữa trưa",
    calories: "680 kcal",
    image: "https://cdn.pixabay.com/photo/2024/04/23/09/25/ai-generated-8714496_1280.jpg",
    nutrition: { protein: "32g", carbs: "55g", fats: "28g" },
    description: "Món ăn truyền thống Việt với thịt nướng, bún và rau sống tươi"
  },
  {
    id: 7,
    title: "Súp bí đỏ hạt quinoa",
    meal: "Bữa tối",
    calories: "350 kcal",
    image: "https://cdn.pixabay.com/photo/2021/09/27/19/13/pumpkin-6662081_1280.jpg",
    nutrition: { protein: "12g", carbs: "40g", fats: "10g" },
    description: "Súp ấm nhẹ nhàng với bí đỏ, hạt quinoa, sữa hạt và gia vị tự nhiên — ít béo, dễ tiêu"
  },
  {
    id: 8,
    title: "Bowl sữa chua Hy Lạp và granola",
    meal: "Bữa phụ",
    calories: "290 kcal",
    image: "https://cdn.pixabay.com/photo/2019/08/17/16/42/granola-4412584_1280.jpg",
    nutrition: { protein: "17g", carbs: "28g", fats: "10g" },
    description: "Bữa phụ nhẹ nhàng với sữa chua Hy Lạp ít đường, granola homemade và trái cây tươi"
  }
] as const;

// Features data
export const FEATURES_DATA = [
  {
    icon: 'Target',
    title: "BMI Calculator",
    description: "Theo dõi chỉ số BMI và nhận lời khuyên dinh dưỡng được cá nhân hóa",
    path: "/home/body-index"
  },
  {
    icon: 'BarChart3',
    title: "Calorie Tracking",
    description: "Ghi chép và theo dõi lượng calo tiêu thụ hàng ngày dễ dàng",
    path: "/home/calorie-index",
    iconClass: "secondary"
  },
  {
    icon: 'Calendar',
    title: "Food Log",
    description: "Lưu trữ lịch sử ăn uống và phân tích dinh dưỡng chi tiết",
    path: "/home/calorie-calculation",
    iconClass: "accent"
  },
  {
    icon: 'BookOpen',
    title: "Blog Community",
    description: "Chia sẻ kiến thức và kinh nghiệm về dinh dưỡng cùng cộng đồng",
    path: "/home/blog",
    iconClass: "quaternary"
  }
] as const;

// Welcome section data
export const WELCOME_STATS = {
  TARGET_CALORIES: 1850,
  TRACKING_DAYS: 15
} as const;
