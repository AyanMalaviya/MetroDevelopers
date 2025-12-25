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
 * - Google Maps: normal address / name search
 * - Apple Maps: coordinates-first, name only as label
 * @param {Object} location - {lat, lng, address}
 * @returns {string} Map URL
 */
export const getMapLink = (location) => {
  const { lat, lng, address } = location;

  if (isMobile()) {
    if (isIOS()) {
      // Apple Maps → use lat/lng as the main location, name only as label
      // This opens the pin at exact coordinates, with the text label
      return `maps://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
        address || `${lat},${lng}`
      )}`;
    } else {
      // Android → normal Google-style search via geo, using name/address
      // This behaves like "show me this place" rather than raw coords
      const query = encodeURIComponent(address || `${lat},${lng}`);
      return `geo:0,0?q=${query}`;
    }
  }

  // Desktop → Google Maps place search (name/address first, not raw coords)
  const searchQuery = encodeURIComponent(address || `${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
};
