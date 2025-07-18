import React, { useState } from 'react';
import { useBlogContext } from '../../context/BlogContext';
import { Heart } from 'lucide-react';
import './Blog.css';
import CreateBlog from './CreateBlog';

const FoodCard = ({ post, onClick, onLike, isLiked, likeCount }) => (
  <div className="blog-card">
    <div className="blog-card-image" onClick={() => onClick(post)}>
      {post.image ? (
        <img src={post.image} alt={post.title} />
      ) : (
        <span>Ảnh minh họa</span>
      )}
    </div>
    <div className="blog-card-content" onClick={() => onClick(post)}>
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-desc">{post.description}</p>
      <div className="blog-card-meta">
        <span className="blog-card-category">{post.category}</span>
        <span className="blog-card-date">{post.date}</span>
      </div>
    </div>
    <div className="blog-card-actions" onClick={(e) => e.stopPropagation()}>
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={() => onLike(post.id)}
      >
        <Heart size={16} />
        <span className="like-count">{likeCount}</span>
      </button>
    </div>
  </div>
);

const FoodItem = ({ food, onClick }) => (
  <div className="food-item" onClick={() => onClick(food)}>
    <div className="food-item-image">
      {food.image_url ? (
        <img src={food.image_url} alt={food.name} />
      ) : (
        <span></span>
      )}
    </div>
    <div className="food-item-content">
      <h3 className="food-item-title">{food.name}</h3>
      <p className="food-item-category">{food.category_name}</p>
      <div className="food-item-nutrition">
        <span className="nutrition-item">{food.calories} cal</span>
        <span className="nutrition-item">{food.protein}g protein</span>
        <span className="nutrition-item">{food.carbs}g carbs</span>
      </div>
    </div>
  </div>
);

const FoodCategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="food-category-filter">
    <label htmlFor="food-category" className="filter-label">Lọc theo danh mục:</label>
    <select 
      id="food-category"
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="food-category-select"
    >
      <option value="">Tất cả danh mục</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  </div>
);

const FoodSearchBar = ({ value, onChange }) => (
  <div className="food-search">
    <input
      type="text"
      placeholder="Tìm kiếm thực phẩm..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="food-search-input"
    />
  </div>
);

const FoodModal = ({ food, variations, onClose }) => {
  if (!food) return null;

  return (
    <div className="food-modal-overlay" onClick={onClose}>
      <div className="food-modal" onClick={(e) => e.stopPropagation()}>
        <div className="food-modal-header">
          <h2 className="food-modal-title">Chi tiết</h2>
          <button className="food-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="food-modal-content">
          <div className="food-intro">
            <div className="food-intro-text">
              <h1 className="food-name">{food.name.split('(')[0].trim()}</h1>
              <p className="food-description">
                {food.name.split('(')[0].trim()} rất giàu dinh dưỡng, chứa nhiều vitamin và khoáng chất. 
                Mặc dù có hàm lượng carb cao hơn, những carbohydrate phức tạp giàu tinh bột này được chuyển hóa thành năng lượng 
                và sẽ giúp bạn cảm thấy no lâu hơn. Hãy xem Bảng Calorie {food.name.split('(')[0].trim()} và Sản phẩm {food.name.split('(')[0].trim()} 
                của chúng tôi dưới đây để biết thêm thông tin dinh dưỡng.
              </p>
            </div>
            <div className="food-intro-image">
              <span></span>
            </div>
          </div>
          
          <div className="food-nutrition-table">
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Serving</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {variations.map((variation, index) => (
                  <tr key={index}>
                    <td>{variation.name}</td>
                    <td>{variation.serving}</td>
                    <td>{variation.calories} cal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogDetail = ({ post, onBack, onLike, isLiked, likeCount }) => (
  <div className="blog-detail">
    <button className="back-button" onClick={onBack}>← Quay lại danh sách</button>
    <div className="blog-detail-header">
      <div className="blog-detail-info">
        <h1 className="blog-detail-title">{post.title}</h1>
        <div className="blog-detail-meta">
          <span className="blog-detail-category">{post.category}</span>
          <span className="blog-detail-date">{post.date}</span>
          {post.author_name && (
            <span className="blog-detail-author">Bởi {post.author_name}</span>
          )}
        </div>
      </div>
      <div className="blog-detail-actions">
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={20} />
          <span className="like-count">{likeCount}</span>
        </button>
      </div>
    </div>
    {post.image && <div className="blog-detail-image">
      <img src={post.image} alt={post.title} />
    </div>}
    <div className="blog-detail-content">
      {post.content.split('\n\n').map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  </div>
);

const CategoryFilter = ({ categories, selected, onChange }) => (
  <div className="blog-categories">
    {categories.map(category => (
      <button
        key={category}
        className={`category-button ${selected === category ? 'active' : ''}`}
        onClick={() => onChange(category)}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    ))}
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <div className="blog-search">
    <input
      type="text"
      placeholder="Tìm kiếm bài viết..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FoodList = ({ foods, onFoodClick, loading, currentPage, itemsPerPage, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <div className="food-list-loading">
        <p>Đang tải danh sách thực phẩm...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="no-foods-message">
        <p>Không tìm thấy thực phẩm nào.</p>
      </div>
    );
  }

  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return foods.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = getCurrentItems();

  return (
    <div className="food-list-container">
      <div className="food-list">
        {currentItems.map((food) => (
          <FoodItem
            key={food.id}
            food={food}
            onClick={onFoodClick}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="food-pagination">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const Blog = () => {
  const { 
    filteredPosts, 
    categories, 
    selectedCategory, 
    searchQuery,
    postsLoading,
    userLikes,
    foodItems,
    foodCategories,
    selectedFood,
    showFoodModal,
    loading,
    setSelectedCategory, 
    setSearchQuery,
    toggleLike,
    openFoodModal,
    closeFoodModal,
    getFoodVariations,
    fetchBlogPosts
  } = useBlogContext();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState('blog'); // 'blog' or 'menu'
  
  // Food filtering state
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  
  // Pagination state for food list
  const [currentFoodPage, setCurrentFoodPage] = useState(1);
  const itemsPerPage = 8; // 8-10 items per page

  const [showCreate, setShowCreate] = useState(false);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
  };

  const handleFoodClick = (food) => {
    openFoodModal(food);
  };

  const handleFoodCategoryChange = (categoryId) => {
    setSelectedFoodCategory(categoryId);
    setCurrentFoodPage(1); // Reset to first page when filter changes
  };

  const handleFoodSearchChange = (query) => {
    setFoodSearchQuery(query);
    setCurrentFoodPage(1); // Reset to first page when search changes
  };

  const handleFoodPageChange = (page) => {
    setCurrentFoodPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // Filter food items based on category and search
  const filteredFoodItems = foodItems.filter(food => {
    const matchCategory = !selectedFoodCategory || food.category_id == selectedFoodCategory;
    const matchSearch = food.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
                       food.category_name.toLowerCase().includes(foodSearchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate total pages for food list
  const totalFoodPages = Math.max(1, Math.ceil(filteredFoodItems.length / itemsPerPage));

  const foodVariations = selectedFood ? getFoodVariations(selectedFood) : [];

  return (
    <div className="blog-container">
      {selectedPost ? (
        <BlogDetail 
          post={selectedPost} 
          onBack={handleBackClick}
          onLike={toggleLike}
          isLiked={userLikes.has(selectedPost.id)}
          likeCount={selectedPost.likes_count || 0}
        />
      ) : (
        <>
          <div className="blog-tabs">
            <button 
              className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              Blog
            </button>
            <button 
              className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu List
            </button>
          </div>

          {activeTab === 'blog' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button className="create-blog-btn" onClick={() => setShowCreate(true)}>
                  + Viết Blog
                </button>
              </div>
              <h1 className="blog-title">Bí Quyết Ăn Uống Lành Mạnh</h1>
              
              <div className="blog-controls">
                <CategoryFilter 
                  categories={categories} 
                  selected={selectedCategory} 
                  onChange={setSelectedCategory} 
                />
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                />
              </div>
              
              {postsLoading ? (
                <div className="blog-loading">
                  <p>Đang tải bài viết...</p>
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="blog-card-grid">
                  {filteredPosts.map((post) => (
                    <FoodCard
                      key={post.id}
                      post={post}
                      onClick={handlePostClick}
                      onLike={toggleLike}
                      isLiked={userLikes.has(post.id)}
                      likeCount={post.likes_count || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-posts-message">
                  <p>Không tìm thấy bài viết phù hợp với tiêu chí tìm kiếm của bạn.</p>
                </div>
              )}
              {showCreate && (
                <CreateBlog 
                  onClose={() => setShowCreate(false)}
                  onCreated={fetchBlogPosts}
                />
              )}
            </>
          ) : (
            <>
              <h1 className="blog-title">Danh Sách Thực Phẩm</h1>
              <p className="menu-description">
                Khám phá thông tin dinh dưỡng chi tiết của các loại thực phẩm. 
                Click vào thực phẩm để xem các cách chế biến và hàm lượng calo.
              </p>
              
              <div className="food-controls">
                <FoodCategoryFilter 
                  categories={foodCategories}
                  selectedCategory={selectedFoodCategory}
                  onCategoryChange={handleFoodCategoryChange}
                />
                <FoodSearchBar 
                  value={foodSearchQuery} 
                  onChange={handleFoodSearchChange} 
                />
              </div>
              
              <FoodList 
                foods={filteredFoodItems}
                onFoodClick={handleFoodClick}
                loading={loading}
                currentPage={currentFoodPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalFoodPages}
                onPageChange={handleFoodPageChange}
              />
            </>
          )}
        </>
      )}

      {showFoodModal && (
        <FoodModal 
          food={selectedFood}
          variations={foodVariations}
          onClose={closeFoodModal}
        />
      )}
    </div>
  );
};

export default Blog;