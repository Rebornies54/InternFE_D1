import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/healthy-food-logo.png';
import { User, ChevronDown, ChevronRight, LogOut, Search, Clock, Calendar, Star, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { useNavigationScroll } from '../../hooks/useNavigationScroll';
import { usePageScroll } from '../../hooks/usePageScroll';
import './home.css';

// Import các component mới
import Blog from '../../components/Blog';
import BodyIndex from '../../components/BodyIndex';
import CalorieIndex from '../../components/CalorieIndex';
import CalorieCalculation from '../../components/CalorieCalculation';
import Dashboard from '../../components/Dashboard';
import Profile from '../../components/Profile';

// Navigation tabs configuration
const navTabs = [
  { label: 'Blog', path: '/home/blog', key: 'blog' },
  { label: 'Body Index', path: '/home/body-index', key: 'body' },
  { label: 'Calorie Index', path: '/home/calorie-index', key: 'calorie' },
  { label: 'Calorie Calculation', path: '/home/calorie-calculation', key: 'calculation' },
  { label: 'Dashboard', path: '/home/dashboard', key: 'dashboard' },
];

// Custom NavLink component for better control
const NavLink = ({ to, children, className }) => {
  const location = useLocation();
  const navigateWithScroll = useNavigationScroll();
  
  const handleClick = (e) => {
    e.preventDefault();
    navigateWithScroll(to);
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

// Components
const Header = () => {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const handleLogout = () => {
    logout();
    // Redirect sẽ được xử lý bởi ProtectedRoute
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Đóng dropdown khi click ra ngoài
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
  
  return (
    <header className="home-header">
      <div className="home-header-content">
        <div className="home-logo-group">
          <img src={logo} alt="Healthy Food Logo" className="home-logo-img" />
          <span className="home-app-name">HEALTHY FOOD</span>
        </div>
        <nav className="home-nav">
          {navTabs.map(tab => (
            <NavLink
              key={tab.key}
              to={tab.path}
              className={`home-nav-link ${tab.key}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="home-user-group">
          <div className="user-link" onClick={toggleUserDropdown}>
            <User size={24} className="user-icon" />
            <span className="user-name">{user?.name || 'User'}</span>
            <ChevronDown size={16} className={`dropdown-arrow ${showUserDropdown ? 'rotated' : ''}`} />
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
                    window.scrollTo(0, 0);
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
    </header>
  );
};

const Sidebar = ({ expandedMenus, toggleMenu }) => {
  const { foodItems, foodCategories, openFoodModal } = useBlogContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter food items based on search
  const filteredFoodItems = foodItems.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get food items by category
  const getFoodsByCategory = (categoryId) => {
    return foodItems.filter(food => food.category_id == categoryId);
  };

  // Get popular foods (top 5 by calories)
  const getPopularFoods = () => {
    return foodItems
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 5);
  };

  // Get seasonal foods (random selection)
  const getSeasonalFoods = () => {
    const seasonalCategories = [2, 3]; // Vegetables & Fruits
    return foodItems
      .filter(food => seasonalCategories.includes(food.category_id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  // Get time-based menu
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

  // Get weekday menu
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
        
        {/* Search Bar */}
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
          {/* À la carte Menu */}
          <div className="home-sidebar-menu-item" onClick={() => toggleMenu('alacarte')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* Seasonal Menu */}
          <div className="home-sidebar-menu-item" onClick={() => toggleMenu('seasonal')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* Menu by Time */}
          <div className="home-sidebar-menu-item" onClick={() => toggleMenu('daily')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* Menu by Day */}
          <div className="home-sidebar-menu-item" onClick={() => toggleMenu('weekday')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* Popular Menu */}
          <div className="home-sidebar-menu-item" onClick={() => toggleMenu('popular')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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

// BlogLayout: Header + Sidebar + Main
const BlogLayout = ({ children }) => {
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
  
  // Load expanded menu state from localStorage
  useEffect(() => {
    try {
      const savedMenuState = localStorage.getItem('blogExpandedMenus');
      if (savedMenuState) {
        setExpandedMenus(JSON.parse(savedMenuState));
      }
    } catch (e) {
      console.error("Error loading menu state from localStorage", e);
    }
  }, []);
  
  // Save expanded menu state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('blogExpandedMenus', JSON.stringify(expandedMenus));
    } catch (e) {
      console.error("Error saving menu state to localStorage", e);
    }
  }, [expandedMenus]);
  
  return (
    <div className="home-container">
      <Header />
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

// PageLayout: Header + Main (không Sidebar)
const PageLayout = ({ children }) => (
  <div className="home-container">
    <Header />
    <main className="home-main">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  </div>
);

// Page components sử dụng layout phù hợp
const BlogPage = () => {
  usePageScroll();
  return (
    <BlogLayout>
      <Blog />
    </BlogLayout>
  );
};

const BodyIndexPage = () => {
  usePageScroll();
  return (
    <PageLayout>
      <BodyIndex />
    </PageLayout>
  );
};

const CalorieIndexPage = () => {
  usePageScroll();
  return (
    <PageLayout>
      <CalorieIndex />
    </PageLayout>
  );
};

const CalorieCalculationPage = () => {
  usePageScroll();
  return (
    <PageLayout>
      <CalorieCalculation />
    </PageLayout>
  );
};

const DashboardPage = () => {
  usePageScroll();
  return (
    <PageLayout>
      <Dashboard />
    </PageLayout>
  );
};

const ProfilePage = () => {
  usePageScroll();
  return (
    <PageLayout>
      <Profile />
    </PageLayout>
  );
};

const Home = () => {
  return <Outlet />;
};

Home.BlogPage = BlogPage;
Home.BodyIndexPage = BodyIndexPage;
Home.CalorieIndexPage = CalorieIndexPage;
Home.CalorieCalculationPage = CalorieCalculationPage;
Home.DashboardPage = DashboardPage;
Home.ProfilePage = ProfilePage;

export default Home;