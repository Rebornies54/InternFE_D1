# Healthy Food Backend API

Backend API cho ứng dụng quản lý dinh dưỡng và theo dõi calo.

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm hoặc yarn

### Bước 1: Cài đặt dependencies
```bash
cd healthy-food-be
npm install
```

### Bước 2: Cấu hình database
1. Tạo database MySQL:
```sql
CREATE DATABASE `healthy-food`;
```

2. Cập nhật file `config.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthy-food
DB_PORT=3306
```

### Bước 3: Setup database
```bash
npm run setup-db
```

### Bước 4: Chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile (cần auth)
- `PUT /api/auth/profile` - Cập nhật profile (cần auth)
- `PUT /api/auth/change-password` - Đổi mật khẩu (cần auth)

### Health Check
- `GET /health` - Kiểm tra trạng thái server

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) cho authentication.

### Headers cần thiết cho protected routes:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

### Bảng chính:
- `users` - Thông tin người dùng
- `food_categories` - Danh mục thực phẩm
- `detailed_foods` - Chi tiết thực phẩm và dinh dưỡng
- `food_logs` - Nhật ký ăn uống
- `body_index` - Chỉ số cơ thể
- `blog_posts` - Bài viết blog
- `user_favorites` - Thực phẩm yêu thích
- `nutrition_goals` - Mục tiêu dinh dưỡng
- `search_history` - Lịch sử tìm kiếm

## 🛠️ Cấu trúc Project

```
healthy-food-be/
├── .env          # Cấu hình environment
├── server.js           # Entry point
├── connection.js       # Database connection
├── schema.sql          # Database schema
├── setup-database.js   # Database setup script
├── middleware/         # Middleware
│   ├── auth.js        # JWT authentication
│   └── validation.js  # Request validation
├── services/          # Business logic
│   └── authService.js # Authentication service
└── routes/            # API routes
    └── auth.js        # Authentication routes
```

## 🔧 Environment Variables

Tạo file `config.env` với các biến sau:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthy-food
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-2024
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing API

### Đăng ký tài khoản:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "phone": "0123456789"
  }'
```

### Đăng nhập:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Lấy profile (cần token):
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Chống spam requests
- **JWT**: Secure authentication
- **bcrypt**: Password hashing
- **express-validator**: Input validation

## 📝 Logs

Server sử dụng Morgan để log requests. Logs sẽ hiển thị trong console.

## 🚨 Error Handling

API trả về lỗi với format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔄 Development

Để chạy trong development mode với auto-reload:
```bash
npm run dev
```

## 📦 Production

Để deploy production:
```bash
npm start
```

Đảm bảo set `NODE_ENV=production` trong environment variables. 