// src/services/api.js

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port if needed

/**
 * Makes a request to the backend API.
 * Handles basic error checking and JSON parsing.
 * @param {string} endpoint - The API endpoint path (e.g., '/auth/login').
 * @param {string} method - HTTP method (e.g., 'GET', 'POST').
 * @param {object} [body=null] - The request body for POST/PUT requests.
 * @param {string} [token=null] - Optional JWT token for authenticated requests.
 * @returns {Promise<object>} The JSON response data from the API.
 * @throws {Error} Throws an error if the request fails or returns non-OK status.
 */
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }), // Standard Bearer token
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    console.log(`[API Request] ${method} ${url}`, body ? `Body: ${JSON.stringify(body)}` : '');

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch (e) { /* ignore */ }
            const errorMessage = errorData?.message || response.statusText || `HTTP error! Status: ${response.status}`;
            console.error(`[API Error] ${method} ${url} failed (${response.status}):`, errorMessage);
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        if (response.status === 204) {
            console.log(`[API Response] ${method} ${url} - Status 204 No Content`);
            return null;
        }

        const data = await response.json();
        console.log(`[API Response] ${method} ${url} - Status ${response.status}`, data);
        return data;

    } catch (error) {
        console.error(`[API Fetch Error] ${method} ${url}:`, error);
        throw error; // Re-throw for components to handle
    }
};

// --- Specific API Functions ---

export const loginUser = async (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password });
};

export const registerUser = async (username, email, password, role = 'User') => {
    // Note: Backend might ignore role if not allowed from frontend registration
    return apiRequest('/auth/register', 'POST', { username, email, password, role });
};

// Add other API functions here later...
// export const fetchExercises = async (token) => { ... };

