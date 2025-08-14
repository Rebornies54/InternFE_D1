

/**
 * Check if an image URL is valid and accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} - True if image is accessible, false otherwise
 */
export const checkImageAccessibility = async (url) => {
  if (!url || url.trim() === '') {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    console.warn(`Image accessibility check failed for ${url}:`, error);
    return false;
  }
};

/**
 * Get the full image URL with proper base URL
 * @param {string} imageUrl - The image URL (can be relative or absolute)
 * @param {string} baseUrl - The base URL (default: http://localhost:5000)
 * @returns {string} - The complete image URL
 */
export const getFullImageUrl = (imageUrl, baseUrl = 'http://localhost:5000') => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL starting with /, prepend base URL
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }

  // Otherwise, assume it's a filename and prepend uploads path
  return `${baseUrl}/uploads/${imageUrl}`;
};

/**
 * Handle image loading error with fallback
 * @param {Event} event - The error event
 * @param {string} imageUrl - The failed image URL
 * @param {string} fallbackSelector - CSS selector for fallback element
 */
export const handleImageError = (event, imageUrl, fallbackSelector = null) => {
  console.warn(`Failed to load image: ${imageUrl}`);
  
  // Hide the failed image
  event.target.style.display = 'none';
  
  // Show fallback if selector provided
  if (fallbackSelector) {
    const fallback = event.target.parentNode.querySelector(fallbackSelector);
    if (fallback) {
      fallback.style.display = 'block';
    }
  }
};

/**
 * Preload an image to check if it's accessible
 * @param {string} url - The image URL to preload
 * @returns {Promise<boolean>} - True if image loads successfully
 */
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Debug image loading issues
 * @param {string} imageUrl - The image URL to debug
 */
export const debugImageLoading = async (imageUrl) => {
  console.group(`🔍 Debugging image: ${imageUrl}`);
  
  // Check if URL is valid
  const isValidUrl = imageUrl && imageUrl.trim() !== '';
  console.log('✅ URL valid:', isValidUrl);
  
  if (!isValidUrl) {
    console.groupEnd();
    return;
  }
  
  // Get full URL
  const fullUrl = getFullImageUrl(imageUrl);
  console.log('🔗 Full URL:', fullUrl);
  
  // Check accessibility
  const isAccessible = await checkImageAccessibility(fullUrl);
  console.log('🌐 Accessible:', isAccessible);
  
  // Try to preload
  const preloadSuccess = await preloadImage(fullUrl);
  console.log('📦 Preload success:', preloadSuccess);
  
  console.groupEnd();
  
  return {
    isValidUrl,
    fullUrl,
    isAccessible,
    preloadSuccess
  };
};
