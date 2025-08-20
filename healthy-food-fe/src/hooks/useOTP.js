import { useState, useEffect, useCallback } from 'react';

const useOTP = (email) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);


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

  const handleOTPChange = useCallback((value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }
  }, []);

  const startCountdown = useCallback((seconds = 60) => {
    setCountdown(seconds);
    setCanResend(false);
  }, []);

  const resetOTP = useCallback(() => {
    setOtp('');
    setCountdown(0);
    setCanResend(true);
    setIsVerifying(false);
  }, []);

  const formatCountdown = useCallback(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [countdown]);

  const handleRateLimitError = useCallback((errorMessage) => {
    if (errorMessage.includes('Vui lòng đợi')) {
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
