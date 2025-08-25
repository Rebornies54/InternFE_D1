import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/healthy-food-logo.png';
import { User, ChevronDown, ChevronRight, LogOut, Search, Clock, Calendar, Star, Utensils, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { useFoodContext } from '../../context/FoodContext';
import { STORAGE_KEYS } from '../../constants';
import ScrollToTop from '../../components/ScrollToTop';
import { getFallbackImage } from '../../utils/updateFoodImages';


import './home.css';

import Blog from '../../components/Blog';
import BodyIndex from '../../components/BodyIndex';
import CalorieIndex from '../../components/CalorieIndex';
import CalorieCalculation from '../../components/CalorieCalculation';
import Dashboard from '../../components/Dashboard';
import Profile from '../../components/Profile';
import HomePage from '../../components/HomePage/HomePage';
import FoodVariations from '../../components/FoodVariations/FoodVariations';

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
        <div className="home-logo-group" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
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
  const { foodItems, foodCategories } = useBlogContext();
  const { handleFoodClick } = useFoodContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDays, setExpandedDays] = useState({});
  const [expandedTimes, setExpandedTimes] = useState({});
  const [showAllStates, setShowAllStates] = useState({});

  // More robust deduplication using Map to ensure unique categories by ID
  const uniqueCategories = useMemo(() => {
    if (!foodCategories || !Array.isArray(foodCategories)) return [];
    
    const categoryMap = new Map();
    foodCategories.forEach(category => {
      if (category && category.id && !categoryMap.has(category.id)) {
        categoryMap.set(category.id, category);
      }
    });
    
    // Convert to array and sort by ID to ensure consistent order
    return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
  }, [foodCategories]);

  const filteredFoodItems = foodItems.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFoodsByCategory = (categoryId) => {
    return foodItems.filter(food => food.category_id == categoryId);
  };

  const getPopularFoods = () => {
    // Get high-calorie foods and popular Vietnamese/International dishes
    const popularFoodNames = [
      // High calorie traditional foods
      'Butter', 'Olive Oil', 'Avocado', 'Nuts (mixed)', 'Cheese (cheddar)',
      // Popular Vietnamese dishes
      'Phở Bò', 'Bún Bò Huế', 'Cơm Tấm', 'Bánh Mì', 'Gỏi Cuốn',
      // Popular International dishes
      'Pizza Margherita', 'Hamburger', 'Pasta Carbonara', 'Sushi Roll', 'Pad Thai'
    ];
    
    return foodItems
      .filter(food => popularFoodNames.includes(food.name))
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 8);
  };

  const getSeasonalFoods = () => {
    // Include seasonal vegetables, fruits, and traditional seasonal dishes
    const seasonalFoodNames = [
      // Seasonal vegetables
      'Broccoli (raw)', 'Spinach (raw)', 'Asparagus', 'Bell Peppers (raw)', 'Zucchini',
      // Seasonal fruits
      'Strawberries', 'Mango', 'Pineapple', 'Oranges', 'Grapes',
      // Vietnamese seasonal dishes
      'Bánh Chưng', 'Xôi Gấc', 'Chè Hạt Sen', 'Bánh Tét', 'Mứt Tết',
      // International seasonal dishes
      'Pumpkin Soup', 'Apple Pie', 'Cranberry Sauce', 'Roasted Turkey', 'Christmas Pudding'
    ];
    
    return foodItems
      .filter(food => seasonalFoodNames.includes(food.name))
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  };

  const getTimeBasedMenu = (time) => {
    const timeMenus = {
      morning: [
        // Traditional breakfast items
        'Oatmeal (cooked)', 'Whole Milk', 'Bananas (raw)', 'Apples (raw)', 'Yogurt (plain)', 
        'Granola', 'Honey', 'Berries', 'Egg (chicken)', 'Bread (white)',
        // Vietnamese breakfast
        'Phở Bò', 'Bánh Mì', 'Cháo Gà', 'Bánh Cuốn', 'Xôi Gấc',
        // International breakfast
        'Pancakes', 'French Toast', 'Scrambled Eggs', 'Avocado Toast', 'Greek Yogurt'
      ],
      afternoon: [
        // Traditional lunch items
        'Chicken (raw)', 'Brown Rice (cooked)', 'Broccoli (raw)', 'Carrots (raw)', 
        'Sweet Potato', 'Green Beans', 'Cauliflower', 'Bell Peppers',
        // Vietnamese lunch
        'Cơm Tấm', 'Bún Chả', 'Gỏi Cuốn', 'Canh Chua', 'Thịt Kho',
        // International lunch
        'Grilled Salmon', 'Quinoa Bowl', 'Mediterranean Salad', 'Pasta Primavera', 'Chicken Caesar Salad'
      ],
      evening: [
        // Traditional dinner items
        'Salmon (raw)', 'Quinoa (cooked)', 'Spinach (raw)', 'Tomatoes (raw)', 
        'Tuna (raw)', 'Asparagus', 'Mushrooms', 'Zucchini',
        // Vietnamese dinner
        'Bún Bò Huế', 'Cơm Niêu', 'Lẩu', 'Gà Nướng', 'Cá Kho',
        // International dinner
        'Beef Steak', 'Roasted Vegetables', 'Miso Soup', 'Pad Thai', 'Sushi'
      ]
    };
    
    return foodItems.filter(food => 
      timeMenus[time]?.includes(food.name)
    );
  };

  const getWeekdayMenu = (day) => {
    const dayMenus = {
      monday: [
        // Traditional Monday items
        'Chicken (raw)', 'White Rice (cooked)', 'Broccoli (raw)', 'Green Beans', 'Carrots (raw)', 'Sweet Potato',
        // Vietnamese Monday
        'Phở Gà', 'Rau Muống Xào', 'Canh Rau Cải', 'Thịt Heo Luộc',
        // International Monday
        'Chicken Stir Fry', 'Steamed Vegetables', 'Brown Rice', 'Clear Soup'
      ],
      tuesday: [
        // Traditional Tuesday items
        'Pork (raw)', 'Pasta (cooked)', 'Carrots (raw)', 'Spinach (raw)', 'Bell Peppers (raw)', 'Mushrooms',
        // Vietnamese Tuesday
        'Thịt Kho Tàu', 'Cơm Gà', 'Canh Chua Cá', 'Rau Lang Luộc',
        // International Tuesday
        'Pork Chops', 'Pasta Carbonara', 'Green Salad', 'Minestrone Soup'
      ],
      wednesday: [
        // Traditional Wednesday items
        'Beef (raw)', 'Quinoa (cooked)', 'Spinach (raw)', 'Asparagus', 'Zucchini', 'Cauliflower',
        // Vietnamese Wednesday
        'Bò Lúc Lắc', 'Cơm Tấm', 'Canh Bí Đỏ', 'Rau Cải Xào',
        // International Wednesday
        'Beef Tacos', 'Quinoa Bowl', 'Roasted Vegetables', 'Gazpacho'
      ],
      thursday: [
        // Traditional Thursday items
        'Salmon (raw)', 'Brown Rice (cooked)', 'Bell Peppers (raw)', 'Broccoli (raw)', 'Carrots (raw)', 'Green Beans',
        // Vietnamese Thursday
        'Cá Hồi Kho', 'Cơm Gạo Lứt', 'Canh Rau Dền', 'Đậu Hũ Xào',
        // International Thursday
        'Grilled Salmon', 'Wild Rice', 'Steamed Broccoli', 'Fish Chowder'
      ],
      friday: [
        // Traditional Friday items
        'Turkey (raw)', 'Barley (cooked)', 'Cucumber (raw)', 'Tomatoes (raw)', 'Lettuce', 'Onions (raw)',
        // Vietnamese Friday
        'Gà Nướng Lá Chanh', 'Xôi Đậu Xanh', 'Canh Chua Tôm', 'Rau Muống Xào Tỏi',
        // International Friday
        'Turkey Burger', 'Barley Risotto', 'Greek Salad', 'Tomato Soup'
      ],
      saturday: [
        // Traditional Saturday items
        'Egg (chicken)', 'Oatmeal (cooked)', 'Tomatoes (raw)', 'Bananas (raw)', 'Apples (raw)', 'Berries',
        // Vietnamese Saturday
        'Cháo Trắng', 'Bánh Mì Ốp La', 'Trái Cây Tươi', 'Sữa Đậu Nành',
        // International Saturday
        'Eggs Benedict', 'Overnight Oats', 'Fruit Smoothie', 'Avocado Toast'
      ],
      sunday: [
        // Traditional Sunday items
        'Tuna (raw)', 'Buckwheat (cooked)', 'Onions (raw)', 'Garlic', 'Ginger', 'Lemon',
        // Vietnamese Sunday
        'Lẩu Hải Sản', 'Cơm Niêu', 'Canh Cải Chua', 'Gỏi Cuốn',
        // International Sunday
        'Tuna Nicoise Salad', 'Buckwheat Pancakes', 'Onion Soup', 'Lemon Chicken'
      ]
    };
    
    return foodItems.filter(food => 
      dayMenus[day]?.includes(food.name)
    );
  };

  const getSeasonalFoodsBySeason = (season) => {
    const seasonalFoods = {
      Spring: [
        'Broccoli (raw)', 'Spinach (raw)', 'Asparagus', 'Bell Peppers (raw)', 'Zucchini',
        'Strawberries', 'Mango', 'Pineapple', 'Oranges', 'Grapes',
        'Bánh Chưng', 'Xôi Gấc', 'Chè Hạt Sen', 'Bánh Tét', 'Mứt Tết'
      ],
      Summer: [
        'Tomatoes (raw)', 'Cucumber (raw)', 'Lettuce', 'Onions (raw)', 'Garlic',
        'Watermelon', 'Cantaloupe', 'Peaches', 'Plums', 'Cherries',
        'Chè Hạt Sen', 'Bánh Tét', 'Mứt Tết', 'Bánh Chưng', 'Xôi Gấc'
      ],
      Autumn: [
        'Sweet Potato', 'Pumpkin', 'Butternut Squash', 'Carrots (raw)', 'Cauliflower',
        'Apples (raw)', 'Pears', 'Persimmons', 'Pomegranate', 'Figs',
        'Bánh Chưng', 'Xôi Gấc', 'Chè Hạt Sen', 'Bánh Tét', 'Mứt Tết'
      ],
      Winter: [
        'Kale', 'Brussels Sprouts', 'Cabbage', 'Turnips', 'Parsnips',
        'Oranges', 'Grapefruit', 'Tangerines', 'Pomegranate', 'Kiwi',
        'Bánh Chưng', 'Xôi Gấc', 'Chè Hạt Sen', 'Bánh Tét', 'Mứt Tết'
      ]
    };
    
    return foodItems.filter(food => 
      seasonalFoods[season]?.includes(food.name)
    );
  };

  const getPopularFoodsByCategory = (category) => {
    if (category === 'High Calories') {
      return foodItems
        .filter(food => food.calories > 500)
        .sort((a, b) => b.calories - a.calories)
        .slice(0, 8);
    } else if (category === 'Vietnamese Favorites') {
      const vietnameseFavorites = [
        'Phở Bò', 'Bún Bò Huế', 'Cơm Tấm', 'Bánh Mì', 'Gỏi Cuốn',
        'Cơm Tấm', 'Bún Chả', 'Gỏi Cuốn', 'Canh Chua', 'Thịt Kho'
      ];
      return foodItems
        .filter(food => vietnameseFavorites.includes(food.name))
        .sort((a, b) => b.calories - a.calories)
        .slice(0, 8);
    } else if (category === 'International Favorites') {
      const internationalFavorites = [
        'Pizza Margherita', 'Hamburger', 'Pasta Carbonara', 'Sushi Roll', 'Pad Thai',
        'Pasta Carbonara', 'Chicken Caesar Salad', 'Mediterranean Salad'
      ];
      return foodItems
        .filter(food => internationalFavorites.includes(food.name))
        .sort((a, b) => b.calories - a.calories)
        .slice(0, 8);
    }
    return [];
  };


  const renderFoodItem = (food) => {
    // Get fallback image based on category
    const imageUrl = food.image_url && food.image_url.trim() !== '' && food.image_url !== 'null' 
      ? food.image_url 
      : getFallbackImage(food.category_id);
    
    return (
      <div 
        key={food.id} 
        className="sidebar-food-item"
        onClick={() => handleFoodClick(food)}
      >
        <div className="sidebar-food-icon">
          <img 
            src={imageUrl} 
            alt={food.name}
            onError={(e) => {
              e.target.src = getFallbackImage(food.category_id);
            }}
          />
        </div>
        <div className="sidebar-food-info">
          <div className="sidebar-food-name">{food.name || 'Unknown Food'}</div>
          <div className="sidebar-food-calories">{food.calories || 0} cal</div>
        </div>
      </div>
    );
  };

  const toggleDay = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleTime = (time) => {
    setExpandedTimes(prev => ({ ...prev, [time]: !prev[time] }));
  };

  const toggleShowAll = (key) => {
    setShowAllStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFoodItemsWithLimit = (foods, limit = 4, key) => {
    const showAll = showAllStates[key] || false;
    const displayedFoods = showAll ? foods : foods.slice(0, limit);
    const hasMore = foods.length > limit;

    return (
      <div>
        {displayedFoods.map(renderFoodItem)}
        {hasMore && !showAll && (
          <button 
            className="sidebar-show-more-btn"
            onClick={() => toggleShowAll(key)}
          >
            + Xem thêm ({foods.length - limit})
          </button>
        )}
        {hasMore && showAll && (
          <button 
            className="sidebar-show-less-btn"
            onClick={() => toggleShowAll(key)}
          >
            - Thu gọn
          </button>
        )}
      </div>
    );
  };

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
              <div className="sidebar-submenu-title">By Category</div>
              {uniqueCategories.map(category => (
                <div key={category.id}>
                  <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleDay(`category-${category.id}`)}>
                    {expandedDays[`category-${category.id}`] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {category.name}
                  </div>
                  {expandedDays[`category-${category.id}`] && renderFoodItemsWithLimit(getFoodsByCategory(category.id), 4, `category-${category.id}`)}
                </div>
              ))}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('seasonal')}>
            {expandedMenus.seasonal ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Calendar size={16} />
            <span>Seasonal Menu</span>
          </div>
          {expandedMenus.seasonal && (
            <div className="sidebar-submenu">
              <div className="sidebar-submenu-title">By Season</div>
              {['Spring', 'Summer', 'Autumn', 'Winter'].map(season => (
                <div key={season}>
                  <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleDay(`season-${season}`)}>
                    {expandedDays[`season-${season}`] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {season}
                  </div>
                  {expandedDays[`season-${season}`] && renderFoodItemsWithLimit(getSeasonalFoodsBySeason(season), 3, `season-${season}`)}
                </div>
              ))}
            </div>
          )}

          <div className="home-sidebar-menu-item home-sidebar-menu-item-clickable" onClick={() => toggleMenu('daily')}>
            {expandedMenus.daily ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Clock size={16} />
            <span>Menu by Time</span>
          </div>
                     {expandedMenus.daily && (
             <div className="sidebar-submenu">
               <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleTime('morning')}>
                 {expandedTimes.morning ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                 Morning
               </div>
               {expandedTimes.morning && renderFoodItemsWithLimit(getTimeBasedMenu('morning'), 3, 'morning')}
               
               <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleTime('afternoon')}>
                 {expandedTimes.afternoon ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                 Afternoon
               </div>
               {expandedTimes.afternoon && renderFoodItemsWithLimit(getTimeBasedMenu('afternoon'), 3, 'afternoon')}
               
               <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleTime('evening')}>
                 {expandedTimes.evening ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                 Evening
               </div>
               {expandedTimes.evening && renderFoodItemsWithLimit(getTimeBasedMenu('evening'), 3, 'evening')}
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
                   <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleDay(day)}>
                     {expandedDays[day] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                     {day.charAt(0).toUpperCase() + day.slice(1)}
                   </div>
                   {expandedDays[day] && renderFoodItemsWithLimit(getWeekdayMenu(day), 3, day)}
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
              <div className="sidebar-submenu-title">By Popularity</div>
              {['High Calories', 'Vietnamese Favorites', 'International Favorites'].map(category => (
                <div key={category}>
                  <div className="sidebar-submenu-title home-sidebar-menu-item-clickable" onClick={() => toggleDay(`popular-${category}`)}>
                    {expandedDays[`popular-${category}`] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {category}
                  </div>
                  {expandedDays[`popular-${category}`] && renderFoodItemsWithLimit(getPopularFoodsByCategory(category), 4, `popular-${category}`)}
                </div>
              ))}
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
      <FoodVariations />
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