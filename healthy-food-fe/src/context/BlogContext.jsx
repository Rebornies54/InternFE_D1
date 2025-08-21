// Fixed import
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { foodAPI, blogAPI } from '../services/api';
import { PAGINATION, DEFAULTS, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import useMessageTimer from '../hooks/useMessageTimer';

const BlogContext = createContext();

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  // State for food data
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for blog posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState(new Set());
  const [selectedPost, setSelectedPost] = useState(null);
  
  // State for blog categories and filtering
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPost, setCurrentPost] = useState(null);
  
  // State for food modal
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);

  // State for comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentLikes, setCommentLikes] = useState(new Set());
  const [commentPagination, setCommentPagination] = useState({});

  const [replies, setReplies] = useState({});
  const [repliesLoading, setRepliesLoading] = useState({});
  const [replyLikes, setReplyLikes] = useState({});
  const [repliesPagination, setRepliesPagination] = useState({});

  const [error, setError] = useState(null);

  // Sử dụng custom hook thay vì timeout trực tiếp
  useMessageTimer(error, setError, null, 5000);

  /**
   * Set error message with user-friendly text
   * @param {string} message - Error message
   * @param {Error} originalError - Original error object
   */
  const setErrorMessage = (message, originalError = null) => {
    setError(message);
    if (import.meta.env.MODE === 'development' && originalError) {
    }
  };

  /**
   * Fetch food items from database
   */
  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await foodAPI.getAllItems();
      if (response.data.success) {
        setFoodItems(response.data.data);
      } else {
        setErrorMessage(ERROR_MESSAGES.FOOD_FETCH_FAILED);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch food categories from database
   */
  const fetchFoodCategories = async () => {
    try {
      setError(null);
      const response = await foodAPI.getCategories();
      if (response.data.success) {
        setFoodCategories(response.data.data);
      } else {
        setErrorMessage(ERROR_MESSAGES.CATEGORY_FETCH_FAILED);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
    }
  };

  /**
   * Fetch blog posts from API and map to frontend format
   */
  const fetchBlogPosts = async () => {
    try {
      setPostsLoading(true);
      setError(null);
      const response = await blogAPI.getAllPosts();
      if (response.data.success) {
        const mappedPosts = response.data.data.map(post => ({
          ...post,
          date: new Date(post.created_at).toLocaleDateString('vi-VN')
        }));
        setPosts(mappedPosts);
      } else {
        setErrorMessage(ERROR_MESSAGES.BLOG_FETCH_FAILED);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
    } finally {
      setPostsLoading(false);
    }
  };

  /**
   * Fetch user likes for all posts
   */
  const fetchUserLikes = async () => {
    try {
      setError(null);
      const likedPosts = new Set();
      for (const post of posts) {
        try {
          const response = await blogAPI.checkLiked(post.id);
          if (response.data.success && response.data.liked) {
            likedPosts.add(post.id);
          }
        } catch (error) {
          // Silent fail for individual like checks
          continue;
        }
      }
      setUserLikes(likedPosts);
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.LIKES_FETCH_FAILED, error);
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

      const response = await blogAPI.toggleLike(postId);
      if (!response.data.success) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.LIKE_TOGGLE_FAILED, error);
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

  const memoizedPosts = useMemo(() => posts, [posts]);
  const memoizedComments = useMemo(() => comments, [comments]);

  const checkCommentLikesBatch = useCallback(async (commentIds) => {
    if (!commentIds || commentIds.length === 0) return new Set();
    
    try {
      const response = await blogAPI.checkCommentLikesBatch(commentIds);
      if (response.data.success) {
        return new Set(response.data.data.likedCommentIds || []);
      }
    } catch (error) {
      const likedComments = new Set();
      const checkPromises = commentIds.map(async (commentId) => {
        try {
          const likeResponse = await blogAPI.checkCommentLiked(commentId);
          if (likeResponse.data.success && likeResponse.data.liked) {
            likedComments.add(commentId);
          }
        } catch (error) { /* Error handled */ }});
      
      await Promise.all(checkPromises);
      return likedComments;
    }
    
    return new Set();
  }, []);

  const fetchComments = useCallback(async (postId, page = 1, limit = 10) => {
    try {
      setCommentsLoading(true);
      setError(null);
      
      const response = await blogAPI.getComments(postId, page, limit);
      
      if (response.data.success) {
        if (page === 1) {
          setComments(response.data.data.comments);
        } else {
          setComments(prev => [...prev, ...response.data.data.comments]);
        }
        setCommentPagination(response.data.data.pagination);

        if (page === 1 && response.data.data.comments.length > 0) {
          const commentIds = response.data.data.comments.map(comment => comment.id);
          const likedComments = await checkCommentLikesBatch(commentIds);
          setCommentLikes(likedComments);
        }
      } else {
        setErrorMessage(ERROR_MESSAGES.COMMENTS_FETCH_FAILED);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
    } finally {
      setCommentsLoading(false);
    }
  }, [checkCommentLikesBatch]);

  /**
   * Create a new comment for a post
   * @param {number} postId - The post ID
   * @param {Object} commentData - Comment data
   * @returns {Object} Result object with success status and comment data
   */
  const createComment = async (postId, commentData) => {
    try {
      setError(null);
      const response = await blogAPI.createComment(postId, commentData);
      
      if (response.data.success) {
        const newComment = response.data.data;

        setComments(prev => [newComment, ...prev]);
        
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments_count: (post.comments_count || 0) + 1
            };
          }
          return post;
        }));
        
        return { success: true, comment: newComment };
      } else {
        setErrorMessage(ERROR_MESSAGES.COMMENT_CREATE_FAILED);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  };

  /**
   * Update an existing comment
   * @param {number} commentId - The comment ID
   * @param {Object} commentData - Updated comment data
   * @returns {Object} Result object with success status
   */
  const updateComment = async (commentId, commentData) => {
    try {
      setError(null);
      const response = await blogAPI.updateComment(commentId, commentData);
      
      if (response.data.success) {
        const updatedComment = response.data.data;

        setComments(prev => prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ));
        
        return { success: true, comment: updatedComment };
      } else {
        setErrorMessage(ERROR_MESSAGES.COMMENT_UPDATE_FAILED);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      setError(null);
      const response = await blogAPI.deleteComment(commentId);
      
      if (response.data.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(key => {
            newReplies[key] = newReplies[key].filter(reply => reply.id !== commentId);
          });
          return newReplies;
        });

        setCommentPagination(prev => ({
          ...prev,
          total_comments: Math.max(0, prev.total_comments - 1),
          total_pages: Math.ceil(Math.max(0, prev.total_comments - 1) / 10)
        }));
        
        return { success: true };
      } else {
        setErrorMessage(ERROR_MESSAGES.COMMENT_DELETE_FAILED);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  };

  const fetchReplies = useCallback(async (commentId, page = 1, limit = 5) => {
    try {
      setRepliesLoading(true);
      setError(null);
      
      const response = await blogAPI.getReplies(commentId, page, limit);
      
      if (response.data.success) {
        if (page === 1) {
          setReplies(prev => ({ ...prev, [commentId]: response.data.data.replies }));
        } else {
          setReplies(prev => ({
            ...prev,
            [commentId]: [...(prev[commentId] || []), ...response.data.data.replies]
          }));
        }

        if (page === 1 && response.data.data.replies.length > 0) {
          const replyIds = response.data.data.replies.map(reply => reply.id);
          const likedReplies = await checkCommentLikesBatch(replyIds);
          setReplyLikes(prev => ({ ...prev, [commentId]: likedReplies }));
        }
        
        setRepliesPagination(prev => ({
          ...prev,
          [commentId]: response.data.data.pagination
        }));
      } else {
        setErrorMessage(ERROR_MESSAGES.REPLIES_FETCH_FAILED);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR, error);
    } finally {
      setRepliesLoading(false);
    }
  }, [checkCommentLikesBatch]);

  const toggleCommentLike = async (commentId) => {
    try {
      const currentComment = comments.find(comment => comment.id === commentId) ||
                           Object.values(replies).flat().find(reply => reply.id === commentId);
      
      if (!currentComment) {
        return;
      }

      const isCurrentlyLiked = commentLikes.has(commentId);

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

      setCommentLikes(prev => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.delete(commentId);
        } else {
          newLikes.add(commentId);
        }
        return newLikes;
      });

      const response = await blogAPI.toggleCommentLike(commentId);
      
      if (response.data.success) {
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
        rollbackCommentLikeUpdate(commentId, currentComment, isCurrentlyLiked);
      }
    } catch (error) {
      const currentComment = comments.find(comment => comment.id === commentId) ||
                           Object.values(replies).flat().find(reply => reply.id === commentId);
      const isCurrentlyLiked = commentLikes.has(commentId);
      
      if (currentComment) {
        rollbackCommentLikeUpdate(commentId, currentComment, isCurrentlyLiked);
      }
    }
  };
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
    const fetchCategories = async () => {
      try {
        const blogCategories = [
          'tất cả',
          'thực phẩm',
          'thực đơn', 
          'bí quyết',
          'câu chuyện',
          'công thức'
        ];
        setCategories(blogCategories);
      } catch (error) {
        logError('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      fetchUserLikes();
    }
  }, [posts]);
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCategory = post.category === selectedCategory || selectedCategory === 'tất cả';
      const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

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
    } catch (error) { /* Error handled */ }};

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
