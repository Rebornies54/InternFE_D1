import { UI_TEXT } from '../constants/index';

/**
 * Error Handler Utility
 * Centralized error handling to replace console.log statements
 */

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Log error without console.log
   * @param {string} context - Where the error occurred
   * @param {Error|string} error - The error object or message
   * @param {Object} additionalData - Additional data to log
   */
  logError(context, error, additionalData = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      additionalData,
    };

    this.errorLog.push(errorEntry);

    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      
      this.sendToErrorService(errorEntry);
    }
  }

  /**
   * Log warning without console.warn
   * @param {string} context - Where the warning occurred
   * @param {string} message - Warning message
   * @param {Object} additionalData - Additional data
   */
  logWarning(context, message, additionalData = {}) {
    const warningEntry = {
      timestamp: new Date().toISOString(),
      context,
      type: 'warning',
      message,
      additionalData,
    };

    this.errorLog.push(warningEntry);

    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  /**
   * Get error log for debugging
   * @returns {Array} Array of error entries
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Send error to external service (placeholder)
   * @param {Object} errorEntry - Error entry to send
   */
  sendToErrorService(errorEntry) {

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${errorEntry.context}: ${errorEntry.error}`,
        fatal: false,
      });
    }
  }

  /**
   * Handle image loading errors
   * @param {Event} event - Image error event
   * @param {string} imageUrl - Failed image URL
   * @param {string} context - Context where image failed
   */
  handleImageError(event, imageUrl, context = 'unknown') {
    this.logWarning('Image Load Error', UI_TEXT.IMAGE_LOAD_FAILED, {
      imageUrl,
      context,
      element: event.target,
    });
  }

  /**
   * Handle API errors
   * @param {Error} error - API error
   * @param {string} endpoint - API endpoint
   * @param {Object} requestData - Request data
   */
  handleApiError(error, endpoint, requestData = {}) {
    this.logError('API Error', error, {
      endpoint,
      requestData,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
  }

  /**
   * Handle scroll errors
   * @param {Error} error - Scroll error
   * @param {string} context - Scroll context
   */
  handleScrollError(error, context = 'scroll') {
    this.logWarning('Scroll Error', UI_TEXT.SCROLL_ERROR, {
      context,
      error: error.message,
    });
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;

export const logError = (context, error, additionalData) => 
  errorHandler.logError(context, error, additionalData);

export const logWarning = (context, message, additionalData) => 
  errorHandler.logWarning(context, message, additionalData);

export const handleImageError = (event, imageUrl, context) => 
  errorHandler.handleImageError(event, imageUrl, context);

export const handleApiError = (error, endpoint, requestData) => 
  errorHandler.handleApiError(error, endpoint, requestData);

export const handleScrollError = (error, context) => 
  errorHandler.handleScrollError(error, context);
