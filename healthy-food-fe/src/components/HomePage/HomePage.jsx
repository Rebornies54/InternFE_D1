import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { 
  Target, 
  Users, 
  ArrowRight,
  Calendar,
  Clock,
  Star,
  BarChart3,
  BookOpen,
  Coffee,
  Apple,
  Salad,
  ChevronRight
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const { posts } = useBlogContext();
  const navigate = useNavigate();
  const latestPosts = posts.slice(0, 3);

  // Reset body height on mount
  useEffect(() => {
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
    
    // Log current dimensions for debugging
    console.log('Body height reset:', {
      bodyHeight: document.body.offsetHeight,
      bodyScrollHeight: document.body.scrollHeight,
      htmlHeight: document.documentElement.offsetHeight,
      htmlScrollHeight: document.documentElement.scrollHeight,
      windowHeight: window.innerHeight,
      viewportHeight: window.visualViewport?.height || window.innerHeight
    });
  }, []);

  // Banner slider functionality
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    {
      badge: "Nền tảng dinh dưỡng #1 Việt Nam",
      title: "Dinh dưỡng thông minh cho cuộc sống khỏe mạnh",
      subtitle: "Công cụ theo dõi dinh dưỡng cá nhân hóa giúp bạn đạt được mục tiêu sức khỏe",
      image: "https://cdn.pixabay.com/photo/2024/04/09/10/45/burger-8685610_1280.png",
      primaryAction: { text: "Kiểm tra BMI", link: "/home/body-index", icon: <Target size={16} /> },
      secondaryAction: { text: "Khám phá blog", link: "/home/blog", icon: <BookOpen size={16} /> }
    },
    {
      badge: "Ăn uống thông minh",
      title: "Thực đơn cân bằng mỗi ngày cho sức khỏe tối ưu",
      subtitle: "Khám phá các công thức nấu ăn lành mạnh và tính toán dinh dưỡng chính xác",
      image: "https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg",
      primaryAction: { text: "Tính calo", link: "/home/calorie-index", icon: <BarChart3 size={16} /> },
      secondaryAction: { text: "Xem công thức", link: "/home/calorie-calculation", icon: <Coffee size={16} /> }
    },
    {
      badge: "Hỗ trợ sức khỏe",
      title: "Đạt mục tiêu sức khỏe với kế hoạch cá nhân hóa",
      subtitle: "Theo dõi tiến độ và nhận lời khuyên dinh dưỡng phù hợp với thể trạng",
      image: "https://cdn.pixabay.com/photo/2017/05/25/15/08/jogging-2343558_1280.jpg",
      primaryAction: { text: "Dashboard", link: "/home/dashboard", icon: <BarChart3 size={16} /> },
      secondaryAction: { text: "Thực đơn gợi ý", link: "/home/calorie-calculation", icon: <Salad size={16} /> }
    }
  ];

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToBanner = (index) => {
    setCurrentBanner(index);
  };

  return (
    <div className="homepage-container">
      {/* Banner Slider */}
      <section className="banner-slider">
        <div 
          className="banner-slider-container" 
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="banner-slide">
              <div className="banner-content">
                <div className="banner-badge">
                  <Star size={14} />
                  <span>{banner.badge}</span>
                </div>
                <h1 className="banner-title">
                  {banner.title.includes("khỏe mạnh") ? (
                    <>
                      {banner.title.split("khỏe mạnh")[0]} 
                      <span className="accent">khỏe mạnh</span>
                      {banner.title.split("khỏe mạnh")[1]}
                    </>
                  ) : banner.title}
                </h1>
                <p className="banner-subtitle">
                  {banner.subtitle}
                </p>
                <div className="banner-actions">
                  <Link to={banner.primaryAction.link} className="btn-primary">
                    {banner.primaryAction.icon} {banner.primaryAction.text}
                  </Link>
                  <Link to={banner.secondaryAction.link} className="btn-outline">
                    {banner.secondaryAction.icon} {banner.secondaryAction.text}
                  </Link>
                </div>
              </div>
              <div className="banner-image">
                <img src={banner.image} alt="Healthy Food" className="banner-main-image" />
                <div className="banner-stat-card stat-users">
                  <Users size={20} />
                  <div>
                    <span className="stat-value">10K+</span>
                    <span className="stat-label">Người dùng</span>
                  </div>
                </div>
                <div className="banner-stat-card stat-recipes">
                  <Coffee size={20} />
                  <div>
                    <span className="stat-value">500+</span>
                    <span className="stat-label">Công thức</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="banner-controls">
          {banners.map((_, index) => (
            <div 
              key={index} 
              className={`banner-dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => goToBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Suggested Menu */}
      <section className="suggested-menu-section">
        <div className="section-header section-header-flex">
          <div>
            <div className="section-badge">
              <Salad size={14} />
              <span>Được yêu thích</span>
            </div>
            <h2 className="section-title">Thực đơn gợi ý hôm nay</h2>
          </div>
          <button 
            onClick={() => navigate('/home/calorie-calculation')} 
            className="view-more-link"
          >
            Xem tất cả công thức <ChevronRight size={16} />
          </button>
        </div>
        <div className="menu-grid">
          <div className="menu-card breakfast">
            <div className="menu-image">
              <img src="https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg" alt="Breakfast" />
              <div className="meal-label">Bữa sáng</div>
            </div>
            <div className="menu-content">
              <h3 className="menu-title">Cháo yến mạch trái cây</h3>
              <span className="menu-calories">420 kcal</span>
              <div className="nutrition-facts">
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">15g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">60g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fats</span>
                  <span className="nutrition-value">12g</span>
                </div>
              </div>
              <p className="menu-description">
                Bữa sáng giàu chất xơ với yến mạch, táo, chuối và hạt chia
              </p>
              <button 
                onClick={() => navigate('/home/calorie-calculation')}
                className="menu-link"
              >
                Xem chi tiết <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="menu-card lunch">
            <div className="menu-image">
              <img src="https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg" alt="Lunch" />
              <div className="meal-label">Bữa trưa</div>
            </div>
            <div className="menu-content">
              <h3 className="menu-title">Salad gà nướng rau củ</h3>
              <span className="menu-calories">650 kcal</span>
              <div className="nutrition-facts">
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">40g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">45g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fats</span>
                  <span className="nutrition-value">25g</span>
                </div>
              </div>
              <p className="menu-description">
                Salad đầy đủ dinh dưỡng với ức gà nướng, bơ, cà chua và dầu olive
              </p>
              <button 
                onClick={() => navigate('/home/calorie-calculation')}
                className="menu-link"
              >
                Xem chi tiết <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="menu-card dinner">
            <div className="menu-image">
              <img src="https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg" alt="Dinner" />
              <div className="meal-label">Bữa tối</div>
            </div>
            <div className="menu-content">
              <h3 className="menu-title">Cá hồi nướng với khoai lang</h3>
              <span className="menu-calories">520 kcal</span>
              <div className="nutrition-facts">
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">35g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">40g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fats</span>
                  <span className="nutrition-value">22g</span>
                </div>
              </div>
              <p className="menu-description">
                Cá hồi giàu omega-3 với khoai lang nướng và rau xanh hấp
              </p>
              <button 
                onClick={() => navigate('/home/calorie-calculation')}
                className="menu-link"
              >
                Xem chi tiết <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-badge">
            <Star size={14} />
            <span>Tính năng</span>
          </div>
          <h2 className="section-title">Công cụ theo dõi dinh dưỡng thông minh</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Target size={24} />
            </div>
            <div className="feature-content">
              <h3>BMI Calculator</h3>
              <p>Theo dõi chỉ số BMI và nhận lời khuyên dinh dưỡng được cá nhân hóa</p>
            </div>
            <button 
              onClick={() => navigate('/home/body-index')}
              className="feature-link"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon secondary">
              <BarChart3 size={24} />
            </div>
            <div className="feature-content">
              <h3>Calorie Tracking</h3>
              <p>Ghi chép và theo dõi lượng calo tiêu thụ hàng ngày dễ dàng</p>
            </div>
            <button 
              onClick={() => navigate('/home/calorie-index')}
              className="feature-link"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon accent">
              <Calendar size={24} />
            </div>
            <div className="feature-content">
              <h3>Food Log</h3>
              <p>Lưu trữ lịch sử ăn uống và phân tích dinh dưỡng chi tiết</p>
            </div>
            <button 
              onClick={() => navigate('/home/calorie-calculation')}
              className="feature-link"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon quaternary">
              <BookOpen size={24} />
            </div>
            <div className="feature-content">
              <h3>Blog Community</h3>
              <p>Chia sẻ kiến thức và kinh nghiệm về dinh dưỡng cùng cộng đồng</p>
            </div>
            <button 
              onClick={() => navigate('/home/blog')}
              className="feature-link"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="section-header section-header-flex">
          <div>
            <div className="section-badge">
              <BookOpen size={14} />
              <span>Blog</span>
            </div>
            <h2 className="section-title">Bài viết mới nhất</h2>
          </div>
          <Link to="/home/blog" className="view-more-link">
            Xem tất cả bài viết <ChevronRight size={16} />
          </Link>
        </div>
        <div className="blog-grid">
          {latestPosts.map((post, index) => (
            <div key={post.id} className="blog-card">
              <div className="blog-card-image">
                {post.image_url && post.image_url.trim() !== '' ? (
                  <img src={post.image_url} alt={post.title} />
                ) : (
                  <div className="blog-placeholder">
                    <Coffee size={24} />
                  </div>
                )}
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span className="blog-reading-time">
                    <Clock size={14} /> 5 phút đọc
                  </span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">
                  {post.description || post.content.substring(0, 100)}...
                </p>
                <button 
                  onClick={() => navigate(`/home/blog`)}
                  className="blog-read-more"
                >
                  Đọc tiếp <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      {user && (
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-user-info">
              <div className="user-avatar">
                {user.avatar && user.avatar.trim() !== '' ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                )}
              </div>
              <div className="user-details">
                <h2>Chào mừng trở lại!</h2>
                <p className="user-name">{user.name}</p>
              </div>
            </div>
            <div className="user-stats">
              <div className="user-stat-card">
                <div className="stat-icon">
                  <Target size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">23.5</span>
                  <span className="stat-label">BMI hiện tại</span>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="stat-icon">
                  <BarChart3 size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">1,850</span>
                  <span className="stat-label">Calo mục tiêu</span>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="stat-icon">
                  <Calendar size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Ngày theo dõi</span>
                </div>
              </div>
            </div>
            <div className="welcome-actions">
              <Link to="/home/dashboard" className="btn-primary">
                <BarChart3 size={16} /> Dashboard của tôi
              </Link>
              <button 
                onClick={() => navigate('/home/calorie-calculation')}
                className="btn-outline"
              >
                <Coffee size={16} /> Ghi chép bữa ăn
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;