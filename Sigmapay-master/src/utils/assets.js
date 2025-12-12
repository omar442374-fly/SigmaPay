/**
 * Utility functions for handling asset paths in the application
 */

import { getBaseUrl } from './url';

/**
 * Get the correct path for an asset, taking into account the base URL
 * @param {string} path - The asset path (without leading slash)
 * @returns {string} The full asset path
 */
export const getAssetPath = (path) => {
  const basePath = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${basePath}${cleanPath}`;
};
