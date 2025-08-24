// Fixed import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { authAPI } from '../../services/api';
import Banner from './components/Banner/Banner';
import MenuCarousel from './components/MenuCarousel/MenuCarousel';
import Features from './components/Features/Features';
import BlogSection from './components/BlogSection/BlogSection';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const { posts } = useBlogContext();
  const navigate = useNavigate();
  const latestPosts = posts.slice(0, 3);
  const [currentBmi, setCurrentBmi] = useState(null);

  // Cleanup body styles on mount
  useEffect(() => {
    // Reset any inline styles
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
  }, []);

  // Load current BMI for signed-in user
  useEffect(() => {
    const loadBmi = async () => {
      if (!user) return;
      try {
        const res = await authAPI.getBMIData();
        if (res.data?.success && res.data?.data) {
          setCurrentBmi(Number(res.data.data.bmi));
        } else {
          setCurrentBmi(null);
        }
      } catch (_) {
        setCurrentBmi(null);
      }
    };
    loadBmi();
  }, [user]);

  return (
    <>
      <Banner />
      <div className="homepage-container">
        <MenuCarousel navigate={navigate} />
        <Features navigate={navigate} />
        <BlogSection posts={latestPosts} navigate={navigate} />
        {user && <WelcomeSection user={user} currentBmi={currentBmi} navigate={navigate} />}
      </div>
    </>
  );
};

export default HomePage;
