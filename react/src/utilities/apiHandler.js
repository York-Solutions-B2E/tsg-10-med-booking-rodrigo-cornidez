const API_BASE_URL = "/api";


// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
};

/**
 * Standard API request handler with optional user validation
 * @param {string} url - The API endpoint (relative path)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} [data=null] - Request body for POST/PUT requests
 * @param {Object} [headers={}] - Additional headers
 * @returns {Promise<any>} - The JSON response or an error
 */
const apiHandler = async (url, method = "GET", data = null, headers = {}) => {


  const csrfToken = ["POST", "PUT", "DELETE"].includes(method) ? getCsrfToken() : null;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken && { "X-XSRF-Token": csrfToken }),
      ...headers,
    },
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    // Handle 204 No Content (DELETE)
    if (response.status === 204) {
      return null; // Return null for no content
    }

    // For other statuses, parse JSON
    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${method} ${url}):`, error.message);
    throw error;
  }
};
/**
 * Create API instance
 * @param {Function} [getUser] - Optional callback for user validation
 * @returns {Object} API instance with get, post, put, delete methods
 */
export const createApi = (getUser = null) => ({
  get: (url, headers) => apiHandler(url, "GET", null, headers, getUser),
  post: (url, data, headers) => apiHandler(url, "POST", data, headers, getUser),
  put: (url, data, headers) => apiHandler(url, "PUT", data, headers, getUser),
  delete: (url, headers) => apiHandler(url, "DELETE", null, headers, getUser),
});
