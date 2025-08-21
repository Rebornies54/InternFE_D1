// Fixed import
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBlogContext } from "../../context/BlogContext";
import { motion } from "framer-motion";
// Fixed import
import { authAPI } from "../../services/api";
import { UI_TEXT } from "../../constants";
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
  ChevronLeft,
} from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  const { user } = useAuth();
  const { posts } = useBlogContext();
  const navigate = useNavigate();
  const latestPosts = posts.slice(0, 3);
  const [currentBmi, setCurrentBmi] = useState(null);

  // Helper function to navigate and scroll to top
  const navigateToPage = (path) => {
    navigate(path);
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      // Also scroll container if exists
      const container = document.querySelector(".home-container");
      if (container && container.scrollTo) {
        container.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    });
  };

  // Carousel drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  // Banner slider functionality
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [];

  // Menu carousel functionality with infinite loop
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Animation variants for scroll-triggered animations
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const slideInLeft = {
    hidden: {
      opacity: 0,
      x: -60,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const slideInRight = {
    hidden: {
      opacity: 0,
      x: 60,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const scaleIn = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const originalMenuItems = [
    {
      id: 1,
      title: "Cháo yến mạch trái cây",
      meal: UI_TEXT.BREAKFAST_MEAL,
      calories: `420 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2016/11/06/23/31/breakfast-1804457_1280.jpg",
      nutrition: { protein: "15g", carbs: "60g", fats: "12g" },
      description: "Bữa sáng giàu chất xơ với yến mạch, táo, chuối và hạt chia",
    },
    {
      id: 2,
      title: "Salad gà nướng rau củ",
      meal: UI_TEXT.LUNCH_MEAL,
      calories: `650 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2024/02/02/12/34/lettuce-8548078_1280.jpg",
      nutrition: { protein: "40g", carbs: "45g", fats: "25g" },
      description:
        "Salad đầy đủ dinh dưỡng với ức gà nướng, bơ, cà chua và dầu olive",
    },
    {
      id: 3,
      title: "Cá hồi nướng với khoai lang",
      meal: UI_TEXT.DINNER_MEAL,
      calories: `520 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg",
      nutrition: { protein: "35g", carbs: "40g", fats: "22g" },
      description: "Cá hồi giàu omega-3 với khoai lang nướng và rau xanh hấp",
    },
    {
      id: 4,
      title: "Smoothie bowl trái cây",
      meal: UI_TEXT.SNACK_MEAL,
      calories: `280 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2024/02/27/06/18/ai-generated-8599511_1280.jpg",
      nutrition: { protein: "8g", carbs: "45g", fats: "8g" },
      description: "Smoothie bowl tươi mát với các loại trái cây theo mùa",
    },
    {
      id: 5,
      title: "Bánh mì nguyên cám trứng và bơ",
      meal: UI_TEXT.BREAKFAST_MEAL,
      calories: `450 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2020/03/23/16/56/homemade-4961416_1280.jpg",
      nutrition: { protein: "20g", carbs: "35g", fats: "22g" },
      description:
        "Bữa sáng tiện lợi với bánh mì nguyên cám, trứng luộc và bơ chín",
    },
    {
      id: 6,
      title: "Bún thịt nướng rau sống",
      meal: UI_TEXT.LUNCH_MEAL,
      calories: `680 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2024/04/23/09/25/ai-generated-8714496_1280.jpg",
      nutrition: { protein: "32g", carbs: "55g", fats: "28g" },
      description:
        "Món ăn truyền thống Việt với thịt nướng, bún và rau sống tươi",
    },
    {
      id: 7,
      title: "Súp bí đỏ hạt quinoa",
      meal: UI_TEXT.DINNER_MEAL,
      calories: `350 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2021/09/27/19/13/pumpkin-6662081_1280.jpg",
      nutrition: { protein: "12g", carbs: "40g", fats: "10g" },
      description:
        "Súp ấm nhẹ nhàng với bí đỏ, hạt quinoa, sữa hạt và gia vị tự nhiên — ít béo, dễ tiêu",
    },
    {
      id: 8,
      title: "Bowl sữa chua Hy Lạp và granola",
      meal: UI_TEXT.SNACK_MEAL,
      calories: `290 ${UI_TEXT.KCAL_UNIT}`,
      image:
        "https://cdn.pixabay.com/photo/2019/08/17/16/42/granola-4412584_1280.jpg",
      nutrition: { protein: "17g", carbs: "28g", fats: "10g" },
      description:
        "Bữa phụ nhẹ nhàng với sữa chua Hy Lạp ít đường, granola homemade và trái cây tươi",
    },
  ];
  const menuItems = [
    ...originalMenuItems.map((item, index) => ({
      ...item,
      uniqueId: `set1-${item.id}`,
    })),
    ...originalMenuItems.map((item, index) => ({
      ...item,
      uniqueId: `set2-${item.id}`,
    })),
    ...originalMenuItems.map((item, index) => ({
      ...item,
      uniqueId: `set3-${item.id}`,
    })),
  ];

  // Cleanup body styles on mount
  useEffect(() => {
    // Reset any inline styles
    document.body.removeAttribute("style");
    document.documentElement.removeAttribute("style");
  }, []);

  
  // Auto slide for menu carousel with infinite loop - optimized with requestAnimationFrame
  useEffect(() => {
    let animationId;
    let lastTime = 0;
    const interval = 6000; // 6 seconds

    const animate = (currentTime) => {
      if (currentTime - lastTime >= interval) {
        setCurrentMenuIndex((prev) => {
          const nextIndex = prev + 1;
          // If we reach the end of the tripled array, jump back to the middle set seamlessly
          if (nextIndex >= originalMenuItems.length * 2) {
            setIsTransitioning(true);
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
              setCurrentMenuIndex(originalMenuItems.length);
              setIsTransitioning(false);
            });
            return originalMenuItems.length * 2 - 1; // Stay at the end temporarily
          }
          return nextIndex;
        });
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [originalMenuItems.length]);


  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleTouchStart = (e) => {
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
          // Move to previous item
          setCurrentMenuIndex((prev) => {
            const prevIndex = prev - 1;
            if (prevIndex < originalMenuItems.length) {
              setIsTransitioning(true);
              // Use requestAnimationFrame for smoother transitions
              requestAnimationFrame(() => {
                setCurrentMenuIndex(originalMenuItems.length * 2 - 1);
                setIsTransitioning(false);
              });
              return originalMenuItems.length;
            }
            return prevIndex;
          });
        } else {
          // Move to next item
          setCurrentMenuIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= originalMenuItems.length * 2) {
              setIsTransitioning(true);
              // Use requestAnimationFrame for smoother transitions
              requestAnimationFrame(() => {
                setCurrentMenuIndex(originalMenuItems.length);
                setIsTransitioning(false);
              });
              return originalMenuItems.length * 2 - 1;
            }
            return nextIndex;
          });
        }
      }
      setDragOffset(0);
    };

    // Add touch event listeners with passive: false
    carouselElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    carouselElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    carouselElement.addEventListener("touchend", handleTouchEnd);

    return () => {
      carouselElement.removeEventListener("touchstart", handleTouchStart);
      carouselElement.removeEventListener("touchmove", handleTouchMove);
      carouselElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, dragOffset, originalMenuItems.length]);

  useEffect(() => {
    if (isTransitioning) {
      // Use requestAnimationFrame for smoother transitions
      const frameId = requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [isTransitioning]);

  // Drag handlers
  const handleDragStart = (e) => {
    // Ignore if clicking on navigation buttons
    if (e.target.closest(".carousel-nav-btn")) {
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
    const dragThreshold = 80; // Reduced threshold for more responsive drag

    if (Math.abs(dragOffset) > dragThreshold) {
      if (dragOffset > 0) {
        // Move to previous item
        setCurrentMenuIndex((prev) => {
          const prevIndex = prev - 1;
          if (prevIndex < originalMenuItems.length) {
            setIsTransitioning(true);
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
              setCurrentMenuIndex(originalMenuItems.length * 2 - 1);
              setIsTransitioning(false);
            });
            return originalMenuItems.length;
          }
          return prevIndex;
        });
      } else {
        // Move to next item
        setCurrentMenuIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= originalMenuItems.length * 2) {
            setIsTransitioning(true);
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
              setCurrentMenuIndex(originalMenuItems.length);
              setIsTransitioning(false);
            });
            return originalMenuItems.length * 2 - 1;
          }
          return nextIndex;
        });
      }
    }

    setDragOffset(0);
  };

  // Calculate transform for carousel track
  const getTrackTransform = () => {
    const baseTransform = -currentMenuIndex * 100;
    const dragTransform =
      (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;
    return `translateX(${baseTransform + dragTransform}%)`;
  };

  return (
    <>
      {/* Banner Section - Outside container for full width */}
      <section className="banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <div className="banner-badge">
              <Star size={14} />
              <span>{UI_TEXT.NUTRITION_PLATFORM_BADGE}</span>
            </div>
            <h1 className="banner-title">
              {UI_TEXT.SMART_NUTRITION_TITLE}
            </h1>
            <p className="banner-subtitle">
              {UI_TEXT.PERSONALIZED_NUTRITION_SUBTITLE}
            </p>
            <div className="banner-actions">
              <Link to="/home/body-index" className="banner-primary-btn">
                <Target size={16} />
                {UI_TEXT.CHECK_BMI_BUTTON}
              </Link>
              <Link to="/home/blog" className="banner-secondary-btn">
                <BookOpen size={16} />
                {UI_TEXT.EXPLORE_BLOG_BUTTON}
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

      <div className="homepage-container">
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
              <motion.div className="section-badge" variants={scaleIn}>
                <Salad size={14} />
                <span>{UI_TEXT.POPULAR_BADGE}</span>
              </motion.div>
              <motion.h2 className="section-title" variants={fadeInUp}>
                {UI_TEXT.SUGGESTED_MENU_TITLE}
              </motion.h2>
            </motion.div>
            <motion.button
              onClick={() => navigateToPage("/home/calorie-calculation")}
              className="view-more-link"
              variants={slideInRight}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {UI_TEXT.VIEW_ALL_RECIPES} <ChevronRight size={16} />
            </motion.button>
          </motion.div>

          <div
            className={`menu-carousel-container ${
              isDragging ? "dragging" : ""
            } homepage-carousel-cursor`}
            ref={carouselRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="menu-carousel">
              <div
                className="menu-carousel-track homepage-carousel-track-transformed"
                ref={trackRef}
                style={{
                  transform: getTrackTransform(),
                  transition:
                    isDragging || isTransitioning
                      ? "none"
                      : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {menuItems.map((item, index) => (
                  <div
                    key={item.uniqueId}
                    className={`menu-carousel-card ${
                      index === currentMenuIndex ? "active" : ""
                    }`}
                  >
                    <div className="menu-card-image">
                      {item.image && item.image.trim() !== "" && (
                        <img src={item.image} alt={item.title} />
                      )}
                      <div className="meal-label">{item.meal}</div>
                    </div>
                    <div className="menu-card-content">
                      <h3 className="menu-card-title">{item.title}</h3>
                      <span className="menu-card-calories">
                        {item.calories}
                      </span>
                      <div className="menu-card-nutrition">
                        <div className="nutrition-item">
                                                <span className="nutrition-label">{UI_TEXT.PROTEIN_LABEL_HOMEPAGE}</span>
                      <span className="nutrition-value">
                        {item.nutrition.protein}
                      </span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">{UI_TEXT.CARBS_LABEL_HOMEPAGE}</span>
                      <span className="nutrition-value">
                        {item.nutrition.carbs}
                      </span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">{UI_TEXT.FATS_LABEL_HOMEPAGE}</span>
                      <span className="nutrition-value">
                        {item.nutrition.fats}
                      </span>
                    </div>
                      </div>
                      <p className="menu-card-description">
                        {item.description}
                      </p>
                      <button
                        onClick={() =>
                          navigateToPage("/home/calorie-calculation")
                        }
                        className="menu-card-link"
                      >
                        {UI_TEXT.VIEW_DETAILS} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <motion.div className="section-header" variants={staggerContainer}>
            <motion.div className="section-badge" variants={scaleIn}>
              <Star size={14} />
              <span>{UI_TEXT.FEATURES_BADGE}</span>
            </motion.div>
            <motion.h2 className="section-title" variants={fadeInUp}>
              {UI_TEXT.SMART_NUTRITION_TOOLS_TITLE}
            </motion.h2>
          </motion.div>
          <motion.div className="features-grid" variants={staggerContainer}>
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
                <h3>{UI_TEXT.BMI_CALCULATOR_TITLE}</h3>
                <p>
                  {UI_TEXT.BMI_TRACKING_DESCRIPTION}
                </p>
              </div>
              <motion.button
                onClick={() => navigateToPage("/home/body-index")}
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
                <h3>{UI_TEXT.CALORIE_TRACKING_TITLE}</h3>
                <p>
                  {UI_TEXT.CALORIE_TRACKING_DESCRIPTION}
                </p>
              </div>
              <motion.button
                onClick={() => navigateToPage("/home/calorie-index")}
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
                <h3>{UI_TEXT.FOOD_LOG_TITLE}</h3>
                <p>{UI_TEXT.FOOD_LOG_DESCRIPTION}</p>
              </div>
              <motion.button
                onClick={() => navigateToPage("/home/calorie-calculation")}
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
                <h3>{UI_TEXT.BLOG_COMMUNITY_TITLE}</h3>
                <p>
                  {UI_TEXT.BLOG_COMMUNITY_DESCRIPTION}
                </p>
              </div>
              <motion.button
                onClick={() => navigateToPage("/home/blog")}
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
              <motion.div className="section-badge" variants={scaleIn}>
                <BookOpen size={14} />
                <span>{UI_TEXT.BLOG_BADGE}</span>
              </motion.div>
              <motion.h2 className="section-title" variants={fadeInUp}>
                {UI_TEXT.LATEST_POSTS_TITLE}
              </motion.h2>
            </motion.div>
            <motion.div variants={slideInRight}>
              <Link to="/home/blog" className="view-more-link">
                {UI_TEXT.VIEW_ALL_POSTS} <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div className="blog-grid" variants={staggerContainer}>
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="blog-card"
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="blog-card-image">
                  {post.image_url && post.image_url.trim() !== "" ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      onError={(e) => {
                        logWarning(
                          `Failed to load homepage blog image: ${post.image_url}`
                        );
                        e.target.style.display = "none";
                        const placeholder =
                          e.target.parentNode.querySelector(
                            ".blog-placeholder"
                          );
                        if (placeholder) {
                          placeholder.classList.remove(
                            "homepage-blog-placeholder-hidden"
                          );
                          placeholder.classList.add(
                            "homepage-blog-placeholder-visible"
                          );
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`blog-placeholder ${
                      post.image_url && post.image_url.trim() !== ""
                        ? "homepage-blog-placeholder-hidden"
                        : "homepage-blog-placeholder-visible"
                    }`}
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
                      <Clock size={14} /> {UI_TEXT.FIVE_MIN_READ}
                    </span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">
                    {post.description || post.content.substring(0, 100)}...
                  </p>
                  <button
                    onClick={() => navigateToPage(`/home/blog`)}
                    className="blog-read-more"
                  >
                    {UI_TEXT.READ_MORE} <ChevronRight size={14} />
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
            <motion.div className="welcome-card" variants={scaleIn}>
              <motion.div
                className="welcome-user-info"
                variants={staggerContainer}
              >
                <motion.div
                  className="user-avatar"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  {user.avatar && user.avatar.trim() !== "" ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </motion.div>
                <motion.div className="user-details" variants={fadeInUp}>
                  <h2>{UI_TEXT.WELCOME_BACK_TITLE}</h2>
                  <p className="user-name">{user.name}</p>
                </motion.div>
              </motion.div>
              <motion.div className="user-stats" variants={staggerContainer}>
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
                    <span className="stat-value">
                      {currentBmi?.toFixed ? currentBmi.toFixed(1) : "—"}
                    </span>
                    <span className="stat-label">{UI_TEXT.CURRENT_BMI_LABEL}</span>
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
                    <span className="stat-label">{UI_TEXT.TARGET_CALORIES_LABEL}</span>
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
                    <span className="stat-label">{UI_TEXT.TRACKING_DAYS_LABEL}</span>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="welcome-actions"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Link to="/home/dashboard" className="btn-primary">
                    <BarChart3 size={16} /> {UI_TEXT.MY_DASHBOARD_BUTTON}
                  </Link>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <button
                    onClick={() => navigateToPage("/home/calorie-calculation")}
                    className="btn-outline"
                  >
                    <Coffee size={16} /> {UI_TEXT.LOG_MEAL_BUTTON}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </div>
    </>
  );
};

export default HomePage;
