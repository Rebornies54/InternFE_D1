import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import ScrollToTop from './components/ScrollToTop';

import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import { CalorieProvider } from './context/CalorieContext';
import { BlogProvider } from './context/BlogContext';
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FoodProvider>
            <CalorieProvider>
              <BlogProvider>
                <ScrollToTop />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/home/blog" replace />} />
                    <Route path="blog" element={<Home.BlogPage />} />
                    <Route path="body-index" element={<Home.BodyIndexPage />} />
                    <Route path="calorie-index" element={<Home.CalorieIndexPage />} />
                    <Route path="calorie-calculation" element={<Home.CalorieCalculationPage />} />
                    <Route path="dashboard" element={<Home.DashboardPage />} />
                    <Route path="profile" element={<Home.ProfilePage />} />
                  </Route>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </BlogProvider>
            </CalorieProvider>
          </FoodProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;