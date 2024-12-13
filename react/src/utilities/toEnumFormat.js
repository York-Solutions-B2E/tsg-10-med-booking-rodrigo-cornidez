/**
 * Converts a string to an enum-compatible format:
 * - Converts all letters to uppercase.
 * - Replaces spaces with underscores.
 *
 * @function
 * @param {string} text - The input string to format.
 * @returns {string} The formatted string in ALL CAPS with underscores.
 *
 * @example
 * // Returns "PENDING"
 * toEnumFormat("Pending");
 *
 * @example
 * // Returns "IN_PERSON"
 * toEnumFormat("In Person");
 */
function toEnumFormat(text) {
  if (!text) return "";
  return text
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .toUpperCase(); // Convert to uppercase
}

export default toEnumFormat;
