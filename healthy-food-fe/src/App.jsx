import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import ScrollToTop from './components/ScrollToTop';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}>
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
    </BrowserRouter>
  );
}

export default App;