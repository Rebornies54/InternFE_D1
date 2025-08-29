import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../AnimatedComponents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DASHBOARD, MONTHLY_CHART } from '../../../../constants';
import { processWeeklyData, calculateSummaryStats } from '../../../../utils/chartDataProcessor';
import './MonthlyChartSection.css';

const MonthlyChartSection = ({ 
  selectedMonth, 
  setSelectedMonth, 
  monthOptions, 
  loading, 
  getMonthlyBarData,
  getMonthlyDailyData,
  foodCategories = []
}) => {
  // State để lưu dữ liệu biểu đồ
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Tạo dữ liệu biểu đồ theo ngày
  useEffect(() => {
    const loadChartData = async () => {
      setChartLoading(true);
      try {
        // Ưu tiên sử dụng dữ liệu daily breakdown từ API
        const dailyData = await getMonthlyDailyData(selectedMonth);
        if (dailyData && dailyData.length > 0) {
          setChartData(processWeeklyData(dailyData, selectedMonth));
        } else {
          // Fallback về weekly breakdown nếu không có daily data
          const rawData = getMonthlyBarData();
          setChartData(processWeeklyData(rawData, selectedMonth));
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
        // Fallback về weekly breakdown nếu có lỗi
        const rawData = getMonthlyBarData();
        setChartData(processWeeklyData(rawData, selectedMonth));
      } finally {
        setChartLoading(false);
      }
    };

    loadChartData();
  }, [getMonthlyDailyData, getMonthlyBarData, selectedMonth]);

  const dataCount = chartData.length;

  // Màu sắc cho các ngày trong tuần
  const dayColors = [
    '#FF6B6B', // Thứ 2 - Đỏ
    '#4ECDC4', // Thứ 3 - Xanh lá
    '#45B7D1', // Thứ 4 - Xanh dương
    '#96CEB4', // Thứ 5 - Xanh nhạt
    '#FFEAA7', // Thứ 6 - Vàng
    '#DDA0DD', // Thứ 7 - Tím
    '#FF8C42', // Chủ nhật - Cam
  ];

  const getChartConfig = () => {
    if (dataCount <= 7) {
      return {
        width: '80%',
        margin: { top: 10, right: 20, left: 20, bottom: 5 },
        barWidth: 60
      };
    } else if (dataCount <= 15) {
      return {
        width: '100%',
        margin: { top: 10, right: 20, left: 10, bottom: 5 },
        barWidth: 40
      };
    } else {
      return {
        width: '100%',
        margin: { top: 10, right: 20, left: 0, bottom: 5 },
        barWidth: 30
      };
    }
  };

  const chartConfig = getChartConfig();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {MONTHLY_CHART.TOOLTIP.CALORIES_UNIT}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-filter-row">
        <label className="dashboard-label">{MONTHLY_CHART.LABELS.MONTH}</label>
        <select
          className="dashboard-select"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map(month => (
            <option key={month.label} value={month.label}>{month.label}</option>
          ))}
        </select>
      </div>
      
      <div className="chart-title">
        {MONTHLY_CHART.TITLE}
      </div>
      
      {loading || chartLoading ? (
        <div className="dashboard-loading">
          <LoadingSpinner size={50} />
        </div>
      ) : (
        <div className="chart-container" style={{ 
          display: 'flex', 
          justifyContent: dataCount <= 7 ? 'center' : 'flex-start',
          width: '100%'
        }}>
          <ResponsiveContainer width={chartConfig.width} height={DASHBOARD.CHART_CONFIG.BAR.HEIGHT}>
            <BarChart 
              data={chartData} 
              margin={chartConfig.margin}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#555', fontSize: 10 }}
                tickFormatter={formatDateForDisplay}
                label={{ value: 'Ngày', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fill: '#555', fontSize: 12 }}
                label={{ value: 'Calo', angle: -90, position: 'insideLeft' }}
                domain={[0, 'dataMax + 500']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Single bar for each day */}
              <Bar 
                dataKey="calories" 
                fill="#8884d8"
                radius={[2, 2, 0, 0]}
                name="Calories"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="dashboard-chart-desc">
        {DASHBOARD.CHART_TITLES.MONTHLY}
      </div>
      
      {/* Thống kê tổng quan */}
      {!loading && chartData.length > 0 && (
        <div className="chart-summary">
          <div className="summary-title">{MONTHLY_CHART.SUMMARY.TITLE} {selectedMonth}</div>
          <div className="summary-stats">
            {(() => {
              const stats = calculateSummaryStats(chartData);
              return (
                <>
                  <div className="summary-item">
                    <span className="summary-label">{MONTHLY_CHART.SUMMARY.TOTAL_CALORIES}</span>
                    <span className="summary-value">
                      {(stats.totalCalories || 0).toLocaleString()} {MONTHLY_CHART.TOOLTIP.CALORIES_UNIT}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{MONTHLY_CHART.SUMMARY.AVG_PER_WEEK}</span>
                    <span className="summary-value">
                      {(stats.averagePerDay || 0).toLocaleString()} {MONTHLY_CHART.TOOLTIP.CALORIES_UNIT}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{MONTHLY_CHART.SUMMARY.HIGHEST_WEEK}</span>
                    <span className="summary-value">
                      {(stats.highestDay || 0).toLocaleString()} {MONTHLY_CHART.TOOLTIP.CALORIES_UNIT}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyChartSection;
