// Helper function to navigate and scroll to top
export const navigateToPage = (navigate, path) => {
  navigate(path);
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Also scroll container if exists
    const container = document.querySelector('.home-container');
    if (container && container.scrollTo) {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, 100);
};

// Log warning function
export const logWarning = (message) => {
  console.warn(message);
};
