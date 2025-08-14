import { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../services/api';

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

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        label: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        year: monthDate.getFullYear(),
        month: monthDate.getMonth() + 1
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
      console.error('Error loading daily stats:', error);
      setError('Failed to load daily statistics');
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
      console.error('Error loading weekly stats:', error);
      setError('Failed to load weekly statistics');
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
      console.error('Error loading monthly stats:', error);
      setError('Failed to load monthly statistics');
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
    
    return monthlyStats.weeklyBreakdown.map(week => {
      const weekData = {
        week: `Week ${week.week_number}`,
        total: Math.round(week.weekly_calories)
      };
      
      if (monthlyStats.categoryBreakdown) {
        monthlyStats.categoryBreakdown.slice(0, 5).forEach((category, index) => {
          const colors = ['#7ef9a2', '#b388ff', '#ffb3c6', '#ffd6a5', '#7ad7f0'];
          weekData[`category_${index}`] = Math.round(category.total_calories / 4);
        });
      }
      
      return weekData;
    });
  }, [monthlyStats]);

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
    setError
  };
}; 