# Blog Component Structure

Component Blog đã được refactor thành các component con nhỏ hơn để dễ quản lý và bảo trì, tương tự như cấu trúc của HomePage.

## Cấu trúc thư mục

```
Blog/
├── Blog.jsx                 # Component chính
├── Blog.css                 # CSS chung
├── CreateBlog.jsx           # Component tạo blog
├── Comment.jsx              # Component comment
├── README.md               # File này
└── components/             # Thư mục chứa các component con
    ├── index.js            # Export tất cả components
    ├── BlogTabs/           # Tab chuyển đổi Blog/Menu
    │   ├── BlogTabs.jsx
    │   ├── BlogTabs.css
    │   └── index.js
    ├── BlogHeader/         # Header với nút tạo blog và tiêu đề
    │   ├── BlogHeader.jsx
    │   ├── BlogHeader.css
    │   └── index.js
    ├── BlogControls/       # Bộ lọc và tìm kiếm cho blog
    │   ├── BlogControls.jsx
    │   ├── BlogControls.css
    │   └── index.js
    ├── BlogCardGrid/       # Grid hiển thị các blog card
    │   ├── BlogCardGrid.jsx
    │   ├── BlogCardGrid.css
    │   └── index.js
    ├── BlogCard/           # Card hiển thị thông tin blog
    │   ├── BlogCard.jsx
    │   ├── BlogCard.css
    │   └── index.js
    ├── BlogDetail/         # Chi tiết blog
    │   ├── BlogDetail.jsx
    │   ├── BlogDetail.css
    │   └── index.js
    ├── FoodControls/       # Bộ lọc và tìm kiếm cho food
    │   ├── FoodControls.jsx
    │   ├── FoodControls.css
    │   └── index.js
    ├── FoodList/           # Danh sách thực phẩm
    │   ├── FoodList.jsx
    │   ├── FoodList.css
    │   └── index.js
    ├── FoodItem/           # Item thực phẩm
    │   ├── FoodItem.jsx
    │   ├── FoodItem.css
    │   └── index.js
    └── FoodModal/          # Modal chi tiết thực phẩm
        ├── FoodModal.jsx
        ├── FoodModal.css
        └── index.js
```

## Các component con

### 1. BlogTabs
- Quản lý việc chuyển đổi giữa tab Blog và Menu
- Props: `activeTab`, `onTabChange`

### 2. BlogHeader
- Hiển thị header với nút tạo blog và tiêu đề
- Props: `onShowCreate`, `title`, `description`

### 3. BlogControls
- Chứa bộ lọc category và search bar cho blog
- Props: `categories`, `selectedCategory`, `searchQuery`, `onCategoryChange`, `onSearchChange`

### 4. BlogCardGrid
- Grid hiển thị các blog card
- Props: `posts`, `onPostClick`, `onLike`, `userLikes`, `postsLoading`

### 5. BlogCard
- Card hiển thị thông tin blog
- Props: `post`, `onClick`, `onLike`, `isLiked`, `likeCount`

### 6. BlogDetail
- Chi tiết blog với nội dung đầy đủ
- Props: `post`, `onBack`, `onLike`, `isLiked`, `likeCount`

### 7. FoodControls
- Bộ lọc category và search bar cho food
- Props: `categories`, `selectedCategory`, `searchQuery`, `onCategoryChange`, `onSearchChange`

### 8. FoodList
- Danh sách thực phẩm với pagination
- Props: `foods`, `onFoodClick`, `loading`, `currentPage`, `itemsPerPage`, `totalPages`, `onPageChange`

### 9. FoodItem
- Item thực phẩm
- Props: `food`, `onClick`

### 10. FoodModal
- Modal chi tiết thực phẩm
- Props: `food`, `variations`, `onClose`

## Lợi ích của việc refactor

1. **Dễ bảo trì**: Mỗi component có trách nhiệm riêng biệt
2. **Tái sử dụng**: Các component có thể được sử dụng ở nơi khác
3. **Dễ test**: Có thể test từng component riêng lẻ
4. **Code sạch**: Logic được phân tách rõ ràng
5. **Performance**: Chỉ re-render component cần thiết

## Cách sử dụng

```jsx
import {
  BlogTabs,
  BlogHeader,
  BlogControls,
  BlogCardGrid,
  BlogDetail,
  FoodControls,
  FoodList,
  FoodModal
} from './components';
```

Hoặc import từng component riêng lẻ:

```jsx
import BlogTabs from './components/BlogTabs';
import BlogHeader from './components/BlogHeader';
// ...
```
