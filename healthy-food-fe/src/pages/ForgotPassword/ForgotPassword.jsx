import { UI_TEXT, VALIDATION, ERROR_MESSAGES, FORGOT_PASSWORD } from '../../constants';
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
      setError(FORGOT_PASSWORD.MESSAGES.ENTER_6_DIGIT);
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
          <p className="forgot-password-welcome">{FORGOT_PASSWORD.WELCOME}</p>
          <h2 className="forgot-password-title">
            {currentStep === 'email' && FORGOT_PASSWORD.STEPS.EMAIL}
            {currentStep === 'otp' && FORGOT_PASSWORD.STEPS.OTP}
            {currentStep === 'reset' && FORGOT_PASSWORD.STEPS.RESET}
            {currentStep === 'success' && FORGOT_PASSWORD.STEPS.SUCCESS}
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
                      {FORGOT_PASSWORD.LABELS.EMAIL}
                    </label>
                    <Field 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder={UI_TEXT.ENTER_EMAIL} 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="email" component="div" className="forgot-password-error" />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="forgot-password-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? FORGOT_PASSWORD.BUTTONS.SENDING_OTP : FORGOT_PASSWORD.BUTTONS.SEND_OTP}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="forgot-password-footer">
              {FORGOT_PASSWORD.MESSAGES.REMEMBER_PASSWORD}
              <Link to="/login" className="forgot-password-link">{FORGOT_PASSWORD.MESSAGES.LOGIN}</Link>
            </div>
          </>
        )}
        {currentStep === 'otp' && (
          <>
            <div className="otp-section">
              <p className="otp-instruction">
                {FORGOT_PASSWORD.MESSAGES.OTP_SENT} <strong>{userEmail}</strong>
              </p>
              
              <div className="otp-input-group">
                <label className="forgot-password-label">
                  <span className="forgot-password-required-mark">*</span>
                  {FORGOT_PASSWORD.LABELS.OTP}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => handleOTPChange(e.target.value)}
                  placeholder={UI_TEXT.OTP_PLACEHOLDER}
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
                  {isVerifying ? FORGOT_PASSWORD.BUTTONS.VERIFYING : FORGOT_PASSWORD.BUTTONS.VERIFY_OTP}
                </button>
                
                <div className="resend-section">
                  {!canResend ? (
                    <span className="countdown-text">
                      {FORGOT_PASSWORD.MESSAGES.RESEND_OTP_IN} {formatCountdown()}
                    </span>
                  ) : (
                    <button 
                      className="resend-btn"
                      onClick={handleResendOTP}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? FORGOT_PASSWORD.MESSAGES.SENDING : FORGOT_PASSWORD.MESSAGES.RESEND_OTP}
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
                {FORGOT_PASSWORD.BUTTONS.BACK_TO_EMAIL}
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
                      {FORGOT_PASSWORD.LABELS.NEW_PASSWORD}
                    </label>
                    <Field 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      placeholder={FORGOT_PASSWORD.PLACEHOLDERS.NEW_PASSWORD} 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="newPassword" component="div" className="forgot-password-error" />
                  </div>

                  <div className="forgot-password-form-group">
                    <label htmlFor="confirmPassword" className="forgot-password-label">
                      <span className="forgot-password-required-mark">*</span>
                      {FORGOT_PASSWORD.LABELS.CONFIRM_PASSWORD}
                    </label>
                    <Field 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder={FORGOT_PASSWORD.PLACEHOLDERS.CONFIRM_PASSWORD} 
                      className="forgot-password-input" 
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="forgot-password-error" />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="forgot-password-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? FORGOT_PASSWORD.BUTTONS.RESETTING : FORGOT_PASSWORD.BUTTONS.RESET_PASSWORD}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="forgot-password-footer">
              <button 
                className="back-btn"
                onClick={handleBackToOTP}
              >
                {FORGOT_PASSWORD.BUTTONS.BACK_TO_OTP}
              </button>
            </div>
          </>
        )}
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-content">
              <h3 className="success-modal-title">{FORGOT_PASSWORD.SUCCESS.TITLE}</h3>
              <p className="success-modal-message">
                {successMessage}
              </p>
              
              <div className="success-modal-buttons">
                <button 
                  className="success-modal-btn success-modal-btn-secondary"
                  onClick={handleBackToLogin}
                >
                  {FORGOT_PASSWORD.SUCCESS.BACK_TO_LOGIN}
                </button>
                <button 
                  className="success-modal-btn success-modal-btn-primary"
                  onClick={handleContinueToHome}
                >
                  {FORGOT_PASSWORD.SUCCESS.CONTINUE_TO_HOME}
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