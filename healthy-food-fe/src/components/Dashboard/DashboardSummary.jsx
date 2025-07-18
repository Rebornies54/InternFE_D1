import React from 'react';
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
      <h2 className="summary-title">Dashboard Summary</h2>
      
      <div className="summary-grid">
        {/* Daily Summary */}
        <div className="summary-card daily">
          <div className="summary-header">
            <h3>Today's Summary</h3>
            <div className="summary-icon">📊</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Calories:</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_calories || 0)} cal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Food Items:</span>
              <span className="summary-value">{dailySummary?.total_entries || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Quantity:</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_quantity || 0)} g</span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="summary-card weekly">
          <div className="summary-header">
            <h3>This Week</h3>
            <div className="summary-icon">📈</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Calories:</span>
              <span className="summary-value">{formatNumber(weeklySummary?.total_calories || 0)} cal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg/Day:</span>
              <span className="summary-value">{formatNumber(Math.round(weeklySummary?.avg_calories_per_day || 0))} cal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Entries:</span>
              <span className="summary-value">{weeklySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="summary-card monthly">
          <div className="summary-header">
            <h3>This Month</h3>
            <div className="summary-icon">📅</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Calories:</span>
              <span className="summary-value">{formatNumber(monthlySummary?.total_calories || 0)} cal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg/Day:</span>
              <span className="summary-value">{formatNumber(Math.round(monthlySummary?.avg_calories_per_day || 0))} cal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Entries:</span>
              <span className="summary-value">{monthlySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {dailyStats?.categoryStats && dailyStats.categoryStats.length > 0 && (
        <div className="top-categories">
          <h3 className="categories-title">Top Categories Today</h3>
          <div className="categories-list">
            {dailyStats.categoryStats.slice(0, 5).map((category, index) => (
              <div key={category.category_id} className="category-item">
                <div className="category-rank">#{index + 1}</div>
                <div className="category-info">
                  <div className="category-name">{category.category_name}</div>
                  <div className="category-stats">
                    {formatNumber(category.total_calories)} cal • {category.entry_count} items
                  </div>
                </div>
                <div className="category-percentage">
                  {Math.round((category.total_calories / (dailySummary?.total_calories || 1)) * 100)}%
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