import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DashboardSummary } from './components';
import { 
  FadeIn, 
  SlideInLeft
} from '../AnimatedComponents';
import { 
  DateFilterSection, 
  WeeklyChartSection, 
  MonthlyChartSection 
} from './components';

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
      
        <DateFilterSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          loading={loading}
          getRadarData={getRadarData}
        />

        <WeeklyChartSection
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          weekOptions={weekOptions}
          loading={loading}
          getWeeklyLineData={getWeeklyLineData}
        />

        <MonthlyChartSection
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          monthOptions={monthOptions}
          loading={loading}
          getMonthlyBarData={getMonthlyBarData}
        />
      </div>
    </FadeIn>
  );
}

export default Dashboard;