import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { foodAPI, blogAPI } from '../services/api';

const BlogContext = createContext();

/**
 * Custom hook để sử dụng BlogContext
 * @returns {Object} BlogContext value
 */
export const useBlogContext = () => useContext(BlogContext);

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
  
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentLikes, setCommentLikes] = useState(new Set());
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replies, setReplies] = useState({});
  const [repliesLoading, setRepliesLoading] = useState({});
  const [commentPagination, setCommentPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_comments: 0,
    has_next: false,
    has_prev: false
  });

  /**
   * Fetch food items from database
   */
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

  /**
   * Fetch food categories from database
   */
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

  /**
   * Fetch blog posts from API and map to frontend format
   */
  const fetchBlogPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await blogAPI.getAllPosts();
      if (response.data.success) {
        const mappedPosts = response.data.data.map(post => ({
          ...post,
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

  /**
   * Fetch user likes for all posts
   */
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
          console.error('Error checking like status:', error);
        }
      }
      setUserLikes(likedPosts);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  /**
   * Toggle like for a post with optimistic updates
   * @param {number} postId - The post ID to toggle like
   */
  const toggleLike = async (postId) => {
    try {
      const currentPost = posts.find(post => post.id === postId);
      const isCurrentlyLiked = userLikes.has(postId);
      
      // Optimistic update for immediate UI feedback
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: isCurrentlyLiked ? 
              Math.max(post.likes_count - 1, 0) : 
              post.likes_count + 1
          };
        }
        return post;
      }));

      setUserLikes(prev => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.delete(postId);
        } else {
          newLikes.add(postId);
        }
        return newLikes;
      });

      // Call API
      const response = await blogAPI.toggleLike(postId);
      
      if (response.data.success) {
        // Update with accurate data from server
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: response.data.liked ? 
                (currentPost?.likes_count || 0) + 1 : 
                Math.max((currentPost?.likes_count || 0) - 1, 0)
            };
          }
          return post;
        }));

        setUserLikes(prev => {
          const newLikes = new Set(prev);
          if (response.data.liked) {
            newLikes.add(postId);
          } else {
            newLikes.delete(postId);
          }
          return newLikes;
        });
      } else {
        // Rollback optimistic update if API fails
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: currentPost?.likes_count || 0
            };
          }
          return post;
        }));

        setUserLikes(prev => {
          const newLikes = new Set(prev);
          if (isCurrentlyLiked) {
            newLikes.add(postId);
          } else {
            newLikes.delete(postId);
          }
          return newLikes;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Rollback optimistic update on error
      const currentPost = posts.find(post => post.id === postId);
      const isCurrentlyLiked = userLikes.has(postId);
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: currentPost?.likes_count || 0
          };
        }
        return post;
      }));

      setUserLikes(prev => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.add(postId);
        } else {
          newLikes.delete(postId);
        }
        return newLikes;
      });
    }
  };

  /**
   * Fetch comments for a post with pagination and sorting
   * @param {number} postId - The post ID
   * @param {number} page - Page number (default: 1)
   * @param {string} sortBy - Sort order ('newest', 'oldest', 'most_liked')
   */
  const fetchComments = useCallback(async (postId, page = 1, sortBy = 'newest') => {
    try {
      setCommentsLoading(true);
      const response = await blogAPI.getComments(postId, page, sortBy);
      
      if (response.data.success) {
        if (page === 1) {
          setComments(response.data.data.comments);
        } else {
          setComments(prev => [...prev, ...response.data.data.comments]);
        }
        setCommentPagination(response.data.data.pagination);
        
        // Initialize comment likes for new comments (only on first page)
        if (page === 1) {
          const likedComments = new Set();
          const checkPromises = response.data.data.comments.map(async (comment) => {
            try {
              const likeResponse = await blogAPI.checkCommentLiked(comment.id);
              if (likeResponse.data.success && likeResponse.data.liked) {
                likedComments.add(comment.id);
              }
            } catch (error) {
              console.error('Error checking comment like status:', error);
            }
          });
          
          await Promise.all(checkPromises);
          setCommentLikes(likedComments);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  }, []);



  /**
   * Create a new comment for a post
   * @param {number} postId - The post ID
   * @param {Object} commentData - Comment data
   * @returns {Object} Result object with success status and comment data
   */
  const createComment = async (postId, commentData) => {
    try {
      const response = await blogAPI.createComment(postId, commentData);
      
      if (response.data.success) {
        const newComment = response.data.data;
        
        // Optimistic update
        setComments(prev => [newComment, ...prev]);
        
        // Update pagination
        setCommentPagination(prev => ({
          ...prev,
          total_comments: prev.total_comments + 1,
          total_pages: Math.ceil((prev.total_comments + 1) / 10)
        }));
        
        return { success: true, comment: newComment };
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo comment' };
    }
  };

  /**
   * Update an existing comment
   * @param {number} commentId - The comment ID
   * @param {string} content - New comment content
   * @returns {Object} Result object with success status and updated comment
   */
  const updateComment = async (commentId, content) => {
    try {
      const response = await blogAPI.updateComment(commentId, { content });
      
      if (response.data.success) {
        const updatedComment = response.data.data;
        
        // Optimistic update for comments and replies
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ));
        
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(key => {
            newReplies[key] = newReplies[key].map(reply => 
              reply.id === commentId ? updatedComment : reply
            );
          });
          return newReplies;
        });
        
        return { success: true, comment: updatedComment };
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật comment' };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await blogAPI.deleteComment(commentId);
      
      if (response.data.success) {
        // Optimistic update
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        
        // Remove from replies
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(key => {
            newReplies[key] = newReplies[key].filter(reply => reply.id !== commentId);
          });
          return newReplies;
        });
        
        // Update pagination
        setCommentPagination(prev => ({
          ...prev,
          total_comments: Math.max(0, prev.total_comments - 1),
          total_pages: Math.ceil(Math.max(0, prev.total_comments - 1) / 10)
        }));
        
        return { success: true };
      }
    } catch (error) {
      // Error deleting comment
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa comment' };
    }
  };

  const fetchReplies = useCallback(async (commentId, page = 1) => {
    try {
      setRepliesLoading(prev => ({ ...prev, [commentId]: true }));
      const response = await blogAPI.getReplies(commentId, page);
      
      if (response.data.success) {
        if (page === 1) {
          setReplies(prev => ({ ...prev, [commentId]: response.data.data.replies }));
        } else {
          setReplies(prev => ({
            ...prev,
            [commentId]: [...(prev[commentId] || []), ...response.data.data.replies]
          }));
        }
        
        // Khởi tạo commentLikes cho replies mới - chỉ gọi một lần
        if (page === 1 && response.data.data.replies && response.data.data.replies.length > 0) {
          const likedReplies = new Set();
          const checkPromises = response.data.data.replies.map(async (reply) => {
            try {
              const likeResponse = await blogAPI.checkCommentLiked(reply.id);
              if (likeResponse.data.success && likeResponse.data.liked) {
                likedReplies.add(reply.id);
              }
            } catch (error) {
              // Error checking reply like status
            }
          });
          
          await Promise.all(checkPromises);
          setCommentLikes(prev => new Set([...prev, ...likedReplies]));
        }
      }
    } catch (error) {
      // Error fetching replies
      // Không làm crash app khi có lỗi fetch replies
    } finally {
      setRepliesLoading(prev => ({ ...prev, [commentId]: false }));
    }
  }, []);

  const toggleCommentLike = async (commentId) => {
    try {
      // Kiểm tra comment tồn tại
      const currentComment = comments.find(comment => comment.id === commentId) ||
                           Object.values(replies).flat().find(reply => reply.id === commentId);
      
      if (!currentComment) {
        // Comment not found
        return;
      }

      const isCurrentlyLiked = commentLikes.has(commentId);
      
      // Optimistic update cho comments
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes_count: isCurrentlyLiked ? 
              Math.max(comment.likes_count - 1, 0) : 
              comment.likes_count + 1
          };
        }
        return comment;
      }));

      // Optimistic update cho replies
      setReplies(prev => {
        const newReplies = { ...prev };
        Object.keys(newReplies).forEach(key => {
          newReplies[key] = newReplies[key].map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes_count: isCurrentlyLiked ? 
                  Math.max(reply.likes_count - 1, 0) : 
                  reply.likes_count + 1
              };
            }
            return reply;
          });
        });
        return newReplies;
      });

      // Optimistic update cho commentLikes
      setCommentLikes(prev => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.delete(commentId);
        } else {
          newLikes.add(commentId);
        }
        return newLikes;
      });

      // Gọi API
      const response = await blogAPI.toggleCommentLike(commentId);
      
      if (response.data.success) {
        // Cập nhật lại với dữ liệu chính xác từ server
        const newLikedState = response.data.liked;
        
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes_count: newLikedState ? 
                (currentComment.likes_count || 0) + 1 : 
                Math.max((currentComment.likes_count || 0) - 1, 0)
            };
          }
          return comment;
        }));

        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(key => {
            newReplies[key] = newReplies[key].map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes_count: newLikedState ? 
                    (currentComment.likes_count || 0) + 1 : 
                    Math.max((currentComment.likes_count || 0) - 1, 0)
                };
              }
              return reply;
            });
          });
          return newReplies;
        });

        // Cập nhật commentLikes với response từ server
        setCommentLikes(prev => {
          const newLikes = new Set(prev);
          if (newLikedState) {
            newLikes.add(commentId);
          } else {
            newLikes.delete(commentId);
          }
          return newLikes;
        });
      } else {
        // Rollback optimistic update nếu API thất bại
        rollbackCommentLikeUpdate(commentId, currentComment, isCurrentlyLiked);
      }
    } catch (error) {
      // Error toggling comment like
      
      // Rollback optimistic update khi có lỗi
      const currentComment = comments.find(comment => comment.id === commentId) ||
                           Object.values(replies).flat().find(reply => reply.id === commentId);
      const isCurrentlyLiked = commentLikes.has(commentId);
      
      if (currentComment) {
        rollbackCommentLikeUpdate(commentId, currentComment, isCurrentlyLiked);
      }
    }
  };

  // Helper function để rollback comment like update
  const rollbackCommentLikeUpdate = (commentId, originalComment, wasLiked) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes_count: originalComment.likes_count || 0
        };
      }
      return comment;
    }));

    setReplies(prev => {
      const newReplies = { ...prev };
      Object.keys(newReplies).forEach(key => {
        newReplies[key] = newReplies[key].map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              likes_count: originalComment.likes_count || 0
            };
          }
          return reply;
        });
      });
      return newReplies;
    });

    setCommentLikes(prev => {
      const newLikes = new Set(prev);
      if (wasLiked) {
        newLikes.add(commentId);
      } else {
        newLikes.delete(commentId);
      }
      return newLikes;
    });
  };

  const clearComments = useCallback(() => {
    setComments([]);
    setReplies({});
    setCommentLikes(new Set());
    setCommentPagination({
      current_page: 1,
      total_pages: 0,
      total_comments: 0,
      has_next: false,
      has_prev: false
    });
  }, []);

  useEffect(() => {
    fetchFoodItems();
    fetchFoodCategories();
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      fetchUserLikes();
    }
  }, [posts]);

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'tất cả' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0]
    };
    setPosts(prev => [...prev, postWithId]);
  };

  const updatePost = (updatedPost) => {
    setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const getPostById = (postId) => {
    return posts.find(post => post.id === postId);
  };

  const openFoodModal = (food) => {
    setSelectedFood(food);
    setShowFoodModal(true);
  };

  const closeFoodModal = () => {
    setSelectedFood(null);
    setShowFoodModal(false);
  };

  const getFoodVariations = (food) => {
    if (!food) return [];
    
    const baseName = food.name.split('(')[0].trim();
    const categoryName = food.category_name?.toLowerCase() || '';
    
    const variations = [];
    
    if (categoryName.includes('meat') || categoryName.includes('eggs') || categoryName.includes('seafood')) {
      variations.push(
        { name: `${baseName} (raw)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (grilled)`, serving: '100g', calories: Math.round(food.calories * 0.9) },
        { name: `${baseName} (fried)`, serving: '100g', calories: Math.round(food.calories * 1.3) },
        { name: `${baseName} (baked)`, serving: '100g', calories: Math.round(food.calories * 0.95) },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.85) }
      );
    }
    else if (categoryName.includes('vegetables') || categoryName.includes('legumes')) {
      variations.push(
        { name: `${baseName} (raw)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
        { name: `${baseName} (boiled)`, serving: '100g', calories: Math.round(food.calories * 0.75) },
        { name: `${baseName} (stir-fried)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
        { name: `${baseName} (roasted)`, serving: '100g', calories: Math.round(food.calories * 1.1) }
      );
    }
    else if (categoryName.includes('fruits')) {
      variations.push(
        { name: `${baseName} (fresh)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (dried)`, serving: '100g', calories: Math.round(food.calories * 3.5) },
        { name: `${baseName} (juice)`, serving: '100g', calories: Math.round(food.calories * 0.8) },
        { name: `${baseName} (smoothie)`, serving: '100g', calories: Math.round(food.calories * 1.2) },
        { name: `${baseName} (frozen)`, serving: '100g', calories: Math.round(food.calories * 0.9) }
      );
    }
    else if (categoryName.includes('grains') || categoryName.includes('cereals') || categoryName.includes('breads')) {
      variations.push(
        { name: `${baseName} (cooked)`, serving: '100g', calories: food.calories },
        { name: `${baseName} (toasted)`, serving: '100g', calories: Math.round(food.calories * 1.1) },
        { name: `${baseName} (fried)`, serving: '100g', calories: Math.round(food.calories * 1.4) },
        { name: `${baseName} (baked)`, serving: '100g', calories: Math.round(food.calories * 1.05) },
        { name: `${baseName} (steamed)`, serving: '100g', calories: Math.round(food.calories * 0.95) }
      );
    }
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

  const incrementViewCount = async (postId) => {
    try {
      await blogAPI.incrementViewCount(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, views_count: (post.views_count || 0) + 1 }
            : post
        )
      );
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const value = {
    posts,
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
    filteredPosts,
    setSelectedCategory,
    setSearchQuery,
    setCurrentPost,
    toggleLike,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    openFoodModal,
    closeFoodModal,
    getFoodVariations,
    fetchFoodItems,
    comments,
    commentsLoading,
    replies,
    repliesLoading,
    commentPagination,
    commentLikes,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    fetchReplies,
    toggleCommentLike,
    clearComments,
    incrementViewCount
  };

  return (
    <BlogContext.Provider
      value={value}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
