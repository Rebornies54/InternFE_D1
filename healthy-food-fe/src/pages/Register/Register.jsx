import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
const FormField = ({ label, name, type = "text", as, placeholder, required, children, className }) => (
  <div className="register-form-group">
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

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-head">
          <p className="register-welcome">Welcome!</p>
          <h2 className="register-title">アカウント登録</h2>
        </div>
        
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
                  label="氏名"
                  name="name"
                  required={true}
                  className="register-input-fullname"
                />
                
                {/* Birthday and Email */}
                <div className="register-form-row">
                  <FormField
                    label="生年月日"
                    name="birthday"
                    type="date"
                    placeholder="DD.MM.YYYY"
                    className="register-input-birthday"
                  />
                  
                  <FormField
                    label="Nhập Email"
                    name="email"
                    required={true}
                    placeholder="Nhập Email"
                    className="register-input-email"
                  />
                </div>
                
                {/* Password and Phone */}
                <div className="register-form-row">
                  <FormField
                    label="パスワード"
                    name="password"
                    type="password"
                    required={true}
                    placeholder="パスワードを入力"
                    className="register-input-password"
                  />
                  
                  <FormField
                    label="電話番号"
                    name="phone"
                    required={true}
                    placeholder="電話番号を入力"
                    className="register-input-phone"
                  />
                </div>
                
                {/* Gender */}
                <FormField
                  label="性別"
                  name="gender"
                  as="select"
                  placeholder="性別を選択"
                  className="register-select-gender"
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                </FormField>
                
                {/* Province */}
                <FormField
                  label="都道府県"
                  name="province"
                  as="select"
                  required={true}
                  placeholder="都道府県"
                  className="register-select-province"
                >
                  <option value="tokyo">東京都</option>
                  <option value="osaka">大阪府</option>
                  <option value="kyoto">京都府</option>
                </FormField>
                
                {/* District */}
                <FormField
                  label="市/区"
                  name="district"
                  as="select"
                  required={true}
                  placeholder="市/区"
                  className="register-select-district"
                >
                </FormField>
                
                {/* Address */}
                <FormField
                  label="番地"
                  name="address"
                  placeholder="番地"
                  className="register-input-address"
                />
              </div>
              
              <button type="submit" className="register-button">登録</button>
            </Form>
          )}
        </Formik>
        
        <div className="register-footer">
          既に登録している方はこちら
          <a href="/login" className="register-link">ログイン</a>
        </div>
      </div>
    </div>
  );
};

export default Register;