# Healthy Food Frontend

Ứng dụng web React cho hệ thống quản lý thực phẩm lành mạnh.

## Tính năng

- **Authentication**: Đăng nhập/đăng ký với JWT
- **Blog**: Xem và quản lý bài viết về thực phẩm
- **Body Index**: Tính toán chỉ số cơ thể (BMI, BMR)
- **Calorie Index**: Quản lý chỉ số calo
- **Calorie Calculation**: Tính toán và theo dõi calo
- **Dashboard**: Bảng điều khiển tổng quan
- **Profile**: Quản lý thông tin cá nhân

## Công nghệ sử dụng

- React 19
- React Router DOM
- Axios
- Lucide React (Icons)
- Formik & Yup (Form validation)
- Recharts (Charts)
- Styled Components
- Vite (Build tool)

## Cài đặt

```bash
npm install
```

## Chạy development server

```bash
npm run dev
```

## Build cho production

```bash
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/          # React components
│   ├── Blog/           # Blog components
│   ├── BodyIndex/      # Body index components
│   ├── CalorieIndex/   # Calorie index components
│   ├── CalorieCalculation/ # Calorie calculation components
│   ├── Dashboard/      # Dashboard components
│   └── Profile/        # Profile components
├── context/            # React Context
├── pages/              # Page components
├── services/           # API services
└── assets/             # Static assets
```

## API Endpoints

Ứng dụng kết nối với backend API tại `http://localhost:3000` với các endpoint:

- Authentication: `/api/auth/*`
- Food management: `/api/foods/*`
- User profile: `/api/users/*`

## Environment Variables

Tạo file `.env` trong thư mục gốc:

```
VITE_API_URL=http://localhost:3000
```

