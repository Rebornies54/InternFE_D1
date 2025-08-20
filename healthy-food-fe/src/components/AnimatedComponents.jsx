import './AnimatedComponents.css';
import { AnimatePresence } from 'framer-motion';
import { ANIMATION } from '../constants';

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

export const FadeIn = ({ children, delay = ANIMATION.DEFAULT_DELAY, duration = ANIMATION.DEFAULT_DURATION }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, delay = ANIMATION.DEFAULT_DELAY }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ children, delay = ANIMATION.DEFAULT_DELAY }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = ANIMATION.DEFAULT_DELAY }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

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

export const LoadingSpinner = ({ size = ANIMATION.LOADING_SPINNER_SIZE, color = ANIMATION.PRIMARY_COLOR }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="loading-spinner"
  />
);

export const StaggeredList = ({ children, staggerDelay = ANIMATION.STAGGER_DELAY }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ staggerChildren: staggerDelay }}
  >
    {children}
  </motion.div>
);

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

export const AnimatedModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="animated-modal-overlay"
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

export const AnimatedProgressBar = ({ progress, color = ANIMATION.PROGRESS_BAR_COLOR }) => (
  <motion.div
    className="progress-bar-container"
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="progress-bar-fill"
    />
  </motion.div>
);

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