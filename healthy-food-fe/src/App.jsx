import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { FoodProvider } from './context/FoodContext';
import { CalorieProvider } from './context/CalorieContext';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Home = React.lazy(() => import('./pages/Home/Home'));

function App() {
  // Reset body height on app mount
  React.useEffect(() => {
    // Reset any forced height from previous debugging
    document.body.style.height = '';
    document.body.style.minHeight = '';
    document.documentElement.style.height = '';
    document.documentElement.style.minHeight = '';
    
    // Remove any force scroll elements
    const forceElement = document.getElementById('force-scroll-element');
    if (forceElement) {
      forceElement.remove();
    }
    
    // Reset any inline styles that might have been set
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
  }, []);

  return (
    <AuthProvider>
      <BlogProvider>
        <FoodProvider>
          <CalorieProvider>
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <ScrollToTop />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/home/*" element={<Home />} />
                  <Route path="/" element={<Navigate to="/home" replace />} />
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