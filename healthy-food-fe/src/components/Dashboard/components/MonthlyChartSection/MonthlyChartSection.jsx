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
        <ResponsiveContainer width="100%" height={DASHBOARD.CHART_CONFIG.BAR.HEIGHT}>
          <BarChart 
            data={getMonthlyBarData()} 
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
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
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="dashboard-chart-desc">{DASHBOARD.CHART_TITLES.MONTHLY}</div>
    </div>
  );
};

export default MonthlyChartSection;
