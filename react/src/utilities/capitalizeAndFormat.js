/**
 * Formats a string by capitalizing the first letter of each word
 * and replacing underscores with spaces.
 *
 * @function
 * @param {string} text - The input string to format.
 * @returns {string} The formatted string with proper capitalization and spaces.
 *
 * @example
 * // Returns "Pending"
 * capitalizeAndFormat("PENDING");
 *
 * @example
 * // Returns "In Person"
 * capitalizeAndFormat("IN_PERSON");
 */
function capitalizeAndFormat(text) {
    if (!text) return "";
    return text
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }
  
  export default capitalizeAndFormat;
  