import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/healthy-food-logo.png';
import { User, ChevronDown, ChevronRight, LogOut, Search, Clock, Calendar, Star, Utensils, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { STORAGE_KEYS } from '../../constants';
import ScrollToTop from '../../components/ScrollToTop';


import './home.css';

import Blog from '../../components/Blog';
import BodyIndex from '../../components/BodyIndex';
import CalorieIndex from '../../components/CalorieIndex';
import CalorieCalculation from '../../components/CalorieCalculation';
import Dashboard from '../../components/Dashboard';
import Profile from '../../components/Profile';
import HomePage from '../../components/HomePage/HomePage';

const navTabs = [
  { label: 'Blog', path: '/home/blog', key: 'blog' },
  { label: 'Body Index', path: '/home/body-index', key: 'body' },
  { label: 'HOME', path: '/home', key: 'home', isHome: true },
  { label: 'Calorie Index', path: '/home/calorie-index', key: 'calorie' },
  { label: 'Calorie Calculation', path: '/home/calorie-calculation', key: 'calculation' },
  { label: 'Dashboard', path: '/home/dashboard', key: 'dashboard' },
];

const NavLink = ({ to, children, className, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Navigate immediately - let React Router handle scroll naturally
    navigate(to);
    
    if (onClick) onClick();
  };
  
  const isActive = location.pathname === to;
  
  return (
    <a 
      href={to}
      onClick={handleClick}
      className={`${className} ${isActive ? 'active' : ''}`}
    >
      {children}
    </a>
  );
};

const Header = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.home-user-group')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.home-header') && isMobileMenuOpen) {
        toggleMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, toggleMobileMenu]);
  
  return (
    <header className="home-header">
      <div className="home-header-content">
        <div className="home-logo-group">
          <img src={logo} alt="Healthy Food Logo" className="home-logo-img" />
          <span className="home-app-name">HEALTHY FOOD</span>
        </div>
        
        <div className="home-nav-container">
          <nav className="home-nav desktop-nav">
            {navTabs.map(tab => (
              <NavLink
                key={tab.key}
                to={tab.path}
                className={`home-nav-link ${tab.key} ${tab.isHome ? 'home-tab' : ''}`}
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="home-user-group">
          <div className="user-link" onClick={toggleUserDropdown}>
            <User size={20} className="user-icon" />
            <span className="user-name">{user?.name || 'User'}</span>
            <ChevronDown size={14} className={`dropdown-arrow ${showUserDropdown ? 'rotated' : ''}`} />
          </div>
          
          {showUserDropdown && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-greeting">
                  Hello, <span className="user-dropdown-name">{user?.name || 'User'}</span>!
                </div>
              </div>
              <div className="user-dropdown-divider"></div>
              <div className="user-dropdown-menu">
                <Link 
                  to="/home/profile" 
                  className="user-dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                  }}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button className="user-dropdown-item logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="home-nav mobile-nav">
          <div className="mobile-nav-header">
            <span className="mobile-nav-title">Menu</span>
            <button 
              className="mobile-nav-close"
              onClick={toggleMobileMenu}
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mobile-nav-content">
            {navTabs.map(tab => (
              <NavLink
                key={tab.key}
                to={tab.path}
                className={`home-nav-link mobile-nav-link ${tab.key} ${tab.isHome ? 'home-tab' : ''}`}
                onClick={toggleMobileMenu}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          <div className="mobile-nav-footer">
            <div className="mobile-user-info">
              <User size={16} />
              <span>{user?.name || 'User'}</span>
            </div>
            <button 
              className="mobile-logout-btn"
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

const Sidebar = ({ expandedMenus, toggleMenu }) => {
  const { foodItems, foodCategories, openFoodModal } = useBlogContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoodItems = foodItems.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFoodsByCategory = (categoryId) => {
    return foodItems.filter(food => food.category_id == categoryId);
  };

  const getPopularFoods = () => {
    return foodItems
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 5);
  };

  const getSeasonalFoods = () => {
    const seasonalCategories = [2, 3];
    return foodItems
      .filter(food => seasonalCategories.includes(food.category_id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  const getTimeBasedMenu = (time) => {
    const timeMenus = {
      morning: ['Oatmeal (cooked)', 'Whole Milk', 'Bananas (raw)', 'Apples (raw)'],
      afternoon: ['Chicken (raw)', 'Brown Rice (cooked)', 'Broccoli (raw)', 'Carrots (raw)'],
      evening: ['Salmon (raw)', 'Quinoa (cooked)', 'Spinach (raw)', 'Tomatoes (raw)']
    };
    
    return foodItems.filter(food => 
      timeMenus[time]?.includes(food.name)
    );
  };

  const getWeekdayMenu = (day) => {
    const dayMenus = {
      monday: ['Chicken (raw)', 'White Rice (cooked)', 'Broccoli (raw)'],
      tuesday: ['Pork (raw)', 'Pasta (cooked)', 'Carrots (raw)'],
      wednesday: ['Beef (raw)', 'Quinoa (cooked)', 'Spinach (raw)'],
      thursday: ['Salmon (raw)', 'Brown Rice (cooked)', 'Bell Peppers (raw)'],
      friday: ['Turkey (raw)', 'Barley (cooked)', 'Cucumber (raw)'],
      saturday: ['Egg (chicken)', 'Oatmeal (cooked)', 'Tomatoes (raw)'],
      sunday: ['Tuna (raw)', 'Buckwheat (cooked)', 'Onions (raw)']
    };
    
    return foodItems.filter(food => 
      dayMenus[day]?.includes(food.name)
    );
  };

  const handleFoodClick = (food) => {
    openFoodModal(food);
  };

  const renderFoodItem = (food) => (
    <div 
      key={food.id} 
      className="sidebar-food-item"
      onClick={() => handleFoodClick(food)}
    >
      <div className="sidebar-food-icon"></div>
      <div className="sidebar-food-info">
        <div className="sidebar-food-name">{food.name}</div>
        <div className="sidebar-food-calories">{food.calories} cal</div>
      </div>
    </div>
  );

  return (
    <aside className="home-sidebar">
      <div className="home-sidebar-section">
        <h3 className="home-sidebar-title">Menu</h3>
        
        <div className="sidebar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm thực phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
        </div>

        <div className="home-sidebar-menu">
          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('alacarte')}>
            {expandedMenus.alacarte ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Utensils size={16} />
            <span>À la carte Menu</span>
          </div>
          {expandedMenus.alacarte && (
            <div className="sidebar-submenu">
              <div className="sidebar-submenu-title">By Item</div>
              {filteredFoodItems.slice(0, 5).map(renderFoodItem)}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('seasonal')}>
            {expandedMenus.seasonal ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Calendar size={16} />
            <span>Seasonal Menu</span>
          </div>
          {expandedMenus.seasonal && (
            <div className="sidebar-submenu">
              <div className="sidebar-submenu-title">By Dish</div>
              {getSeasonalFoods().map(renderFoodItem)}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('daily')}>
            {expandedMenus.daily ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Clock size={16} />
            <span>Menu by Time</span>
          </div>
          {expandedMenus.daily && (
            <div className="sidebar-submenu">
              <div className="sidebar-submenu-title">Morning</div>
              {getTimeBasedMenu('morning').map(renderFoodItem)}
              <div className="sidebar-submenu-title">Afternoon</div>
              {getTimeBasedMenu('afternoon').map(renderFoodItem)}
              <div className="sidebar-submenu-title">Evening</div>
              {getTimeBasedMenu('evening').map(renderFoodItem)}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('weekday')}>
            {expandedMenus.weekday ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Calendar size={16} />
            <span>Menu by Day</span>
          </div>
          {expandedMenus.weekday && (
            <div className="sidebar-submenu">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day}>
                  <div className="sidebar-submenu-title">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                  {getWeekdayMenu(day).map(renderFoodItem)}
                </div>
              ))}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('popular')}>
            {expandedMenus.popular ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Star size={16} />
            <span>Popular Menu</span>
          </div>
          {expandedMenus.popular && (
            <div className="sidebar-submenu">
              <div className="sidebar-submenu-title">Top Calories</div>
              {getPopularFoods().map(renderFoodItem)}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const BlogLayout = ({ children, isMobileMenuOpen, toggleMobileMenu }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    seasonal: false,
    daily: false,
    weekday: false,
    popular: false,
    alacarte: false
  });
  
  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };
  
  useEffect(() => {
    try {
      const savedMenuState = localStorage.getItem(STORAGE_KEYS.BLOG_MENUS);
      if (savedMenuState) {
        setExpandedMenus(JSON.parse(savedMenuState));
      }
          } catch (e) {
      }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOG_MENUS, JSON.stringify(expandedMenus));
          } catch (e) {
      }
  }, [expandedMenus]);
  
  return (
    <div className="home-container">
      <Header isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <div className="home-layout">
        <Sidebar expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        <main className="home-main">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const PageLayout = ({ children, isMobileMenuOpen, toggleMobileMenu }) => (
  <div className="home-container">
    <Header isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
    <main className="home-main">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  </div>
);

const BlogPage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <BlogLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <Blog />
    </BlogLayout>
  );
};

const BodyIndexPage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <BodyIndex />
    </PageLayout>
  );
};

const CalorieIndexPage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <CalorieIndex />
    </PageLayout>
  );
};

const CalorieCalculationPage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <CalorieCalculation />
    </PageLayout>
  );
};

const DashboardPage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <Dashboard />
    </PageLayout>
  );
};

const ProfilePage = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <Profile />
    </PageLayout>
  );
};

const HomePageComponent = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <PageLayout isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
      <HomePage />
    </PageLayout>
  );
};

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePageComponent isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/home" element={<HomePageComponent isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/blog" element={<BlogPage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/body-index" element={<BodyIndexPage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/calorie-index" element={<CalorieIndexPage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/calorie-calculation" element={<CalorieCalculationPage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/dashboard" element={<DashboardPage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
        <Route path="/profile" element={<ProfilePage isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />} />
      </Routes>
    </>
  );
};

Home.HomePageComponent = HomePageComponent;
Home.BlogPage = BlogPage;
Home.BodyIndexPage = BodyIndexPage;
Home.CalorieIndexPage = CalorieIndexPage;
Home.CalorieCalculationPage = CalorieCalculationPage;
Home.DashboardPage = DashboardPage;
Home.ProfilePage = ProfilePage;

export default Home;