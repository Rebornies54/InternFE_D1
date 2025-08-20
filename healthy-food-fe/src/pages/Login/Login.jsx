import { UI_TEXT, VALIDATION, ERROR_MESSAGES } from '../../constants';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop, useForm, useModal, useRememberPassword } from '../../hooks';
import { 
  PageTransition, 
  FadeIn, 
  SlideInLeft, 
  AnimatedButton,
  AnimatedModal
} from '../../components/AnimatedComponents';
import './login.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { scrollToTop } = useScrollToTop();
  const { isSubmitting, withSubmitting } = useForm();
  const { isOpen: showErrorModal, openModal, closeModal } = useModal();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    rememberPassword,
    setRememberPassword,
    savedCredentials,
    saveCredentials,
    clearCredentials
  } = useRememberPassword();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    await withSubmitting(async () => {
      const errors = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        setErrorMessage('Please fill in all required information');
        openModal();
        return;
      }

      const result = await login(values);
      if (result.success) {

        if (rememberPassword) {
          saveCredentials(values.email, values.password);
        } else {
          clearCredentials();
        }
        
        scrollToTop();
        navigate('/home');
      } else {
        setErrorMessage(result.message);
        openModal();
      }
    });
  };

  const handleCloseErrorModal = () => {
    closeModal();
    setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberPasswordChange = (e) => {
    setRememberPassword(e.target.checked);
    if (!e.target.checked) {
      clearCredentials();
    }
  };

  const getInitialValues = () => {
    if (savedCredentials) {
      return {
        email: savedCredentials.email || '',
        password: savedCredentials.password || ''
      };
    }
    return { email: '', password: '' };
  };

  return (
    <PageTransition>
      <div className="login-container">
        <FadeIn delay={0.2}>
          <div className="login-box">
            <SlideInLeft delay={0.3}>
              <h2 className="login-title">Login</h2>
            </SlideInLeft>
            
            <Formik
              initialValues={getInitialValues()}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
              enableReinitialize={false}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="login-form">
                  <div className="login-form-group">
                    <label htmlFor="email" className="login-label">Email</label>
                    <Field 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder={UI_TEXT.ENTER_EMAIL} 
                      className="login-input"
                      autoComplete="email" 
                    />
                    {errors.email && touched.email && (
                      <div className="login-error-message">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="login-form-group">
                    <label htmlFor="password" className="login-label password-label">Password</label>
                    <div className="password-input-container">
                      <Field 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder={UI_TEXT.ENTER_PASSWORD} 
                        className="login-input password-input"
                        autoComplete="current-password" 
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <div className="login-error-message">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  
                  <div className="login-options">
                    <label className="remember-password-label">
                      <input
                        type="checkbox"
                        checked={rememberPassword}
                        onChange={handleRememberPasswordChange}
                        className="remember-password-checkbox"
                      />
                      <span className="remember-password-text">Lưu mật khẩu</span>
                    </label>
                  </div>
                  
                  <AnimatedButton 
                    type="submit" 
                    className="login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </AnimatedButton>
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
        </FadeIn>
      </div>

      <AnimatedModal isOpen={showErrorModal} onClose={handleCloseErrorModal}>
        <div className="error-modal">
          <div className="error-modal-content">
            <h3 className="error-modal-title">Login Error</h3>
            <p className="error-modal-message">
              {errorMessage}
            </p>
            <div className="error-modal-buttons">
              <AnimatedButton 
                className="error-modal-btn error-modal-btn-primary"
                onClick={handleCloseErrorModal}
              >
                Close
              </AnimatedButton>
            </div>
          </div>
        </div>
      </AnimatedModal>
    </PageTransition>
  );
};

export default Login;