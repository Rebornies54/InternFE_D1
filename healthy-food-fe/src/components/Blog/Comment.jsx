// Fixed import
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { blogAPI } from '../../services/api';
import { PAGINATION, ERROR_MESSAGES } from '../../constants';
import { Heart, MessageCircle, MoreVertical, Edit, Trash, Reply } from 'lucide-react';
import { 
  AnimatedButton, 
  FadeIn, 
  SlideInLeft, 
  StaggeredList, 
  StaggeredItem,
  LoadingSpinner
} from '../AnimatedComponents';
import './Comment.css';
import SortComments from './SortComments';

const Comment = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showOptions, setShowOptions] = useState({});

  const commentEndRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [postId, sortBy]);

  useEffect(() => {
    if (editingComment) {
      setEditText(editingComment.content);
    }
  }, [editingComment]);

  useEffect(() => {
    if (replyingTo) {
      setReplyText('');
    }
  }, [replyingTo]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await blogAPI.getComments(postId, 1, PAGINATION.COMMENT_PAGE_SIZE, sortBy);
      
      if (response.data.success) {
        
        const commentsData = Array.isArray(response.data.data) ? response.data.data : [];
        setComments(commentsData);
        setCurrentPage(1);
        setHasMore(commentsData.length === PAGINATION.COMMENT_PAGE_SIZE);
      } else {
        setError(ERROR_MESSAGES.COMMENTS_FETCH_FAILED);
        setComments([]); 
      }
    } catch (error) {
      logError('Error fetching comments:', error);
      setError(ERROR_MESSAGES.COMMENTS_FETCH_FAILED);
      setComments([]); 
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await blogAPI.getComments(postId, nextPage, PAGINATION.COMMENT_PAGE_SIZE, sortBy);
      
      if (response.data.success) {
        
        const newComments = Array.isArray(response.data.data) ? response.data.data : [];
        setComments(prev => [...prev, ...newComments]);
        setCurrentPage(nextPage);
        setHasMore(newComments.length === PAGINATION.COMMENT_PAGE_SIZE);
      }
    } catch (error) {
      logError('Error loading more comments:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await blogAPI.createComment(postId, { content: newComment.trim() });
      
      if (response.data.success) {
        setComments(prev => [response.data.data, ...(Array.isArray(prev) ? prev : [])]);
        setNewComment('');
      } else {
        setError(ERROR_MESSAGES.COMMENT_CREATE_FAILED);
      }
    } catch (error) {
      logError('Error creating comment:', error);
      setError(ERROR_MESSAGES.COMMENT_CREATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId, replyContent) => {
    if (!replyContent.trim()) return;

    try {
      const response = await blogAPI.createReply(commentId, { content: replyContent.trim() });
      
      if (response.data.success) {
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(Array.isArray(comment.replies) ? comment.replies : []), response.data.data]
            };
          }
          return comment;
        }));
        setReplyingTo(null);
        setReplyText('');
      }
    } catch (error) {
      logError('Error creating reply:', error);
    }
  };

  const handleEditComment = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      const response = await blogAPI.updateComment(editingComment.id, { content: editText.trim() });
      
      if (response.data.success) {
        setComments(prev => Array.isArray(prev) ? prev.map(comment => 
          comment.id === editingComment.id 
            ? { ...comment, content: editText.trim() }
            : comment
        ) : []);
        setEditingComment(null);
        setEditText('');
      }
    } catch (error) {
      logError('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      const response = await blogAPI.deleteComment(commentId);
      
      if (response.data.success) {
        setComments(prev => Array.isArray(prev) ? prev.filter(comment => comment.id !== commentId) : []);
      }
    } catch (error) {
      logError('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await blogAPI.toggleCommentLike(commentId);
      
      if (response.data.success) {
        setComments(prev => Array.isArray(prev) ? prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: !comment.is_liked,
              likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1
            };
          }
          return comment;
        }) : []);
      }
    } catch (error) {
      logError('Error toggling comment like:', error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const response = await blogAPI.toggleReplyLike(replyId);
      
      if (response.data.success) {
        setComments(prev => Array.isArray(prev) ? prev.map(comment => ({
          ...comment,
          replies: Array.isArray(comment.replies) ? comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                is_liked: !reply.is_liked,
                likes_count: reply.is_liked ? reply.likes_count - 1 : reply.likes_count + 1
              };
            }
            return reply;
          }) : []
        })) : []);
      }
    } catch (error) {
      logError('Error toggling reply like:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const toggleOptions = (commentId) => {
    setShowOptions(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const canEditComment = (comment) => {
    return user && comment.user_id === user.id;
  };

  const canDeleteComment = (comment) => {
    return user && (comment.user_id === user.id || user.role === 'admin');
  };

  const renderReply = (reply, commentId) => (
    <div key={reply.id} className="reply-item">
      <div className="reply-header">
        <div className="reply-user-info">
          <img 
            src={reply.user_avatar || '/default-avatar.png'} 
            alt={reply.user_name}
            className="reply-avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="reply-user-details">
            <span className="reply-user-name">{reply.user_name}</span>
            <span className="reply-date">{formatDate(reply.created_at)}</span>
          </div>
        </div>
        <div className="reply-actions">
          <AnimatedButton
            className={`reply-like-btn ${reply.is_liked ? 'liked' : ''}`}
            onClick={() => handleLikeReply(reply.id)}
          >
            <Heart size={12} />
            <span>{reply.likes_count || 0}</span>
          </AnimatedButton>
        </div>
      </div>
      <div className="reply-content">
        <p>{reply.content}</p>
      </div>
    </div>
  );

  const renderComment = (comment) => (
    <div key={comment.id} className="comment-item">
      <div className="comment-header">
        <div className="comment-user-info">
          <img 
            src={comment.user_avatar || '/default-avatar.png'} 
            alt={comment.user_name}
            className="comment-avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="comment-user-details">
            <span className="comment-user-name">{comment.user_name}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
        </div>
        <div className="comment-actions">
          <AnimatedButton
            className={`comment-like-btn ${comment.is_liked ? 'liked' : ''}`}
            onClick={() => handleLikeComment(comment.id)}
          >
            <Heart size={14} />
            <span>{comment.likes_count || 0}</span>
          </AnimatedButton>
          <AnimatedButton
            className="comment-reply-btn"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            <Reply size={14} />
            <span>Trả lời</span>
          </AnimatedButton>
          {(canEditComment(comment) || canDeleteComment(comment)) && (
            <div className="comment-options">
              <AnimatedButton
                className="comment-options-btn"
                onClick={() => toggleOptions(comment.id)}
              >
                <MoreVertical size={14} />
              </AnimatedButton>
              {showOptions[comment.id] && (
                <div className="comment-options-dropdown">
                  {canEditComment(comment) && (
                    <button 
                      type="button"
                      className="comment-option-btn"
                      onClick={() => {
                        setEditingComment(comment);
                        toggleOptions(comment.id);
                      }}
                    >
                      <Edit size={14} />
                      <span>Chỉnh sửa</span>
                    </button>
                  )}
                  {canDeleteComment(comment) && (
                    <button 
                      type="button"
                      className="comment-option-btn delete"
                      onClick={() => {
                        handleDeleteComment(comment.id);
                        toggleOptions(comment.id);
                      }}
                    >
                      <Trash size={14} />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {editingComment?.id === comment.id ? (
        <div className="comment-edit-form">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Chỉnh sửa bình luận..."
            className="comment-edit-textarea"
          />
          <div className="comment-edit-actions">
            <button 
              type="button"
              className="comment-edit-cancel"
              onClick={() => setEditingComment(null)}
            >
              Hủy
            </button>
            <button 
              type="button"
              className="comment-edit-save"
              onClick={handleEditComment}
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-content">
          <p>{comment.content}</p>
        </div>
      )}

      {replyingTo === comment.id && (
        <div className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Viết trả lời..."
            className="reply-textarea"
          />
          <div className="reply-actions">
            <button 
              type="button"
              className="reply-cancel"
              onClick={() => setReplyingTo(null)}
            >
              Hủy
            </button>
            <button 
              type="button"
              className="reply-submit"
              onClick={() => handleReply(comment.id, replyText)}
              disabled={!replyText.trim()}
            >
              Trả lời
            </button>
          </div>
        </div>
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="replies-section">
          <button 
            type="button"
            className="replies-toggle"
            onClick={() => toggleReplies(comment.id)}
          >
            <MessageCircle size={12} />
            <span>
              {showReplies[comment.id] ? 'Ẩn' : 'Hiển thị'} {comment.replies.length} trả lời
            </span>
          </button>
          {showReplies[comment.id] && (
            <div className="replies-list">
              {comment.replies.map(reply => renderReply(reply, comment.id))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="comments-loading">
        <LoadingSpinner />
        <p>Đang tải bình luận...</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3 className="comments-title">
          Bình luận ({Array.isArray(comments) ? comments.length : 0})
        </h3>
        <SortComments 
          sortBy={sortBy} 
          onSortChange={setSortBy} 
        />
      </div>

      {error && (
        <div className="comments-error">
          <p>{error}</p>
          <button type="button" onClick={fetchComments}>Thử lại</button>
        </div>
      )}

      {user && (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <div className="comment-form-header">
            <img 
              src={user.avatar_url || '/default-avatar.png'} 
              alt={user.name}
              className="comment-form-avatar"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="comment-form-textarea"
              disabled={submitting}
            />
          </div>
          <div className="comment-form-actions">
            <button 
              type="submit" 
              className="comment-form-submit"
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        <StaggeredList>
          {Array.isArray(comments) && comments.map((comment, index) => (
            <StaggeredItem key={comment.id} index={index}>
              <FadeIn>
                {renderComment(comment)}
              </FadeIn>
            </StaggeredItem>
          ))}
        </StaggeredList>
      </div>

      {hasMore && (
        <div className="comments-load-more">
          <button 
            type="button"
            className="load-more-btn"
            onClick={loadMoreComments}
            disabled={loadingMore}
          >
            {loadingMore ? 'Đang tải...' : 'Tải thêm bình luận'}
          </button>
        </div>
      )}

      {!user && (
        <div className="comments-login-prompt">
          <p>Vui lòng đăng nhập để bình luận</p>
        </div>
      )}
    </div>
  );
};

export default Comment; 