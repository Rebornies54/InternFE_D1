# 🎨 Hướng Dẫn Deploy lên Render (Chi Tiết)

## Bước 1: Chuẩn Bị

1. **Tạo tài khoản Render**: https://render.com
   - Đăng nhập bằng GitHub

2. **Push code lên GitHub** (nếu chưa có)

## Bước 2: Deploy Database

⚠️ **Lưu ý**: Render free tier chỉ có PostgreSQL, không có MySQL.

### Option A: Dùng PostgreSQL (Khuyến nghị)
- Cần migrate schema từ MySQL → PostgreSQL
- Render có PostgreSQL free tier

### Option B: Dùng MySQL từ Railway/PlanetScale
- Deploy backend lên Render
- Connect tới MySQL external

## Bước 3: Deploy Backend

1. **Tạo Web Service**:
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository

2. **Cấu hình**:
   - **Name**: `healthy-food-backend`
   - **Environment**: `Node`
   - **Region**: Chọn gần bạn nhất
   - **Branch**: `main` (hoặc branch bạn muốn)
   - **Root Directory**: `healthy-food-be`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   
   # Database (nếu dùng PostgreSQL)
   DB_HOST=<postgres-host>
   DB_USER=<postgres-user>
   DB_PASSWORD=<postgres-password>
   DB_NAME=healthyfood
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRES_IN=7d
   
   # CORS
   CORS_ORIGIN=https://your-frontend.vercel.app
   
   # Email
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-gmail-app-password
   
   # Frontend
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render sẽ tự động build và deploy

5. **Lưu ý Free Tier**:
   - Service sẽ **sleep** sau 15 phút không dùng
   - Lần đầu wake up mất ~30 giây
   - Có thể dùng UptimeRobot để ping định kỳ

## Bước 4: Deploy Frontend

1. **Tạo Static Site**:
   - Dashboard → "New" → "Static Site"
   - Connect GitHub repository

2. **Cấu hình**:
   - **Name**: `healthy-food-frontend`
   - **Root Directory**: `healthy-food-fe`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://healthy-food-backend.onrender.com
   ```

4. **Deploy**:
   - Click "Create Static Site"
   - Render sẽ build và deploy

## Bước 5: Update CORS

1. Quay lại Backend service
2. Update `CORS_ORIGIN` = Frontend URL từ Render
3. Redeploy backend

## Bước 6: Migrate MySQL → PostgreSQL (Nếu cần)

Nếu bạn muốn dùng PostgreSQL của Render:

1. **Tạo PostgreSQL Database**:
   - Dashboard → "New" → "PostgreSQL"
   - Copy connection string

2. **Convert Schema**:
   - Sử dụng tool convert MySQL → PostgreSQL
   - Hoặc manual convert các differences:
     - `AUTO_INCREMENT` → `SERIAL`
     - `TIMESTAMP` → `TIMESTAMP WITH TIME ZONE`
     - `ENGINE=InnoDB` → Remove (PostgreSQL không cần)

3. **Import Schema**:
   - Dùng pgAdmin hoặc psql CLI
   - Import converted schema

## Troubleshooting

### Service bị sleep:
- Dùng UptimeRobot để ping mỗi 5 phút
- Hoặc upgrade lên paid plan

### Build fails:
- Check logs trong Render dashboard
- Verify Node.js version (>= 16)
- Check build command

### Database connection:
- Verify connection string
- Check firewall settings
- Test connection từ local

## Cost Estimate

- **Render Free Tier**: 
  - 750 giờ/tháng (đủ cho 1 service chạy 24/7)
  - PostgreSQL: 90MB storage
  - Static sites: Unlimited
- **Total**: **$0** nếu trong free tier

## Alternative: Render + PlanetScale

Nếu muốn giữ MySQL:
1. Deploy backend lên Render
2. Dùng PlanetScale cho MySQL (free tier: 5GB)
3. Update connection string trong backend

---

**Chúc bạn deploy thành công!** 🎉
