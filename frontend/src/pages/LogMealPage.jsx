// src/pages/LogMealPage.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { searchFoods, addMealLogEntry, getMealHistory, deleteMealLogEntry } from '../services/api';
import {
    FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiActivity, FiLoader,
    FiAlertCircle, FiCheck, FiEdit2, FiXCircle // Added Edit2 for quantity input, XCircle for cancel
} from 'react-icons/fi';
import { FaAppleAlt /*, FaDrumstickBite, FaBreadSlice, FaTint*/ } from 'react-icons/fa'; // Simplified icons for brevity

// --- Helper Functions ---
const getTodayDate = () => { const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };

const calculateMacrosForApiFood = (food, quantityG) => {
    if (!food || !quantityG || quantityG <= 0) return { calories: null, proteinG: null, carbsG: null, fatG: null };
    const factor = parseFloat(quantityG) / 100; // Ensure quantityG is a number

    const caloriesPer100 = parseFloat(food.calories_per_100g) || 0;
    const proteinPer100 = parseFloat(food.protein_per_100g) || 0;
    const carbsPer100 = parseFloat(food.carbs_per_100g) || 0;
    const fatPer100 = parseFloat(food.fat_per_100g) || 0;

    const calories = Math.round(caloriesPer100 * factor);
    const proteinG = Math.round(proteinPer100 * factor * 10) / 10;
    const carbsG = Math.round(carbsPer100 * factor * 10) / 10;
    const fatG = Math.round(fatPer100 * factor * 10) / 10;

    return {
        calories: caloriesPer100 === 0 && factor === 0 ? null : calories, // Handle 0 quantity better
        proteinG: proteinPer100 === 0 && factor === 0 ? null : proteinG,
        carbsG: carbsPer100 === 0 && factor === 0 ? null : carbsG,
        fatG: fatPer100 === 0 && factor === 0 ? null : fatG
    };
};

// --- Components ---
const MealSectionCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight flex items-center"> {icon && <span className="mr-2 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );
const LoggedItemCard = ({ item, onRemove }) => (
    <li key={item.id} className="flex justify-between items-center bg-gray-50/80 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-200 ease-in-out">
        <div className="flex-1 mr-4">
            <p className="text-md font-semibold text-gray-900">{item.food_name_at_log_time}</p>
            <p className="text-xs text-gray-600 mt-1">
                {parseFloat(item.quantity_g || 0).toFixed(1)}g |
                <span className="font-medium text-yellow-600"> ~{item.calories !== null ? parseFloat(item.calories).toFixed(0) : '?'} kcal</span> |
                <span className="font-medium text-emerald-600"> P:{item.protein_g !== null ? parseFloat(item.protein_g).toFixed(1) : '?'}g</span> |
                <span className="font-medium text-blue-600"> C:{item.carbs_g !== null ? parseFloat(item.carbs_g).toFixed(1) : '?'}g</span> |
                <span className="font-medium text-red-600"> F:{item.fat_g !== null ? parseFloat(item.fat_g).toFixed(1) : '?'}g</span>
            </p>
        </div>
        <button onClick={() => onRemove(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0" title={`Remove ${item.food_name_at_log_time}`} aria-label={`Remove ${item.food_name_at_log_time}`}> <FiTrash2 className="h-4 w-4"/> </button>
    </li>
);

const mealTypes = [ { name: 'Breakfast', emoji: '🍳' }, { name: 'Lunch', emoji: '🥪' }, { name: 'Dinner', emoji: '🍝' }, { name: 'Snack', emoji: '🍎' } ];

// --- LogMealPage Component ---
function LogMealPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState('');
    const [mealLog, setMealLog] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // --- NEW State for staging food item for logging ---
    const [stagedFoodDetails, setStagedFoodDetails] = useState(null); // { foodItem: object, quantityG: string, calculatedMacros: object }

    const loggedItemsListRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    const fetchMealHistory = useCallback(async (date) => { /* ... (same as before) ... */ setIsLoadingHistory(true); setFetchError(null); try { const historyData = await getMealHistory(date, date); setMealLog(historyData || []); } catch (error) { setFetchError(error.message || "Could not load meal history."); setMealLog([]); } finally { setIsLoadingHistory(false); } }, []);
    useEffect(() => { fetchMealHistory(selectedDate); }, [selectedDate, fetchMealHistory]);

    useEffect(() => { // Debounced Search Effect
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        if (!searchTerm.trim()) { setSearchResults([]); setIsSearching(false); setSearchError(null); return; }
        setIsSearching(true); setSearchError(null); setSearchResults([]);
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await searchFoods(searchTerm);
                setSearchResults(results);
            } catch (error) {
                setSearchError(error.message || "Failed to search for food.");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [searchTerm]);

    const currentMealItems = useMemo(() => mealLog.filter(item => item.meal_type === selectedMeal), [mealLog, selectedMeal]);
    const dailyTotals = useMemo(() => mealLog.reduce((totals, item) => { totals.calories += parseFloat(item.calories) || 0; totals.protein += parseFloat(item.protein_g) || 0; totals.carbs += parseFloat(item.carbs_g) || 0; totals.fat += parseFloat(item.fat_g) || 0; return totals; }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [mealLog]);
    const currentMealTotals = useMemo(() => currentMealItems.reduce((totals, item) => { totals.calories += parseFloat(item.calories) || 0; totals.protein += parseFloat(item.protein_g) || 0; totals.carbs += parseFloat(item.carbs_g) || 0; totals.fat += parseFloat(item.fat_g) || 0; return totals; }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [currentMealItems]);

    // --- NEW: Handler when a food item is selected from search results ---
    const handleSelectFoodFromSearch = (foodItem) => {
        const defaultQuantity = String(foodItem.default_serving_g || '100');
        setStagedFoodDetails({
            foodItem: foodItem,
            quantityG: defaultQuantity,
            calculatedMacros: calculateMacrosForApiFood(foodItem, parseFloat(defaultQuantity))
        });
        setSearchTerm(''); // Clear search term
        setSearchResults([]); // Clear search results
    };

    // --- NEW: Handler for quantity change in the staging area ---
    const handleStagedQuantityChange = (e) => {
        if (stagedFoodDetails) {
            const newQuantity = e.target.value;
            const newQuantityNum = parseFloat(newQuantity);
            setStagedFoodDetails(prev => ({
                ...prev,
                quantityG: newQuantity, // Keep as string for input field
                calculatedMacros: calculateMacrosForApiFood(prev.foodItem, newQuantityNum)
            }));
        }
    };
    
    // --- MODIFIED: Handle Adding Food (now uses stagedFoodDetails) ---
    const handleConfirmAndAddFood = async () => {
        if (!stagedFoodDetails) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const { foodItem, quantityG, calculatedMacros } = stagedFoodDetails;
        const finalQuantityG = parseFloat(quantityG);

        if (isNaN(finalQuantityG) || finalQuantityG <= 0) {
            setSaveError("Please enter a valid quantity greater than 0.");
            setIsSaving(false);
            return;
        }

        const mealLogData = {
            foodId: foodItem.id,
            foodName: foodItem.name,
            logDate: selectedDate,
            mealType: selectedMeal,
            quantityG: finalQuantityG,
            calories: calculatedMacros.calories,
            proteinG: calculatedMacros.proteinG,
            carbsG: calculatedMacros.carbsG,
            fatG: calculatedMacros.fatG,
        };

        try {
            await addMealLogEntry(mealLogData);
            setSaveSuccess(true);
            fetchMealHistory(selectedDate);
            setStagedFoodDetails(null); // Clear staged food
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            setSaveError(error.message || "Failed to save meal entry.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveItem = async (logIdToRemove) => { /* ... (same as before) ... */ try { await deleteMealLogEntry(logIdToRemove); fetchMealHistory(selectedDate); } catch (error) { alert(`Error deleting entry: ${error.message}`); } };
    useEffect(() => { if (loggedItemsListRef.current) { loggedItemsListRef.current.scrollTop = loggedItemsListRef.current.scrollHeight; } }, [currentMealItems]);

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

            {isLoadingHistory && ( <div className="flex justify-center items-center py-6"><FiLoader className="animate-spin h-6 w-6 text-indigo-500 mr-2"/> Loading meal history...</div> )}
            {fetchError && !isLoadingHistory && ( <div className="text-center py-6 px-4 bg-red-50 rounded-lg border border-red-200"><p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {fetchError}</p></div> )}

            {!isLoadingHistory && !fetchError && (
                <MealSectionCard title={`Totals for ${selectedDate}`} icon={<FiActivity />}>
                    {mealLog.length > 0 ? ( <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"> <div className="bg-yellow-50 p-3 rounded-lg"><p className="text-xs font-medium text-yellow-700 uppercase">Calories</p><p className="text-xl font-bold text-yellow-900">{dailyTotals.calories.toFixed(0)}</p><p className="text-xs text-yellow-600">kcal</p></div> <div className="bg-emerald-50 p-3 rounded-lg"><p className="text-xs font-medium text-emerald-700 uppercase">Protein</p><p className="text-xl font-bold text-emerald-900">{dailyTotals.protein.toFixed(1)}</p><p className="text-xs text-emerald-600">g</p></div> <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs font-medium text-blue-700 uppercase">Carbs</p><p className="text-xl font-bold text-blue-900">{dailyTotals.carbs.toFixed(1)}</p><p className="text-xs text-blue-600">g</p></div> <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs font-medium text-red-700 uppercase">Fat</p><p className="text-xl font-bold text-red-900">{dailyTotals.fat.toFixed(1)}</p><p className="text-xs text-red-600">g</p></div> </div> ) : ( <p className="text-sm text-gray-500 italic text-center py-4">Log your first item for today to see totals.</p> )}
                </MealSectionCard>
            )}

            {!isLoadingHistory && !fetchError && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                    {/* Search & Staging Card */}
                    <MealSectionCard title={`Add Food to ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji} className="lg:sticky lg:top-6">
                        <div className="relative"> <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"> <FiSearch /> </span> <input type="text" placeholder={`e.g. chicken breast, apple...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md"/> </div>
                        
                        {/* Search Results Area */}
                        <div className="mt-4 border border-gray-200 rounded-xl min-h-[80px] max-h-60 overflow-y-auto bg-white shadow-inner relative">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 p-3 border-b border-gray-200 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">Search Results</h3>
                            {isSearching && ( <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm"><FiLoader className="animate-spin h-6 w-6 text-indigo-600"/></div> )}
                            {!isSearching && searchError && ( <p className="p-5 text-sm text-red-600 text-center flex items-center justify-center gap-2"><FiAlertCircle/> {searchError}</p> )}
                            {!isSearching && !searchError && searchResults.length > 0 && (
                                <ul className="divide-y divide-gray-100">
                                    {searchResults.map(food => (
                                        <li key={food.id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition duration-150 cursor-pointer" onClick={() => handleSelectFoodFromSearch(food)}>
                                            <div> <p className="text-sm font-semibold text-gray-900">{food.name}</p> <p className="text-xs text-gray-500">~{calculateMacrosForApiFood(food, 100).calories ?? '?'} kcal / 100g</p> </div>
                                            <FiPlusCircle className="h-5 w-5 text-indigo-500 hover:text-indigo-700"/>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!isSearching && !searchError && searchResults.length === 0 && searchTerm.trim() && ( <p className="p-5 text-sm text-gray-500 text-center italic">No food found matching "{searchTerm}".</p> )}
                            {!isSearching && !searchError && searchResults.length === 0 && !searchTerm.trim() && !stagedFoodDetails && ( <p className="p-5 text-sm text-gray-400 text-center italic">Start typing to search...</p> )}
                        </div>

                        {/* --- NEW: Staging Area for Selected Food --- */}
                        {stagedFoodDetails && (
                            <div className="mt-6 p-4 border border-indigo-200 rounded-xl bg-indigo-50/50 shadow-md space-y-4 animate-fadeIn">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-md font-semibold text-indigo-800">{stagedFoodDetails.foodItem.name}</h4>
                                        <p className="text-xs text-indigo-600">Adjust quantity and add to your meal.</p>
                                    </div>
                                    <button onClick={() => setStagedFoodDetails(null)} className="p-1 text-gray-400 hover:text-red-500" title="Cancel adding this item"><FiXCircle size={20}/></button>
                                </div>
                                
                                <div>
                                    <label htmlFor="staged-quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity (g)</label>
                                    <input
                                        type="number"
                                        id="staged-quantity"
                                        value={stagedFoodDetails.quantityG}
                                        onChange={handleStagedQuantityChange}
                                        min="1"
                                        step="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {stagedFoodDetails.calculatedMacros && (
                                    <div className="text-xs text-gray-700 space-y-0.5">
                                        <p>Calories: <span className="font-semibold">{stagedFoodDetails.calculatedMacros.calories?.toFixed(0) ?? '0'} kcal</span></p>
                                        <p>Protein: <span className="font-semibold">{stagedFoodDetails.calculatedMacros.proteinG?.toFixed(1) ?? '0'} g</span></p>
                                        <p>Carbs: <span className="font-semibold">{stagedFoodDetails.calculatedMacros.carbsG?.toFixed(1) ?? '0'} g</span></p>
                                        <p>Fat: <span className="font-semibold">{stagedFoodDetails.calculatedMacros.fatG?.toFixed(1) ?? '0'} g</span></p>
                                    </div>
                                )}
                                {saveError && <p className="text-sm text-red-600 flex items-center gap-1"><FiAlertCircle/>{saveError}</p>}
                                {saveSuccess && <p className="text-sm text-green-600 flex items-center gap-1"><FiCheck/>Item added!</p>}

                                <button
                                    onClick={handleConfirmAndAddFood}
                                    disabled={isSaving || !stagedFoodDetails.quantityG || parseFloat(stagedFoodDetails.quantityG) <= 0}
                                    className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 transition-all"
                                >
                                    {isSaving ? <FiLoader className="animate-spin mr-2"/> : <FiPlusCircle className="mr-2"/>}
                                    {isSaving ? 'Adding...' : `Add to ${selectedMeal}`}
                                </button>
                            </div>
                        )}
                        {/* End Staging Area */}
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
