import { useEffect } from 'react';

/**
 * Custom hook để quản lý message timer
 * @param {string} message - Message cần hiển thị
 * @param {Function} setMessage - Function để set message
 * @param {Function|null} setMessageType - Function để set message type (tùy chọn)
 * @param {number} duration - Thời gian hiển thị (ms), mặc định 3000ms
 */
const useMessageTimer = (message, setMessage, setMessageType, duration = 3000) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        if (setMessageType && typeof setMessageType === 'function') {
          setMessageType('');
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, setMessage, setMessageType, duration]);
};

export default useMessageTimer;