import React, { useCallback } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { format, parseISO, isValid } from 'date-fns';
import { DATEPICKER } from '../../constants';
import './DatePicker.css';

// Cải thiện locale để hiển thị đúng ngày trong tuần
const customViLocale = {
  ...vi,
  localize: {
    ...vi.localize,
    day: (n) => {
      return DATEPICKER.DAY_NAMES[n];
    }
  }
};

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = DATEPICKER.PLACEHOLDER,
  className = "",
  disabled = false,
  maxDate = new Date(),
  minDate = null,
  disableFuture = true,
  clearable = true
}) => {
  // Tối ưu hàm xử lý thay đổi ngày với useCallback
  const handleDateChange = useCallback((date) => {
    if (!onChange) return;
    
    if (date && isValid(date)) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const normalizedDate = new Date(year, month, day, 0, 0, 0, 0);
      const formattedDate = format(normalizedDate, 'yyyy-MM-dd');
      onChange(formattedDate);
    } else {
      onChange('');
    }
  }, [onChange]);

  // Tối ưu hàm lấy giá trị date
  const getSelectedDate = useCallback(() => {
    if (!value) return null;
    
    try {
      if (typeof value === 'string') {
        const parsed = parseISO(value);
        return isValid(parsed) 
          ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0)
          : null;
      }
      
      if (value instanceof Date && isValid(value)) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }, [value]);

  const selectedDate = getSelectedDate();

  return (
    <div className={`custom-datepicker-wrapper ${className}`}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={customViLocale}>
        <MuiDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format={DATEPICKER.FORMAT}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          disableFuture={disableFuture}
          clearable={clearable}
          slotProps={{
            textField: {
              placeholder: placeholder,
              className: "custom-datepicker-input",
              fullWidth: true,
              variant: "outlined",
              size: "medium",
              inputProps: {
                'aria-label': DATEPICKER.ACCESSIBILITY.INPUT_LABEL,
              }
            },
            popper: {
              className: "custom-datepicker-popper",
              placement: "bottom-start"
            },
            actionBar: {
              actions: ['today', clearable ? 'clear' : null, 'accept'].filter(Boolean),
              className: "custom-datepicker-actions"
            },
            day: {
              className: "custom-datepicker-day"
            }
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default React.memo(CustomDatePicker);