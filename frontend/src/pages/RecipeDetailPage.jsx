// src/pages/RecipeDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiClock, FiUsers, FiHeart, FiList, FiCheckCircle,
    FiTag, FiLoader, FiAlertCircle // Added Loader and Alert icons
} from 'react-icons/fi';
import { FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';
// Import the API service function
import { getRecipeById } from '../services/api';

function RecipeDetailPage() {
    const { recipeId } = useParams(); // Get recipeId from URL parameters
    const navigate = useNavigate();

    // State for the recipe data, loading status, and errors
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch recipe data
    const fetchRecipe = useCallback(async () => {
        if (!recipeId) {
            setError("No recipe ID provided.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        console.log(`Fetching recipe with ID: ${recipeId}`);
        try {
            const data = await getRecipeById(recipeId); // Call the API service

            // --- IMPORTANT: Parse JSON fields and structure data ---
            const parsedRecipe = {
                ...data,
                // Parse fields expected to be JSON arrays/objects if they are strings
                tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags || [],
                ingredients: typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients || [],
                instructions: typeof data.instructions === 'string' ? JSON.parse(data.instructions) : data.instructions || [],
                // Combine separate nutrition columns into a nested object
                nutrition: {
                    calories: data.nutrition_calories,
                    protein: data.nutrition_protein,
                    carbs: data.nutrition_carbs,
                    fat: data.nutrition_fat
                }
            };
            // --- End Parsing ---

            setRecipe(parsedRecipe);
            console.log("Recipe data fetched and parsed:", parsedRecipe);
        } catch (err) {
            console.error("Failed to fetch recipe:", err);
            setError(err.message || `Recipe with ID "${recipeId}" not found or failed to load.`);
        } finally {
            setIsLoading(false);
        }
    }, [recipeId]); // Depend on recipeId

    // useEffect to call fetchRecipe when the component mounts or recipeId changes
    useEffect(() => {
        fetchRecipe();
    }, [fetchRecipe]); // Depend on the memoized fetchRecipe function

    // --- Render Loading State ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                <span className="ml-3 text-gray-600">Loading Recipe...</span>
            </div>
        );
    }

    // --- Render Error State ---
    if (error || !recipe) {
        return (
            <div className="text-center py-20 max-w-lg mx-auto animate-fadeIn">
                 <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4"/>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Recipe Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "Sorry, we couldn't find the recipe you're looking for."}</p>
                <button onClick={() => navigate(-1)} className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                    <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </button>
                 <button onClick={fetchRecipe} className="ml-3 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    // --- Render Recipe Details ---
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite loop if placeholder fails
        e.target.src = 'https://placehold.co/1200x600/e5e7eb/9ca3af?text=Image+Not+Available';
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn space-y-8">
            {/* Back Button */}
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back to Recipes
                </button>
            </div>

            {/* Recipe Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                {/* Image */}
                <img
                    // Use image_url from the API response
                    src={recipe.image_url || 'https://placehold.co/1200x600/e5e7eb/9ca3af?text=No+Image'}
                    alt={`Image of ${recipe.title}`}
                    className="w-full h-64 sm:h-80 object-cover"
                    onError={handleImageError}
                />
                <div className="p-6 sm:p-10 space-y-6">
                    {/* Title and Description */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{recipe.title}</h1>
                        <p className="text-lg text-slate-600 leading-relaxed">{recipe.description}</p>
                    </div>

                    {/* Tags */}
                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full flex items-center">
                                    <FiTag className="mr-1 h-3 w-3"/> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick Info (Prep Time, Cook Time, Servings) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center border-y border-gray-200/80 py-4">
                        <div className="text-sm">
                            <FiClock className="mx-auto mb-1 h-5 w-5 text-amber-600"/>
                            <span className="font-semibold block text-gray-700">Prep Time</span>
                            {/* Use prep_time from API */}
                            <span className="text-gray-500">{recipe.prep_time || '--'}</span>
                        </div>
                        <div className="text-sm">
                            <FaFire className="mx-auto mb-1 h-5 w-5 text-red-500"/>
                            <span className="font-semibold block text-gray-700">Cook Time</span>
                             {/* Use cook_time from API */}
                            <span className="text-gray-500">{recipe.cook_time || '--'}</span>
                        </div>
                        <div className="text-sm col-span-2 sm:col-span-1">
                            <FiUsers className="mx-auto mb-1 h-5 w-5 text-blue-600"/>
                            <span className="font-semibold block text-gray-700">Servings</span>
                            <span className="text-gray-500">{recipe.servings || '--'}</span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center">
                            <FiList className="mr-2 text-emerald-600"/> Ingredients
                        </h2>
                        {/* Check if ingredients is an array before mapping */}
                        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                            <ul className="list-disc list-outside pl-5 space-y-1.5 text-slate-700">
                                {recipe.ingredients.map((ing, index) => (
                                    // Assuming ingredient object has 'name', 'quantity', 'unit'
                                    <li key={index}>
                                        {ing.quantity ? `${ing.quantity} ` : ''}
                                        {ing.unit ? `${ing.unit} ` : ''}
                                        {ing.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic text-sm">No ingredients listed.</p>
                        )}
                    </div>

                    {/* Instructions */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center">
                            <FiCheckCircle className="mr-2 text-purple-600"/> Instructions
                        </h2>
                         {/* Check if instructions is an array before mapping */}
                        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                            <ol className="list-decimal list-outside pl-5 space-y-3 text-slate-700 leading-relaxed">
                                {recipe.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                         ) : (
                            <p className="text-slate-500 italic text-sm">No instructions provided.</p>
                        )}
                    </div>

                    {/* Nutrition */}
                    {recipe.nutrition && (recipe.nutrition.calories || recipe.nutrition.protein || recipe.nutrition.carbs || recipe.nutrition.fat) && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center">
                                <FiHeart className="mr-2 text-red-500"/> Nutrition (per serving, approx.)
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    <span className="font-semibold block text-yellow-800">{recipe.nutrition.calories || '--'}</span>
                                    <span className="text-xs text-yellow-700">kcal</span>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                    <span className="font-semibold block text-emerald-800">{recipe.nutrition.protein || '--'}g</span>
                                    <span className="text-xs text-emerald-700">Protein</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <span className="font-semibold block text-blue-800">{recipe.nutrition.carbs || '--'}g</span>
                                    <span className="text-xs text-blue-700">Carbs</span>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                    <span className="font-semibold block text-red-800">{recipe.nutrition.fat || '--'}g</span>
                                    <span className="text-xs text-red-700">Fat</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecipeDetailPage;
