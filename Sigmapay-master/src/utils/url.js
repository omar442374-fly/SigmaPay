/**
 * Utility functions for handling URLs in the application
 */

/**
 * Get the base URL for the application
 * This handles the base path from vite.config.js
 * @returns {string} The base URL
 */
export const getBaseUrl = () => {
  return '/Sigmapay/';
};

/**
 * Construct a full URL with the base path and hash router
 * @param {string} path - The path to navigate to (without leading slash)
 * @returns {string} The full URL
 */
export const getFullUrl = (path) => {
  const basePath = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // For debugging
  console.log('Navigating to:', `${window.location.origin}${basePath}#/${cleanPath}`);

  return `${window.location.origin}${basePath}#/${cleanPath}`;
};

/**
 * Navigate to a URL using the correct base path and hash router
 * This function should be used for external navigation or when you need to force a full page reload
 * For internal navigation, prefer using the React Router's navigate function
 * @param {string} path - The path to navigate to (without leading slash)
 */
export const navigateTo = (path) => {
  const url = getFullUrl(path);
  console.log('Setting window.location.href to:', url);

  // Use a small timeout to ensure any pending state updates are completed
  setTimeout(() => {
    window.location.href = url;
  }, 10);
};
