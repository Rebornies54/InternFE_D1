import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/healthy-food-logo.png';
import { User, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Luôn navigate để đảm bảo ScrollToTop được trigger
    navigate(to);
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
                <Link to="/home/profile" className="user-dropdown-item">
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

const Sidebar = ({ expandedMenus, toggleMenu }) => (
  <aside className="home-sidebar">
    <div className="home-sidebar-section">
      <h3 className="home-sidebar-title">Menu</h3>
      <div className="home-sidebar-menu">
        <div className="home-sidebar-menu-item" onClick={() => toggleMenu('alacarte')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {expandedMenus.alacarte ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>À la carte Menu</span>
        </div>
        {expandedMenus.alacarte && (
          <div style={{ marginLeft: 24 }}>
            <div className="home-sidebar-menu-item">
              <span style={{ fontSize: 14, color: '#666' }}>By Item</span>
            </div>
          </div>
        )}
        <div className="home-sidebar-menu-item" onClick={() => toggleMenu('seasonal')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {expandedMenus.seasonal ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Seasonal Menu</span>
        </div>
        {expandedMenus.seasonal && (
          <div style={{ marginLeft: 24 }}>
            <div className="home-sidebar-menu-item">
              <span style={{ fontSize: 14, color: '#666' }}>By Dish</span>
            </div>
          </div>
        )}
        <div className="home-sidebar-menu-item" onClick={() => toggleMenu('daily')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {expandedMenus.daily ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Menu by Time</span>
        </div>
        {expandedMenus.daily && (
          <div style={{ marginLeft: 24 }}>
            <div style={{ fontSize: 14, color: '#1ca7ec' }}>Morning</div>
            <div style={{ fontSize: 14, color: '#666' }}>Afternoon</div>
            <div style={{ fontSize: 13, color: '#bbb' }}>......</div>
          </div>
        )}
        <div className="home-sidebar-menu-item" onClick={() => toggleMenu('weekday')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {expandedMenus.weekday ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Menu by Day</span>
        </div>
        {expandedMenus.weekday && (
          <div style={{ marginLeft: 24 }}>
            <div style={{ fontSize: 14, color: '#666' }}>Monday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Tuesday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Wednesday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Thursday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Friday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Saturday</div>
            <div style={{ fontSize: 14, color: '#666' }}>Sunday</div>
          </div>
        )}
        <div className="home-sidebar-menu-item" onClick={() => toggleMenu('popular')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {expandedMenus.popular ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Popular Menu</span>
        </div>
        {expandedMenus.popular && (
          <div style={{ marginLeft: 24, fontSize: 14, color: '#666' }}>
            <div>Title</div>
          </div>
        )}
      </div>
    </div>
  </aside>
);

// BlogLayout: Header + Sidebar + Main
const BlogLayout = ({ children }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    seasonal: true,
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
const BlogPage = () => (
  <BlogLayout>
    <Blog />
  </BlogLayout>
);

const BodyIndexPage = () => (
  <PageLayout>
    <BodyIndex />
  </PageLayout>
);

const CalorieIndexPage = () => (
  <PageLayout>
    <CalorieIndex />
  </PageLayout>
);

const CalorieCalculationPage = () => (
  <PageLayout>
    <CalorieCalculation />
  </PageLayout>
);

const DashboardPage = () => (
  <PageLayout>
    <Dashboard />
  </PageLayout>
);

const ProfilePage = () => (
  <PageLayout>
    <Profile />
  </PageLayout>
);

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