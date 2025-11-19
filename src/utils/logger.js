/**
 * Centralized logging utility
 * 
 * Provides environment-aware logging that only shows messages
 * in development mode, keeping production console clean.
 * 
 * @module logger
 */

// Determine if we are in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger class with environment-aware methods
 */
class Logger {
  /**
   * Log info message (development only)
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  static info(message, ...args) {
    if (isDevelopment) {
      console.log(`INFO ${message}`, ...args);
    }
  }

  /**
   * Log warning message (always shown)
   * @param {string} message - Warning message
   * @param {...any} args - Additional arguments
   */
  static warn(message, ...args) {
    console.warn(`WARN ${message}`, ...args);
  }

  /**
   * Log error message (always shown)
   * @param {string} message - Error message
   * @param {...any} args - Additional arguments
   */
  static error(message, ...args) {
    console.error(` ERROR ${message}`, ...args);
  }

  /**
   * Log debug message (development only, with styling)
   * @param {string} message - Debug message
   * @param {...any} args - Additional arguments
   */
  static debug(message, ...args) {
    if (isDevelopment) {
      console.log(` DEBUG ${message}`, ...args);
    }
  }

  /**
   * Log success message (development only)
   * @param {string} message - Success message
   * @param {...any} args - Additional arguments
   */
  static success(message, ...args) {
    if (isDevelopment) {
      console.log(` SUCCESS ${message}`, ...args);
    }
  }
}

export default Logger;