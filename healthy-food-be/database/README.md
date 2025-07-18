# Database Management

Thư mục này chứa các script để quản lý cơ sở dữ liệu cho ứng dụng Healthy Food.

## Cấu trúc thư mục

```
database/
├── README.md                    # Hướng dẫn này
├── schema.sql                   # Schema chính của database
├── scripts/                     # Scripts quản lý database
│   ├── setup.js                 # Script khởi tạo database chính
│   ├── migrations/              # Scripts migration
│   │   ├── add-blog-tables.js
│   │   ├── add-bmi-table.js
│   │   └── add-food-images.js
│   ├── data/                    # Scripts thêm dữ liệu
│   │   ├── add-more-foods.js
│   │   └── add-sample-blogs.js
│   └── maintenance/             # Scripts bảo trì
│       ├── check-tables.js
│       ├── check-users.js
│       └── clean-database.js
└── connection.js                # Cấu hình kết nối database
```

## Cách sử dụng

### 1. Khởi tạo database
```bash
node scripts/setup.js
```

### 2. Chạy migrations
```bash
node scripts/migrations/add-blog-tables.js
node scripts/migrations/add-bmi-table.js
node scripts/migrations/add-food-images.js
```

### 3. Thêm dữ liệu
```bash
node scripts/data/add-more-foods.js
node scripts/data/add-sample-blogs.js
```

### 4. Bảo trì database
```bash
node scripts/maintenance/check-tables.js
node scripts/maintenance/check-users.js
node scripts/maintenance/clean-database.js
```

## Các bảng trong database

### Core Tables
- `users` - Thông tin người dùng
- `food_categories` - Danh mục thực phẩm
- `food_items` - Chi tiết thực phẩm
- `user_food_logs` - Nhật ký ăn uống

### Feature Tables
- `user_bmi_data` - Dữ liệu BMI người dùng
- `blog_posts` - Bài viết blog
- `blog_post_likes` - Like bài viết

## Lưu ý

- Luôn backup database trước khi chạy scripts
- Kiểm tra kết nối database trước khi thực thi
- Các scripts được thiết kế để chạy an toàn (idempotent) 