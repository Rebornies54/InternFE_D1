import { useState, useEffect, useCallback } from 'react';

const useOTP = (email) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown timer cho resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Xử lý thay đổi OTP input
  const handleOTPChange = useCallback((value) => {
    // Chỉ cho phép nhập số và tối đa 6 ký tự
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }
  }, []);

  // Bắt đầu countdown
  const startCountdown = useCallback((seconds = 60) => {
    setCountdown(seconds);
    setCanResend(false);
  }, []);

  // Reset OTP
  const resetOTP = useCallback(() => {
    setOtp('');
    setCountdown(0);
    setCanResend(true);
    setIsVerifying(false);
  }, []);

  // Format countdown thành mm:ss
  const formatCountdown = useCallback(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [countdown]);

  // Xử lý lỗi rate limiting
  const handleRateLimitError = useCallback((errorMessage) => {
    if (errorMessage.includes('Vui lòng đợi')) {
      // Trích xuất thời gian từ message
      const match = errorMessage.match(/(\d+) giây/);
      if (match) {
        const seconds = parseInt(match[1]);
        startCountdown(seconds);
      }
    }
  }, [startCountdown]);

  return {
    otp,
    countdown,
    canResend,
    isVerifying,
    handleOTPChange,
    startCountdown,
    resetOTP,
    formatCountdown,
    handleRateLimitError,
    setOtp,
    setIsVerifying
  };
};

export default useOTP;
