import React from 'react';
import DatePicker from '../../../DatePicker';
import { 
  ScaleIn,
  LoadingSpinner
} from '../../../AnimatedComponents';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { DASHBOARD } from '../../../../constants';
import './DateFilterSection.css';

const DateFilterSection = ({ 
  selectedDate, 
  setSelectedDate, 
  loading, 
  getRadarData 
}) => {
  return (
    <div className="dashboard-date-filter-row">
      <div className="dashboard-datepicker-block">
        <label className="dashboard-label">{DASHBOARD.LABELS.SELECT_DATE}</label>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder={DASHBOARD.LABELS.SELECT_DATE}
          className="dashboard-datepicker"
        />
        <div className="dashboard-chart-desc">{DASHBOARD.DATE_FORMAT}</div>
      </div>
      <div className="dashboard-radar-block">
        <h3 className="dashboard-chart-title">{DASHBOARD.CHART_TITLES.RADAR}</h3>
        {loading ? (
          <div className="dashboard-loading">
            <LoadingSpinner size={50} />
          </div>
        ) : (
          <ScaleIn>
            <RadarChart 
              width={DASHBOARD.CHART_CONFIG.RADAR.WIDTH} 
              height={DASHBOARD.CHART_CONFIG.RADAR.HEIGHT} 
              cx="50%" 
              cy="50%" 
              outerRadius={DASHBOARD.CHART_CONFIG.RADAR.OUTER_RADIUS} 
              data={getRadarData()}
            >
              <PolarGrid stroke="#ddd" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#666', fontSize: 11 }} />
              <Radar 
                name="Calories" 
                dataKey="A" 
                stroke={DASHBOARD.COLORS.RADAR} 
                fill={DASHBOARD.COLORS.RADAR} 
                fillOpacity={DASHBOARD.CHART_CONFIG.RADAR.FILL_OPACITY} 
                dot={{ 
                  r: DASHBOARD.CHART_CONFIG.RADAR.DOT_RADIUS, 
                  fill: DASHBOARD.COLORS.RADAR 
                }} 
              />
            </RadarChart>
          </ScaleIn>
        )}
        <div className="dashboard-chart-desc">{DASHBOARD.CHART_TITLES.RADAR}</div>
      </div>
    </div>
  );
};

export default DateFilterSection;
