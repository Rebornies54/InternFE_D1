import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useDashboardData } from '../../hooks/useDashboardData';
import DashboardSummary from './DashboardSummary';
import DatePicker from '../DatePicker';
import { 
  FadeIn, 
  SlideInLeft, 
  SlideInRight, 
  ScaleIn,
  LoadingSpinner,
  AnimatedProgressBar
} from '../AnimatedComponents';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const {
    dailyStats,
    weeklyStats,
    monthlyStats,
    loading,
    error,
    generateDateOptions,
    loadDailyStats,
    loadWeeklyStats,
    loadMonthlyStats,
    getRadarData,
    getWeeklyLineData,
    getMonthlyBarData,
    setError
  } = useDashboardData();

  const [weekOptions, setWeekOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    const { weeks, months } = generateDateOptions();
    setWeekOptions(weeks);
    setMonthOptions(months);
    
    if (weeks.length > 0) setSelectedWeek(weeks[0].label);
    if (months.length > 0) setSelectedMonth(months[0].label);
  }, [generateDateOptions]);

  useEffect(() => {
    if (selectedDate) {
      loadDailyStats(selectedDate);
    }
  }, [selectedDate, loadDailyStats]);

  useEffect(() => {
    if (selectedWeek && weekOptions.length > 0) {
      loadWeeklyStats(selectedWeek, weekOptions);
    }
  }, [selectedWeek, weekOptions, loadWeeklyStats]);

  useEffect(() => {
    if (selectedMonth && monthOptions.length > 0) {
      loadMonthlyStats(selectedMonth, monthOptions);
    }
  }, [selectedMonth, monthOptions, loadMonthlyStats]);

  return (
    <FadeIn>
      <div className="dashboard-analytics-container">
        {error && <div className="dashboard-error">{error}</div>}
        
        {/* Dashboard Summary */}
        <SlideInLeft delay={0.2}>
          <DashboardSummary 
            dailyStats={dailyStats}
            weeklyStats={weeklyStats}
            monthlyStats={monthlyStats}
          />
        </SlideInLeft>
      
        {/* DatePicker + Radar chart */}
        <div className="dashboard-date-filter-row">
          <div className="dashboard-datepicker-block">
            <label className="dashboard-label">Select date</label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Select date"
              className="dashboard-datepicker"
            />
            <div className="dashboard-chart-desc">DD/MM/YYYY</div>
          </div>
          <div className="dashboard-radar-block">
            <h3 className="dashboard-chart-title">Calories by Food Category</h3>
            {loading ? (
              <div className="dashboard-loading">
                <LoadingSpinner size={50} />
              </div>
            ) : (
              <ScaleIn>
                <RadarChart width={400} height={320} cx="50%" cy="50%" outerRadius="75%" data={getRadarData()}>
                  <PolarGrid stroke="#ddd" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#666', fontSize: 11 }} />
                  <Radar name="Calories" dataKey="A" stroke="#2196f3" fill="#2196f3" fillOpacity={0.15} dot={{ r: 4, fill: '#2196f3' }} />
                </RadarChart>
              </ScaleIn>
            )}
            <div className="dashboard-chart-desc">Daily calorie intake by food category</div>
          </div>
        </div>

        {/* Line chart by week */}
        <div className="dashboard-section">
          <div className="dashboard-filter-row">
            <label className="dashboard-label">Week:</label>
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={getWeeklyLineData()} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 12 }} />
                <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="calo" stroke="#4caf50" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#4caf50', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#4caf50' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div className="dashboard-chart-desc">Daily calorie intake for the selected week</div>
        </div>

        {/* Bar chart by month */}
        <div className="dashboard-section">
          <div className="dashboard-filter-row">
            <label className="dashboard-label">Month:</label>
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
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={getMonthlyBarData()} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 12 }} />
                <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12, color: '#555' }} className="dashboard-chart-legend" />
                <Bar dataKey="total" fill="#9c27b0" name="Total Calories" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="dashboard-chart-desc">Weekly calorie intake for the selected month</div>
        </div>
      </div>
    </FadeIn>
  );
}

export default Dashboard;