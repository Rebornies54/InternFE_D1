# 🚀 Hướng Dẫn Deploy Website Healthy Food - Miễn Phí

## 📋 Tổng Quan Các Phương Án

Dự án của bạn gồm:
- **Backend**: Node.js + Express + MySQL
- **Frontend**: React + Vite (có thể build thành static files)
- **Database**: MySQL
- **File Storage**: Uploads (avatars, blog images)

---

## 🎯 PHƯƠNG ÁN 1: RAILWAY (KHUYẾN NGHỊ - DỄ NHẤT)

### ✅ Ưu điểm:
- **Hoàn toàn miễn phí** với $5 credit/tháng (đủ cho dự án nhỏ)
- Deploy tự động từ GitHub
- Hỗ trợ MySQL tích hợp
- Dễ setup, không cần config phức tạp
- Hỗ trợ Docker

### 📦 Setup:

1. **Tạo tài khoản Railway**: https://railway.app
2. **Deploy Database**:
   - New Project → Add MySQL
   - Copy connection string

3. **Deploy Backend**:
   - New Service → Deploy from GitHub repo
   - Chọn folder `healthy-food-be`
   - Add Environment Variables:
     ```
     DB_HOST=<từ MySQL service>
     DB_USER=<từ MySQL service>
     DB_PASSWORD=<từ MySQL service>
     DB_NAME=healthyfood
     DB_PORT=3306
     JWT_SECRET=<generate random string>
     JWT_EXPIRES_IN=7d
     PORT=5000
     NODE_ENV=production
     CORS_ORIGIN=<frontend URL>
     EMAIL_USER=<your-gmail>
     EMAIL_APP_PASSWORD=<gmail-app-password>
     FRONTEND_URL=<frontend URL>
     ```

4. **Deploy Frontend**:
   - Build frontend: `npm run build` trong folder `healthy-food-fe`
   - Deploy folder `dist` lên Vercel/Netlify (xem Phương án 2)

**Link**: https://railway.app

---

## 🎯 PHƯƠNG ÁN 2: RENDER (MIỄN PHÍ - TỐT)

### ✅ Ưu điểm:
- **Free tier**: 750 giờ/tháng
- PostgreSQL miễn phí (cần migrate từ MySQL)
- Auto-deploy từ GitHub
- SSL tự động

### ⚠️ Lưu ý:
- Free tier sẽ sleep sau 15 phút không dùng
- Cần migrate MySQL → PostgreSQL (hoặc dùng MySQL từ Railway)

### 📦 Setup:

1. **Tạo tài khoản**: https://render.com
2. **Deploy Backend**:
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `cd healthy-food-be && npm install`
   - Start Command: `cd healthy-food-be && npm start`
   - Environment Variables: (giống Railway)

3. **Deploy Frontend**:
   - New → Static Site
   - Connect GitHub repo
   - Build Command: `cd healthy-food-fe && npm install && npm run build`
   - Publish Directory: `healthy-food-fe/dist`

**Link**: https://render.com

---

## 🎯 PHƯƠNG ÁN 3: VERCEL + PLANETSCALE (KHUYẾN NGHỊ CHO FRONTEND)

### ✅ Ưu điểm:
- **Vercel**: Deploy frontend miễn phí, cực nhanh
- **PlanetScale**: MySQL miễn phí (5GB storage)
- CDN toàn cầu
- Auto-deploy từ GitHub

### 📦 Setup:

#### A. Deploy Frontend lên Vercel:
1. Tạo tài khoản: https://vercel.com
2. Import GitHub repo
3. Settings:
   - Framework Preset: Vite
   - Root Directory: `healthy-food-fe`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```

#### B. Deploy Backend:
- Dùng Railway hoặc Render (như trên)

#### C. Database PlanetScale:
1. Tạo tài khoản: https://planetscale.com
2. Tạo database mới
3. Import schema từ `schema.sql`
4. Update connection string trong backend

**Link**: 
- Vercel: https://vercel.com
- PlanetScale: https://planetscale.com

---

## 🎯 PHƯƠNG ÁN 4: FLY.IO (MIỄN PHÍ - TỐT CHO DOCKER)

### ✅ Ưu điểm:
- **Free tier**: 3 VMs miễn phí
- Hỗ trợ Docker tốt
- Global edge network
- Persistent volumes cho uploads

### 📦 Setup:

1. **Cài đặt Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy Backend**:
   ```bash
   cd healthy-food-be
   fly launch
   # Follow prompts
   ```

3. **Deploy Frontend**:
   - Build và deploy lên Vercel/Netlify

**Link**: https://fly.io

---

## 🎯 PHƯƠNG ÁN 5: NETLIFY + SUPABASE (TỐT CHO FULLSTACK)

### ✅ Ưu điểm:
- **Netlify**: Frontend + Functions miễn phí
- **Supabase**: PostgreSQL miễn phí (500MB)
- Real-time database
- Auth service tích hợp

### ⚠️ Lưu ý:
- Cần migrate MySQL → PostgreSQL

**Link**: 
- Netlify: https://netlify.com
- Supabase: https://supabase.com

---

## 🎯 PHƯƠNG ÁN 6: GITHUB PAGES + BACKEND RIÊNG (CHỈ FRONTEND)

### ✅ Ưu điểm:
- **Hoàn toàn miễn phí**
- Tích hợp GitHub
- CDN miễn phí

### ⚠️ Hạn chế:
- Chỉ deploy được frontend static
- Backend phải deploy riêng

---

## 📊 SO SÁNH CÁC PHƯƠNG ÁN

| Phương án | Backend | Frontend | Database | File Storage | Độ khó |
|-----------|---------|----------|----------|--------------|--------|
| **Railway** | ✅ Free | ✅ Free | ✅ MySQL | ✅ Volume | ⭐ Dễ |
| **Render** | ✅ Free* | ✅ Free | ⚠️ PostgreSQL | ✅ Volume | ⭐⭐ Trung bình |
| **Vercel + PlanetScale** | ✅ Free | ✅ Free | ✅ MySQL | ⚠️ Cần S3 | ⭐⭐ Trung bình |
| **Fly.io** | ✅ Free | ✅ Free | ⚠️ External | ✅ Volume | ⭐⭐⭐ Khó |
| **Netlify + Supabase** | ✅ Free | ✅ Free | ⚠️ PostgreSQL | ✅ Storage | ⭐⭐ Trung bình |

*Free tier có giới hạn

---

## 🏆 KHUYẾN NGHỊ: PHƯƠNG ÁN TỐI ƯU

### **Combo 1: Railway (Backend + DB) + Vercel (Frontend)**
- ✅ Dễ nhất, ít config
- ✅ MySQL native, không cần migrate
- ✅ Free tier đủ dùng
- ✅ Auto-deploy từ GitHub

### **Combo 2: Render (Backend) + Vercel (Frontend) + PlanetScale (DB)**
- ✅ Tách biệt services
- ✅ PlanetScale MySQL tốt
- ✅ Vercel CDN nhanh

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

### Backend:
- [ ] Update `CORS_ORIGIN` với frontend URL
- [ ] Set `NODE_ENV=production`
- [ ] Generate `JWT_SECRET` mạnh
- [ ] Config email service (Gmail App Password)
- [ ] Test database connection
- [ ] Setup file uploads (nếu dùng external storage)

### Frontend:
- [ ] Update API URL trong `.env`
- [ ] Build production: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Check environment variables

### Database:
- [ ] Import schema từ `schema.sql`
- [ ] Test connection
- [ ] Backup data (nếu có)

---

## 🔧 FILE CẤU HÌNH CẦN TẠO

Xem các file trong thư mục này:
- `railway.json` - Cấu hình Railway
- `render.yaml` - Cấu hình Render
- `vercel.json` - Cấu hình Vercel
- `.env.production` - Environment variables mẫu

---

## 🆘 TROUBLESHOOTING

### Backend không kết nối database:
- Kiểm tra connection string
- Đảm bảo database đã được tạo
- Check firewall/network settings

### CORS errors:
- Update `CORS_ORIGIN` trong backend
- Check frontend API URL

### File uploads không hoạt động:
- Kiểm tra quyền ghi file
- Consider dùng Cloudinary/S3 cho production

### Build fails:
- Check Node.js version (>= 16)
- Clear `node_modules` và rebuild
- Check environment variables

---

## 📚 TÀI LIỆU THAM KHẢO

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs

---

## 💡 TIPS

1. **Sử dụng GitHub Actions** để auto-deploy
2. **Cloudinary** cho file uploads (free tier: 25GB)
3. **Monitor** với UptimeRobot (free)
4. **Backup database** định kỳ
5. **Use CDN** cho static assets

---

Chúc bạn deploy thành công! 🎉
