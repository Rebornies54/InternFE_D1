import { UI_TEXT } from '../constants/index';

/**
 * Error Handler Utility
 * Centralized error handling to replace console.log statements
 */

interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
}

interface ErrorEntry {
  timestamp: string;
  context: string;
  error: string;
  stack?: string | undefined;
  additionalData?: Record<string, unknown> | undefined;
}

interface WarningEntry {
  timestamp: string;
  context: string;
  type: 'warning';
  message: string;
  additionalData?: Record<string, unknown>;
}

class ErrorHandler {
  private errorLog: (ErrorEntry | WarningEntry)[] = [];
  private maxLogSize: number = 100;

  /**
   * Log error without console.log
   * @param context - Where the error occurred
   * @param error - The error object or message
   * @param additionalData - Additional data to log
   */
  logError(context: string, error: Error | string, additionalData: Record<string, unknown> = {}): void {
    const errorEntry: ErrorEntry = {
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

    this.sendToErrorService(errorEntry);
  }

  /**
   * Log warning without console.warn
   * @param context - Where the warning occurred
   * @param message - Warning message
   * @param additionalData - Additional data
   */
  logWarning(context: string, message: string, additionalData: Record<string, unknown> = {}): void {
    const warningEntry: WarningEntry = {
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
   * @returns Array of error entries
   */
  getErrorLog(): (ErrorEntry | WarningEntry)[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Send error to external service (placeholder)
   * @param errorEntry - Error entry to send
   */
  private sendToErrorService(errorEntry: ErrorEntry): void {

    const windowWithGtag = window as WindowWithGtag;
    if (typeof window !== 'undefined' && windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'exception', {
        description: `${errorEntry.context}: ${errorEntry.error}`,
        fatal: false,
      });
    }
  }

  /**
   * Handle image loading errors
   * @param event - Image error event
   * @param imageUrl - Failed image URL
   * @param context - Context where image failed
   */
  handleImageError(event: Event, imageUrl: string, context: string = 'unknown'): void {
    this.logWarning('Image Load Error', UI_TEXT.IMAGE_LOAD_FAILED, {
      imageUrl,
      context,
      element: event.target,
    });
  }

  /**
   * Handle API errors
   * @param error - API error
   * @param endpoint - API endpoint
   * @param requestData - Request data
   */
  handleApiError(error: Error | string, endpoint: string, requestData: Record<string, unknown> = {}): void {
    const apiError = error as { response?: { status?: number; statusText?: string } };
    this.logError('API Error', error, {
      endpoint,
      requestData,
      status: apiError.response?.status,
      statusText: apiError.response?.statusText,
    });
  }

  /**
   * Handle scroll errors
   * @param error - Scroll error
   * @param context - Scroll context
   */
  handleScrollError(error: Error, context: string = 'scroll'): void {
    this.logWarning('Scroll Error', UI_TEXT.SCROLL_ERROR, {
      context,
      error: error.message,
    });
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;

export const logError = (context: string, error: Error | string, additionalData?: Record<string, unknown>) => 
  errorHandler.logError(context, error, additionalData || {});

export const logWarning = (context: string, message: string, additionalData?: Record<string, unknown>) => 
  errorHandler.logWarning(context, message, additionalData || {});

export const handleImageError = (event: Event, imageUrl: string, context?: string) => 
  errorHandler.handleImageError(event, imageUrl, context);

export const handleApiError = (error: Error | string, endpoint: string, requestData?: Record<string, unknown>) => 
  errorHandler.handleApiError(error, endpoint, requestData || {});

export const handleScrollError = (error: Error, context?: string) => 
  errorHandler.handleScrollError(error, context);
