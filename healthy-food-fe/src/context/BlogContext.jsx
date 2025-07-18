import React, { createContext, useContext, useState, useEffect } from 'react';
import { foodAPI, blogAPI } from '../services/api';

// Khởi tạo context
const BlogContext = createContext();

// Custom hook sử dụng BlogContext
export const useBlogContext = () => useContext(BlogContext);

// Dữ liệu mẫu ban đầu
const initialBlogPosts = [
  {
    id: 1,
    title: "Khoai tây - Nguồn vitamin C dồi dào",
    description: "Khoai tây chứa hàm lượng vitamin C cao...",
    image: "",
    category: "thực phẩm",
    date: "2025-07-10",
    content: `Khoai tây thường bị đánh giá thấp...`
  },
  {
    id: 2,
    title: "Rau củ - Thực phẩm ít calo, nhiều dưỡng chất",
    description: "Rau củ là lựa chọn tuyệt vời...",
    image: "",
    category: "thực phẩm",
    date: "2025-07-12",
    content: `Rau củ là nền tảng của mọi chế độ ăn lành mạnh...`
  },
  {
    id: 3,
    title: "Nấm - Protein thực vật chất lượng cao",
    description: "Giàu protein và ít calo...",
    image: "",
    category: "thực phẩm",
    date: "2025-07-15",
    content: `Nấm không chỉ là một nguyên liệu ngon miệng...`
  },
  {
    id: 4,
    title: "Cách xây dựng thực đơn cân bằng",
    description: "Một thực đơn cân bằng giúp cung cấp đầy đủ dưỡng chất...",
    image: "",
    category: "thực đơn",
    date: "2025-07-05",
    content: `Thực đơn cân bằng lý tưởng nên bao gồm...`
  },
  {
    id: 5,
    title: "Bí quyết ăn uống cân bằng khi bận rộn",
    description: "Duy trì chế độ ăn lành mạnh ngay cả khi lịch trình bận rộn...",
    image: "",
    category: "bí quyết",
    date: "2025-07-08",
    content: `Cuộc sống bận rộn không phải là lý do để từ bỏ ăn uống lành mạnh...`
  },
  {
    id: 6,
    title: "Thủy phân cơ thể - Tầm quan trọng của nước",
    description: "Uống đủ nước không chỉ giúp duy trì sức khỏe...",
    image: "",
    category: "bí quyết",
    date: "2025-07-03",
    content: `Nước đóng vai trò thiết yếu trong mọi chức năng của cơ thể...`
  }
];

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories] = useState(['tất cả', 'thực phẩm', 'thực đơn', 'bí quyết']);
  const [selectedCategory, setSelectedCategory] = useState('tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPost, setCurrentPost] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState(new Set());
  
  // Food items state
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch food items from database
  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllItems();
      if (response.data.success) {
        setFoodItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch food categories
  const fetchFoodCategories = async () => {
    try {
      const response = await foodAPI.getCategories();
      if (response.data.success) {
        setFoodCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching food categories:', error);
    }
  };

  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await blogAPI.getAllPosts();
      if (response.data.success) {
        // Map API data to frontend format
        const mappedPosts = response.data.data.map(post => ({
          ...post,
          image: post.image_url, // Map image_url to image for frontend compatibility
          date: new Date(post.created_at).toLocaleDateString('vi-VN')
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch user likes
  const fetchUserLikes = async () => {
    try {
      const likedPosts = new Set();
      for (const post of posts) {
        try {
          const response = await blogAPI.checkLiked(post.id);
          if (response.data.success && response.data.liked) {
            likedPosts.add(post.id);
          }
        } catch (error) {
          console.error(`Error checking like for post ${post.id}:`, error);
        }
      }
      setUserLikes(likedPosts);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  // Toggle like for a post
  const toggleLike = async (postId) => {
    try {
      const response = await blogAPI.toggleLike(postId);
      if (response.data.success) {
        // Update posts with new like count
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: response.data.liked ? post.likes_count + 1 : post.likes_count - 1
            };
          }
          return post;
        }));

        // Update user likes
        setUserLikes(prev => {
          const newLikes = new Set(prev);
          if (response.data.liked) {
            newLikes.add(postId);
          } else {
            newLikes.delete(postId);
          }
          return newLikes;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFoodItems();
    fetchFoodCategories();
    fetchBlogPosts();
  }, []);

  // Fetch user likes when posts are loaded
  useEffect(() => {
    if (posts.length > 0) {
      fetchUserLikes();
    }
  }, [posts]);

  // Lọc bài viết theo danh mục và từ khóa tìm kiếm
  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'tất cả' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Thêm bài viết mới
  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0]
    };
    setPosts(prev => [...prev, postWithId]);
  };

  // Cập nhật bài viết
  const updatePost = (updatedPost) => {
    setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  // Xóa bài viết
  const deletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  // Lấy bài viết theo ID
  const getPostById = (postId) => {
    return posts.find(post => post.id === postId);
  };

  // Food modal functions
  const openFoodModal = (food) => {
    setSelectedFood(food);
    setShowFoodModal(true);
  };

  const closeFoodModal = () => {
    setSelectedFood(null);
    setShowFoodModal(false);
  };

  // Generate food variations based on selected food
  const getFoodVariations = (food) => {
    if (!food) return [];
    
    const baseName = food.name.split('(')[0].trim();
    const categoryName = food.category_name?.toLowerCase() || '';
    
    // Định nghĩa cách chế biến phù hợp cho từng loại thực phẩm
    const variations = [];
    
    // Meat / Eggs / Seafood
    if (categoryName.includes('meat') || categoryName.includes('eggs') || categoryName.includes('seafood')) {
      variations.push(
        { name: `${baseName} (raw)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (grilled)`, serving: '100g', calories: Math.round(food.calories * 0.9) },
        { name: `${baseName} (fried)`, serving: '100g', calories: Math.round(food.calories * 1.3) },
        { name: `${baseName} (baked)`, serving: '100g', calories: Math.round(food.calories * 0.95) },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.85) }
      );
    }
    // Vegetables & Legumes
    else if (categoryName.includes('vegetables') || categoryName.includes('legumes')) {
      variations.push(
        { name: `${baseName} (raw)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
        { name: `${baseName} (boiled)`, serving: '100g', calories: Math.round(food.calories * 0.75) },
        { name: `${baseName} (stir-fried)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
        { name: `${baseName} (roasted)`, serving: '100g', calories: Math.round(food.calories * 1.1) }
      );
    }
    // Fruits
    else if (categoryName.includes('fruits')) {
      variations.push(
        { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (dried)`, serving: '100g', calories: Math.round(food.calories * 3.5) },
        { name: `${baseName} (juice)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
        { name: `${baseName} (smoothie)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
        { name: `${baseName} (frozen)`, serving: '100g', calories: Math.round(food.calories * 0.9) }
      );
    }
    // Grains / Cereals / Breads
    else if (categoryName.includes('grains') || categoryName.includes('cereals') || categoryName.includes('breads')) {
      variations.push(
        { name: `${baseName} (cooked)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (toasted)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
        { name: `${baseName} (fried)`, serving: '100g', calories: Math.round(food.calories * 1.4) },
        { name: `${baseName} (baked)`, serving: '100g', calories: Math.round(food.calories * 1.05) },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.95) }
      );
    }
    // Beverages & Dairy Products
    else if (categoryName.includes('beverages') || categoryName.includes('dairy')) {
      if (baseName.toLowerCase().includes('milk') || baseName.toLowerCase().includes('yogurt')) {
        variations.push(
          { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (skim)`, serving: '100g', calories: Math.round(food.calories * 0.7) },
          { name: `${baseName} (whole)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
          { name: `${baseName} (flavored)`, serving: '100g', calories: Math.round(food.calories * 1.3) },
          { name: `${baseName} (fortified)`, serving: '100g', calories: Math.round(food.calories * 1.05) }
        );
      } else if (baseName.toLowerCase().includes('cheese')) {
        variations.push(
          { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (aged)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
          { name: `${baseName} (melted)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
          { name: `${baseName} (grated)`, serving: '100g', calories: Math.round(food.calories * 1.05) },
          { name: `${baseName} (processed)`, serving: '100g', calories: Math.round(food.calories * 1.15) }
        );
      } else {
        variations.push(
          { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (chilled)`, serving: '100g', calories: Math.round(food.calories * 0.95) },
          { name: `${baseName} (warm)`, serving: '100g', calories: Math.round(food.calories * 1.02) },
          { name: `${baseName} (fortified)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
          { name: `${baseName} (organic)`, serving: '100g', calories: Math.round(food.calories * 1.05) }
        );
      }
    }
    // Snacks & Processed Foods
    else if (categoryName.includes('snacks') || categoryName.includes('processed')) {
      if (baseName.toLowerCase().includes('chips') || baseName.toLowerCase().includes('fries')) {
        variations.push(
          { name: `${baseName} (fried)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (baked)`, serving: '100g', calories: Math.round(food.calories * 0.7) },
          { name: `${baseName} (air-fried)`, serving: '100g', calories: Math.round(food.calories * 0.6) },
          { name: `${baseName} (homemade)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
          { name: `${baseName} (restaurant)`, serving: '100g', calories: Math.round(food.calories * 1.2) }
        );
      } else if (baseName.toLowerCase().includes('chocolate') || baseName.toLowerCase().includes('candy')) {
        variations.push(
          { name: `${baseName} (dark)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (milk)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
          { name: `${baseName} (white)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
          { name: `${baseName} (sugar-free)`, serving: '100g', calories: Math.round(food.calories * 0.3) },
          { name: `${baseName} (organic)`, serving: '100g', calories: Math.round(food.calories * 1.05) }
        );
      } else {
        variations.push(
          { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
          { name: `${baseName} (frozen)`, serving: '100g', calories: Math.round(food.calories * 0.95) },
          { name: `${baseName} (homemade)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
          { name: `${baseName} (restaurant)`, serving: '100g', calories: Math.round(food.calories * 1.3) },
          { name: `${baseName} (premium)`, serving: '100g', calories: Math.round(food.calories * 1.1) }
        );
      }
    }
    // Default fallback
    else {
      variations.push(
        { name: `${baseName} (raw)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (cooked)`, serving: '100g', calories: Math.round(food.calories * 0.9) },
        { name: `${baseName} (processed)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
        { name: `${baseName} (fresh)`, serving: '100g', calories: Math.round(food.calories * 0.95) },
        { name: `${baseName} (prepared)`, serving: '100g', calories: Math.round(food.calories * 1.05) }
      );
    }
    
    return variations;
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        filteredPosts,
        categories,
        selectedCategory,
        searchQuery,
        currentPost,
        postsLoading,
        userLikes,
        foodItems,
        foodCategories,
        selectedFood,
        showFoodModal,
        loading,
        setSelectedCategory,
        setSearchQuery,
        setCurrentPost,
        addPost,
        updatePost,
        deletePost,
        getPostById,
        toggleLike,
        openFoodModal,
        closeFoodModal,
        getFoodVariations,
        fetchFoodItems
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
