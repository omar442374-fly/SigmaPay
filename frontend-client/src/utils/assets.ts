/**
 * Get the path to an asset in the public folder
 * @param {string} path - The path to the asset relative to the public folder
 * @returns {string} The full path to the asset
 */
export function getAssetPath(path: string): string {
  return `${process.env.PUBLIC_URL}/${path}`;
}
