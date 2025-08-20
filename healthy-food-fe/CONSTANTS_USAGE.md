# Hướng Dẫn Sử Dụng Constants và Error Handling

## Tổng Quan

Project đã được tối ưu hóa hoàn toàn:
- **Console.log statements** - Đã được thay thế bằng error handler
- **Hard code values** - Đã được chuyển vào constants
- **TypeScript support** - Đã được implement với type safety
- **ESLint rules** - Đã được cấu hình
- **Automation scripts** - Đã được tạo
- **Type safety** - Đã loại bỏ any types, sử dụng unknown

## Scripts Automation

```bash
# Xử lý console.log statements
npm run fix:console

# Xử lý hard code values
npm run fix:hardcode

# Xử lý comments
npm run fix:comments

# Loại bỏ emojis
npm run fix:emojis

# Xử lý types
npm run fix:types

# Xử lý tất cả
npm run fix:all

# Kiểm tra project
npm run audit

# Kiểm tra type safety
npm run audit:types
```

## File Structure

```
src/
├── constants/
│   ├── index.ts          # Primary constants file (TypeScript)
│   └── index.js          # Secondary constants file (JavaScript)
├── utils/
│   ├── errorHandler.ts   # Error handling utility (TypeScript)
│   └── errorHandler.js   # Error handling utility (JavaScript)
└── scripts/
    ├── audit.js          # Project audit tool
    ├── fix-console-final.js      # Console.log replacement
    ├── fix-hardcode-final.js     # Hard code replacement
    ├── fix-comments-simple.js    # Comments optimization
    ├── fix-emojis.js            # Emoji cleanup
    ├── fix-types.js             # Type safety
    └── audit-types.js           # Type safety audit
```

## Constants Usage

### Import Constants

```typescript
import { UI_TEXT, VALIDATION, ERROR_MESSAGES } from '../constants/index.ts';
```

### UI Text Constants

```typescript
// Loading States
UI_TEXT.LOADING                    // 'Loading...'
UI_TEXT.UPLOADING                  // 'Uploading...'
UI_TEXT.SELECT_IMAGE               // 'Select Image'

// Form Placeholders
UI_TEXT.ENTER_EMAIL                // 'Enter your email'
UI_TEXT.ENTER_PASSWORD             // 'Enter your password'
UI_TEXT.OTP_PLACEHOLDER            // '000000'

// Blog Placeholders
UI_TEXT.ENTER_BLOG_TITLE           // 'Nhập tiêu đề bài viết...'
UI_TEXT.ENTER_BLOG_DESCRIPTION     // 'Mô tả ngắn gọn về bài viết...'
UI_TEXT.ENTER_BLOG_CONTENT         // 'Viết nội dung bài blog của bạn...'

// Search Placeholders
UI_TEXT.SEARCH_FOOD                // 'Tìm kiếm thực phẩm...'
UI_TEXT.SEARCH_POSTS               // 'Tìm kiếm bài viết...'

// Error Messages
UI_TEXT.IMAGE_LOAD_FAILED          // 'Failed to load image'
UI_TEXT.SCROLL_ERROR               // 'Scroll error occurred'
```

### Validation Constants

```typescript
VALIDATION.NAME_MIN_LENGTH         // 15
VALIDATION.NAME_MAX_LENGTH         // 80
VALIDATION.EMAIL_REGEX             // Email validation pattern
VALIDATION.PASSWORD_MIN_LENGTH     // 6
```

## Error Handler Usage

### Import Error Handler

```typescript
import { logError, logWarning, handleImageError, handleApiError } from '../utils/errorHandler.ts';
```

### Basic Usage

```typescript
// Log errors
logError('Component Name', error, { additionalData: 'value' });

// Log warnings
logWarning('Component Name', 'Warning message', { context: 'additional info' });

// Handle specific errors
handleImageError(event, imageUrl, 'component context');
handleApiError(error, '/api/endpoint', { requestData: 'value' });
```

### Component Example

```jsx
import React from 'react';
import { UI_TEXT } from '../constants/index.ts';
import { logError, handleImageError } from '../utils/errorHandler.ts';

const MyComponent = () => {
  const handleError = (error) => {
    logError('MyComponent', error, { userId: 123 });
  };

  const handleImageLoad = (event) => {
    if (event.target.error) {
      handleImageError(event, event.target.src, 'MyComponent');
    }
  };

  return (
    <div>
      <input placeholder={UI_TEXT.ENTER_EMAIL} />
      <img onError={handleImageLoad} src="image.jpg" alt="test" />
    </div>
  );
};
```

## Type Safety

### Best Practices

```typescript
// Good - Using proper types
const handleError = (error: Error | string) => {
  logError('Component', error);
};

// Good - Using unknown for external data
const handleApiResponse = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    // Type guard before using
  }
};

// Avoid - Using any
const badFunction = (data: any) => {
  // This loses type safety
};
```

## Migration Checklist

### Completed
- [x] Console.log statements replaced with error handler
- [x] Hard code values moved to constants
- [x] TypeScript support implemented
- [x] ESLint rules configured
- [x] Automation scripts created
- [x] Documentation updated
- [x] Type safety improved (removed any types)
- [x] Comments optimized
- [x] Emojis cleaned up

### Next Steps
- [ ] Test all components after migration
- [ ] Run TypeScript compiler check
- [ ] Run ESLint to verify no violations
- [ ] Test error handling functionality
- [ ] Verify constants are properly imported

## Best Practices

### Constants
- Use `UI_TEXT` for all user-facing text
- Use `VALIDATION` for form validation rules
- Use `ERROR_MESSAGES` for error messages
- Import from `../constants/index.ts` (TypeScript)

### Error Handling
- Use `logError` for errors
- Use `logWarning` for warnings
- Provide context in first parameter
- Include additional data when relevant
- Use specific handlers for common errors

### Type Safety
- Use `unknown` instead of `any`
- Implement proper type guards
- Use union types for error handling
- Avoid type assertions when possible

### Code Quality
- No console.log in production code
- No hard code values in components
- Use TypeScript for type safety
- Follow ESLint rules
- Keep comments minimal and essential

## Future Enhancements

### Internationalization (i18n)
```typescript
// Future implementation
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const emailPlaceholder = t('form.email.placeholder');
```

### Error Tracking Integration
```typescript
// Future implementation with Sentry/LogRocket
import * as Sentry from '@sentry/react';

logError('Component', error, {
  tags: { component: 'MyComponent' },
  extra: { userId: 123 }
});
```

## Support

Nếu gặp vấn đề:
1. Kiểm tra import paths
2. Chạy `npm run lint` để tìm lỗi
3. Kiểm tra TypeScript compilation
4. Xem logs trong browser console
5. Chạy `npm run audit:types` để kiểm tra type safety
