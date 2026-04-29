/**
 * Image URL utility - constructs full URLs for images from backend
 */

const API_BASE = "http://localhost:8080";

export function getImageUrl(relativePath) {
  if (!relativePath) return null;
  
  // If already a full URL, return as-is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  
  // If starts with /uploads, construct full URL
  if (relativePath.startsWith("/uploads")) {
    return `${API_BASE}${relativePath}`;
  }
  
  // Otherwise assume it needs /uploads prefix
  return `${API_BASE}/uploads/${relativePath}`;
}

export default { getImageUrl };
