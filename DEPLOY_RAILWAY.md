# 🚂 Hướng Dẫn Deploy lên Railway (Chi Tiết)

## Bước 1: Chuẩn Bị

1. **Tạo tài khoản Railway**: https://railway.app
   - Đăng nhập bằng GitHub

2. **Push code lên GitHub** (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/healthy-food.git
   git push -u origin main
   ```

## Bước 2: Deploy Database MySQL

1. **Tạo Project mới**:
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

2. **Thêm MySQL Database**:
   - Click "New" → "Database" → "Add MySQL"
   - Railway sẽ tự động tạo MySQL instance
   - **Lưu ý**: Copy các thông tin connection (sẽ dùng cho backend)

3. **Import Schema**:
   - Click vào MySQL service
   - Tab "Connect" → Copy connection string
   - Hoặc dùng Railway CLI:
     ```bash
     railway connect
     mysql -h <host> -u <user> -p <database> < healthy-food-be/database/schema.sql
     ```

## Bước 3: Deploy Backend

1. **Thêm Backend Service**:
   - Trong project, click "New" → "GitHub Repo"
   - Chọn repository
   - Railway sẽ detect Node.js project

2. **Cấu hình Service**:
   - **Root Directory**: `healthy-food-be`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Thêm Environment Variables**:
   - Click vào service → Tab "Variables"
   - Thêm các biến sau:

   ```env
   NODE_ENV=production
   PORT=5000
   
   # Database (lấy từ MySQL service)
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   
   # JWT
   JWT_SECRET=<generate-random-string-64-chars>
   JWT_EXPIRES_IN=7d
   
   # CORS (sẽ update sau khi có frontend URL)
   CORS_ORIGIN=https://your-frontend.vercel.app
   
   # Email
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-gmail-app-password
   
   # Frontend URL
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Generate JWT_SECRET**:
   ```bash
   # Trên terminal
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**:
   - Railway sẽ tự động deploy khi bạn push code
   - Hoặc click "Deploy" để deploy ngay

6. **Lấy Backend URL**:
   - Click vào service → Tab "Settings"
   - Copy "Public Domain" (ví dụ: `healthy-food-backend.railway.app`)

## Bước 4: Deploy Frontend lên Vercel

1. **Tạo tài khoản Vercel**: https://vercel.com

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import từ GitHub repository

3. **Cấu hình**:
   - **Framework Preset**: Vite
   - **Root Directory**: `healthy-food-fe`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://healthy-food-backend.railway.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel sẽ tự động build và deploy

6. **Update CORS trong Backend**:
   - Quay lại Railway backend service
   - Update `CORS_ORIGIN` = Vercel domain của bạn
   - Redeploy backend

## Bước 5: Setup File Storage (Tùy chọn)

Railway có persistent volumes, nhưng để tốt hơn, dùng Cloudinary:

1. **Tạo tài khoản Cloudinary**: https://cloudinary.com (free tier: 25GB)

2. **Cài đặt package**:
   ```bash
   cd healthy-food-be
   npm install cloudinary multer-storage-cloudinary
   ```

3. **Update code upload** để dùng Cloudinary thay vì local storage

## Bước 6: Test

1. **Test Backend**:
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Test Frontend**:
   - Truy cập Vercel URL
   - Test đăng ký/đăng nhập
   - Test upload file
   - Test các chức năng khác

## Bước 7: Custom Domain (Tùy chọn)

### Railway (Backend):
1. Click service → Settings → "Generate Domain"
2. Hoặc add custom domain trong Settings

### Vercel (Frontend):
1. Project Settings → Domains
2. Add custom domain
3. Follow DNS instructions

## Troubleshooting

### Backend không start:
- Check logs trong Railway dashboard
- Verify environment variables
- Check database connection

### CORS errors:
- Verify `CORS_ORIGIN` đúng với frontend URL
- Check frontend `VITE_API_URL`

### Database connection failed:
- Verify database variables
- Check database service đang chạy
- Test connection string

### File uploads không hoạt động:
- Railway volumes có giới hạn
- Consider dùng Cloudinary/S3

## Monitoring

1. **Railway Dashboard**: Xem logs, metrics
2. **UptimeRobot**: Monitor uptime (free)
3. **Sentry**: Error tracking (free tier)

## Cost Estimate

- **Railway**: $5 credit/tháng (đủ cho dự án nhỏ)
- **Vercel**: Free (unlimited cho personal projects)
- **Total**: **$0** nếu trong free tier

## Next Steps

1. Setup CI/CD với GitHub Actions
2. Add monitoring & logging
3. Setup database backups
4. Optimize performance
5. Add CDN cho static assets

---

**Chúc bạn deploy thành công!** 🎉
