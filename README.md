# Healthy Food Application


## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm run install-all
```

### 2. Cấu hình database
1. Tạo file `.env` trong thư mục `healthy-food-be`:
```bash
cd healthy-food-be
cp env.example .env
```


```bash
npm run setup-db
```
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

```bash
npm run install-all    # Cài đặt tất cả dependencies
npm run dev           # Chạy cả frontend và backend
npm run setup-db      # Setup database
npm run build         # Build frontend
```

### Build frontend:
```bash
cd healthy-food-fe
npm run build
```

### Deploy backend:
```bash
cd healthy-food-be
npm start
