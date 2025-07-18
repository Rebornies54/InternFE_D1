import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './login.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const scrollToTop = useScrollToTop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const result = await login(values);
    if (result.success) {
      scrollToTop();
      navigate('/home');
    } else {
      // Show modal with specific error message
      setErrorMessage(result.message);
      setShowErrorModal(true);
    }
    setSubmitting(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">Email</label>
                <Field 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="login-input" 
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.95rem' }} />
              </div>
              <div className="login-form-group">
                <label htmlFor="password" className="login-label password-label">Password</label>
                <Field 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  className="login-input" 
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.95rem' }} />
              </div>
              <button 
                type="submit" 
                className="login-button"
                disabled={isSubmitting || isSubmitting}
              >
                {isSubmitting || isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="forgot-password-link">
          <Link to="/forgot-password" className="forgot-password-text">
            Forgot Password?
          </Link>
        </div>
        
        <div className="login-footer">
          <span>Don't have an account?</span>
          <Link to="/register" className="login-link">Register now</Link>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <div className="error-modal-content">
              <h3 className="error-modal-title">Login Error</h3>
              <p className="error-modal-message">
                {errorMessage}
              </p>
              <div className="error-modal-buttons">
                <button 
                  className="error-modal-btn error-modal-btn-primary"
                  onClick={handleCloseErrorModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;