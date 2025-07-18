import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './register.css';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
  birthday: Yup.string(),
  email: Yup.string().email('Invalid email address').required('This field is required'),
  password: Yup.string().min(6, 'Please enter at least 6 characters').required('This field is required'),
  phone: Yup.string().required('This field is required'),
  gender: Yup.string(),
  province: Yup.string().required('This field is required'),
  district: Yup.string().required('This field is required'),
  address: Yup.string()
});

// Form field component for consistent styling
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
          <option value="" disabled selected hidden>{placeholder}</option>
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
      />
    )}
    
    <ErrorMessage name={name} component="div" className="register-error" />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const scrollToTop = useScrollToTop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const result = await register(values);
    if (result.success) {
      setShowSuccessModal(true);
    }
    setSubmitting(false);
    setIsSubmitting(false);
  };

  const handleLoginNow = () => {
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
    <div className="register-container">
      <div className="register-box">
        <div className="register-head">
          <p className="register-welcome">Welcome!</p>
          <h2 className="register-title">Account Registration</h2>
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
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="register-form">
              <div className="register-form-wrapper">
                {/* Full Name */}
                <FormField
                  label="Full Name"
                  name="name"
                  required={true}
                  className="register-input-fullname"
                />
                
                {/* Birthday and Email */}
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
                    placeholder="Enter your email"
                    className="register-input-email"
                    groupClassName="register-form-group-email"
                  />
                </div>
                
                {/* Password and Phone */}
                <div className="register-form-row">
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    required={true}
                    placeholder="Enter your password"
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
                
                {/* Gender */}
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
                
                {/* Province */}
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
                
                {/* District */}
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
                
                {/* Address */}
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

      {/* Success Modal */}
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
    </div>
  );
};

export default Register;