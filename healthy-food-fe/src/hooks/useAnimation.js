import { useCallback } from 'react';

// Hook để tạo animation variants
export const useAnimationVariants = () => {
  const fadeInUp = useCallback((delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  }), []);

  const fadeInDown = useCallback((delay = 0) => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  }), []);

  const slideInLeft = useCallback((delay = 0) => ({
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay }
  }), []);

  const slideInRight = useCallback((delay = 0) => ({
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay }
  }), []);

  const scaleIn = useCallback((delay = 0) => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, delay }
  }), []);

  const staggerContainer = useCallback((staggerDelay = 0.1) => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: staggerDelay }
    }
  }), [staggerDelay]);

  const staggerItem = useCallback(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }), []);

  return {
    fadeInUp,
    fadeInDown,
    slideInLeft,
    slideInRight,
    scaleIn,
    staggerContainer,
    staggerItem
  };
};

// Hook để tạo hover animations
export const useHoverAnimation = () => {
  const buttonHover = useCallback(() => ({
    whileHover: { 
      scale: 1.05, 
      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" 
    },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }), []);

  const cardHover = useCallback(() => ({
    whileHover: { 
      y: -5, 
      boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  }), []);

  const linkHover = useCallback(() => ({
    whileHover: { 
      scale: 1.02,
      color: "#2C7BE5"
    },
    transition: { duration: 0.2 }
  }), []);

  return {
    buttonHover,
    cardHover,
    linkHover
  };
};

// Hook để tạo loading animations
export const useLoadingAnimation = () => {
  const spinnerAnimation = useCallback(() => ({
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }), []);

  const pulseAnimation = useCallback(() => ({
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    },
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }), []);

  const shimmerAnimation = useCallback(() => ({
    animate: { 
      backgroundPosition: ["-200% 0", "200% 0"]
    },
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: "linear"
    }
  }), []);

  return {
    spinnerAnimation,
    pulseAnimation,
    shimmerAnimation
  };
};

// Hook để tạo page transitions
export const usePageTransition = () => {
  const pageEnter = useCallback(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }), []);

  const pageSlide = useCallback(() => ({
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }), []);

  const pageScale = useCallback(() => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }), []);

  return {
    pageEnter,
    pageSlide,
    pageScale
  };
}; 