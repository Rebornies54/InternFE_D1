import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { FoodProvider } from './context/FoodContext';
import { CalorieProvider } from './context/CalorieContext';
import ScrollToTop from './components/ScrollToTop';
import { UI_TEXT } from './constants';
import './App.css';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Home = React.lazy(() => import('./pages/Home/Home'));

function App() {
  React.useEffect(() => {
    
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <AuthProvider>
      <BlogProvider>
        <FoodProvider>
          <CalorieProvider>
            <BrowserRouter>
              <Suspense fallback={<div>{UI_TEXT.LOADING_TEXT}</div>}>
                <ScrollToTop />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/home/*" element={<Home />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CalorieProvider>
        </FoodProvider>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;