import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop, useForm, useModal, useError } from '../../hooks';
import useOTP from '../../hooks/useOTP';
import { DEFAULTS, UI } from '../../constants';
import './ForgotPassword.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();
  const { scrollToTop } = useScrollToTop();
  const { isSubmitting, withSubmitting } = useForm();
  const { isOpen: showSuccessModal, openModal, closeModal } = useModal();
  const { error, setError, clearError } = useError();
  
  const [currentStep, setCurrentStep] = useState(DEFAULTS.CURRENT_STEP); // 'email', 'otp', 'reset', 'success'
  const [userEmail, setUserEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  const {
    otp,
    countdown,
    canResend,
    isVerifying,
    handleOTPChange,
    startCountdown,
    resetOTP,
    formatCountdown,
    handleRateLimitError,
    setIsVerifying
  } = useOTP(userEmail);

  const handleSendEmail = async (values, { setSubmitting }) => {
    await withSubmitting(async () => {
      clearError();
      
      const result = await forgotPassword(values.email);
      if (result.success) {
        setUserEmail(values.email);
        setCurrentStep('otp');
        startCountdown(60); 
      } else {
        handleRateLimitError(result.message);
      }
    });
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    clearError();
    
    const result = await verifyOTP(userEmail, otp);
    if (result.success) {
      setCurrentStep('reset');
    }
    setIsVerifying(false);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    clearError();
    const result = await forgotPassword(userEmail);
    if (result.success) {
      startCountdown(60);
    } else {
      handleRateLimitError(result.message);
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    await withSubmitting(async () => {
      clearError();
      
      const result = await resetPassword(userEmail, otp, values.newPassword);
      if (result.success) {
        setSuccessMessage(result.message);
        setCurrentStep('success');
        openModal();
      }
    });
  };

  const handleBackToLogin = () => {
    closeModal();
    scrollToTop();
    navigate('/login');
  };

  const handleContinueToHome = () => {
    closeModal();
    scrollToTop();
    navigate('/home');
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setUserEmail('');
    resetOTP();
    clearError();
  };

  const handleBackToOTP = () => {
    setCurrentStep('otp');
    clearError();
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-head">
          <p className="forgot-password-welcome">Welcome!</p>
          <h2 className="forgot-password-title">
            {currentStep === 'email' && 'Forgot Password'}
            {currentStep === 'otp' && 'Enter OTP'}
            {currentStep === 'reset' && 'Reset Password'}
            {currentStep === 'success' && 'Success!'}
          </h2>
        </div>
        
        {error && (
          <div className="forgot-password-error-message">
            {error}
          </div>
        )}

        {currentStep === 'email' && (
          <>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSendEmail}
            >
              {() => (
                <Form className="forgot-password-form">
                  <div className="forgot-password-form-group">
                    <label htmlFor="email" className="forgot-password-label">
                      <span className="forgot-password-required-mark">*</span>
                      Email
                    </label>
                    <Field 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="email" component="div" className="forgot-password-error" />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="forgot-password-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="forgot-password-footer">
              Remember your password?
              <Link to="/login" className="forgot-password-link">Login</Link>
            </div>
          </>
        )}
        {currentStep === 'otp' && (
          <>
            <div className="otp-section">
              <p className="otp-instruction">
                We've sent a 6-digit OTP to <strong>{userEmail}</strong>
              </p>
              
              <div className="otp-input-group">
                <label className="forgot-password-label">
                  <span className="forgot-password-required-mark">*</span>
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => handleOTPChange(e.target.value)}
                  placeholder="000000"
                  className="forgot-password-input otp-input"
                  maxLength={6}
                />
              </div>

              <div className="otp-actions">
                <button 
                  className="forgot-password-button"
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <div className="resend-section">
                  {!canResend ? (
                    <span className="countdown-text">
                      Resend OTP in {formatCountdown()}
                    </span>
                  ) : (
                    <button 
                      className="resend-btn"
                      onClick={handleResendOTP}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="forgot-password-footer">
              <button 
                className="back-btn"
                onClick={handleBackToEmail}
              >
                ← Back to Email
              </button>
            </div>
          </>
        )}

        {currentStep === 'reset' && (
          <>
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleResetPassword}
            >
              {() => (
                <Form className="forgot-password-form">
                  <div className="forgot-password-form-group">
                    <label htmlFor="newPassword" className="forgot-password-label">
                      <span className="forgot-password-required-mark">*</span>
                      New Password
                    </label>
                    <Field 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      placeholder="Enter new password" 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="newPassword" component="div" className="forgot-password-error" />
                  </div>

                  <div className="forgot-password-form-group">
                    <label htmlFor="confirmPassword" className="forgot-password-label">
                      <span className="forgot-password-required-mark">*</span>
                      Confirm Password
                    </label>
                    <Field 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="Confirm new password" 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="forgot-password-error" />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="forgot-password-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="forgot-password-footer">
              <button 
                className="back-btn"
                onClick={handleBackToOTP}
              >
                ← Back to OTP
              </button>
            </div>
          </>
        )}
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-content">
              <h3 className="success-modal-title">Password Reset Success!</h3>
              <p className="success-modal-message">
                {successMessage}
              </p>
              
              <div className="success-modal-buttons">
                <button 
                  className="success-modal-btn success-modal-btn-secondary"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
                <button 
                  className="success-modal-btn success-modal-btn-primary"
                  onClick={handleContinueToHome}
                >
                  Continue to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword; 