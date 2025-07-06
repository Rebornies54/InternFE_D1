import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import logo from '../../assets/logo/healthy-food-logo.png';
import { User, ChevronDown, ChevronRight } from 'lucide-react';
import ScrollToTop from '../../components/ScrollToTop';
import './home.css';

// Import các component mới
import Blog from '../../components/Blog';
import BodyIndex from '../../components/BodyIndex';
import CalorieIndex from '../../components/CalorieIndex';
import CalorieCalculation from '../../components/CalorieCalculation';
import Dashboard from '../../components/Dashboard';

// Static data
const navTabs = [
  { label: 'Blog', path: '/home/blog', key: 'blog' },
  { label: 'Body index', path: '/home/body-index', key: 'body' },
  { label: 'Calorie Index', path: '/home/calorie-index', key: 'calorie' },
  { label: 'Calorie Calculation', path: '/home/calorie-calculation', key: 'calculation' },
  { label: 'Dashboard', path: '/home/dashboard', key: 'dashboard' },
];

// Components
const Header = () => {
  const location = useLocation();
  
  return (
    <header className="home-header">
      <div className="home-header-content">
        <div className="home-logo-group">
          <img src={logo} alt="Healthy Food Logo" className="home-logo-img" />
          <span className="home-app-name">HEALTHY FOOD</span>
        </div>
        <nav className="home-nav">
          {navTabs.map(tab => (
            <Link
              key={tab.key}
              to={tab.path}
              className={`home-nav-link ${tab.key} ${location.pathname === tab.path ? 'active' : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="home-user-group">
          <Link to="/login" className="user-link">
            <User size={24} className="user-icon" />
            <span>user</span>
          </Link>
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

const Home = () => {
  return <Outlet />;
};

Home.BlogPage = BlogPage;
Home.BodyIndexPage = BodyIndexPage;
Home.CalorieIndexPage = CalorieIndexPage;
Home.CalorieCalculationPage = CalorieCalculationPage;
Home.DashboardPage = DashboardPage;

export default Home;