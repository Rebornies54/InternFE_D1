import React, { useState } from 'react';
import { FOOD_DATABASE_SECTION } from '../../../../constants';
import { logError } from '../../../../utils/errorHandler';
import './FoodDatabaseSection.css';

const FoodDatabaseSection = ({
  foodCategories,
  foodItems,
  selectedCategory,
  onCategoryChange,
  loading,
  dailyStats,
  selectedDate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getTableOptions = () => {
    const seen = new Set();
    return foodCategories
      .map(cat => ({
        value: cat.id,
        label: cat.name
      }))
      .filter(option => {
        if (seen.has(option.label)) return false;
        seen.add(option.label);
        return true;
      });
  };

  const filteredFoodItems = foodItems.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedFoodItems = searchQuery ? filteredFoodItems : foodItems.slice(0, 10);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const comment = {
        id: Date.now(),
        content: newComment.trim(),
        author: FOOD_DATABASE_SECTION.COMMENTS.AUTHOR,
        timestamp: new Date().toLocaleString(FOOD_DATABASE_SECTION.LOCALE),
        categoryId: selectedCategory
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      logError(FOOD_DATABASE_SECTION.COMMENTS.ERRORS.CREATE_FAILED, error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="food-database-section">
      <div className="section-header">
        <h2 className="section-title">
          {FOOD_DATABASE_SECTION.TITLE}
        </h2>
      </div>

      {/* Table Selection */}
      <div className="table-select-form-group">
        <label htmlFor="table-select" className="table-select-label">
          {FOOD_DATABASE_SECTION.LABEL}
        </label>
        <select
          id="table-select"
          className="table-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(parseInt(e.target.value))}
          disabled={loading}
        >
          {getTableOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Food Table */}
      <div className="food-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>{FOOD_DATABASE_SECTION.LOADING.TEXT}</p>
          </div>
        ) : foodItems.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">{FOOD_DATABASE_SECTION.NO_DATA.ICON}</div>
            <h3>{FOOD_DATABASE_SECTION.NO_DATA.TITLE}</h3>
            <p>{FOOD_DATABASE_SECTION.NO_DATA.MESSAGE}</p>
          </div>
        ) : (
          <table className="food-database-table">
            <thead>
              <tr>
                <th>{FOOD_DATABASE_SECTION.TABLE_HEADERS.STT}</th>
                <th>{FOOD_DATABASE_SECTION.TABLE_HEADERS.FOOD_NAME}</th>
                <th>{FOOD_DATABASE_SECTION.TABLE_HEADERS.CALORIES}</th>
                <th>{FOOD_DATABASE_SECTION.TABLE_HEADERS.UNIT}</th>
              </tr>
            </thead>
            <tbody>
              {displayedFoodItems.map((food, index) => (
                <tr key={food.id} className="food-row">
                  <td>{index + 1}</td>
                  <td className="food-name-cell">
                    <div className="food-name-wrapper">
                      <div className="food-name">{food.name}</div>
                      {food.description && (
                        <div className="food-description">{food.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="calories-cell">
                    <span className="calories-value">{food.caloriesPer100g || food.calories}</span>
                    <span className="calories-unit">{FOOD_DATABASE_SECTION.UNITS.CALORIES}</span>
                  </td>
                  <td>{food.unit || FOOD_DATABASE_SECTION.UNITS.GRAMS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Search Bar */}
      <div className="food-search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder={FOOD_DATABASE_SECTION.SEARCH.PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="food-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
              title={FOOD_DATABASE_SECTION.SEARCH.CLEAR_BUTTON}
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="search-results-info">
            {FOOD_DATABASE_SECTION.SEARCH.RESULTS_INFO
              .replace('{count}', filteredFoodItems.length)
              .replace('{query}', searchQuery)}
          </div>
        )}
      </div>

      {/* Table Note */}
      {foodItems.length > 10 && !searchQuery && (
        <div className="food-table-note">
          <p>
            <strong>{FOOD_DATABASE_SECTION.TABLE_NOTE.LABEL}</strong> {FOOD_DATABASE_SECTION.TABLE_NOTE.MESSAGE}
          </p>
        </div>
      )}

      {/* Daily Statistics */}
      {dailyStats && (
        <div className="daily-statistics-section">
          <h3 className="section-title">
            {FOOD_DATABASE_SECTION.STATISTICS.TITLE} {selectedDate}
          </h3>
          
          <div className="statistics-summary">
            <div className="stat-card">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.SUMMARY.TOTAL_CALORIES}</h3>
              <div className="stat-value">{dailyStats.summary?.total_calories || 0} {FOOD_DATABASE_SECTION.UNITS.CALORIES}</div>
            </div>
            <div className="stat-card">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.SUMMARY.TOTAL_QUANTITY}</h3>
              <div className="stat-value">{dailyStats.summary?.total_quantity || 0}{FOOD_DATABASE_SECTION.UNITS.GRAMS}</div>
            </div>
            <div className="stat-card">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.SUMMARY.TOTAL_ENTRIES}</h3>
              <div className="stat-value">{dailyStats.summary?.total_entries || 0}</div>
            </div>
          </div>

          {/* Category Statistics */}
          {dailyStats.categoryStats && dailyStats.categoryStats.length > 0 && (
            <div className="category-stats">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.TITLE}</h3>
              <div className="category-stats-grid">
                {dailyStats.categoryStats.map((cat, index) => (
                  <div key={index} className="category-stat-card">
                    <h4>{cat.category_name}</h4>
                    <p><strong>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.LABELS.CALORIES}</strong> {cat.total_calories} {FOOD_DATABASE_SECTION.UNITS.CALORIES}</p>
                    <p><strong>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.LABELS.QUANTITY}</strong> {cat.total_quantity}{FOOD_DATABASE_SECTION.UNITS.GRAMS}</p>
                    <p><strong>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.LABELS.ENTRIES}</strong> {cat.entry_count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Foods */}
          {dailyStats.topFoods && dailyStats.topFoods.length > 0 && (
            <div className="top-foods">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.TOP_FOODS.TITLE}</h3>
              <div className="top-foods-list">
                {dailyStats.topFoods.map((food, index) => (
                  <div key={index} className="top-food-item">
                    <div className="food-name">{food.food_name}</div>
                    <div className="food-category">({food.category_name})</div>
                    <div className="food-calories">{food.total_calories} {FOOD_DATABASE_SECTION.UNITS.CALORIES}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="food-database-comments-section">
        <h3 className="section-title">{FOOD_DATABASE_SECTION.COMMENTS.TITLE}</h3>
        
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={FOOD_DATABASE_SECTION.COMMENTS.FORM.PLACEHOLDER}
              className="comment-textarea"
              rows="3"
              disabled={submitting}
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? FOOD_DATABASE_SECTION.COMMENTS.FORM.SUBMITTING : FOOD_DATABASE_SECTION.COMMENTS.FORM.SUBMIT}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">
              <p>{FOOD_DATABASE_SECTION.COMMENTS.LIST.NO_COMMENTS}</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-timestamp">{comment.timestamp}</span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="comment-delete-btn"
                    title={FOOD_DATABASE_SECTION.COMMENTS.LIST.DELETE_BUTTON}
                  >
                    ×
                  </button>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDatabaseSection;
