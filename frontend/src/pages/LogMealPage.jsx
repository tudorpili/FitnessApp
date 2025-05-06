// src/pages/LogMealPage.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
// Import API functions
import { searchFoods, addMealLogEntry, getMealHistory, deleteMealLogEntry } from '../services/api';
import {
    FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiActivity, FiLoader,
    FiAlertCircle, FiCheck // Added Check for success
} from 'react-icons/fi';
import { FaAppleAlt, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';

// --- Helper Functions ---
const getTodayDate = () => { /* ... */ const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };

// Calculates macros based on API food data structure
// --- UPDATED: Use parseFloat for potentially string values ---
const calculateMacrosForApiFood = (food, quantityG) => {
    if (!food || !quantityG || quantityG <= 0) return { calories: null, proteinG: null, carbsG: null, fatG: null };
    const factor = quantityG / 100;

    // Parse values as floats before calculation, provide 0 as fallback if parsing fails (or value is null/undefined)
    const caloriesPer100 = parseFloat(food.calories_per_100g) || 0;
    const proteinPer100 = parseFloat(food.protein_per_100g) || 0;
    const carbsPer100 = parseFloat(food.carbs_per_100g) || 0;
    const fatPer100 = parseFloat(food.fat_per_100g) || 0;

    // Calculate macros based on parsed numbers
    const calories = Math.round(caloriesPer100 * factor);
    const proteinG = Math.round(proteinPer100 * factor * 10) / 10;
    const carbsG = Math.round(carbsPer100 * factor * 10) / 10;
    const fatG = Math.round(fatPer100 * factor * 10) / 10;

    // Return null if the base value was 0 (or failed parsing), otherwise return calculated value
    return {
        calories: caloriesPer100 === 0 ? null : calories,
        proteinG: proteinPer100 === 0 ? null : proteinG,
        carbsG: carbsPer100 === 0 ? null : carbsG,
        fatG: fatPer100 === 0 ? null : fatG
    };
};
// --- END UPDATE ---

// --- Components ---
const MealSectionCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight flex items-center"> {icon && <span className="mr-2 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );

// Updated LoggedItemCard to use API data structure
const LoggedItemCard = ({ item, onRemove }) => (
    // Use item.id (from DB) as key
    <li key={item.id} className="flex justify-between items-center bg-gray-50/80 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-200 ease-in-out">
        <div className="flex-1 mr-4">
            {/* Display name stored at log time */}
            <p className="text-md font-semibold text-gray-900">{item.food_name_at_log_time}</p>
            <p className="text-xs text-gray-600 mt-1">
                {/* Display quantity_g */}
                {parseFloat(item.quantity_g || 0).toFixed(1)}g | {/* Ensure quantity is formatted */}
                {/* Display stored calculated macros */}
                <span className="font-medium text-yellow-600"> ~{item.calories !== null ? parseFloat(item.calories).toFixed(0) : '?'} kcal</span> |
                <span className="font-medium text-emerald-600"> P:{item.protein_g !== null ? parseFloat(item.protein_g).toFixed(1) : '?'}g</span> |
                <span className="font-medium text-blue-600"> C:{item.carbs_g !== null ? parseFloat(item.carbs_g).toFixed(1) : '?'}g</span> |
                <span className="font-medium text-red-600"> F:{item.fat_g !== null ? parseFloat(item.fat_g).toFixed(1) : '?'}g</span>
            </p>
        </div>
         <button
            // Pass item.id (DB id) to remove handler
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0"
            title={`Remove ${item.food_name_at_log_time}`}
            aria-label={`Remove ${item.food_name_at_log_time}`}
        >
            <FiTrash2 className="h-4 w-4"/>
        </button>
    </li>
);

const mealTypes = [ { name: 'Breakfast', emoji: '🍳' }, { name: 'Lunch', emoji: '🥪' }, { name: 'Dinner', emoji: '🍝' }, { name: 'Snack', emoji: '🍎' } ];

// --- LogMealPage Component ---
function LogMealPage() {
    // State for date, meal type, search
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState('');

    // State for meal log data fetched from API
    const [mealLog, setMealLog] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // State for API food search results
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // State for Add operation
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const loggedItemsListRef = useRef(null); // For scrolling
    const debounceTimeoutRef = useRef(null); // For debouncing API calls

    // --- Fetch Meal History Function ---
    const fetchMealHistory = useCallback(async (date) => {
        setIsLoadingHistory(true);
        setFetchError(null);
        try {
            console.log(`Fetching meal history for date: ${date}`);
            // Fetch only for the selected date
            const historyData = await getMealHistory(date, date);
            setMealLog(historyData || []); // Update state with fetched logs
            console.log("Meal history fetched:", historyData);
        } catch (error) {
            console.error("Failed to fetch meal history:", error);
            setFetchError(error.message || "Could not load meal history.");
            setMealLog([]); // Clear log on error
        } finally {
            setIsLoadingHistory(false);
        }
    }, []); // No date dependency here, pass date when calling

    // --- useEffect Hooks ---
    // Fetch history when selectedDate changes
    useEffect(() => {
        fetchMealHistory(selectedDate);
    }, [selectedDate, fetchMealHistory]);

    // Debounced Search Effect (remains the same)
    useEffect(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        if (!searchTerm.trim()) { setSearchResults([]); setIsSearching(false); setSearchError(null); return; }
        setIsSearching(true); setSearchError(null); setSearchResults([]);
        debounceTimeoutRef.current = setTimeout(async () => {
            console.log(`Debounced search for: "${searchTerm}"`);
            try {
                const results = await searchFoods(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error("Food search failed:", error);
                setSearchError(error.message || "Failed to search for food.");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [searchTerm]);

    // --- Memos for Calculations (use fetched mealLog) ---
    const currentMealItems = useMemo(() => {
        return mealLog.filter(item => item.meal_type === selectedMeal); // Already filtered by date in fetch
    }, [mealLog, selectedMeal]);

    const dailyTotals = useMemo(() => {
        // mealLog already contains items only for selectedDate
        return mealLog.reduce((totals, item) => {
            totals.calories += parseFloat(item.calories) || 0; // Ensure numbers
            totals.protein += parseFloat(item.protein_g) || 0;
            totals.carbs += parseFloat(item.carbs_g) || 0;
            totals.fat += parseFloat(item.fat_g) || 0;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [mealLog]);

    const currentMealTotals = useMemo(() => {
        return currentMealItems.reduce((totals, item) => {
            totals.calories += parseFloat(item.calories) || 0;
            totals.protein += parseFloat(item.protein_g) || 0;
            totals.carbs += parseFloat(item.carbs_g) || 0;
            totals.fat += parseFloat(item.fat_g) || 0;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [currentMealItems]);

    // --- Handle Adding Food (Calls API) ---
    const handleAddFood = async (food) => { // Make async
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const quantityG = parseFloat(food.default_serving_g) || 100; // Ensure quantity is number
        const macros = calculateMacrosForApiFood(food, quantityG);

        // Prepare payload for the API
        const mealLogData = {
            foodId: food.id,
            foodName: food.name, // Send the name from search result
            logDate: selectedDate,
            mealType: selectedMeal,
            quantityG: quantityG,
            // Send calculated macros (ensure they are numbers or null)
            calories: macros.calories,
            proteinG: macros.proteinG,
            carbsG: macros.carbsG,
            fatG: macros.fatG,
        };

        try {
            console.log("Adding meal log entry via API:", mealLogData);
            await addMealLogEntry(mealLogData); // Call API
            setSaveSuccess(true);
            fetchMealHistory(selectedDate); // Refresh the log for the current date
            setSearchTerm(''); // Clear search
            setSearchResults([]); // Clear results
            setTimeout(() => setSaveSuccess(false), 2000); // Hide success message
        } catch (error) {
            console.error("Failed to add meal log entry:", error);
            setSaveError(error.message || "Failed to save meal entry.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handle Removing Item (Calls API) ---
    const handleRemoveItem = async (logIdToRemove) => { // Make async
        console.log(`Attempting to delete meal log entry ID: ${logIdToRemove}`);
        // Consider adding confirmation dialog here
        try {
            await deleteMealLogEntry(logIdToRemove); // Call API
            fetchMealHistory(selectedDate); // Refresh log on success
        } catch (error) {
            console.error(`Failed to delete meal log entry ${logIdToRemove}:`, error);
            // Display error to user (e.g., using an alert or toast)
            alert(`Error deleting entry: ${error.message}`);
        }
    };

    // Scroll Effect (remains the same)
    useEffect(() => { if (loggedItemsListRef.current) { loggedItemsListRef.current.scrollTop = loggedItemsListRef.current.scrollHeight; } }, [currentMealItems]);

    // --- Render Logic ---
    return (
        <div className="space-y-8 sm:space-y-10 font-sans max-w-screen-xl mx-auto">
            {/* Header and Date Picker */}
            <div className="pb-6 border-b border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Log Your Meal</h1>
                <div className="flex items-center gap-2 mt-4">
                     <label htmlFor="log-date" className="flex items-center text-sm font-medium text-gray-700"><FiCalendar className="mr-1.5 h-4 w-4 text-gray-500"/> Logging for:</label>
                    <input type="date" id="log-date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"/>
                </div>
            </div>

            {/* Meal Type Selector */}
            <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
                <div className="bg-gray-100 p-1.5 rounded-full flex flex-wrap gap-1 justify-center sm:justify-start">
                    {mealTypes.map(meal => ( <button key={meal.name} onClick={() => setSelectedMeal(meal.name)} className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out flex-1 justify-center sm:flex-initial ${ selectedMeal === meal.name ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-gray-200' }`}> <span className="mr-1.5 text-lg">{meal.emoji}</span> {meal.name} </button> ))}
                </div>
            </div>

             {/* Loading/Error State for History */}
            {isLoadingHistory && ( <div className="flex justify-center items-center py-6"><FiLoader className="animate-spin h-6 w-6 text-indigo-500 mr-2"/> Loading meal history...</div> )}
            {fetchError && !isLoadingHistory && ( <div className="text-center py-6 px-4 bg-red-50 rounded-lg border border-red-200"><p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {fetchError}</p></div> )}

            {/* Daily Totals Card (show only if history loaded) */}
            {!isLoadingHistory && !fetchError && (
                <MealSectionCard title={`Totals for ${selectedDate}`} icon={<FiActivity />}>
                     {mealLog.length > 0 ? ( <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"> <div className="bg-yellow-50 p-3 rounded-lg"><p className="text-xs font-medium text-yellow-700 uppercase">Calories</p><p className="text-xl font-bold text-yellow-900">{dailyTotals.calories.toFixed(0)}</p><p className="text-xs text-yellow-600">kcal</p></div> <div className="bg-emerald-50 p-3 rounded-lg"><p className="text-xs font-medium text-emerald-700 uppercase">Protein</p><p className="text-xl font-bold text-emerald-900">{dailyTotals.protein.toFixed(1)}</p><p className="text-xs text-emerald-600">g</p></div> <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs font-medium text-blue-700 uppercase">Carbs</p><p className="text-xl font-bold text-blue-900">{dailyTotals.carbs.toFixed(1)}</p><p className="text-xs text-blue-600">g</p></div> <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs font-medium text-red-700 uppercase">Fat</p><p className="text-xl font-bold text-red-900">{dailyTotals.fat.toFixed(1)}</p><p className="text-xs text-red-600">g</p></div> </div> ) : ( <p className="text-sm text-gray-500 italic text-center py-4">Log your first item for today to see totals.</p> )}
                </MealSectionCard>
            )}

            {/* Main Grid: Search & Logged Items (show only if history loaded) */}
            {!isLoadingHistory && !fetchError && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                    {/* Search Card */}
                    <MealSectionCard title={`Add Food to ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji} className="lg:sticky lg:top-6">
                         <div className="relative"> <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"> <FiSearch /> </span> <input type="text" placeholder={`e.g. chicken breast, apple...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md"/> </div>
                         {/* Save Feedback */}
                         {saveError && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle/>{saveError}</p>}
                         {saveSuccess && <p className="mt-2 text-sm text-green-600 flex items-center gap-1"><FiCheck/>Item added!</p>}
                        {/* Search Results Area */}
                        <div className="mt-4 border border-gray-200 rounded-xl min-h-[100px] max-h-72 overflow-y-auto bg-white shadow-inner relative"> <h3 className="text-xs font-semibold uppercase text-gray-500 p-3 border-b border-gray-200 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">Search Results</h3> {isSearching && ( <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm"><FiLoader className="animate-spin h-6 w-6 text-indigo-600"/></div> )} {!isSearching && searchError && ( <p className="p-5 text-sm text-red-600 text-center flex items-center justify-center gap-2"><FiAlertCircle/> {searchError}</p> )} {!isSearching && !searchError && searchResults.length > 0 && ( <ul className="divide-y divide-gray-100"> {searchResults.map(food => ( <li key={food.id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition duration-150"> <div> <p className="text-sm font-semibold text-gray-900">{food.name}</p> <p className="text-xs text-gray-500">~{calculateMacrosForApiFood(food, 100).calories ?? '?'} kcal / 100g</p> </div> <button onClick={() => handleAddFood(food)} disabled={isSaving} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed" title={`Add ${food.name}`} aria-label={`Add ${food.name}`}><FiPlusCircle className="h-5 w-5"/></button> </li> ))} </ul> )} {!isSearching && !searchError && searchResults.length === 0 && searchTerm.trim() && ( <p className="p-5 text-sm text-gray-500 text-center italic">No food found matching "{searchTerm}".</p> )} {!isSearching && !searchError && searchResults.length === 0 && !searchTerm.trim() && ( <p className="p-5 text-sm text-gray-400 text-center italic">Start typing to search...</p> )} </div>
                    </MealSectionCard>

                    {/* Logged Items Card */}
                    <MealSectionCard title={`Logged in ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji}>
                         {currentMealItems.length > 0 ? ( <> <ul ref={loggedItemsListRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"> {currentMealItems.map(item => ( <LoggedItemCard key={item.id} item={item} onRemove={handleRemoveItem} /> ))} </ul> <div className="pt-5 border-t border-gray-200 mt-5 text-sm font-semibold text-gray-800 space-y-1"> <p className="text-base">Total for {selectedMeal}:</p> <p><span className="text-yellow-600">~{currentMealTotals.calories.toFixed(0)} kcal</span></p> <p><span className="text-emerald-600">Protein: {currentMealTotals.protein.toFixed(1)}g</span></p> <p><span className="text-blue-600">Carbs: {currentMealTotals.carbs.toFixed(1)}g</span></p> <p><span className="text-red-600">Fat: {currentMealTotals.fat.toFixed(1)}g</span></p> </div> </> ) : ( <p className="text-sm text-gray-500 italic text-center py-8">No items logged for {selectedMeal} yet.</p> )}
                     </MealSectionCard>
                </div>
            )}
        </div>
    );
}

export default LogMealPage;
