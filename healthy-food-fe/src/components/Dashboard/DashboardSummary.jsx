import React from 'react';
import { UI_TEXT } from '../../constants';
import './DashboardSummary.css';

const DashboardSummary = ({ dailyStats, weeklyStats, monthlyStats }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const getDailySummary = () => {
    if (!dailyStats?.summary) return null;
    return dailyStats.summary;
  };

  const getWeeklySummary = () => {
    if (!weeklyStats?.summary) return null;
    return weeklyStats.summary;
  };

  const getMonthlySummary = () => {
    if (!monthlyStats?.summary) return null;
    return monthlyStats.summary;
  };

  const dailySummary = getDailySummary();
  const weeklySummary = getWeeklySummary();
  const monthlySummary = getMonthlySummary();

  return (
    <div className="dashboard-summary">
      <h2 className="summary-title">{UI_TEXT.DASHBOARD_SUMMARY}</h2>
      
      <div className="summary-grid">
        {/* Daily Summary */}
        <div className="summary-card daily">
          <div className="summary-header">
            <h3>{UI_TEXT.TODAYS_SUMMARY}</h3>
            <div className="summary-icon">📊</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_CALORIES}:</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_calories || 0)} {UI_TEXT.CAL_LABEL_2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.FOOD_ITEMS_LABEL}</span>
              <span className="summary-value">{dailySummary?.total_entries || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_QUANTITY}:</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_quantity || 0)} g</span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="summary-card weekly">
          <div className="summary-header">
            <h3>{UI_TEXT.THIS_WEEK}</h3>
            <div className="summary-icon">📈</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_CALORIES}:</span>
              <span className="summary-value">{formatNumber(weeklySummary?.total_calories || 0)} {UI_TEXT.CAL_LABEL_2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.AVG_PER_DAY}</span>
              <span className="summary-value">{formatNumber(Math.round(weeklySummary?.avg_calories_per_day || 0))} {UI_TEXT.CAL_LABEL_2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_ENTRIES_LABEL}</span>
              <span className="summary-value">{weeklySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="summary-card monthly">
          <div className="summary-header">
            <h3>{UI_TEXT.THIS_MONTH}</h3>
            <div className="summary-icon">📅</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_CALORIES}:</span>
              <span className="summary-value">{formatNumber(monthlySummary?.total_calories || 0)} {UI_TEXT.CAL_LABEL_2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.AVG_PER_DAY}</span>
              <span className="summary-value">{formatNumber(Math.round(monthlySummary?.avg_calories_per_day || 0))} {UI_TEXT.CAL_LABEL_2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{UI_TEXT.TOTAL_ENTRIES_LABEL}</span>
              <span className="summary-value">{monthlySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {dailyStats?.categoryStats && dailyStats.categoryStats.length > 0 && (
        <div className="top-categories">
          <h3 className="categories-title">{UI_TEXT.TOP_CATEGORIES_TODAY}</h3>
          <div className="categories-list">
            {dailyStats.categoryStats.slice(0, 5).map((category, index) => (
              <div key={category.category_id} className="category-item">
                <div className="category-rank">#{index + 1}</div>
                <div className="category-info">
                  <div className="category-name">{category.category_name}</div>
                  <div className="category-stats">
                    {formatNumber(category.total_calories)} {UI_TEXT.CAL_LABEL_2} • {category.entry_count} {UI_TEXT.ITEMS_LABEL_2}
                  </div>
                </div>
                <div className="category-percentage">
                  {Math.round((category.total_calories / (dailySummary?.total_calories || 1)) * 100)}{UI_TEXT.PERCENTAGE_SYMBOL}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;