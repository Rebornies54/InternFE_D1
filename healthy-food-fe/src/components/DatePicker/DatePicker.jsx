import React, { useState, useEffect, useRef } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './DatePicker.css';

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [tempSelectedDate, setTempSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  const monthNames = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setTempSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === new Date().toDateString(),
        isSelected: tempSelectedDate && dayDate.toDateString() === tempSelectedDate.toDateString()
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    return days;
  };

  const handleDateClick = (day) => {
    setTempSelectedDate(day.date);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      setSelectedDate(tempSelectedDate);
      const formattedDate = tempSelectedDate.toISOString().split('T')[0];
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setTempSelectedDate(today);
  };

  const handleClear = () => {
    setSelectedDate(null);
    setTempSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={`date-picker-container ${className}`} ref={datePickerRef}>
      <div 
        className={`date-picker-input ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Calendar size={16} />
        <span className="date-picker-text">
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        {selectedDate && (
          <button 
            className="date-picker-clear"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-header">
            <button 
              className="date-picker-nav-btn"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="date-picker-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button 
              className="date-picker-nav-btn"
              onClick={goToNextMonth}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="date-picker-calendar">
            <div className="date-picker-weekdays">
              {dayNames.map(day => (
                <div key={day} className="date-picker-weekday">{day}</div>
              ))}
            </div>
            <div className="date-picker-days">
              {days.map((day, index) => (
                <button
                  key={index}
                  className={`date-picker-day ${
                    !day.isCurrentMonth ? 'other-month' : ''
                  } ${day.isToday ? 'today' : ''} ${
                    day.isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </div>

          <div className="date-picker-actions">
            <button className="date-picker-action-btn" onClick={handleToday}>
              Hôm nay
            </button>
            <button className="date-picker-action-btn" onClick={handleCancel}>
              Hủy
            </button>
            <button 
              className="date-picker-action-btn primary" 
              onClick={handleConfirm}
              disabled={!tempSelectedDate}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker; 