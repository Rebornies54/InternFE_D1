import React, { useState } from 'react';
import './Dashboard.css';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import { format } from 'date-fns';

// Fake data sát với ảnh mẫu
const radarData = [
  { subject: 'Thịt gà', A: 239 },
  { subject: 'Trứng gà', A: 155 },
  { subject: 'Súp lơ', A: 100 },
  { subject: 'Dưa hấu', A: 120 },
  { subject: 'Khoai tây', A: 77 },
  { subject: 'Chuối', A: 176 },
];

const weekLineData = [
  { day: 'Thứ 2', calo: 1900 },
  { day: 'Thứ 3', calo: 2000 },
  { day: 'Thứ 4', calo: 1500 },
  { day: 'Thứ 5', calo: 1950 },
  { day: 'Thứ 6', calo: 1000 },
  { day: 'Thứ 7', calo: 600 },
  { day: 'Chủ nhật', calo: 1800 },
];

const monthBarData = [
  { week: 'Tuần 1', a: 3000, b: 2300, c: 800, d: 700, e: 2200, f: 900 },
  { week: 'Tuần 2', a: 2200, b: 750, c: 3000, d: 1700, e: 1500, f: 800 },
  { week: 'Tuần 3', a: 2900, b: 1500, c: 2300, d: 2400, e: 1300, f: 1500 },
  { week: 'Tuần 4', a: 2300, b: 900, c: 2500, d: 100, e: 2300, f: 300 },
];

const weekOptions = [
  'Tuần 1 tháng 8/2024',
  'Tuần 2 tháng 8/2024',
  'Tuần 3 tháng 8/2024',
  'Tuần 4 tháng 8/2024',
];
const monthOptions = [
  'Tháng 8/2024',
  'Tháng 7/2024',
  'Tháng 6/2024',
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
          <label className="dashboard-label">Chọn ngày</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="dashboard-datepicker"
          />
          <div className="dashboard-datepicker-format">MM/DD/YYYY</div>
        </div>
        <div className="dashboard-radar-block">
          <h3 className="dashboard-chart-title">Thống kê lượng calo đã nạp vào cơ thể</h3>
          <ResponsiveContainer width={420} height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 300]} />
              <Radar name="Calo" dataKey="A" stroke="#e573c7" fill="#e573c7" fillOpacity={0.25} dot={{ r: 5, fill: '#e573c7' }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="dashboard-chart-desc">Biểu đồ lượng calo theo từng loại thực phẩm nạp vào trong ngày</div>
        </div>
      </div>

      {/* Line chart theo tuần */}
      <div className="dashboard-section">
        <div className="dashboard-filter-row">
          <label className="dashboard-label">Filter theo tuần</label>
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
        <div className="dashboard-chart-desc">Biểu đồ thống kê lượng calo nạp vào theo các ngày trong tuần</div>
      </div>

      {/* Bar chart theo tháng */}
      <div className="dashboard-section">
        <div className="dashboard-filter-row">
          <label className="dashboard-label">Filter theo tháng</label>
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
            <Bar dataKey="a" fill="#7ef9a2" name="Thịt gà" />
            <Bar dataKey="b" fill="#b388ff" name="Chuối" />
            <Bar dataKey="c" fill="#ffb3c6" name="Khoai tây" />
            <Bar dataKey="d" fill="#ffd6a5" name="Dưa hấu" />
            <Bar dataKey="e" fill="#7ad7f0" name="Trứng gà" />
            <Bar dataKey="f" fill="#fbbf24" name="Súp lơ" />
          </BarChart>
        </ResponsiveContainer>
        <div className="dashboard-chart-desc">Biểu đồ thống kê lượng calo nạp vào theo các tuần trong tháng</div>
      </div>
    </div>
  );
}

export default Dashboard;