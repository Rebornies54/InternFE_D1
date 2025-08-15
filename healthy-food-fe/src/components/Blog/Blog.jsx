import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBlogContext } from '../../context/BlogContext';
import { blogAPI } from '../../services/api';
import { PAGINATION, DEFAULTS, ERROR_MESSAGES } from '../../constants';
import { Heart, Eye } from 'lucide-react';
import { 
  AnimatedCard, 
  AnimatedButton, 
  FadeIn, 
  SlideInLeft, 
  StaggeredList, 
  StaggeredItem,
  AnimatedModal,
  LoadingSpinner
} from '../AnimatedComponents';
import './Blog.css';
import CreateBlog from './CreateBlog';
import Comment from './Comment';

const FoodCard = ({ post, onClick, onLike, isLiked, likeCount }) => (
  <AnimatedCard className="blog-card">
    <div className="blog-card-image" onClick={() => onClick(post)}>
      {post.image_url && post.image_url.trim() !== '' ? (
        <img 
          src={post.image_url} 
          alt={post.title}
          onError={(e) => {
            console.warn(`Failed to load blog image: ${post.image_url}`);
            e.target.style.display = 'none';
            const placeholder = e.target.parentNode.querySelector('.blog-image-placeholder');
            if (placeholder) {
              placeholder.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div 
        className={`blog-image-placeholder ${(post.image_url && post.image_url.trim() !== '') ? 'blog-image-placeholder-hidden' : 'blog-image-placeholder-visible'}`}
      >
        <span>Ảnh minh họa</span>
      </div>
      <div className="blog-card-view-count">
        <Eye size={14} />
        <span>{post.views_count || 0}</span>
      </div>
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
      <AnimatedButton 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={() => onLike(post.id)}
      >
        <Heart size={16} />
        <span className="like-count">{likeCount}</span>
      </AnimatedButton>
    </div>
  </AnimatedCard>
);

const FoodItem = ({ food, onClick }) => (
  <AnimatedCard className="food-item" onClick={() => onClick(food)}>
    <div className="food-item-image">
      {food.image_url && food.image_url.trim() !== '' ? (
        <img 
          src={food.image_url} 
          alt={food.name}
          onError={(e) => {
            console.warn(`Failed to load food image: ${food.image_url}`);
            e.target.style.display = 'none';
            const placeholder = e.target.parentNode.querySelector('.food-image-placeholder');
            if (placeholder) {
              placeholder.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div 
        className={`food-image-placeholder ${(food.image_url && food.image_url.trim() !== '') ? 'food-image-placeholder-hidden' : 'food-image-placeholder-visible'}`}
      >
        <div className="food-placeholder-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <span className="food-placeholder-text">{food.name.split(' ')[0]}</span>
      </div>
    </div>
    <div className="food-item-content">
      <h3 className="food-item-title">{food.name}</h3>
      <p className="food-item-category">{food.category_name}</p>
      <div className="food-item-nutrition">
        <span className="food-item-calories">{food.calories} cal</span>
        <span className="food-item-protein">{food.protein}g protein</span>
        <span className="food-item-carbs">{food.carbs}g carbs</span>
        <span className="food-item-fat">{food.fat}g fat</span>
      </div>
    </div>
  </AnimatedCard>
);

const FoodCategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="food-category-filter">
    <label htmlFor="food-category" className="filter-label">Lọc theo danh mục:</label>
    <div className="food-category-select-wrapper">
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
      <div className="food-category-select-arrow">▼</div>
    </div>
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
    {post.image_url && post.image_url.trim() !== '' && (
      <div className="blog-detail-image">
        <img 
          src={post.image_url} 
          alt={post.title}
          onError={(e) => {
            console.warn(`Failed to load blog detail image: ${post.image_url}`);
            e.target.style.display = 'none';
            const placeholder = e.target.parentNode.querySelector('.blog-detail-placeholder');
            if (placeholder) {
              placeholder.style.display = 'flex';
            }
          }}
        />
        <div 
          className="blog-detail-placeholder blog-detail-placeholder-hidden"
        >
          <span>Ảnh minh họa</span>
        </div>
      </div>
    )}
    <div className="blog-detail-content">
      {post.content.split('\n\n').map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
    
    {/* Comments Section */}
    <Comment postId={post.id} />
  </div>
);

const CategoryFilter = ({ categories, selected, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category) => {
    onChange(category);
    setIsDropdownOpen(false);
  };

  const getSelectedCategoryLabel = () => {
    if (!selected) return 'Tất cả danh mục';
    return selected.charAt(0).toUpperCase() + selected.slice(1);
  };

  return (
    <div className={`blog-categories-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <span className="dropdown-selected">{getSelectedCategoryLabel()}</span>
        <div className="dropdown-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div 
            className={`dropdown-item ${!selected ? 'selected' : ''}`}
            onClick={() => selectCategory('')}
          >
            Tất cả danh mục
          </div>
          {categories.map(category => (
            <div
              key={category}
              className={`dropdown-item ${selected === category ? 'selected' : ''}`}
              onClick={() => selectCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách thực phẩm...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="no-foods-message">
        <div className="no-foods-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <p>Không tìm thấy thực phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
        <p className="no-foods-suggestion">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

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
    fetchBlogPosts,
    incrementViewCount
  } = useBlogContext();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState('blog');
  
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  
  const [currentFoodPage, setCurrentFoodPage] = useState(DEFAULTS.CURRENT_PAGE);
  const itemsPerPage = PAGINATION.BLOG_PAGE_SIZE;

  const [showCreate, setShowCreate] = useState(false);

  // Add refs for DOM elements
  const blogContainerRef = useRef(null);
  const bodyRef = useRef(document.body);

  // State for image loading
  const [imageStates, setImageStates] = useState({});

  // Handle image load success
  const handleImageLoad = useCallback((postId, type = 'blog') => {
    setImageStates(prev => ({
      ...prev,
      [`${type}_${postId}`]: 'loaded'
    }));
  }, []);

  // Handle image load error
  const handleImageError = useCallback((postId, type = 'blog') => {
    setImageStates(prev => ({
      ...prev,
      [`${type}_${postId}`]: 'error'
    }));
  }, []);

  // Check if image should be shown
  const shouldShowImage = useCallback((postId, imageUrl, type = 'blog') => {
    const state = imageStates[`${type}_${postId}`];
    return imageUrl && imageUrl.trim() !== '' && state !== 'error';
  }, [imageStates]);

  // Check if placeholder should be shown
  const shouldShowPlaceholder = useCallback((postId, imageUrl, type = 'blog') => {
    const state = imageStates[`${type}_${postId}`];
    return !imageUrl || imageUrl.trim() === '' || state === 'error';
  }, [imageStates]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    
    setTimeout(() => {
      try {
        // Use refs instead of direct DOM access
        if (blogContainerRef.current && blogContainerRef.current.scrollTop > 0) {
          blogContainerRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          bodyRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      } catch (error) {
        if (import.meta.env.MODE === 'development') {
          console.error('Error scrolling to top:', error);
        }
        bodyRef.current.scrollTo(0, 0);
      }
    }, 100);
  };

  const handleShowCreate = () => {
    setShowCreate(true);
    
    setTimeout(() => {
      try {
        bodyRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        bodyRef.current.scrollTo(0, 0);
      }
    }, 100);
  };

  const handlePostClick = async (post) => {
    try {
      const response = await blogAPI.getPostById(post.id);
      if (response.data.success) {
        setSelectedPost(response.data.data);
      } else {
        setSelectedPost(post);
      }
    } catch (error) {
      // Fallback to existing post data on error
      setSelectedPost(post);
    }
    incrementViewCount(post.id);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    
    setTimeout(() => {
      try {
        bodyRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        bodyRef.current.scrollTo(0, 0);
      }
    }, 100);
  };

  const handleFoodClick = (food) => {
    openFoodModal(food);
  };

  const handleFoodCategoryChange = (categoryId) => {
    setSelectedFoodCategory(categoryId);
    setCurrentFoodPage(1);
  };

  const handleFoodSearchChange = (query) => {
    setFoodSearchQuery(query);
    setCurrentFoodPage(1);
  };

  const handleFoodPageChange = (page) => {
    setCurrentFoodPage(page);
  };

  const filteredFoodItems = foodItems.filter(food => {
    const matchCategory = !selectedFoodCategory || food.category_id == selectedFoodCategory;
    const matchSearch = food.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
                       food.category_name.toLowerCase().includes(foodSearchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalFoodPages = Math.max(1, Math.ceil(filteredFoodItems.length / itemsPerPage));

  const foodVariations = selectedFood ? getFoodVariations(selectedFood) : [];

  // Replace direct DOM manipulation in image rendering
  const renderBlogImage = (post) => {
    const imageKey = `blog_${post.id}`;
    const showImage = shouldShowImage(post.id, post.image_url, 'blog');
    const showPlaceholder = shouldShowPlaceholder(post.id, post.image_url, 'blog');

    return (
      <div className="blog-image-container">
        {showImage ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="blog-image"
            onLoad={() => handleImageLoad(post.id, 'blog')}
            onError={() => handleImageError(post.id, 'blog')}
          />
        ) : null}
        {showPlaceholder && (
          <div className="blog-image-placeholder">
            <span>Ảnh minh họa</span>
          </div>
        )}
      </div>
    );
  };

  const renderFoodImage = (food) => {
    const imageKey = `food_${food.id}`;
    const showImage = shouldShowImage(food.id, food.image_url, 'food');
    const showPlaceholder = shouldShowPlaceholder(food.id, food.image_url, 'food');

    return (
      <div className="food-image-container">
        {showImage ? (
          <img
            src={food.image_url}
            alt={food.name}
            className="food-image"
            onLoad={() => handleImageLoad(food.id, 'food')}
            onError={() => handleImageError(food.id, 'food')}
          />
        ) : null}
        {showPlaceholder && (
          <div className="food-image-placeholder">
            <div className="food-placeholder-icon">
              <span>🍽️</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="blog-container" ref={blogContainerRef}>
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
              onClick={() => handleTabChange('blog')}
            >
              Blog
            </button>
            <button 
              className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => handleTabChange('menu')}
            >
              Menu List
            </button>
          </div>

          {activeTab === 'blog' ? (
            <>
              <div className="blog-create-button-container">
                <button 
                  className="create-blog-btn" 
                  onClick={handleShowCreate}
                  title="Viết blog mới"
                  aria-label="Tạo bài viết blog mới"
                >
                  Viết Blog
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