# 🥗 Healthy Food Application

Ứng dụng quản lý dinh dưỡng và theo dõi sức khỏe với tính năng BMI calculator, calorie tracking, blog chia sẻ và dashboard analytics.

## 📋 Tính năng chính

- 🔐 **Authentication**: Đăng ký, đăng nhập, quản lý profile
- 📊 **BMI Calculator**: Tính toán chỉ số BMI và phân loại
- 🍽️ **Food Tracking**: Theo dõi lượng calo và dinh dưỡng hàng ngày
- 📝 **Blog System**: Chia sẻ bài viết về dinh dưỡng
- 📈 **Dashboard**: Thống kê và biểu đồ dinh dưỡng
- 📱 **Responsive Design**: Tương thích mobile và desktop
- 🎨 **Modern UI**: Giao diện đẹp với animations

## 🚀 Quick Start

### Option 1: Docker (Recommended)

#### Yêu cầu hệ thống
- **Docker Desktop** hoặc **Docker Engine** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **RAM**: Ít nhất 4GB
- **Disk Space**: Ít nhất 2GB

#### Bước 1: Clone repository
```bash
git clone <repository-url>
cd InternFE_D1
```

#### Bước 2: Chạy ứng dụng với Docker
```bash
# Chạy toàn bộ ứng dụng (MySQL + Backend + Frontend)
docker-compose up -d

# Kiểm tra trạng thái các services
docker-compose ps
```

#### Bước 3: Thiết lập database (chỉ chạy 1 lần)
```bash
# Setup database schema và dữ liệu mẫu
docker-compose --profile setup up db-setup

# Kiểm tra logs của setup
docker-compose logs db-setup
```

#### Bước 4: Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: localhost:3308 (MySQL)

#### Docker Commands hữu ích
```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Dừng ứng dụng
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu)
docker-compose down -v

# Rebuild và chạy
docker-compose up -d --build

# Chỉ chạy database
docker-compose up -d mysql

# Chỉ chạy backend
docker-compose up -d backend

# Chỉ chạy frontend
docker-compose up -d frontend
```

### Option 2: Local Development

#### Yêu cầu hệ thống
- **Node.js** (version 16.0.0+)
- **MySQL** (version 8.0+)
- **npm** hoặc **yarn**
- **Git**

#### Bước 1: Clone và cài đặt dependencies
```bash
# Clone repository
git clone <repository-url>
cd InternFE_D1

# Cài đặt tất cả dependencies (Frontend + Backend)
npm run install-all
```

#### Bước 2: Cấu hình database

1. **Tạo database MySQL**:
```sql
CREATE DATABASE `healthyfood` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Tạo file cấu hình backend**:
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

3. **Setup database schema**:
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

### Root Scripts (từ thư mục gốc)
```bash
npm run install-all          # Cài đặt tất cả dependencies
npm run dev                  # Chạy cả frontend và backend
npm run dev:backend          # Chỉ chạy backend
npm run dev:frontend         # Chỉ chạy frontend
npm run setup-db             # Setup database
npm run build                # Build frontend
npm run start:backend        # Chạy backend production
npm run start:frontend       # Chạy frontend production
```

### Backend Scripts (từ healthy-food-be/)
```bash
npm install                  # Cài đặt dependencies
npm run dev                  # Chạy development mode
npm start                    # Chạy production mode
npm run setup-db             # Setup database
```

### Frontend Scripts (từ healthy-food-fe/)
```bash
npm install                  # Cài đặt dependencies
npm run dev                  # Chạy development server
npm run build                # Build production
npm run preview              # Preview production build
npm run lint                 # Lint code
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

## 🔧 Troubleshooting

### Docker Issues

#### 1. Port conflicts
```bash
# Kiểm tra ports đang sử dụng
netstat -tulpn | grep :5173
netstat -tulpn | grep :5000
netstat -tulpn | grep :3308

# Dừng services đang sử dụng ports
sudo lsof -ti:5173 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
sudo lsof -ti:3308 | xargs kill -9
```

#### 2. Database connection issues
```bash
# Kiểm tra MySQL container
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Kiểm tra database
docker exec -it healthy-food-mysql mysql -u root -p
```

#### 3. Build issues
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Local Development Issues

#### 1. Node.js version
```bash
# Kiểm tra version
node --version
npm --version

# Cài đặt Node.js 16+ nếu cần
# Windows: https://nodejs.org/
# Linux: nvm install 16
# macOS: brew install node@16
```

#### 2. MySQL connection
```bash
# Kiểm tra MySQL service
sudo systemctl status mysql

# Start MySQL nếu chưa chạy
sudo systemctl start mysql

# Tạo database
mysql -u root -p
CREATE DATABASE healthyfood;
```

#### 3. Permission issues
```bash
# Fix uploads directory permissions
chmod 755 healthy-food-be/uploads

# Fix node_modules permissions
sudo chown -R $USER:$USER node_modules/
```

#### 4. Port conflicts
```bash
# Kill processes using ports
lsof -ti:5173 | xargs kill -9
lsof -ti:5000 | xargs kill -9
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

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt với salt rounds
- **CORS Protection**: Cross-origin resource sharing
- **Rate Limiting**: Chống spam requests
- **Input Validation**: Server-side validation
- **Helmet**: Security headers
- **File Upload Security**: Type và size validation

## 📈 Performance Optimization

- **Lazy Loading**: React.lazy cho code splitting
- **Image Optimization**: Conditional rendering
- **Database Indexing**: Optimized queries
- **Caching**: Browser caching strategies
- **Bundle Optimization**: Vite build optimization

## 🧪 Testing

### Manual Testing
```bash
# Test API endpoints
curl -X GET http://localhost:5000/health

# Test frontend
# Mở http://localhost:5173 trong browser
```

### API Testing với Postman
1. Import collection từ `docs/postman-collection.json`
2. Set base URL: `http://localhost:5000`
3. Test các endpoints

## 📝 Development Guidelines

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Standard JavaScript
- **Database**: MySQL best practices

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Code review và merge
git checkout main
git merge feature/new-feature
```

### Environment Variables
- **Development**: `.env` files
- **Production**: Docker environment variables
- **Never commit**: Sensitive data (passwords, keys)

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd healthy-food-fe
npm run build

# Start backend production
cd ../healthy-food-be
npm start
```

### Docker Production
```bash
# Build và chạy production
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support

- **Issues**: Tạo issue trên GitHub
- **Documentation**: Xem thêm docs/
- **API Docs**: http://localhost:5000/docs (khi chạy)

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Happy Coding! 🎉**
