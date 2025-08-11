# Healthy Food Application

### Option 1: Docker (Recommended)

#### Yêu cầu hệ thống
- Docker Desktop hoặc Docker Engine
- Docker Compose
- Ít nhất 4GB RAM

#### Chạy ứng dụng với Docker
```bash
# Chạy toàn bộ ứng dụng
docker-compose up -d

# Truy cập ứng dụng
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

#### Thiết lập database 
```bash
docker-compose --profile setup up db-setup
```

### Option 2: Local Development

#### 1. Cài đặt dependencies
```bash
npm run install-all
```

#### 2. Cấu hình database
1. Tạo file `.env` trong thư mục `healthy-food-be`:
```bash
cd healthy-food-be
cp env.example .env
```

2. Cập nhật thông tin database trong file `.env`

3. Setup database:
```bash
npm run setup-db
```

4. Chạy ứng dụng:
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`
Backend sẽ chạy tại: `http://localhost:5000`

```
InternFE_D1/
├── healthy-food-be/          # Backend API
│   ├── database/            # Database files
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── server.js            # Entry point
├── healthy-food-fe/         # Frontend React
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main App
│   └── package.json
└── package.json             # Root scripts
```


## 🔄 Scripts

### Docker Commands
```bash
docker-compose up -d              # Chạy toàn bộ ứng dụng
docker-compose down               # Dừng ứng dụng
docker-compose logs               # Xem logs
docker-compose up -d --build      # Rebuild và chạy
docker-compose --profile setup up db-setup  # Setup database
```

### Local Development Commands
```bash
npm run install-all    # Cài đặt tất cả dependencies
npm run dev           # Chạy cả frontend và backend
npm run setup-db      # Setup database
npm run build         # Build frontend
```

### Build frontend:
```bash
cd healthy-food-fe
npm run dev
```

### Deploy backend:
```bash
cd healthy-food-be
npm start
