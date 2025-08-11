# Healthy Food Application

### Option 1: Docker 

#### Bước 1: Clone repository
```bash
git clone <repository-url>
cd InternFE_D1
```

#### Bước 2: Chạy ứng dụng với Docker
```bash
# Chạy toàn bộ ứng dụng 
docker-compose up -d

# Kiểm tra trạng thái các services
docker-compose ps
```

#### Bước 3: Thiết lập database 
```bash
# Setup database schema và dữ liệu mẫu
docker-compose --profile setup up db-setup

# Kiểm tra logs của setup
docker-compose logs db-setup
```

#### Bước 4: Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/health
- **Database**: localhost:3308 (MySQL)

### Option 2: Local Development

#### Bước 1: Clone và cài đặt dependencies
```bash
# Clone repository
git clone <repository-url>
cd InternFE_D1

# Cài đặt tất cả dependencies (Frontend + Backend)
npm run install-all
```

#### Bước 2: Cấu hình database


1. **Tạo file cấu hình backend**:
```bash
cd healthy-food-be
```

Tạo file `.env` với nội dung:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=healthyfood
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

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

22. **Setup database schema**:
```bash
# Từ thư mục gốc
npm run setup-db
```

#### Bước 3: Chạy ứng dụng
```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng lẻ:
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

#### Bước 4: Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Cấu trúc Project

```
InternFE_D1/
├── healthy-food-be/          # Backend API (Node.js + Express)
│   ├── database/            # Database files
│   │   ├── schema.sql       # Database schema
│   │   ├── scripts/         # Database scripts
│   │   └── connection.js    # Database connection
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── config/          # Configuration files
│   ├── uploads/             # File uploads
│   ├── server.js            # Entry point
│   └── package.json
├── healthy-food-fe/         # Frontend React
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   └── App.jsx          # Main App
│   ├── public/              # Static assets
│   └── package.json
├── docker-compose.yml       # Docker configuration
├── Dockerfile.backend       # Backend Dockerfile
├── Dockerfile.frontend      # Frontend Dockerfile
└── package.json             # Root scripts
```

## 🔄 Scripts

### Backend Scripts (từ healthy-food-be/)
```bash
npm install                  # Cài đặt dependencies                 # Chạy development mode
npm start                    # Chạy production mode
npm run setup-db             # Setup database
```

### Frontend Scripts (từ healthy-food-fe/)
```bash
npm install                  # Cài đặt dependencies
npm run dev                  # Chạy development server
```

## 🐳 Docker Configuration

### Services
- **mysql**: MySQL 8.0 database
- **backend**: Node.js API server
- **frontend**: React application (Nginx)
- **db-setup**: Database initialization service

### Volumes
- **mysql_data**: Persistent database storage
- **uploads**: File upload storage

### Networks
- **healthy-food-network**: Internal network cho services

### Environment Variables (Docker)
```env
# Database
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=0504Giavuong
DB_NAME=healthyfood
DB_PORT=3306

# JWT
JWT_SECRET=lEuc2u0c+716gWUoKxEZKdR1pVQH9bxYoAgmqlDiq/V4LSbTaS5aaHSxpTm71tXu
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173
```
## 📊 API Documentation

### Base URL
- **Docker**: http://localhost:5000
- **Local**: http://localhost:5000

### Authentication Endpoints
```bash
POST /api/auth/register     # Đăng ký
POST /api/auth/login        # Đăng nhập
GET /api/auth/profile       # Lấy profile
PUT /api/auth/profile       # Cập nhật profile
```

### Blog Endpoints
```bash
GET /api/blog/posts         # Lấy danh sách bài viết
POST /api/blog/posts        # Tạo bài viết mới
PUT /api/blog/posts/:id     # Cập nhật bài viết
DELETE /api/blog/posts/:id  # Xóa bài viết
```

### Food Endpoints
```bash
GET /api/food/items         # Lấy danh sách thực phẩm
POST /api/food/logs         # Log thực phẩm
GET /api/food/statistics    # Thống kê dinh dưỡng
```
