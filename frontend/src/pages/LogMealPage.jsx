// src/pages/LogMealPage.jsx
import React, { useState, useMemo, useRef, useEffect, /*useCallback*/ } from 'react';
// Removed: import { mockFoods, calculateMacros } from '../mockData/foods'; // No longer using mock data
import { searchFoods } from '../services/api'; // Import API function
import { FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiActivity, FiLoader, FiAlertCircle } from 'react-icons/fi'; // Added Loader, AlertCircle
import { FaAppleAlt, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';

// --- Helper Functions ---
const getTodayDate = () => { /* ... */ const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };

// Recalculate macros based on API data structure
const calculateMacrosForApiFood = (food, quantityG) => {
    if (!food || !quantityG || quantityG <= 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    // Use the *_per_100g fields from the API response
    const factor = quantityG / 100;
    return {
        calories: Math.round((food.calories_per_100g || 0) * factor),
        protein: Math.round((food.protein_per_100g || 0) * factor * 10) / 10,
        carbs: Math.round((food.carbs_per_100g || 0) * factor * 10) / 10,
        fat: Math.round((food.fat_per_100g || 0) * factor * 10) / 10,
    };
};

// --- Components (MealSectionCard, LoggedItemCard remain the same) ---
const MealSectionCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight flex items-center"> {icon && <span className="mr-2 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );
const LoggedItemCard = ({ item, onRemove }) => ( <li key={item.logId} className="flex justify-between items-center bg-gray-50/80 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-200 ease-in-out"> <div className="flex-1 mr-4"> <p className="text-md font-semibold text-gray-900">{item.name}</p> <p className="text-xs text-gray-600 mt-1"> {item.quantity}{item.unit} | <span className="font-medium text-yellow-600"> ~{item.calories} kcal</span> | <span className="font-medium text-emerald-600"> P:{item.protein}g</span> | <span className="font-medium text-blue-600"> C:{item.carbs}g</span> | <span className="font-medium text-red-600"> F:{item.fat}g</span> </p> </div> <button onClick={() => onRemove(item.logId)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0" title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`}> <FiTrash2 className="h-4 w-4"/> </button> </li> );

const mealTypes = [ { name: 'Breakfast', emoji: '🍳' }, { name: 'Lunch', emoji: '🥪' }, { name: 'Dinner', emoji: '🍝' }, { name: 'Snack', emoji: '🍎' } ];

// --- LogMealPage Component ---
function LogMealPage() {
    // State for date, meal type, search, logged items
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState('');
    const [sessionLoggedItems, setSessionLoggedItems] = useState([]); // Items logged during this session

    // State for API search results, loading, and errors
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const loggedItemsListRef = useRef(null); // For scrolling
    const debounceTimeoutRef = useRef(null); // For debouncing API calls

    // --- Debounced Search Effect ---
    useEffect(() => {
        // Clear any existing timeout when searchTerm changes
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // If searchTerm is empty, clear results and don't search
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            setSearchError(null);
            return;
        }

        // Set loading state immediately for perceived responsiveness
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]); // Clear previous results while loading new ones

        // Set a timeout to delay the API call
        debounceTimeoutRef.current = setTimeout(async () => {
            console.log(`Debounced search for: "${searchTerm}"`);
            try {
                const results = await searchFoods(searchTerm); // Call API
                setSearchResults(results);
                console.log("Search results received:", results);
            } catch (error) {
                console.error("Food search failed:", error);
                setSearchError(error.message || "Failed to search for food.");
                setSearchResults([]); // Clear results on error
            } finally {
                setIsSearching(false); // Stop loading indicator
            }
        }, 300); // 300ms debounce delay

        // Cleanup function to clear timeout if component unmounts or searchTerm changes again quickly
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm]); // Re-run effect when searchTerm changes

    // --- Memos for Calculations (remain similar, use sessionLoggedItems) ---
    const currentMealItems = useMemo(() => { /* ... */ return sessionLoggedItems.filter(item => item.date === selectedDate && item.meal === selectedMeal); }, [sessionLoggedItems, selectedDate, selectedMeal]);
    const dailyTotals = useMemo(() => { /* ... */ const itemsForDay = sessionLoggedItems.filter(item => item.date === selectedDate); return itemsForDay.reduce((totals, item) => { totals.calories += item.calories || 0; totals.protein += item.protein || 0; totals.carbs += item.carbs || 0; totals.fat += item.fat || 0; return totals; }, { calories: 0, protein: 0, carbs: 0, fat: 0 }); }, [sessionLoggedItems, selectedDate]);
    const currentMealTotals = useMemo(() => { /* ... */ return currentMealItems.reduce((totals, item) => { totals.calories += item.calories || 0; totals.protein += item.protein || 0; totals.carbs += item.carbs || 0; totals.fat += item.fat || 0; return totals; }, { calories: 0, protein: 0, carbs: 0, fat: 0 }); }, [currentMealItems]);

    // --- Handle Adding Food (uses API data structure now) ---
    const handleAddFood = (food) => {
        // Use default serving size from API or fallback to 100g
        const quantityG = food.default_serving_g || 100;
        // Use the updated macro calculation function
        const macros = calculateMacrosForApiFood(food, quantityG);

        const newItem = {
            logId: `${Date.now()}-${food.id}`, // Unique ID for the logged instance
            foodId: food.id, // ID from the database food item
            name: food.name,
            quantity: quantityG,
            unit: food.unit_name || 'g', // Use unit name from API or fallback
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            meal: selectedMeal,
            date: selectedDate,
        };
        setSessionLoggedItems(prevItems => [...prevItems, newItem]);
        setSearchTerm(''); // Clear search after adding
        setSearchResults([]); // Clear search results
    };

    // --- Handle Removing Item (remains the same) ---
    const handleRemoveItem = (logIdToRemove) => { /* ... */ setSessionLoggedItems(prevItems => prevItems.filter(item => item.logId !== logIdToRemove)); };

    // --- Scroll Effect (remains the same) ---
    useEffect(() => { /* ... */ if (loggedItemsListRef.current) { loggedItemsListRef.current.scrollTop = loggedItemsListRef.current.scrollHeight; } }, [currentMealItems]);

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

            {/* Daily Totals Card */}
            <MealSectionCard title={`Totals for ${selectedDate}`} icon={<FiActivity />}>
                 {sessionLoggedItems.filter(i=>i.date === selectedDate).length > 0 ? ( <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"> <div className="bg-yellow-50 p-3 rounded-lg"><p className="text-xs font-medium text-yellow-700 uppercase">Calories</p><p className="text-xl font-bold text-yellow-900">{dailyTotals.calories}</p><p className="text-xs text-yellow-600">kcal</p></div> <div className="bg-emerald-50 p-3 rounded-lg"><p className="text-xs font-medium text-emerald-700 uppercase">Protein</p><p className="text-xl font-bold text-emerald-900">{dailyTotals.protein.toFixed(1)}</p><p className="text-xs text-emerald-600">g</p></div> <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs font-medium text-blue-700 uppercase">Carbs</p><p className="text-xl font-bold text-blue-900">{dailyTotals.carbs.toFixed(1)}</p><p className="text-xs text-blue-600">g</p></div> <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs font-medium text-red-700 uppercase">Fat</p><p className="text-xl font-bold text-red-900">{dailyTotals.fat.toFixed(1)}</p><p className="text-xs text-red-600">g</p></div> </div> ) : ( <p className="text-sm text-gray-500 italic text-center py-4">Log your first item for today to see totals.</p> )}
            </MealSectionCard>

            {/* Main Grid: Search & Logged Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                {/* Search Card */}
                <MealSectionCard title={`Add Food to ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji} className="lg:sticky lg:top-6">
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"> <FiSearch /> </span>
                        <input type="text" placeholder={`e.g. chicken breast, apple...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md"/>
                     </div>

                    {/* Search Results Area */}
                    <div className="mt-4 border border-gray-200 rounded-xl min-h-[100px] max-h-72 overflow-y-auto bg-white shadow-inner relative">
                         <h3 className="text-xs font-semibold uppercase text-gray-500 p-3 border-b border-gray-200 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">Search Results</h3>
                        {isSearching && ( <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm"><FiLoader className="animate-spin h-6 w-6 text-indigo-600"/></div> )}
                        {!isSearching && searchError && ( <p className="p-5 text-sm text-red-600 text-center flex items-center justify-center gap-2"><FiAlertCircle/> {searchError}</p> )}
                        {!isSearching && !searchError && searchResults.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                                {searchResults.map(food => (
                                    <li key={food.id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition duration-150">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{food.name}</p>
                                            {/* Use updated macro calc */}
                                            <p className="text-xs text-gray-500">~{calculateMacrosForApiFood(food, 100).calories} kcal / 100g</p>
                                        </div>
                                        <button onClick={() => handleAddFood(food)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150" title={`Add ${food.name}`} aria-label={`Add ${food.name}`}><FiPlusCircle className="h-5 w-5"/></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                         {!isSearching && !searchError && searchResults.length === 0 && searchTerm.trim() && ( <p className="p-5 text-sm text-gray-500 text-center italic">No food found matching "{searchTerm}".</p> )}
                         {!isSearching && !searchError && searchResults.length === 0 && !searchTerm.trim() && ( <p className="p-5 text-sm text-gray-400 text-center italic">Start typing to search...</p> )}
                    </div>
                </MealSectionCard>

                {/* Logged Items Card */}
                <MealSectionCard title={`Logged in ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji}>
                     {currentMealItems.length > 0 ? ( <> <ul ref={loggedItemsListRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"> {currentMealItems.map(item => ( <LoggedItemCard key={item.logId} item={item} onRemove={handleRemoveItem} /> ))} </ul> <div className="pt-5 border-t border-gray-200 mt-5 text-sm font-semibold text-gray-800 space-y-1"> <p className="text-base">Total for {selectedMeal}:</p> <p><span className="text-yellow-600">~{currentMealTotals.calories} kcal</span></p> <p><span className="text-emerald-600">Protein: {currentMealTotals.protein.toFixed(1)}g</span></p> <p><span className="text-blue-600">Carbs: {currentMealTotals.carbs.toFixed(1)}g</span></p> <p><span className="text-red-600">Fat: {currentMealTotals.fat.toFixed(1)}g</span></p> </div> </> ) : ( <p className="text-sm text-gray-500 italic text-center py-8">No items logged for {selectedMeal} yet.</p> )}
                 </MealSectionCard>
            </div>
        </div>
    );
}

export default LogMealPage;
