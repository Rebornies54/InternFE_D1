import { UI_TEXT, VALIDATION, ERROR_MESSAGES } from '../../constants';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop, useForm, useModal } from '../../hooks';
import './register.css';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  birthday: Yup.string(),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: Yup.string().required('Phone number is required'),
  gender: Yup.string(),
  province: Yup.string().required('Province is required'),
  district: Yup.string().required('District is required'),
  address: Yup.string()
});

const FormField = ({ label, name, type = "text", as, placeholder, required, children, className, groupClassName }) => (
  <div className={`register-form-group ${groupClassName || ''}`}>
    <label htmlFor={name} className="register-label">
      {required && <span className="register-required-mark">*</span>}
      {label}
    </label>
    
    {as === "select" ? (
      <div className={`register-select-wrapper ${className}-wrapper`}>
        <Field
          as="select"
          id={name}
          name={name}
          className={`register-select ${className}`}
        >
          <option value="" disabled>{placeholder}</option>
          {children}
        </Field>
      </div>
    ) : (
      <Field
        id={name}
        name={name}
        type={type}
        className={`register-input ${className}`}
        placeholder={placeholder}
        autoComplete={name === 'password' ? 'new-password' : name}
      />
    )}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const { scrollToTop } = useScrollToTop();
  const { isSubmitting, withSubmitting } = useForm();
  const { isOpen: showSuccessModal, openModal, closeModal } = useModal();
  const { isOpen: showErrorModal, openModal: openErrorModal, closeModal: closeErrorModal } = useModal();
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    name: '',
    birthday: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    province: '',
    district: '',
    address: ''
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    await withSubmitting(async () => {
      const errors = {};
      if (!values.name) errors.name = 'Full name is required';
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (!values.phone) errors.phone = 'Phone number is required';
      if (!values.province) errors.province = 'Province is required';
      if (!values.district) errors.district = 'District is required';
      
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        setErrorMessage('Please fill in all required information');
        openErrorModal();
        return;
      }

      const result = await register(values);
      if (result.success) {
        openModal();
      } else {
        setErrorMessage(result.message || 'Registration failed');
        openErrorModal();
      }
    });
  };

  const handleLoginNow = () => {
    closeModal();
    scrollToTop();
    navigate('/login');
  };

  const handleContinueToHome = () => {
    closeModal();
    scrollToTop();
    navigate('/home');
  };

  const handleCloseErrorModal = () => {
    closeErrorModal();
    setErrorMessage('');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-head">
          <p className="register-welcome">Welcome!</p>
          <h2 className="register-title">Account Registration</h2>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="register-form">
              <div className="register-form-wrapper">
                <FormField
                  label="Full Name"
                  name="name"
                  required={true}
                  className="register-input-fullname"
                />
                {errors.name && touched.name && (
                  <div className="register-error">{errors.name}</div>
                )}
                <div className="register-form-row">
                  <FormField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    placeholder="DD.MM.YYYY"
                    className="register-input-birthday"
                    groupClassName="register-form-group-birthday"
                  />
                  
                  <FormField
                    label="Email"
                    name="email"
                    required={true}
                    placeholder={UI_TEXT.ENTER_EMAIL}
                    className="register-input-email"
                    groupClassName="register-form-group-email"
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="register-error">{errors.email}</div>
                )}
                <div className="register-form-row">
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    required={true}
                    placeholder={UI_TEXT.ENTER_PASSWORD}
                    className="register-input-password"
                    groupClassName="register-form-group-password"
                  />
                  
                  <FormField
                    label="Phone Number"
                    name="phone"
                    required={true}
                    placeholder="Enter your phone number"
                    className="register-input-phone"
                    groupClassName="register-form-group-phone"
                  />
                </div>
                {(errors.password && touched.password) && (
                  <div className="register-error">{errors.password}</div>
                )}
                {(errors.phone && touched.phone) && (
                  <div className="register-error">{errors.phone}</div>
                )}
              
                <FormField
                  label="Gender"
                  name="gender"
                  as="select"
                  placeholder="Select gender"
                  className="register-select-gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </FormField>

                <FormField
                  label="Province"
                  name="province"
                  as="select"
                  required={true}
                  placeholder="Select province"
                  className="register-select-province"
                >
                  <option value="tokyo">Tokyo</option>
                  <option value="osaka">Osaka</option>
                  <option value="kyoto">Kyoto</option>
                </FormField>
                {errors.province && touched.province && (
                  <div className="register-error">{errors.province}</div>
                )}

                <FormField
                  label="District"
                  name="district"
                  as="select"
                  required={true}
                  placeholder="Select district"
                  className="register-select-district"
                >
                  <option value="Ishikari">Ishikari</option>
                  <option value="Teshio">Teshio</option>
                  <option value="Tokachi">Tokachi</option>
                  <option value="Abuta">Abuta</option>
                  <option value="Sorachi">Sorachi</option>
                </FormField>
                {errors.district && touched.district && (
                  <div className="register-error">{errors.district}</div>
                )}

                <FormField
                  label="Address"
                  name="address"
                  placeholder="Enter your address"
                  className="register-input-address"
                />
              </div>
              
              <button 
                type="submit" 
                className="register-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="register-footer">
          Already have an account?
          <Link to="/login" className="register-link">Login</Link>
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-content">
              <h3 className="success-modal-title">Congratulations!</h3>
              <p className="success-modal-message">
                You have successfully registered!
              </p>
              <p className="success-modal-question">
                Would you like to <span 
                  className="login-link-text" 
                  onClick={handleLoginNow}
                >
                  login now
                </span>?
              </p>
              <div className="success-modal-buttons">
                <button 
                  className="success-modal-btn success-modal-btn-secondary"
                  onClick={handleContinueToHome}
                >
                  Continue to home page
                </button>
                <button 
                  className="success-modal-btn success-modal-btn-primary"
                  onClick={handleLoginNow}
                >
                  Login now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <div className="error-modal-content">
              <h3 className="error-modal-title">Registration Error</h3>
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

export default Register;