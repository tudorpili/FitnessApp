// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    console.log(`[API.JS] apiRequest called. Endpoint: ${endpoint}, Method: ${method}`);
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    };
    console.log(`[API Request] Attempting: ${method} ${url}`, body ? `Body: ${JSON.stringify(body)}` : '');
    try {
        const response = await fetch(url, options);
        console.log(`[API Request] Response status for ${method} ${url}: ${response.status}`);
        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch (e) { 
                console.warn(`[API Error] Could not parse JSON from error response for ${method} ${url}. Status: ${response.status}. Body will be read as text.`);
                const errorText = await response.text();
                console.warn(`[API Error] Error response text: ${errorText}`);
                errorData = { message: errorText || `Request failed with status ${response.status}` };
            }
            const errorMessage = errorData?.message || response.statusText || `HTTP error! Status: ${response.status}`;
            console.error(`[API Error Throwing] ${method} ${url} failed (${response.status}):`, errorMessage, errorData);
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = errorData; 
            throw error;
        }
        if (response.status === 204) { 
            console.log(`[API Response Returning Null] ${method} ${url} - Status 204 No Content`);
            return null;
        }
        const responseText = await response.text();
        console.log(`[API Response Raw Text] ${method} ${url} - Status ${response.status}: "${responseText}"`);
        if (!responseText) {
            console.warn(`[API Response Returning Null due to Empty Body] ${method} ${url} - Status ${response.status}`);
            return null; 
        }
        try {
            const data = JSON.parse(responseText);
            console.log(`[API Response Returning Data] ${method} ${url} - Status ${response.status}`, data);
            return data;
        } catch (parseError) {
            console.error(`[API Error Throwing due to JSON Parse] ${method} ${url} - Failed to parse: "${responseText}". Error:`, parseError);
            throw new Error(`Failed to parse server response for ${method} ${url}.`);
        }
    } catch (error) { 
        console.error(`[API.JS] apiRequest - Catch block for ${method} ${url}:`, error.message, error.stack);
        throw error; 
    }
};

export const loginUser = async (email, password) => { console.log('[API.JS] loginUser function called with email:', email); try { const result = await apiRequest('/auth/login', 'POST', { email, password }); console.log('[API.JS] loginUser: apiRequest promise resolved with:', result); return result; } catch (error) { console.error('[API.JS] loginUser: caught error from apiRequest:', error); throw error; } };
export const registerUser = async (username, email, password, role = 'User') => {  return apiRequest('/auth/register', 'POST', { username, email, password, role }); };
export const getAllExercises = async () => {  return apiRequest('/exercises', 'GET'); };
export const getExerciseById = async (id) => {  return apiRequest(`/exercises/${id}`, 'GET'); };
export const createExercise = async (exerciseData) => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/exercises', 'POST', exerciseData, token); };
export const updateExercise = async (id, exerciseData) => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/exercises/${id}`, 'PUT', exerciseData, token); };
export const deleteExercise = async (id) => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/exercises/${id}`, 'DELETE', null, token); };
export const getAllRecipes = async () => { const token = localStorage.getItem('authToken'); return apiRequest('/recipes', 'GET', null, token); };
export const getRecipeById = async (id) => { const token = localStorage.getItem('authToken'); return apiRequest(`/recipes/${id}`, 'GET', null, token); };
export const createRecipe = async (recipeData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/recipes', 'POST', recipeData, token); };
export const updateRecipe = async (id, recipeData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/recipes/${id}`, 'PUT', recipeData, token); };
export const deleteRecipe = async (id) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/recipes/${id}`, 'DELETE', null, token); };
export const adminUpdateRecipeStatus = async (recipeId, status) => { const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Admin privileges required.")); } return apiRequest(`/recipes/${recipeId}/status`, 'PUT', { status }, token); };
export const searchFoods = async (query) => {  if (!query || typeof query !== 'string' || query.trim().length === 0) { return Promise.resolve([]); } const encodedQuery = encodeURIComponent(query.trim()); return apiRequest(`/foods/search?q=${encodedQuery}`, 'GET'); };
export const logWorkout = async (workoutData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/workouts', 'POST', workoutData, token); };
export const getWorkoutHistory = async (startDate, endDate) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const queryParams = new URLSearchParams(); if (startDate) queryParams.set('startDate', startDate); if (endDate) queryParams.set('endDate', endDate); const queryString = queryParams.toString(); return apiRequest(`/workouts/history${queryString ? `?${queryString}` : ''}`, 'GET', null, token); };
export const exportWorkoutsData = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/workouts/export', 'GET', null, token); };
export const addOrUpdateWeight = async (logDate, weight, unit) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const body = { logDate, weight, unit }; return apiRequest('/weight', 'POST', body, token); };
export const getWeightHistory = async () => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/weight/history', 'GET', null, token); };
export const deleteWeightLog = async (logId) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/weight/${logId}`, 'DELETE', null, token); };
export const exportWeightData = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/weight/export', 'GET', null, token); };
export const addMealLogEntry = async (mealLogData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/meals', 'POST', mealLogData, token); };
export const getMealHistory = async (startDate, endDate) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } const queryParams = new URLSearchParams(); if (startDate) queryParams.set('startDate', startDate); if (endDate) queryParams.set('endDate', endDate); const queryString = queryParams.toString(); return apiRequest(`/meals/history${queryString ? `?${queryString}` : ''}`, 'GET', null, token); };
export const deleteMealLogEntry = async (logId) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/meals/${logId}`, 'DELETE', null, token); };
export const exportMealsData = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/meals/export', 'GET', null, token); };
export const getAllWorkoutPlans = async () => {  return apiRequest('/plans', 'GET'); };
export const getWorkoutPlanById = async (planId) => {  return apiRequest(`/plans/${planId}`, 'GET'); };
export const createWorkoutPlan = async (planData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/plans', 'POST', planData, token); };
export const updateWorkoutPlan = async (planId, planData) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/plans/${planId}`, 'PUT', planData, token); };
export const deleteWorkoutPlan = async (planId) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/plans/${planId}`, 'DELETE', null, token); };
export const adminGetAllUsers = async () => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/users', 'GET', null, token); };
export const adminUpdateUser = async (userId, updateData) => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/users/${userId}`, 'PUT', updateData, token); };
export const adminDeleteUser = async (userId) => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/users/${userId}`, 'DELETE', null, token); };
export const getRecentActivity = async (limit = 5) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest(`/dashboard/recent-activity?limit=${limit}`, 'GET', null, token); };
export const getTodaySummary = async () => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/dashboard/today-summary', 'GET', null, token); };
export const getWeightTrendData = async () => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/dashboard/weight-trend', 'GET', null, token); };
export const getCalorieTrendData = async () => {  const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/dashboard/calorie-trend', 'GET', null, token); };
export const adjustTodaySteps = async (amount) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/steps/adjust', 'POST', { amount }, token); };
export const adjustTodayWater = async (amountMl) => {  const token = localStorage.getItem('authToken'); if (!token) { return Promise.reject(new Error("Authentication token not found. Please log in.")); } return apiRequest('/water/adjust', 'POST', { amountMl }, token); };
export const getRandomQuote = async () => { return apiRequest('/quotes/random', 'GET'); };
export const getGoalsProgress = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/dashboard/goals-progress', 'GET', null, token); };
export const getActiveGoals = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/goals', 'GET', null, token); };
export const createGoal = async (goalData) => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/goals', 'POST', goalData, token); };
export const updateGoal = async (goalId, updateData) => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/goals/${goalId}`, 'PUT', updateData, token); };
export const deleteGoal = async (goalId) => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest(`/goals/${goalId}`, 'DELETE', null, token); };
export const updateUserProfile = async (profileData) => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/users/me/profile', 'PUT', profileData, token); };
export const changeUserPassword = async (passwordData) => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/users/me/password', 'PUT', passwordData, token); };
export const deactivateCurrentUserAccount = async () => { const token = localStorage.getItem('authToken'); if (!token) return Promise.reject(new Error("Authentication token not found.")); return apiRequest('/users/me/deactivate', 'PUT', null, token); };

// --- NEW: Delete current user's account ---
export const deleteCurrentUserAccount = async (confirmationText) => {
    const token = localStorage.getItem('authToken');
    if (!token) return Promise.reject(new Error("Authentication token not found."));
    // Backend expects confirmationText in the body
    return apiRequest('/users/me', 'DELETE', { confirmationText: confirmationText }, token);
};
// --- END NEW ---
