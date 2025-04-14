// src/pages/LogMealPage.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { mockFoods, calculateMacros } from '../mockData/foods'; // Import mock data
import { FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiActivity } from 'react-icons/fi'; // Added FiActivity for summary icon
import { FaAppleAlt, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa'; // Example icons for macros

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Meal types with emojis
const mealTypes = [
    { name: 'Breakfast', emoji: '🍳' },
    { name: 'Lunch', emoji: '🥪' },
    { name: 'Dinner', emoji: '🍝' },
    { name: 'Snack', emoji: '🍎' }
];

// -- Reusable Components --
const MealSectionCard = ({ title, children, className = '', icon }) => (
  <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight flex items-center">
        {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

const LoggedItemCard = ({ item, onRemove }) => (
    <li
        key={item.logId}
        className="flex justify-between items-center bg-gray-50/80 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-200 ease-in-out"
    >
        <div className="flex-1 mr-4">
            <p className="text-md font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-600 mt-1">
                {item.quantity}{item.unit} |
                <span className="font-medium text-yellow-600"> ~{item.calories} kcal</span> |
                <span className="font-medium text-emerald-600"> P:{item.protein}g</span> |
                <span className="font-medium text-blue-600"> C:{item.carbs}g</span> |
                <span className="font-medium text-red-600"> F:{item.fat}g</span>
            </p>
        </div>
         <button
            onClick={() => onRemove(item.logId)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0"
            title={`Remove ${item.name}`}
            aria-label={`Remove ${item.name}`}
        >
            <FiTrash2 className="h-4 w-4"/>
        </button>
    </li>
);
// ------------------------

function LogMealPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState('');
    const [sessionLoggedItems, setSessionLoggedItems] = useState([]); // Holds ALL items logged in session
    const loggedItemsListRef = useRef(null);

    // Filter mock foods based on search term
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return mockFoods.filter(food =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    // Filter session items for the currently selected date and meal
    const currentMealItems = useMemo(() => {
        return sessionLoggedItems.filter(item =>
            item.date === selectedDate && item.meal === selectedMeal
        );
    }, [sessionLoggedItems, selectedDate, selectedMeal]);

    // --- NEW: Calculate Daily Totals ---
    const dailyTotals = useMemo(() => {
        // Filter items only by the selected date
        const itemsForDay = sessionLoggedItems.filter(item => item.date === selectedDate);
        // Sum up the macros
        return itemsForDay.reduce((totals, item) => {
            totals.calories += item.calories || 0;
            totals.protein += item.protein || 0;
            totals.carbs += item.carbs || 0;
            totals.fat += item.fat || 0;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [sessionLoggedItems, selectedDate]); // Recalculate when items or date change
    // --- END NEW ---

    // Function to add a food item
    const handleAddFood = (food) => {
        const quantityG = food.defaultServingG || 100;
        const macros = calculateMacros(food, quantityG);
        const newItem = {
            logId: `${Date.now()}-${food.id}`, foodId: food.id, name: food.name,
            quantity: quantityG, unit: food.unitName || 'g', calories: macros.calories,
            protein: macros.protein, carbs: macros.carbs, fat: macros.fat,
            meal: selectedMeal, date: selectedDate,
        };
        setSessionLoggedItems(prevItems => [...prevItems, newItem]);
        setSearchTerm('');
    };

    // Function to remove an item
     const handleRemoveItem = (logIdToRemove) => {
        setSessionLoggedItems(prevItems =>
            prevItems.filter(item => item.logId !== logIdToRemove)
        );
    };

    // Calculate totals for the current meal shown
    const currentMealTotals = useMemo(() => {
        return currentMealItems.reduce((totals, item) => {
            totals.calories += item.calories || 0;
            totals.protein += item.protein || 0;
            totals.carbs += item.carbs || 0;
            totals.fat += item.fat || 0;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [currentMealItems]);

    // Auto-scroll effect
     useEffect(() => {
        if (loggedItemsListRef.current) {
            loggedItemsListRef.current.scrollTop = loggedItemsListRef.current.scrollHeight;
        }
     }, [currentMealItems]); // Scroll when items for the *current* meal change

    return (
        <div className="space-y-8 sm:space-y-10 font-sans max-w-screen-xl mx-auto">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Log Your Meal
                </h1>
                {/* Date Selection moved here */}
                <div className="flex items-center gap-2 mt-4">
                     <label htmlFor="log-date" className="flex items-center text-sm font-medium text-gray-700">
                        <FiCalendar className="mr-1.5 h-4 w-4 text-gray-500"/> Logging for:
                     </label>
                    <input
                        type="date"
                        id="log-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                </div>
            </div>

             {/* Meal Type Selection - Segmented Control Style */}
            <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
                <div className="bg-gray-100 p-1.5 rounded-full flex flex-wrap gap-1 justify-center sm:justify-start">
                    {mealTypes.map(meal => (
                        <button
                            key={meal.name}
                            onClick={() => setSelectedMeal(meal.name)}
                            className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out flex-1 justify-center sm:flex-initial ${
                                selectedMeal === meal.name
                                ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-md scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="mr-1.5 text-lg">{meal.emoji}</span> {meal.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- NEW: Daily Summary Card --- */}
            <MealSectionCard title={`Totals for ${selectedDate}`} icon={<FiActivity />}>
                {sessionLoggedItems.filter(i=>i.date === selectedDate).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-yellow-700 uppercase">Calories</p>
                            <p className="text-xl font-bold text-yellow-900">{dailyTotals.calories}</p>
                            <p className="text-xs text-yellow-600">kcal</p>
                        </div>
                         <div className="bg-emerald-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-emerald-700 uppercase">Protein</p>
                            <p className="text-xl font-bold text-emerald-900">{dailyTotals.protein.toFixed(1)}</p>
                             <p className="text-xs text-emerald-600">g</p>
                        </div>
                         <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-blue-700 uppercase">Carbs</p>
                            <p className="text-xl font-bold text-blue-900">{dailyTotals.carbs.toFixed(1)}</p>
                             <p className="text-xs text-blue-600">g</p>
                        </div>
                         <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-red-700 uppercase">Fat</p>
                            <p className="text-xl font-bold text-red-900">{dailyTotals.fat.toFixed(1)}</p>
                             <p className="text-xs text-red-600">g</p>
                        </div>
                    </div>
                ) : (
                     <p className="text-sm text-gray-500 italic text-center py-4">Log your first item for today to see totals.</p>
                )}
            </MealSectionCard>
            {/* --- END NEW --- */}


            {/* Main Content Grid - 2 Columns on Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

                {/* Left Column: Search and Add */}
                <MealSectionCard title={`Add Food to ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji} className="lg:sticky lg:top-6"> {/* Made search sticky */}
                     {/* Search Input */}
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"> <FiSearch /> </span>
                        <input
                            type="text" placeholder={`e.g. chicken breast, apple...`} value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md"
                        />
                     </div>

                     {/* Search Results */}
                     {searchTerm && (
                        <div className="mt-4 border border-gray-200 rounded-xl max-h-72 overflow-y-auto bg-white shadow-inner">
                             <h3 className="text-xs font-semibold uppercase text-gray-500 p-3 border-b border-gray-200 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">Search Results</h3>
                            {searchResults.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {searchResults.map(food => (
                                        <li key={food.id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition duration-150">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{food.name}</p>
                                                <p className="text-xs text-gray-500">~{calculateMacros(food, 100).calories} kcal / 100g</p>
                                            </div>
                                            <button onClick={() => handleAddFood(food)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150" title={`Add ${food.name}`} aria-label={`Add ${food.name}`}><FiPlusCircle className="h-5 w-5"/></button>
                                        </li>
                                    ))}
                                </ul>
                            ) : ( <p className="p-5 text-sm text-gray-500 text-center italic">No food found.</p> )}
                        </div>
                     )}
                </MealSectionCard>

                {/* Right Column: Logged Items */}
                <MealSectionCard title={`Logged in ${selectedMeal}`} icon={mealTypes.find(m => m.name === selectedMeal)?.emoji}>
                     {currentMealItems.length > 0 ? (
                        <>
                            <ul ref={loggedItemsListRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {currentMealItems.map(item => (
                                    <LoggedItemCard key={item.logId} item={item} onRemove={handleRemoveItem} />
                                ))}
                            </ul>
                            {/* Meal Totals */}
                            <div className="pt-5 border-t border-gray-200 mt-5 text-sm font-semibold text-gray-800 space-y-1">
                                <p className="text-base">Total for {selectedMeal}:</p>
                                <p><span className="text-yellow-600">~{currentMealTotals.calories} kcal</span></p>
                                <p><span className="text-emerald-600">Protein: {currentMealTotals.protein.toFixed(1)}g</span></p>
                                <p><span className="text-blue-600">Carbs: {currentMealTotals.carbs.toFixed(1)}g</span></p>
                                <p><span className="text-red-600">Fat: {currentMealTotals.fat.toFixed(1)}g</span></p>
                            </div>
                        </>
                     ) : ( <p className="text-sm text-gray-500 italic text-center py-8">No items logged for {selectedMeal} yet.</p> )}
                 </MealSectionCard>

            </div> {/* End Main Content Grid */}

        </div> // End Page Container
    );
}

export default LogMealPage;
