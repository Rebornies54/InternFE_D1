import { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../services/api';
import { ERROR_MESSAGES, API_CONFIG } from '../constants';

export const useDashboardData = () => {
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDateOptions = useCallback(() => {
    const currentDate = new Date();
    const weeks = [];
    const months = [];

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - (currentDate.getDay() + 7 * i));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        label: `Week ${i + 1} ${weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0]
      });
    }

    // Tạo tất cả 12 tháng trong năm hiện tại
    const currentYear = currentDate.getFullYear();
    for (let month = 1; month <= 12; month++) {
      const monthDate = new Date(currentYear, month - 1, 1);
      months.push({
        label: `${month.toString().padStart(2, '0')}/${currentYear}`,
        year: currentYear,
        month: month
      });
    }

    return { weeks, months };
  }, []);

  const loadDailyStats = useCallback(async (date) => {
    try {
      setLoading(true);
      setError('');
      const response = await foodAPI.getDailyStatistics(date);
      if (response.data.success) {
        setDailyStats(response.data.data);
      }
    } catch (error) {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeeklyStats = useCallback(async (weekLabel, weekOptions) => {
    try {
      setLoading(true);
      setError('');
      const week = weekOptions.find(w => w.label === weekLabel);
      if (week) {
        const response = await foodAPI.getWeeklyStatistics(week.startDate, week.endDate);
        if (response.data.success) {
          setWeeklyStats(response.data.data);
        }
      }
    } catch (error) {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthlyStats = useCallback(async (monthLabel, monthOptions) => {
    try {
      setLoading(true);
      setError('');
      const month = monthOptions.find(m => m.label === monthLabel);
      if (month) {
        const response = await foodAPI.getMonthlyStatistics(month.year, month.month);
        if (response.data.success) {
          setMonthlyStats(response.data.data);
        }
      }
    } catch (error) {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRadarData = useCallback(() => {
    if (!dailyStats?.topFoods) return [];
    
    return dailyStats.topFoods.slice(0, 6).map(food => ({
      subject: food.food_name,
      A: Math.round(food.total_calories)
    }));
  }, [dailyStats]);

  const getWeeklyLineData = useCallback(() => {
    if (!weeklyStats?.dailyBreakdown) return [];
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return weeklyStats.dailyBreakdown.map(day => {
      const date = new Date(day.log_date);
      return {
        day: dayNames[date.getDay()],
        calo: Math.round(day.daily_calories)
      };
    });
  }, [weeklyStats]);

  const getMonthlyBarData = useCallback(() => {
    if (!monthlyStats?.weeklyBreakdown) return [];
    
    // Trả về dữ liệu weeklyBreakdown trực tiếp để xử lý trong chartDataProcessor
    return monthlyStats.weeklyBreakdown;
  }, [monthlyStats]);

  // Thêm function để lấy dữ liệu daily breakdown cho tháng
  const getMonthlyDailyData = useCallback(async (selectedMonth) => {
    try {
      // Tạo monthOptions từ generateDateOptions
      const { months } = generateDateOptions();
      const month = months.find(m => m.label === selectedMonth);
      if (!month) return [];

      // Tính toán start và end date cho tháng
      const startDate = new Date(month.year, month.month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(month.year, month.month, 0).toISOString().split('T')[0];
      
      // Sử dụng weekly statistics API để lấy daily breakdown
      const response = await foodAPI.getWeeklyStatistics(startDate, endDate);
      if (response.data.success && response.data.data.dailyBreakdown) {
        return response.data.data.dailyBreakdown;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching monthly daily data:', error);
      return [];
    }
  }, [generateDateOptions]);

  return {
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
    setError
  };
};



