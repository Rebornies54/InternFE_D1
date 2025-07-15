import React, { useState } from 'react';
import './Dashboard.css';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';

// Fake data matching the sample image
const radarData = [
  { subject: 'Chicken', A: 239 },
  { subject: 'Chicken Egg', A: 155 },
  { subject: 'Cauliflower', A: 100 },
  { subject: 'Watermelon', A: 120 },
  { subject: 'Potato', A: 77 },
  { subject: 'Banana', A: 176 },
];

const weekLineData = [
  { day: 'Monday', calo: 1900 },
  { day: 'Tuesday', calo: 2000 },
  { day: 'Wednesday', calo: 1500 },
  { day: 'Thursday', calo: 1950 },
  { day: 'Friday', calo: 1000 },
  { day: 'Saturday', calo: 600 },
  { day: 'Sunday', calo: 1800 },
];

const monthBarData = [
  { week: 'Week 1', a: 3000, b: 2300, c: 800, d: 700, e: 2200, f: 900 },
  { week: 'Week 2', a: 2200, b: 750, c: 3000, d: 1700, e: 1500, f: 800 },
  { week: 'Week 3', a: 2900, b: 1500, c: 2300, d: 2400, e: 1300, f: 1500 },
  { week: 'Week 4', a: 2300, b: 900, c: 2500, d: 100, e: 2300, f: 300 },
];

const weekOptions = [
  'Week 1 August 2024',
  'Week 2 August 2024',
  'Week 3 August 2024',
  'Week 4 August 2024',
];
const monthOptions = [
  'August 2024',
  'July 2024',
  'June 2024',
];

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('2024-08-17');
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0]);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);

  return (
    <div className="dashboard-analytics-container">
      {/* DatePicker + Radar chart */}
      <div className="dashboard-date-filter-row">
        <div className="dashboard-datepicker-block">
          <label className="dashboard-label">Select date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="dashboard-datepicker"
          />
          <div className="dashboard-datepicker-format">MM/DD/YYYY</div>
        </div>
        <div className="dashboard-radar-block">
          <h3 className="dashboard-chart-title">Statistics of calories consumed by the body</h3>
          <RadarChart width={420} height={350} cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 300]} />
            <Radar name="Calories" dataKey="A" stroke="#e573c7" fill="#e573c7" fillOpacity={0.25} dot={{ r: 5, fill: '#e573c7' }} />
          </RadarChart>
          <div className="dashboard-chart-desc">Chart showing calories by food type consumed during the day</div>
        </div>
      </div>

      {/* Line chart by week */}
      <div className="dashboard-section">
        <div className="dashboard-filter-row">
          <label className="dashboard-label">Filter by week</label>
          <select
            className="dashboard-select"
            value={selectedWeek}
            onChange={e => setSelectedWeek(e.target.value)}
          >
            {weekOptions.map(week => (
              <option key={week} value={week}>{week}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weekLineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calo" stroke="#e573c7" strokeWidth={2} dot={{ r: 5, fill: '#fff', stroke: '#e573c7', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#e573c7' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="dashboard-chart-desc">Chart showing calorie intake statistics by day of the week</div>
      </div>

      {/* Bar chart by month */}
      <div className="dashboard-section">
        <div className="dashboard-filter-row">
          <label className="dashboard-label">Filter by month</label>
          <select
            className="dashboard-select"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthBarData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="a" fill="#7ef9a2" name="Chicken" />
            <Bar dataKey="b" fill="#b388ff" name="Banana" />
            <Bar dataKey="c" fill="#ffb3c6" name="Potato" />
            <Bar dataKey="d" fill="#ffd6a5" name="Watermelon" />
            <Bar dataKey="e" fill="#7ad7f0" name="Chicken Egg" />
            <Bar dataKey="f" fill="#fbbf24" name="Cauliflower" />
          </BarChart>
        </ResponsiveContainer>
        <div className="dashboard-chart-desc">Chart showing calorie intake statistics by week of the month</div>
      </div>
    </div>
  );
}

export default Dashboard;