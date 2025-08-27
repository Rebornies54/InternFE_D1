import React from 'react';
import { LoadingSpinner } from '../../../AnimatedComponents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DASHBOARD } from '../../../../constants';
import './MonthlyChartSection.css';

const MonthlyChartSection = ({ 
  selectedMonth, 
  setSelectedMonth, 
  monthOptions, 
  loading, 
  getMonthlyBarData 
}) => {
  const chartData = getMonthlyBarData();
  const dataCount = chartData.length;

  const getChartConfig = () => {
    if (dataCount <= 1) {
      return {
        width: '60%',
        margin: { top: 10, right: 20, left: 20, bottom: 5 },
        barWidth: 100 
      };
    } else if (dataCount <= 3) {
      return {
        width: '80%',
        margin: { top: 10, right: 20, left: 10, bottom: 5 },
        barWidth: undefined
      };
    } else {
      return {
        width: '100%',
        margin: { top: 10, right: 20, left: 0, bottom: 5 },
        barWidth: undefined
      };
    }
  };

  const chartConfig = getChartConfig();
  return (
    <div className="dashboard-section">
      <div className="dashboard-filter-row">
        <label className="dashboard-label">{DASHBOARD.LABELS.SELECT_MONTH}</label>
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
      {loading ? (
        <div className="dashboard-loading">
          <LoadingSpinner size={50} />
        </div>
      ) : (
        <div className="chart-container" style={{ 
          display: 'flex', 
          justifyContent: dataCount <= 1 ? 'center' : 'flex-start',
          width: '100%'
        }}>
          <ResponsiveContainer width={chartConfig.width} height={DASHBOARD.CHART_CONFIG.BAR.HEIGHT}>
            <BarChart 
              data={chartData} 
              margin={chartConfig.margin}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 12 }} />
            <YAxis tick={{ fill: '#555', fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, color: '#555' }} className="dashboard-chart-legend" />
            <Bar 
              dataKey="total" 
              fill={DASHBOARD.COLORS.BAR} 
              name="Total Calories" 
              radius={DASHBOARD.CHART_CONFIG.BAR.RADIUS}
              barSize={chartConfig.barWidth}
            />
          </BarChart>
        </ResponsiveContainer>
        </div>
      )}
      <div className="dashboard-chart-desc">{DASHBOARD.CHART_TITLES.MONTHLY}</div>
    </div>
  );
};

export default MonthlyChartSection;
