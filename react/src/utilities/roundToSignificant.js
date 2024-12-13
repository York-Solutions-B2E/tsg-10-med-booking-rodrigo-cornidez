/**
 * Rounds a number to the nearest significant figure
 * 
 * The function progressively rounds numbers down to the nearest:
 * - 1000 for values >= 1000
 * - 100 for values >= 100
 * - 50 for values >= 50
 * - 10 for values >= 10
 * - If the value is less than 10, it is returned as is.
 *
 * @function
 * @param {number} value - The numeric value to be rounded.
 * @returns {number} The rounded value.
 */
function roundToSignificant(value) {
    if (value >= 1000) return Math.floor(value / 1000) * 1000; // Round down to nearest 1000
    if (value >= 100) return Math.floor(value / 100) * 100;   // Round down to nearest 100
    if (value >= 50) return Math.floor(value / 50) * 50;      // Round down to nearest 50
    if (value >= 10) return Math.floor(value / 10) * 10;      // Round down to nearest 10
    return value;                                             // Return value as-is for <10
  }
  
  export default roundToSignificant;
  