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
 * @returns {Promise<any>} The JSON response data from the API.
 * @throws {Error} Throws an error if the request fails or returns non-OK status.
 */
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
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

// --- Authentication ---
export const loginUser = async (email, password) => { /* ... */ return apiRequest('/auth/login', 'POST', { email, password }); };
export const registerUser = async (username, email, password, role = 'User') => { /* ... */ return apiRequest('/auth/register', 'POST', { username, email, password, role }); };

// --- Exercises ---
export const getAllExercises = async () => { /* ... */ return apiRequest('/exercises', 'GET'); };

// --- Recipes ---
export const getAllRecipes = async () => { /* ... */ return apiRequest('/recipes', 'GET'); };
export const getRecipeById = async (id) => { /* ... */ return apiRequest(`/recipes/${id}`, 'GET'); };
export const createRecipe = async (recipeData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/recipes', 'POST', recipeData, token); };
export const updateRecipe = async (id, recipeData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/recipes/${id}`, 'PUT', recipeData, token); };
export const deleteRecipe = async (id) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/recipes/${id}`, 'DELETE', null, token); };

// --- Foods ---
export const searchFoods = async (query) => { /* ... */ if (!query || typeof query !== 'string' || query.trim().length === 0) { return Promise.resolve([]); } const encodedQuery = encodeURIComponent(query.trim()); return apiRequest(`/foods/search?q=${encodedQuery}`, 'GET'); };

// --- Workout Logs ---
export const logWorkout = async (workoutData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/workouts', 'POST', workoutData, token); };
export const getWorkoutHistory = async (startDate, endDate) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const queryParams = new URLSearchParams(); if (startDate) queryParams.set('startDate', startDate); if (endDate) queryParams.set('endDate', endDate); const queryString = queryParams.toString(); return apiRequest(`/workouts/history${queryString ? `?${queryString}` : ''}`, 'GET', null, token); };

// --- Weight Logs ---

/**
 * Adds or updates a weight log entry for the authenticated user.
 * @param {string} logDate - The date of the log (YYYY-MM-DD).
 * @param {number} weight - The weight value.
 * @param {string} unit - The unit of the weight ('kg' or 'lbs').
 * @returns {Promise<object>} A promise resolving to the backend response (likely includes the saved log).
 */
export const addOrUpdateWeight = async (logDate, weight, unit) => {
    console.log(`Calling addOrUpdateWeight service function for date: ${logDate}`);
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    const body = { logDate, weight, unit };
    // The endpoint is POST /api/weight
    return apiRequest('/weight', 'POST', body, token);
};

/**
 * Fetches the weight log history for the authenticated user.
 * @returns {Promise<Array>} A promise resolving to an array of weight log objects (weight is in kg).
 */
export const getWeightHistory = async () => {
    console.log("Calling getWeightHistory service function");
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    // The endpoint is GET /api/weight/history
    return apiRequest('/weight/history', 'GET', null, token);
};

/**
 * Deletes a specific weight log entry by its ID for the authenticated user.
 * @param {string|number} logId - The ID of the weight log entry to delete.
 * @returns {Promise<any>} A promise resolving (often null for 204 No Content or success message).
 */
export const deleteWeightLog = async (logId) => {
    console.log(`Calling deleteWeightLog service function for ID: ${logId}`);
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    // The endpoint is DELETE /api/weight/:logId
    return apiRequest(`/weight/${logId}`, 'DELETE', null, token);
};


// --- Add other API service functions below (e.g., for plans) ---

