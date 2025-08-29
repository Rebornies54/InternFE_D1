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
    getMonthlyDailyData,
  } = useDashboardData();

  const [weekOptions, setWeekOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    const { weeks, months } = generateDateOptions();
    setWeekOptions(weeks);
    setMonthOptions(months);
    
    if (weeks.length > 0) setSelectedWeek(weeks[0].label);
    
    // Chọn tháng hiện tại làm mặc định
    if (months.length > 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonthLabel = `${currentMonth.toString().padStart(2, '0')}/${currentYear}`;
      setSelectedMonth(currentMonthLabel);
    }
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
          getMonthlyDailyData={getMonthlyDailyData}
        />
      </div>
    </FadeIn>
  );
}

export default Dashboard;