import React from 'react';
import { FOOD_DATABASE_SECTION } from '../../../../constants';
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
              {foodItems.slice(0, 10).map((food, index) => (
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
                    <span className="calories-unit">cal</span>
                  </td>
                  <td>{food.unit || 'g'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Note */}
      {foodItems.length > 10 && (
        <div className="food-table-note">
          <p>
            <strong>Lưu ý:</strong> {FOOD_DATABASE_SECTION.TABLE_NOTE.MESSAGE}
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
              <div className="stat-value">{dailyStats.summary?.total_calories || 0} cal</div>
            </div>
            <div className="stat-card">
              <h3>{FOOD_DATABASE_SECTION.STATISTICS.SUMMARY.TOTAL_QUANTITY}</h3>
              <div className="stat-value">{dailyStats.summary?.total_quantity || 0}g</div>
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
                    <p><strong>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.LABELS.CALORIES}</strong> {cat.total_calories} cal</p>
                    <p><strong>{FOOD_DATABASE_SECTION.STATISTICS.CATEGORY.LABELS.QUANTITY}</strong> {cat.total_quantity}g</p>
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
                    <div className="food-calories">{food.total_calories} cal</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodDatabaseSection;
