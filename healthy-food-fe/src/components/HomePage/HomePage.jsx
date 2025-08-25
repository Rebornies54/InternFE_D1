// Fixed import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
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

  // Use BMI from AuthContext instead of making duplicate API calls
  const { currentBmi: authBmi } = useAuth();
  
  useEffect(() => {
    setCurrentBmi(authBmi);
  }, [authBmi]);

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
