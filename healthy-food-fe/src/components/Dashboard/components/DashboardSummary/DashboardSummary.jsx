import React from 'react';
import './DashboardSummary.css';
import { DASHBOARD } from '../../../../constants';

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
      <h2 className="summary-title">{DASHBOARD.TITLE}</h2>
      
      <div className="summary-grid">
        {/* Daily Summary */}
        <div className="summary-card daily">
          <div className="summary-header">
            <h3>{DASHBOARD.SUMMARY.DAILY.TITLE}</h3>
            <div className="summary-icon">{DASHBOARD.SUMMARY.DAILY.ICON}</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.DAILY.LABELS.TOTAL_CALORIES}</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_calories || 0)} {DASHBOARD.SUMMARY.DAILY.UNITS.CALORIES}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.DAILY.LABELS.FOOD_ITEMS}</span>
              <span className="summary-value">{dailySummary?.total_entries || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.DAILY.LABELS.TOTAL_QUANTITY}</span>
              <span className="summary-value">{formatNumber(dailySummary?.total_quantity || 0)} {DASHBOARD.SUMMARY.DAILY.UNITS.QUANTITY}</span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="summary-card weekly">
          <div className="summary-header">
            <h3>{DASHBOARD.SUMMARY.WEEKLY.TITLE}</h3>
            <div className="summary-icon">{DASHBOARD.SUMMARY.WEEKLY.ICON}</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.WEEKLY.LABELS.TOTAL_CALORIES}</span>
              <span className="summary-value">{formatNumber(weeklySummary?.total_calories || 0)} {DASHBOARD.SUMMARY.WEEKLY.UNITS.CALORIES}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.WEEKLY.LABELS.AVG_PER_DAY}</span>
              <span className="summary-value">{formatNumber(Math.round(weeklySummary?.avg_calories_per_day || 0))} {DASHBOARD.SUMMARY.WEEKLY.UNITS.CALORIES}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.WEEKLY.LABELS.TOTAL_ENTRIES}</span>
              <span className="summary-value">{weeklySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="summary-card monthly">
          <div className="summary-header">
            <h3>{DASHBOARD.SUMMARY.MONTHLY.TITLE}</h3>
            <div className="summary-icon">{DASHBOARD.SUMMARY.MONTHLY.ICON}</div>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.MONTHLY.LABELS.TOTAL_CALORIES}</span>
              <span className="summary-value">{formatNumber(monthlySummary?.total_calories || 0)} {DASHBOARD.SUMMARY.MONTHLY.UNITS.CALORIES}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.MONTHLY.LABELS.AVG_PER_DAY}</span>
              <span className="summary-value">{formatNumber(Math.round(monthlySummary?.avg_calories_per_day || 0))} {DASHBOARD.SUMMARY.MONTHLY.UNITS.CALORIES}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{DASHBOARD.SUMMARY.MONTHLY.LABELS.TOTAL_ENTRIES}</span>
              <span className="summary-value">{monthlySummary?.total_entries || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {dailyStats?.categoryStats && dailyStats.categoryStats.length > 0 && (
        <div className="top-categories">
          <h3 className="categories-title">{DASHBOARD.LABELS.TOP_CATEGORIES}</h3>
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