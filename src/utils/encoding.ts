/**
 * Utility functions for encoding and decoding data for URL-safe usage
 */

/**
 * Encodes a string to URL-safe base64 format
 * This replaces characters that are problematic in URLs:
 * '+' → '-', '/' → '_', and removes trailing '='
 * @param data - String to encode
 * @returns URL-safe base64 encoded string
 */
export function encodeBase64Url(data: string): string {
  // Standard Base64 encoding
  const base64 = Buffer.from(data).toString('base64');
  
  // Make it URL safe: replace + with -, / with _, and remove =
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decodes a URL-safe base64 string back to its original form
 * @param encoded - URL-safe base64 encoded string
 * @returns Original decoded string
 */
export function decodeBase64Url(encoded: string): string {
  // Convert URL-safe base64 back to standard base64
  let base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Decode
  return Buffer.from(base64, 'base64').toString();
}
