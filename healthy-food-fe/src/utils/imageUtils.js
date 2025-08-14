

/**
 * Check if an image URL is valid and accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} 
 */
export const checkImageAccessibility = async (url) => {
  if (!url || url.trim() === '') {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    return false;
  }
};

import { API_CONFIG } from '../constants';

/**
 * Get the full image URL with proper base URL
 * @param {string} imageUrl - The image URL (can be relative or absolute)
 * @param {string} baseUrl - The base URL (default: from API_CONFIG)
 * @returns {string} - The complete image URL
 */
export const getFullImageUrl = (imageUrl, baseUrl = API_CONFIG.BASE_URL) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }
  return `${baseUrl}/uploads/${imageUrl}`;
};

/**
 * Handle image loading error with fallback
 * @param {Event} event - The error event
 * @param {string} imageUrl - The failed image URL
 * @param {string} fallbackSelector - CSS selector for fallback element
 */
export const handleImageError = (event, imageUrl, fallbackSelector = null) => {
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
 * Validate image URL format
 * @param {string} imageUrl - The image URL to validate
 * @returns {boolean} - True if URL format is valid
 */
export const validateImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return false;
  }

  try {
    const url = new URL(imageUrl, window.location.origin);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get image dimensions asynchronously
 * @param {string} url - The image URL
 * @returns {Promise<{width: number, height: number} | null>} - Image dimensions or null if failed
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};
