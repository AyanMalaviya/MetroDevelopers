// src/utils/mapUtils.js

/**
 * Detects if user is on mobile device
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detects if user is on iOS
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Generates appropriate map link based on device
 * @param {Object} location - {lat, lng, address}
 * @returns {string} Map URL
 */
export const getMapLink = (location) => {
  const { lat, lng, address } = location;
  
  // Use address as primary search term, coordinates as fallback
  const searchQuery = encodeURIComponent(address || `${lat},${lng}`);

  // Mobile device detection
  if (isMobile()) {
    if (isIOS()) {
      // iOS: Apple Maps with address query
      return `maps://maps.apple.com/?q=${searchQuery}&sll=${lat},${lng}`;
    } else {
      // Android: Use address in query parameter
      return `geo:0,0?q=${searchQuery}`;
    }
  }

  // Desktop: Google Maps with place name search
  // Using the 'query' parameter shows the place name instead of coordinates
  return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
};
