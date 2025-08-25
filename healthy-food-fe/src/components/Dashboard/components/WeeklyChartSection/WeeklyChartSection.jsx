import React from 'react';
import { LoadingSpinner } from '../../../AnimatedComponents';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DASHBOARD } from '../../../../constants';
import './WeeklyChartSection.css';

const WeeklyChartSection = ({ 
  selectedWeek, 
  setSelectedWeek, 
  weekOptions, 
  loading, 
  getWeeklyLineData 
}) => {
  return (
    <div className="dashboard-section">
      <div className="dashboard-filter-row">
        <label className="dashboard-label">{DASHBOARD.LABELS.SELECT_WEEK}</label>
        <select
          className="dashboard-select"
          value={selectedWeek}
          onChange={e => setSelectedWeek(e.target.value)}
        >
          {weekOptions.map(week => (
            <option key={week.label} value={week.label}>{week.label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="dashboard-loading">
          <LoadingSpinner size={50} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={DASHBOARD.CHART_CONFIG.LINE.HEIGHT}>
          <LineChart 
            data={getWeeklyLineData()} 
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 12 }} />
            <YAxis tick={{ fill: '#555', fontSize: 12 }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="calo" 
              stroke={DASHBOARD.COLORS.LINE} 
              strokeWidth={DASHBOARD.CHART_CONFIG.LINE.STROKE_WIDTH} 
              dot={{ 
                r: DASHBOARD.CHART_CONFIG.LINE.DOT_RADIUS, 
                fill: '#fff', 
                stroke: DASHBOARD.COLORS.LINE, 
                strokeWidth: 2 
              }} 
              activeDot={{ 
                r: DASHBOARD.CHART_CONFIG.LINE.ACTIVE_DOT_RADIUS, 
                fill: DASHBOARD.COLORS.LINE 
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="dashboard-chart-desc">{DASHBOARD.CHART_TITLES.WEEKLY}</div>
    </div>
  );
};

export default WeeklyChartSection;
