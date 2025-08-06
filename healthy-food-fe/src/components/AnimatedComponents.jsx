import { motion, AnimatePresence } from 'framer-motion';

// Page transition component
export const PageTransition = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Slide in from left
export const SlideInLeft = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// Slide in from right
export const SlideInRight = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// Scale in animation
export const ScaleIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

// Interactive button
export const AnimatedButton = ({ children, onClick, className = "", disabled = false }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    onClick={onClick}
    disabled={disabled}
    className={className}
  >
    {children}
  </motion.button>
);

// Card with hover effect
export const AnimatedCard = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ 
      y: -5, 
      boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Loading spinner
export const LoadingSpinner = ({ size = 40, color = "#2C7BE5" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    style={{
      width: size,
      height: size,
      border: `3px solid #f3f3f3`,
      borderTop: `3px solid ${color}`,
      borderRadius: "50%"
    }}
  />
);

// Staggered list animation
export const StaggeredList = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ staggerChildren: staggerDelay }}
  >
    {children}
  </motion.div>
);

// Staggered list item
export const StaggeredItem = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Modal overlay
export const AnimatedModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Progress bar
export const AnimatedProgressBar = ({ progress, color = "#2C7BE5" }) => (
  <motion.div
    style={{
      width: "100%",
      height: "8px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      overflow: "hidden"
    }}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        height: "100%",
        backgroundColor: color,
        borderRadius: "4px"
      }}
    />
  </motion.div>
);

// Pulse animation for notifications
export const PulseNotification = ({ children }) => (
  <motion.div
    animate={{ 
      scale: [1, 1.05, 1],
      boxShadow: [
        "0px 0px 0px rgba(44, 123, 229, 0)",
        "0px 0px 20px rgba(44, 123, 229, 0.3)",
        "0px 0px 0px rgba(44, 123, 229, 0)"
      ]
    }}
    transition={{ 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Bounce animation for success states
export const BounceSuccess = ({ children }) => (
  <motion.div
    animate={{ 
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration: 0.6,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
); 