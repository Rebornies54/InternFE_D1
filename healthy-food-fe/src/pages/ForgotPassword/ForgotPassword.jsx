import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './ForgotPassword.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const scrollToTop = useScrollToTop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await authAPI.forgotPassword(values.email);
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setNewPassword(response.data.data.newPassword);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setShowSuccessModal(false);
    scrollToTop();
    navigate('/login');
  };

  const handleContinueToHome = () => {
    setShowSuccessModal(false);
    scrollToTop();
    navigate('/home');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-head">
          <p className="forgot-password-welcome">Welcome!</p>
          <h2 className="forgot-password-title">Forgot Password</h2>
        </div>
        
        {error && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
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
                {isSubmitting ? 'Processing...' : 'Send New Password'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="forgot-password-footer">
          Remember your password?
          <Link to="/login" className="forgot-password-link">Login</Link>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-content">
              <h3 className="success-modal-title">Password Reset Success!</h3>
              <p className="success-modal-message">
                {successMessage}
              </p>
              
              {newPassword && (
                <div className="new-password-section">
                  <h4>Your new password:</h4>
                  <div className="password-display">
                    <span className="new-password">{newPassword}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(newPassword)}
                      className="copy-button"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="password-note">
                    Please login with this new password and change it in your Profile
                  </p>
                </div>
              )}
              
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