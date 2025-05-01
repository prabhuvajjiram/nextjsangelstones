/**
 * Utility functions for file operations
 */

/**
 * Sanitizes a file path to prevent directory traversal attacks
 * @param path The path to sanitize
 * @returns The sanitized path or null if the path is invalid
 */
export const sanitizePath = (path: string | null): string | null => {
  if (!path) return null;
  
  // Remove any directory traversal sequences
  const sanitized = path
    .replace(/\.\.\//g, '') // Remove "../"
    .replace(/\.\.\\/g, '') // Remove "..\"
    .replace(/\/\.\.\//g, '/') // Remove "/../"
    .replace(/\\\.\.\\/g, '\\') // Remove "\..\"
    .replace(/^\/+/, '') // Remove leading slashes
    .replace(/^\\+/, ''); // Remove leading backslashes
  
  // Ensure the path doesn't start with a drive letter (Windows)
  if (/^[a-zA-Z]:/.test(sanitized)) {
    return null;
  }
  
  return sanitized;
};
