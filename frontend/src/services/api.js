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
export const getExerciseById = async (id) => { /* ... */ return apiRequest(`/exercises/${id}`, 'GET'); };
export const createExercise = async (exerciseData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/exercises', 'POST', exerciseData, token); };
export const updateExercise = async (id, exerciseData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/exercises/${id}`, 'PUT', exerciseData, token); };
export const deleteExercise = async (id) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/exercises/${id}`, 'DELETE', null, token); };

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
export const addOrUpdateWeight = async (logDate, weight, unit) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const body = { logDate, weight, unit }; return apiRequest('/weight', 'POST', body, token); };
export const getWeightHistory = async () => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/weight/history', 'GET', null, token); };
export const deleteWeightLog = async (logId) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/weight/${logId}`, 'DELETE', null, token); };

// --- Meal Logs ---
export const addMealLogEntry = async (mealLogData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/meals', 'POST', mealLogData, token); };
export const getMealHistory = async (startDate, endDate) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const queryParams = new URLSearchParams(); if (startDate) queryParams.set('startDate', startDate); if (endDate) queryParams.set('endDate', endDate); const queryString = queryParams.toString(); return apiRequest(`/meals/history${queryString ? `?${queryString}` : ''}`, 'GET', null, token); };
export const deleteMealLogEntry = async (logId) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/meals/${logId}`, 'DELETE', null, token); };

// --- Workout Plans ---
export const getAllWorkoutPlans = async () => { /* ... */ return apiRequest('/plans', 'GET'); };
export const getWorkoutPlanById = async (planId) => { /* ... */ return apiRequest(`/plans/${planId}`, 'GET'); };
export const createWorkoutPlan = async (planData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/plans', 'POST', planData, token); };
export const updateWorkoutPlan = async (planId, planData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/plans/${planId}`, 'PUT', planData, token); };
export const deleteWorkoutPlan = async (planId) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/plans/${planId}`, 'DELETE', null, token); };

// --- User Management (Admin) ---
export const adminGetAllUsers = async () => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/users', 'GET', null, token); };
export const adminUpdateUser = async (userId, updateData) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/users/${userId}`, 'PUT', updateData, token); };
export const adminDeleteUser = async (userId) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/users/${userId}`, 'DELETE', null, token); };

// --- Dashboard ---
export const getRecentActivity = async (limit = 5) => { /* ... */ const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/dashboard/recent-activity?limit=${limit}`, 'GET', null, token); };

/**
 * Fetches the nutritional, step, and water summary for today. Requires authentication.
 * @returns {Promise<object>} Summary object { calories, protein, carbs, fat, steps, waterMl, goals: {...} }.
 */
export const getTodaySummary = async () => {
    console.log("Calling getTodaySummary service function");
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    // Endpoint: GET /api/dashboard/today-summary
    return apiRequest('/dashboard/today-summary', 'GET', null, token);
};

// --- Step Logs ---
/**
 * Adjusts today's step count for the authenticated user.
 * @param {number} amount - The number of steps to add (can be negative).
 * @returns {Promise<object>} The API response (likely includes the updated log).
 */
export const adjustTodaySteps = async (amount) => {
    console.log(`Calling adjustTodaySteps service function with amount: ${amount}`);
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    // Endpoint: POST /api/steps/adjust
    return apiRequest('/steps/adjust', 'POST', { amount }, token);
};

// --- Water Logs ---
/**
 * Adjusts today's water intake for the authenticated user.
 * @param {number} amountMl - The amount of water in ml to add (can be negative).
 * @returns {Promise<object>} The API response (likely includes the updated log).
 */
export const adjustTodayWater = async (amountMl) => {
    console.log(`Calling adjustTodayWater service function with amountMl: ${amountMl}`);
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.reject(new Error("Authentication token not found. Please log in."));
    }
    // Endpoint: POST /api/water/adjust
    return apiRequest('/water/adjust', 'POST', { amountMl }, token);
};

