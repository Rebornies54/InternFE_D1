import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBlogContext } from '../../context/BlogContext';
import { motion, useInView } from 'framer-motion';
import { authAPI } from '../../services/api';
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
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const { posts } = useBlogContext();
  const navigate = useNavigate();
  const latestPosts = posts.slice(0, 3);
  const [currentBmi, setCurrentBmi] = useState(null);

  // Carousel drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Animation variants for scroll-triggered animations
  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    hidden: { 
      opacity: 0, 
      x: -60 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const slideInRight = {
    hidden: { 
      opacity: 0, 
      x: 60 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const scaleIn = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

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

// Banner slider functionality
const [currentBanner, setCurrentBanner] = useState(0);
const banners = [
];

// Menu carousel functionality with infinite loop
const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
const [isTransitioning, setIsTransitioning] = useState(false);

const originalMenuItems = [
    {
      id: 1,
      title: "Cháo yến mạch trái cây",
      meal: "Bữa sáng",
      calories: "420 kcal",
      image: "https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg",
      nutrition: { protein: "15g", carbs: "60g", fats: "12g" },
      description: "Bữa sáng giàu chất xơ với yến mạch, táo, chuối và hạt chia"
    },
    {
      "id": 2,
      "title": "Salad gà nướng rau củ",
      "meal": "Bữa trưa",
      "calories": "650 kcal",
      "image": "https://cdn.pixabay.com/photo/2024/02/02/12/34/lettuce-8548078_1280.jpg",
      "nutrition": { "protein": "40g", "carbs": "45g", "fats": "25g" },
      "description": "Salad đầy đủ dinh dưỡng với ức gà nướng, bơ, cà chua và dầu olive"
    },
    {
      "id": 3,
      "title": "Cá hồi nướng với khoai lang",
      "meal": "Bữa tối",
      "calories": "520 kcal",
      "image": "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg",
      "nutrition": { "protein": "35g", "carbs": "40g", "fats": "22g" },
      "description": "Cá hồi giàu omega-3 với khoai lang nướng và rau xanh hấp"
    },
    {
      "id": 4,
      "title": "Smoothie bowl trái cây",
      "meal": "Bữa phụ",
      "calories": "280 kcal",
      "image": "https://cdn.pixabay.com/photo/2024/02/27/06/18/ai-generated-8599511_1280.jpg",
      "nutrition": { "protein": "8g", "carbs": "45g", "fats": "8g" },
      "description": "Smoothie bowl tươi mát với các loại trái cây theo mùa"
    },
    {
      "id": 5,
      "title": "Bánh mì nguyên cám trứng và bơ",
      "meal": "Bữa sáng",
      "calories": "450 kcal",
      "image": "https://cdn.pixabay.com/photo/2020/03/23/16/56/homemade-4961416_1280.jpg",
      "nutrition": { "protein": "20g", "carbs": "35g", "fats": "22g" },
      "description": "Bữa sáng tiện lợi với bánh mì nguyên cám, trứng luộc và bơ chín"
    },
    {
      "id": 6,
      "title": "Bún thịt nướng rau sống",
      "meal": "Bữa trưa",
      "calories": "680 kcal",
      "image": "https://cdn.pixabay.com/photo/2024/04/23/09/25/ai-generated-8714496_1280.jpg",
      "nutrition": { "protein": "32g", "carbs": "55g", "fats": "28g" },
      "description": "Món ăn truyền thống Việt với thịt nướng, bún và rau sống tươi"
    },
    {
      "id": 7,
     "title": "Súp bí đỏ hạt quinoa",
      "meal": "Bữa tối",
      "calories": "350 kcal",
      "image": "https://cdn.pixabay.com/photo/2021/09/27/19/13/pumpkin-6662081_1280.jpg",
      "nutrition": { "protein": "12g", "carbs": "40g", "fats": "10g" },
      "description": "Súp ấm nhẹ nhàng với bí đỏ, hạt quinoa, sữa hạt và gia vị tự nhiên — ít béo, dễ tiêu"
    },
    {
      "id": 8,
      "title": "Bowl sữa chua Hy Lạp và granola",
      "meal": "Bữa phụ",
      "calories": "290 kcal",
      "image": "https://cdn.pixabay.com/photo/2019/08/17/16/42/granola-4412584_1280.jpg",
      "nutrition": { "protein": "17g", "carbs": "28g", "fats": "10g" },
      "description": "Bữa phụ nhẹ nhàng với sữa chua Hy Lạp ít đường, granola homemade và trái cây tươi"
    }
  ];

  // Create tripled array for infinite loop: [original] + [original] + [original]
  const menuItems = [...originalMenuItems, ...originalMenuItems, ...originalMenuItems];

  // Auto slide for menu carousel with infinite loop
  useEffect(() => {
    const menuInterval = setInterval(() => {
      setCurrentMenuIndex((prev) => {
        const nextIndex = prev + 1;
        // If we reach the end of the tripled array, jump back to the middle set seamlessly
        if (nextIndex >= originalMenuItems.length * 2) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentMenuIndex(originalMenuItems.length);
          }, 50);
          return originalMenuItems.length * 2 - 1; // Stay at the end temporarily
        }
        return nextIndex;
      });
    }, 5000); // Change every 5 seconds
    return () => clearInterval(menuInterval);
  }, [originalMenuItems.length]);

  const nextMenu = () => {
    setCurrentMenuIndex((prev) => {
      const nextIndex = prev + 1;
      // If we reach the end of the tripled array, jump back to the middle set seamlessly
      if (nextIndex >= originalMenuItems.length * 2) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMenuIndex(originalMenuItems.length);
        }, 50);
        return originalMenuItems.length * 2 - 1; // Stay at the end temporarily
      }
      return nextIndex;
    });
  };

  const prevMenu = () => {
    setCurrentMenuIndex((prev) => {
      const prevIndex = prev - 1;
      // If we go below the middle set, jump to the end of the middle set seamlessly
      if (prevIndex < originalMenuItems.length) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMenuIndex(originalMenuItems.length * 2 - 1);
        }, 50);
        return originalMenuItems.length; // Stay at the beginning temporarily
      }
      return prevIndex;
    });
  };

  // Drag handlers
  const handleDragStart = (e) => {
    // Ignore if clicking on navigation buttons
    if (e.target.closest('.carousel-nav-btn')) {
      return;
    }
    
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    setCurrentX(clientX);
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if we should change slides based on drag distance
    const dragThreshold = 100; // Minimum drag distance to trigger slide change
    
    if (Math.abs(dragOffset) > dragThreshold) {
      if (dragOffset > 0) {
        // Dragged right - go to previous
        prevMenu();
      } else {
        // Dragged left - go to next
        nextMenu();
      }
    }
    
    setDragOffset(0);
  };

  // Add event listeners with passive: false to prevent the warning
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleTouchStart = (e) => {
      if (e.target.closest('.carousel-nav-btn')) {
        return;
      }
      setIsDragging(true);
      const clientX = e.touches[0].clientX;
      setStartX(clientX);
      setCurrentX(clientX);
      setDragOffset(0);
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches[0].clientX;
      const deltaX = clientX - startX;
      setCurrentX(clientX);
      setDragOffset(deltaX);
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      const dragThreshold = 100;
      if (Math.abs(dragOffset) > dragThreshold) {
        if (dragOffset > 0) {
          prevMenu();
        } else {
          nextMenu();
        }
      }
      setDragOffset(0);
    };

    // Add touch event listeners with passive: false
    carouselElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    carouselElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      carouselElement.removeEventListener('touchstart', handleTouchStart);
      carouselElement.removeEventListener('touchmove', handleTouchMove);
      carouselElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, dragOffset, originalMenuItems.length]);

  // Calculate transform for carousel track
  const getTrackTransform = () => {
    const baseTransform = -currentMenuIndex * 100;
    const dragTransform = (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;
    return `translateX(${baseTransform + dragTransform}%)`;
  };

  // Handle seamless transitions for infinite loop
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Short delay to ensure transition completes
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="homepage-container">
      {/* Simplified Banner - No animations */}
      <section className="banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <div className="banner-badge">
              <Star size={14} />
              <span>Nền tảng dinh dưỡng #1 Việt Nam</span>
            </div>
            <h1 className="banner-title">
              Dinh dưỡng thông minh cho cuộc sống khỏe mạnh
            </h1>
            <p className="banner-subtitle">
              Công cụ theo dõi dinh dưỡng cá nhân hóa giúp bạn đạt được mục tiêu sức khỏe
            </p>
            <div className="banner-actions">
              <Link to="/home/body-index" className="banner-primary-btn">
                <Target size={16} />
                Kiểm tra BMI
              </Link>
              <Link to="/home/blog" className="banner-secondary-btn">
                <BookOpen size={16} />
                Khám phá blog
              </Link>
            </div>
          </div>
          <div className="banner-image">
            <img 
              src="https://cdn.pixabay.com/photo/2024/06/03/23/32/food-8807457_1280.jpg" 
              alt="Healthy Food Banner" 
            />
          </div>
        </div>
      </section>

      {/* Suggested Menu Carousel */}
      <motion.section 
        className="suggested-menu-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <motion.div 
          className="section-header section-header-flex"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <motion.div 
              className="section-badge"
              variants={scaleIn}
            >
              <Salad size={14} />
              <span>Được yêu thích</span>
            </motion.div>
            <motion.h2 
              className="section-title"
              variants={fadeInUp}
            >
              Thực đơn gợi ý hôm nay
            </motion.h2>
          </motion.div>
          <motion.button 
            onClick={() => navigate('/home/calorie-calculation')} 
            className="view-more-link"
            variants={slideInRight}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Xem tất cả công thức <ChevronRight size={16} />
          </motion.button>
        </motion.div>
        
        <div 
          className={`menu-carousel-container ${isDragging ? 'dragging' : ''}`}
          ref={carouselRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <button 
            className="carousel-nav-btn carousel-prev"
            onClick={prevMenu}
            aria-label="Previous menu item"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="menu-carousel">
                         <div 
               className="menu-carousel-track"
               ref={trackRef}
               style={{
                 transform: getTrackTransform(),
                 transition: isDragging || isTransitioning ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
               }}
             >
              {menuItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`menu-carousel-card ${index === currentMenuIndex ? 'active' : ''}`}
                >
                  <div className="menu-card-image">
                    {item.image && item.image.trim() !== '' && (
                      <img src={item.image} alt={item.title} />
                    )}
                    <div className="meal-label">{item.meal}</div>
                  </div>
                  <div className="menu-card-content">
                    <h3 className="menu-card-title">{item.title}</h3>
                    <span className="menu-card-calories">{item.calories}</span>
                    <div className="menu-card-nutrition">
                      <div className="nutrition-item">
                        <span className="nutrition-label">Protein</span>
                        <span className="nutrition-value">{item.nutrition.protein}</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Carbs</span>
                        <span className="nutrition-value">{item.nutrition.carbs}</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Fats</span>
                        <span className="nutrition-value">{item.nutrition.fats}</span>
                      </div>
                    </div>
                    <p className="menu-card-description">{item.description}</p>
                    <button 
                      onClick={() => navigate('/home/calorie-calculation')}
                      className="menu-card-link"
                    >
                      Xem chi tiết <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="carousel-nav-btn carousel-next"
            onClick={nextMenu}
            aria-label="Next menu item"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        

      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <motion.div 
          className="section-header"
          variants={staggerContainer}
        >
          <motion.div 
            className="section-badge"
            variants={scaleIn}
          >
            <Star size={14} />
            <span>Tính năng</span>
          </motion.div>
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            Công cụ theo dõi dinh dưỡng thông minh
          </motion.h2>
        </motion.div>
        <motion.div 
          className="features-grid"
          variants={staggerContainer}
        >
          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="feature-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Target size={24} />
            </motion.div>
            <div className="feature-content">
              <h3>BMI Calculator</h3>
              <p>Theo dõi chỉ số BMI và nhận lời khuyên dinh dưỡng được cá nhân hóa</p>
            </div>
            <motion.button 
              onClick={() => navigate('/home/body-index')}
              className="feature-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="feature-icon secondary"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <BarChart3 size={24} />
            </motion.div>
            <div className="feature-content">
              <h3>Calorie Tracking</h3>
              <p>Ghi chép và theo dõi lượng calo tiêu thụ hàng ngày dễ dàng</p>
            </div>
            <motion.button 
              onClick={() => navigate('/home/calorie-index')}
              className="feature-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="feature-icon accent"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Calendar size={24} />
            </motion.div>
            <div className="feature-content">
              <h3>Food Log</h3>
              <p>Lưu trữ lịch sử ăn uống và phân tích dinh dưỡng chi tiết</p>
            </div>
            <motion.button 
              onClick={() => navigate('/home/calorie-calculation')}
              className="feature-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="feature-icon quaternary"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <BookOpen size={24} />
            </motion.div>
            <div className="feature-content">
              <h3>Blog Community</h3>
              <p>Chia sẻ kiến thức và kinh nghiệm về dinh dưỡng cùng cộng đồng</p>
            </div>
            <motion.button 
              onClick={() => navigate('/home/blog')}
              className="feature-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Blog Section */}
      <motion.section 
        className="blog-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <motion.div 
          className="section-header section-header-flex"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <motion.div 
              className="section-badge"
              variants={scaleIn}
            >
              <BookOpen size={14} />
              <span>Blog</span>
            </motion.div>
            <motion.h2 
              className="section-title"
              variants={fadeInUp}
            >
              Bài viết mới nhất
            </motion.h2>
          </motion.div>
          <motion.div variants={slideInRight}>
            <Link to="/home/blog" className="view-more-link">
              Xem tất cả bài viết <ChevronRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="blog-grid"
          variants={staggerContainer}
        >
          {latestPosts.map((post, index) => (
            <motion.div 
              key={post.id} 
              className="blog-card"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="blog-card-image">
                {post.image_url && post.image_url.trim() !== '' ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    onError={(e) => {
                      console.warn(`Failed to load homepage blog image: ${post.image_url}`);
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentNode.querySelector('.blog-placeholder');
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="blog-placeholder" 
                  style={{ 
                    display: (post.image_url && post.image_url.trim() !== '') ? 'none' : 'flex'
                  }}
                >
                  <Coffee size={24} />
                </div>
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Welcome Section */}
      {user && (
        <motion.section 
          className="welcome-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div 
            className="welcome-card"
            variants={scaleIn}
          >
            <motion.div 
              className="welcome-user-info"
              variants={staggerContainer}
            >
              <motion.div 
                className="user-avatar"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                {user.avatar && user.avatar.trim() !== '' ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                )}
              </motion.div>
              <motion.div 
                className="user-details"
                variants={fadeInUp}
              >
                <h2>Chào mừng trở lại!</h2>
                <p className="user-name">{user.name}</p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="user-stats"
              variants={staggerContainer}
            >
              <motion.div 
                className="user-stat-card"
                variants={fadeInUp}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div 
                  className="stat-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Target size={20} />
                </motion.div>
                <div className="stat-info">
                      <span className="stat-value">{currentBmi?.toFixed ? currentBmi.toFixed(1) : '—'}</span>
                  <span className="stat-label">BMI hiện tại</span>
                </div>
              </motion.div>
              <motion.div 
                className="user-stat-card"
                variants={fadeInUp}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div 
                  className="stat-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <BarChart3 size={20} />
                </motion.div>
                <div className="stat-info">
                  <span className="stat-value">1,850</span>
                  <span className="stat-label">Calo mục tiêu</span>
                </div>
              </motion.div>
              <motion.div 
                className="user-stat-card"
                variants={fadeInUp}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div 
                  className="stat-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Calendar size={20} />
                </motion.div>
                <div className="stat-info">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Ngày theo dõi</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="welcome-actions"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Link to="/home/dashboard" className="btn-primary">
                  <BarChart3 size={16} /> Dashboard của tôi
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <button 
                  onClick={() => navigate('/home/calorie-calculation')}
                  className="btn-outline"
                >
                  <Coffee size={16} /> Ghi chép bữa ăn
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default HomePage;