/**
 * Calculates the great-circle distance between two points on the Earth's surface.
 * Uses the Haversine formula to compute the distance in miles.
 *
 * @function
 * @param {number} lat1 - Latitude of the first point in decimal degrees.
 * @param {number} lon1 - Longitude of the first point in decimal degrees.
 * @param {number} lat2 - Latitude of the second point in decimal degrees.
 * @param {number} lon2 - Longitude of the second point in decimal degrees.
 * @returns {number} The distance between the two points in miles.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRadians = (degree) => (degree * Math.PI) / 180;
  
    // Earth's radius in miles
    const earthRadiusMiles = 3958.8;
  
    // Compute the differences in latitude and longitude in radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    // Haversine formula to calculate the great-circle distance
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    // Central angle in radians
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Compute the distance in miles
    return earthRadiusMiles * c;
  }
  
  export default calculateDistance;
  