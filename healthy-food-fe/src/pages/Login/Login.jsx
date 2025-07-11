import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './login.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => (
  <div className="login-container">
    <div className="login-box">
      <h2 className="login-title">ログイン</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={values => {
          console.log(values);
        }}
      >
        {() => (
          <Form className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">Email</label>
              <Field id="email" name="email" type="email" placeholder="Emailを入力" className="login-input" />
              <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.95rem' }} />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label password-label">パスワード</label>
              <Field id="password" name="password" type="password" placeholder="パスワードを入力" className="login-input" />
              <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.95rem' }} />
            </div>
            <button type="submit" className="login-button">ログイン</button>
          </Form>
        )}
      </Formik>
      <div className="login-footer">
        <span>アカウントを持っていない方</span>
        <a href="/register" className="login-link">アカウント登録</a>
      </div>
    </div>
  </div>
);

export default Login;