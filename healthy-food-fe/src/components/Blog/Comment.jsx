import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { Heart, MessageCircle, Edit, Trash2, Reply, MoreVertical } from 'lucide-react';
import SortComments from './SortComments';
import './Comment.css';

const CommentItem = ({ comment, onReply, onEdit, onDelete, onLike, isLiked, showReplies = false, currentUser, fetchReplies, replies, repliesLoading, commentLikes }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRepliesState, setShowRepliesState] = useState(false);



  const isAuthor = currentUser?.id === comment?.user_id;
  const commentReplies = replies[comment?.id] || [];
  const hasReplies = comment?.replies_count > 0;

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await onReply(comment.id, replyContent);
      if (result && result.success) {
        setReplyContent('');
        setShowReplyForm(false);
        if (fetchReplies) {
          fetchReplies(comment.id);
        }
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await onLike(comment.id);
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const handleShowReplies = () => {
    if (!showRepliesState && hasReplies && fetchReplies) {
      setShowRepliesState(true);
      fetchReplies(comment.id);
    } else if (showRepliesState) {
      setShowRepliesState(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Vừa xong';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Vừa xong';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} giờ trước`;
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Vừa xong';
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <div className="comment-avatar">
            {comment.author_avatar && comment.author_avatar.trim() !== '' ? (
              <img src={comment.author_avatar} alt={comment.author_name} />
            ) : (
              <div className="avatar-placeholder">
                {comment.author_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="comment-info">
            <span className="comment-author-name">{comment.author_name}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
        </div>
        
        {isAuthor && (
          <div className="comment-options">
            <button 
              className="options-toggle"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={16} />
            </button>
            {showOptions && (
              <div className="options-menu">
                <button onClick={() => onEdit(comment)}>
                  <Edit size={14} />
                  Chỉnh sửa
                </button>
                <button onClick={() => onDelete(comment.id)}>
                  <Trash2 size={14} />
                  Xóa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="comment-content">
        {comment.content}
      </div>

      <div className="comment-actions">
        <button 
          className={`action-btn like-btn ${commentLikes && commentLikes.has ? commentLikes.has(comment.id) : false ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!currentUser}
        >
          <Heart size={16} />
          <span>{comment.likes_count || 0}</span>
        </button>
        
        {currentUser && (
          <button 
            className="action-btn reply-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <Reply size={16} />
            Trả lời
          </button>
        )}

        {hasReplies && (
          <button 
            className="action-btn replies-btn"
            onClick={handleShowReplies}
          >
            <MessageCircle size={16} />
            {comment.replies_count} trả lời
          </button>
        )}
      </div>

      {showReplyForm && currentUser && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Viết trả lời..."
            rows={3}
          />
          <div className="reply-actions">
            <button 
              className="btn-cancel"
              onClick={() => setShowReplyForm(false)}
            >
              Hủy
            </button>
            <button 
              className="btn-submit"
              onClick={handleReply}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </div>
      )}

      {showRepliesState && commentReplies.length > 0 && (
        <div className="replies-container">
          {repliesLoading[comment.id] ? (
            <div className="loading-replies">Đang tải trả lời...</div>
          ) : (
            commentReplies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                isLiked={commentLikes && commentLikes.has ? commentLikes.has(reply.id) : false}
                showReplies={false}
                currentUser={currentUser}
                fetchReplies={fetchReplies}
                replies={replies}
                repliesLoading={repliesLoading}
                commentLikes={commentLikes}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const CommentForm = ({ onSubmit, placeholder = "Viết bình luận..." }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await onSubmit(content);
      if (result.success) {
        setContent('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="comment-textarea"
      />
      <div className="form-actions">
        <button 
          className="btn-submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </div>
    </div>
  );
};

const Comment = ({ postId }) => {
  const { user } = useAuth();
  const { 
    comments, 
    commentsLoading, 
    commentPagination,
    fetchComments, 
    createComment, 
    updateComment, 
    deleteComment,
    clearComments,
    fetchReplies,
    replies,
    repliesLoading,
    toggleCommentLike,
    commentLikes
  } = useBlogContext();

  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [currentSort, setCurrentSort] = useState('newest');

  useEffect(() => {
    if (postId && fetchComments) {
      fetchComments(postId, 1, currentSort);
    }
    
    return () => {
      if (clearComments) {
        clearComments();
      }
    };
  }, [postId, fetchComments, clearComments, currentSort]);

  const handleCreateComment = async (content) => {
    if (!user) return { success: false, message: 'Vui lòng đăng nhập' };
    if (!createComment) return { success: false, message: 'Lỗi hệ thống' };
    
    try {
      return await createComment(postId, { content });
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, message: 'Lỗi khi tạo comment' };
    }
  };

  const handleReply = async (parentId, content) => {
    if (!user) return { success: false, message: 'Vui lòng đăng nhập' };
    if (!createComment) return { success: false, message: 'Lỗi hệ thống' };
    
    try {
      return await createComment(postId, { content, parent_id: parentId });
    } catch (error) {
      console.error('Error creating reply:', error);
      return { success: false, message: 'Lỗi khi tạo reply' };
    }
  };

  const handleEdit = (comment) => {
    if (!user || !comment) return;
    setEditingComment(comment);
    setEditContent(comment.content || '');
  };

  const handleUpdateComment = async () => {
    if (!editContent.trim() || !user || !editingComment || !updateComment) return;
    
    try {
      const result = await updateComment(editingComment.id, editContent);
      if (result && result.success) {
        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user || !deleteComment) return;
    if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      try {
        await deleteComment(commentId);
          } catch (error) {
      console.error('Error deleting comment:', error);
    }
    }
  };

  const handleLoadMore = () => {
    if (commentPagination && commentPagination.has_next && fetchComments) {
      fetchComments(postId, commentPagination.current_page + 1, currentSort);
    }
  };

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    if (fetchComments) {
      fetchComments(postId, 1, newSort);
    }
  };

  if (!postId) {
    return <div className="comments-section">Không tìm thấy bài viết</div>;
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Bình luận ({commentPagination?.total_comments || 0})
      </h3>

      {!user ? (
        <div className="login-required">
          Vui lòng <a href="/login">đăng nhập</a> để bình luận
        </div>
      ) : (
        <CommentForm onSubmit={handleCreateComment} />
      )}

      {comments.length > 0 && (
        <SortComments 
          currentSort={currentSort} 
          onSortChange={handleSortChange} 
        />
      )}

      {commentsLoading && comments.length === 0 ? (
        <div className="loading-comments">Đang tải bình luận...</div>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDeleteComment}
              onLike={toggleCommentLike}
              isLiked={commentLikes.has(comment.id)}
              currentUser={user}
              fetchReplies={fetchReplies}
              replies={replies[comment.id] || []}
              repliesLoading={repliesLoading[comment.id] || false}
              commentLikes={commentLikes}
            />
          ))}
          
          {commentPagination && commentPagination.has_next && (
            <div className="load-more-container">
              <button 
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={commentsLoading}
              >
                {commentsLoading ? 'Đang tải...' : 'Tải thêm bình luận'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="no-comments">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </div>
      )}

      {editingComment && user && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h4>Chỉnh sửa bình luận</h4>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
              >
                Hủy
              </button>
              <button 
                className="btn-submit"
                onClick={handleUpdateComment}
                disabled={!editContent.trim()}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment; 