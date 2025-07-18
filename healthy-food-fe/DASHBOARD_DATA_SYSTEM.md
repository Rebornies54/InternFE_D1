# Dashboard Data System

## Tổng quan

Hệ thống dashboard được thiết kế để hiển thị dữ liệu thống kê thực từ API backend, thay thế cho fake data trước đó. Hệ thống bao gồm:

### 1. **Custom Hook: useDashboardData**
- Quản lý state cho daily, weekly, monthly statistics
- Xử lý loading và error states
- Transform dữ liệu cho charts
- Tạo date options cho filters

### 2. **Dashboard Component**
- Hiển thị 3 loại charts: Radar, Line, Bar
- Date picker và filters cho week/month
- Loading states và error handling
- Responsive design

### 3. **DashboardSummary Component**
- Hiển thị summary cards cho daily/weekly/monthly
- Top categories breakdown
- Số liệu tổng quan

## API Endpoints

### Daily Statistics
```
GET /api/food/statistics/daily?date=YYYY-MM-DD
```
**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-07-18",
    "summary": {
      "total_calories": 1850,
      "total_quantity": 1250,
      "total_entries": 8
    },
    "categoryStats": [
      {
        "category_name": "Protein",
        "category_id": 1,
        "total_calories": 800,
        "total_quantity": 400,
        "entry_count": 3
      }
    ],
    "topFoods": [
      {
        "food_name": "Chicken Breast",
        "category_name": "Protein",
        "total_calories": 400,
        "total_quantity": 200,
        "entry_count": 2
      }
    ]
  }
}
```

### Weekly Statistics
```
GET /api/food/statistics/weekly?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2025-07-14",
      "end_date": "2025-07-20"
    },
    "summary": {
      "total_calories": 12500,
      "total_quantity": 8500,
      "total_entries": 56,
      "avg_calories_per_day": 1785
    },
    "dailyBreakdown": [
      {
        "log_date": "2025-07-14",
        "daily_calories": 1850,
        "daily_quantity": 1250,
        "daily_entries": 8
      }
    ],
    "categoryBreakdown": [...]
  }
}
```

### Monthly Statistics
```
GET /api/food/statistics/monthly?year=2025&month=7
```
**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "year": 2025,
      "month": 7
    },
    "summary": {
      "total_calories": 52000,
      "total_quantity": 35000,
      "total_entries": 240,
      "avg_calories_per_day": 1677
    },
    "weeklyBreakdown": [
      {
        "week_number": 28,
        "weekly_calories": 12500,
        "weekly_quantity": 8500,
        "weekly_entries": 56
      }
    ],
    "categoryBreakdown": [...]
  }
}
```

## Data Flow

### 1. **Component Initialization**
```javascript
// Dashboard.jsx
const {
  dailyStats,
  weeklyStats,
  monthlyStats,
  loading,
  error,
  loadDailyStats,
  loadWeeklyStats,
  loadMonthlyStats,
  getRadarData,
  getWeeklyLineData,
  getMonthlyBarData
} = useDashboardData();
```

### 2. **Date Options Generation**
```javascript
// Tự động tạo 4 tuần gần nhất và 6 tháng gần nhất
const { weeks, months } = generateDateOptions();
```

### 3. **Data Loading**
```javascript
// Load data khi date/week/month thay đổi
useEffect(() => {
  if (selectedDate) {
    loadDailyStats(selectedDate);
  }
}, [selectedDate, loadDailyStats]);
```

### 4. **Chart Data Transformation**
```javascript
// Transform API data cho charts
const getRadarData = () => {
  if (!dailyStats?.topFoods) return [];
  
  return dailyStats.topFoods.slice(0, 6).map(food => ({
    subject: food.food_name,
    A: Math.round(food.total_calories)
  }));
};
```

## Features

### ✅ **Real-time Data**
- Lấy dữ liệu thực từ API backend
- Auto-refresh khi thay đổi filters
- Error handling cho API failures

### ✅ **Interactive Charts**
- Radar chart: Top 6 foods theo calories
- Line chart: Daily calories trong tuần
- Bar chart: Weekly calories trong tháng

### ✅ **Summary Dashboard**
- Daily/Weekly/Monthly summary cards
- Top categories breakdown
- Percentage calculations

### ✅ **Responsive Design**
- Mobile-friendly layout
- Adaptive chart sizes
- Touch-friendly controls

### ✅ **Loading States**
- Skeleton loading cho charts
- Error messages
- Empty state handling

## Usage

### 1. **Access Dashboard**
```javascript
// Navigate to dashboard
<Route path="/dashboard" element={<Dashboard />} />
```

### 2. **Filter Data**
- **Date Picker**: Chọn ngày cụ thể cho daily stats
- **Week Filter**: Chọn tuần cho weekly line chart
- **Month Filter**: Chọn tháng cho monthly bar chart

### 3. **View Summary**
- Summary cards hiển thị tổng quan
- Top categories cho ngày hiện tại
- Percentage breakdown

## Error Handling

### API Errors
```javascript
try {
  const response = await foodAPI.getDailyStatistics(date);
  if (response.data.success) {
    setDailyStats(response.data.data);
  }
} catch (error) {
  console.error('Error loading daily stats:', error);
  setError('Failed to load daily statistics');
}
```

### Empty States
```javascript
const getRadarData = () => {
  if (!dailyStats?.topFoods) return [];
  // Return empty array if no data
};
```

## Performance Optimizations

### 1. **useCallback Hooks**
```javascript
const loadDailyStats = useCallback(async (date) => {
  // Prevent unnecessary re-renders
}, []);
```

### 2. **Conditional Rendering**
```javascript
{loading ? (
  <div className="dashboard-loading">Loading...</div>
) : (
  <RadarChart data={getRadarData()}>
    // Chart content
  </RadarChart>
)}
```

### 3. **Data Caching**
- API responses cached trong state
- Chỉ reload khi filters thay đổi
- Optimized re-renders

## Future Enhancements

### 🔮 **Planned Features**
- Export data to PDF/Excel
- Custom date ranges
- More chart types (Pie, Area)
- Real-time updates
- Data comparison features

### 🔮 **Performance Improvements**
- Virtual scrolling cho large datasets
- Chart animations
- Lazy loading cho historical data
- WebSocket for real-time updates

## Troubleshooting

### Common Issues

1. **No Data Displayed**
   - Check API endpoints
   - Verify authentication
   - Check console for errors

2. **Charts Not Loading**
   - Verify recharts library
   - Check data transformation
   - Validate chart props

3. **Performance Issues**
   - Check API response times
   - Optimize data transformations
   - Implement pagination if needed

### Debug Tools
```javascript
// Enable debug logging
console.log('Daily Stats:', dailyStats);
console.log('Radar Data:', getRadarData());
```

## Dependencies

- **recharts**: Chart library
- **axios**: HTTP client
- **react**: Core framework
- **date-fns**: Date utilities (optional)

## File Structure

```
src/
├── components/
│   └── Dashboard/
│       ├── Dashboard.jsx
│       ├── Dashboard.css
│       ├── DashboardSummary.jsx
│       └── DashboardSummary.css
├── hooks/
│   └── useDashboardData.js
└── services/
    └── api.js
``` 