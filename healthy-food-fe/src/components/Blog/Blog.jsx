import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBlogContext } from '../../context/BlogContext';
import { useFoodContext } from '../../context/FoodContext';
import { blogAPI } from '../../services/api';
import { PAGINATION, DEFAULTS, BLOG_TABS, BLOG_HEADER, BLOG_ACTIONS } from '../../constants';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './Blog.css';

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
import CreateBlog from './CreateBlog';

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
    fetchBlogPosts,
    incrementViewCount
  } = useBlogContext();

  const { 
    foodVariations, 
    showVariationsInMain, 
    shouldSwitchToMenuTab,
    resetTabSwitch,
    openFoodDetail,
    closeVariationsInMain
  } = useFoodContext();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState(BLOG_TABS.BLOG);

  useEffect(() => {
    if (shouldSwitchToMenuTab && activeTab !== BLOG_TABS.MENU) {
      setActiveTab(BLOG_TABS.MENU);
      resetTabSwitch();
    }
  }, [shouldSwitchToMenuTab, activeTab, resetTabSwitch]);
  
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [currentFoodPage, setCurrentFoodPage] = useState(DEFAULTS.CURRENT_PAGE);
  const itemsPerPage = PAGINATION.BLOG_PAGE_SIZE;
  const [showCreate, setShowCreate] = useState(false);
  const blogContainerRef = useRef(null)
  const [imageStates, setImageStates] = useState({});
  const { scrollToTop, scrollModalToTop, scrollToTopWithRetry } = useScrollToTop();
  const handleImageLoad = useCallback((postId, type = 'blog') => {
    setImageStates(prev => ({
      ...prev,
      [`${type}_${postId}`]: 'loaded'
    }));
  }, []);

  const handleImageError = useCallback((postId, type = 'blog') => {
    setImageStates(prev => ({
      ...prev,
      [`${type}_${postId}`]: 'error'
    }));
  }, []);

  const shouldShowImage = useCallback((postId, imageUrl, type = 'blog') => {
    const state = imageStates[`${type}_${postId}`];
    return imageUrl && imageUrl.trim() !== '' && state !== 'error';
  }, [imageStates]);

  const shouldShowPlaceholder = useCallback((postId, imageUrl, type = 'blog') => {
    const state = imageStates[`${type}_${postId}`];
    return !imageUrl || imageUrl.trim() === '' || state === 'error';
  }, [imageStates]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      const container = document.querySelector('.home-container');
      if (container && container.scrollTo) {
        container.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleShowCreate = () => {
    setShowCreate(true);
    scrollToTopWithRetry(100, 3);
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
      setSelectedPost(post);
    }
    incrementViewCount(post.id);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    scrollToTopWithRetry(100, 3);
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
          <BlogTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />

          {activeTab === BLOG_TABS.BLOG ? (
            <>
              <BlogHeader 
                onShowCreate={handleShowCreate}
                title={BLOG_HEADER.BLOG_TITLE}
                type={BLOG_TABS.BLOG}
              />
              
              <BlogControls 
                categories={categories} 
                selectedCategory={selectedCategory} 
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory} 
                onSearchChange={setSearchQuery} 
              />
              
              <BlogCardGrid 
                posts={filteredPosts}
                onPostClick={handlePostClick}
                onLike={toggleLike}
                userLikes={userLikes}
                postsLoading={postsLoading}
              />
              
              {showCreate && (
                <CreateBlog 
                  onClose={() => setShowCreate(false)}
                  onCreated={fetchBlogPosts}
                />
              )}
            </>
          ) : (
            <>
              <BlogHeader 
                title="Menu List"
                type={BLOG_TABS.MENU}
              />
              
              {showVariationsInMain ? (
                <div className="food-variations-container">
                  <div className="food-variations-header">
                    <button 
                      className="back-to-foods-btn" 
                      onClick={closeVariationsInMain}
                    >
                      {BLOG_ACTIONS.BACK_TO_FOODS}
                    </button>
                  </div>
                  
                  <div className="food-variations-grid">
                    {foodVariations.map((variation) => (
                      <div key={variation.id} className="food-variation-item">
                        <div className="food-variation-header">
                          <h3>{variation.name}</h3>
                          <span className="calories">{variation.calories} cal</span>
                        </div>
                        
                        <div className="food-variation-nutrition">
                          <div className="nutrition-row">
                            <span>Protein:</span>
                            <span>{variation.protein}g</span>
                          </div>
                          <div className="nutrition-row">
                            <span>Carbs:</span>
                            <span>{variation.carbs}g</span>
                          </div>
                          <div className="nutrition-row">
                            <span>Fat:</span>
                            <span>{variation.fat}g</span>
                          </div>
                        </div>
                        
                        {variation.description && (
                          <div className="food-variation-description">
                            <p>{variation.description}</p>
                          </div>
                        )}
                        
                        <div className="food-variation-actions">
                          <button className="btn-primary" onClick={() => openFoodDetail(variation)}>
                            {BLOG_ACTIONS.VIEW_DETAILS}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <FoodControls 
                    categories={foodCategories}
                    selectedCategory={selectedFoodCategory}
                    searchQuery={foodSearchQuery}
                    onCategoryChange={handleFoodCategoryChange}
                    onSearchChange={handleFoodSearchChange}
                  />
                  
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