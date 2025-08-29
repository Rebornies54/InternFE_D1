/**
 * Utility functions for processing chart data
 */

/**
 * Process monthly data into daily format for chart display
 * @param {Array} rawData - Raw data from API
 * @param {string} selectedMonth - Selected month (e.g., "03/2025")
 * @returns {Array} Processed daily data for chart
 */
export const processWeeklyData = (rawData, selectedMonth) => {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    // Nếu không có dữ liệu, tạo dữ liệu mẫu cho tháng
    return generateMockDailyData(selectedMonth);
  }

  // Kiểm tra xem dữ liệu có cấu trúc như mong đợi không
  const firstItem = rawData[0];
  
  // Nếu dữ liệu có cấu trúc dailyBreakdown (từ API) - ưu tiên cao nhất
  if (firstItem && firstItem.log_date !== undefined) {
    return processDailyBreakdownData(rawData);
  }
  
  // Nếu dữ liệu có cấu trúc weeklyBreakdown (từ API)
  if (firstItem && firstItem.week_number !== undefined) {
    return processWeeklyBreakdownToDailyData(rawData, selectedMonth);
  }
  
  // Fallback: tạo dữ liệu mẫu
  return generateMockDailyData(selectedMonth);
};

/**
 * Process weekly breakdown data to daily data for chart
 * @param {Array} weeklyData - Weekly breakdown data from API
 * @param {string} selectedMonth - Selected month
 * @returns {Array} Processed daily data
 */
export const processWeeklyBreakdownToDailyData = (weeklyData, selectedMonth) => {
  // Parse selected month to get year and month
  const [month, year] = selectedMonth.split('/');
  const selectedYear = parseInt(year);
  const selectedMonthNum = parseInt(month);
  
  // Generate all days in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonthNum, 0).getDate();
  const dailyData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonthNum - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayName = getDayNameFromNumber(dayOfWeek);
    
    // Find which week this day belongs to
    const weekNumber = Math.ceil(day / 7);
    const weekData = weeklyData.find(week => week.week_number === weekNumber);
    
    // Calculate calories for this day (distribute weekly calories evenly)
    let dailyCalories = 0;
    if (weekData && weekData.weekly_calories) {
      dailyCalories = Math.round(weekData.weekly_calories / 7);
    }
    
    dailyData.push({
      date: date.toISOString().split('T')[0],
      day: dayName,
      calories: dailyCalories,
      dayOfWeek: dayOfWeek
    });
  }
  
  return dailyData;
};

/**
 * Process daily breakdown data
 * @param {Array} dailyData - Daily breakdown data
 * @returns {Array} Processed daily data
 */
export const processDailyBreakdownData = (dailyData) => {
  return dailyData.map(item => {
    const date = new Date(item.log_date);
    const dayOfWeek = date.getDay();
    const dayName = getDayNameFromNumber(dayOfWeek);
    
    return {
      date: item.log_date,
      day: dayName,
      calories: Math.round(item.daily_calories || 0),
      dayOfWeek: dayOfWeek
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Get day name from day number
 * @param {number} dayOfWeek - Day of week (0-6)
 * @returns {string} Day name in Vietnamese
 */
export const getDayNameFromNumber = (dayOfWeek) => {
  const dayNames = {
    0: 'Chủ nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7'
  };
  
  return dayNames[dayOfWeek] || 'Thứ 2';
};

/**
 * Get week number from date string
 * @param {string} dateString - Date string
 * @returns {string} Week string (e.g., "Tuần 1")
 */
export const getWeekFromDate = (dateString) => {
  if (!dateString) return 'Tuần 1';
  
  try {
    const date = new Date(dateString);
    const dayOfMonth = date.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);
    return `Tuần ${weekNumber}`;
  } catch (error) {
    return 'Tuần 1';
  }
};

/**
 * Get day of week from date string
 * @param {string} dateString - Date string
 * @returns {string} Day of week in Vietnamese
 */
export const getDayOfWeek = (dateString) => {
  if (!dateString) return 'Thứ 2';
  
  try {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    return getDayNameFromNumber(dayOfWeek);
  } catch (error) {
    return 'Thứ 2';
  }
};

/**
 * Get all days of week for chart columns
 * @returns {Array} Array of day names
 */
export const getDaysOfWeek = () => {
  return ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
};

/**
 * Calculate summary statistics from chart data
 * @param {Array} chartData - Chart data
 * @returns {Object} Summary statistics
 */
export const calculateSummaryStats = (chartData) => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return {
      totalCalories: 0,
      averagePerDay: 0,
      highestDay: 0,
      dayCount: 0
    };
  }

  const totalCalories = chartData.reduce((sum, day) => sum + (day.calories || 0), 0);
  const averagePerDay = Math.round(totalCalories / chartData.length);
  const highestDay = chartData.reduce((max, day) => (day.calories || 0) > max ? (day.calories || 0) : max, 0);

  return {
    totalCalories,
    averagePerDay,
    highestDay,
    dayCount: chartData.length
  };
};

/**
 * Generate mock daily data for testing
 * @param {string} selectedMonth - Selected month
 * @returns {Array} Mock daily data
 */
export const generateMockDailyData = (selectedMonth) => {
  const [month, year] = selectedMonth.split('/');
  const selectedYear = parseInt(year);
  const selectedMonthNum = parseInt(month);
  const daysInMonth = new Date(selectedYear, selectedMonthNum, 0).getDate();
  const mockData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonthNum - 1, day);
    const dayOfWeek = date.getDay();
    const dayName = getDayNameFromNumber(dayOfWeek);
    const calories = Math.floor(Math.random() * 2000) + 500; // 500-2500 calories

    mockData.push({
      date: date.toISOString().split('T')[0],
      day: dayName,
      calories: calories,
      dayOfWeek: dayOfWeek
    });
  }

  return mockData;
};
