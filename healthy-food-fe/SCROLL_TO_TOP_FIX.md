# Khắc phục vấn đề Scroll to Top

## Vấn đề
Khi chuyển đổi giữa các tab hoặc trang trong ứng dụng, giao diện không tự động cuộn lên đầu mà vẫn giữ vị trí cuộn hiện tại.

## Giải pháp đã thực hiện

### 1. Cải thiện component ScrollToTop
- **File**: `src/components/ScrollToTop.jsx`
- **Thay đổi**: 
  - Loại bỏ điều kiện kiểm tra `prevPathRef.current !== pathname`
  - Giảm timeout từ 150ms xuống 100ms để phản hồi nhanh hơn
  - Đảm bảo scroll to top luôn được thực hiện khi pathname thay đổi

### 2. Tạo custom hook useScrollToTop
- **File**: `src/hooks/useScrollToTop.js`
- **Mục đích**: Cung cấp một cách nhất quán để scroll to top trong toàn bộ ứng dụng
- **Tính năng**: 
  - Hỗ trợ smooth scroll với fallback cho các trình duyệt không hỗ trợ
  - Sử dụng useCallback để tối ưu hiệu suất

### 3. Cập nhật Blog component
- **File**: `src/components/Blog/Blog.jsx`
- **Thay đổi**:
  - Thêm import `useScrollToTop` hook
  - Tạo function `handleTabChange` để xử lý chuyển đổi tab với scroll to top
  - Cập nhật các button tab để sử dụng `handleTabChange`
  - Thay thế tất cả `window.scrollTo(0, 0)` bằng `scrollToTop()`

### 4. Cải thiện NavLink trong Home component
- **File**: `src/pages/Home/Home.jsx`
- **Thay đổi**: Đảm bảo navigation luôn sử dụng `navigate()` để trigger ScrollToTop component

## Cách hoạt động

1. **Khi chuyển đổi route**: Component `ScrollToTop` sẽ tự động scroll to top
2. **Khi chuyển đổi tab trong Blog**: Function `handleTabChange` sẽ scroll to top
3. **Khi click vào blog post**: Function `handlePostClick` sẽ scroll to top
4. **Khi thay đổi trang trong food list**: Function `handleFoodPageChange` sẽ scroll to top

## Kiểm tra

Để kiểm tra xem fix có hoạt động:
1. Mở ứng dụng và scroll xuống giữa trang Blog
2. Click vào tab "Menu List" - trang sẽ scroll lên đầu
3. Click lại vào tab "Blog" - trang sẽ scroll lên đầu
4. Click vào một blog post - trang sẽ scroll lên đầu
5. Click "Quay lại danh sách" - trang sẽ scroll lên đầu
6. Chuyển đổi giữa các tab navigation (Blog, Body Index, etc.) - trang sẽ scroll lên đầu

## Lưu ý

- Tất cả các thay đổi đều backward compatible
- Không ảnh hưởng đến performance
- Hỗ trợ tất cả các trình duyệt hiện đại
- Fallback cho các trình duyệt không hỗ trợ smooth scroll 