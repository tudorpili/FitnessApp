// src/pages/RecipesPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
// Removed: import { mockRecipes } from '../mockData/recipes'; // No longer using mock
import RecipeCard from '../components/common/RecipeCard';
import {
    FiBookOpen, FiPlus, FiSearch, FiFilter, FiX, FiSave, FiAlertCircle,
    FiTag, FiCheck, FiLoader // Added FiLoader
} from 'react-icons/fi';
// Import API service functions
import { getAllRecipes, createRecipe } from '../services/api';

// --- RecipeFormModal Component ---
// (This component remains largely the same, but the onSubmit prop will now trigger an API call)
const RecipeFormModal = ({ isOpen, onClose, onSubmit }) => {
    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredientsInput, setIngredientsInput] = useState(''); // Use single textarea input
    const [instructionsInput, setInstructionsInput] = useState(''); // Use single textarea input
    const [tagsInput, setTagsInput] = useState(''); // Use single input for tags
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // State for submission loading

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTitle(''); setDescription(''); setImageUrl(''); setPrepTime('');
            setCookTime(''); setServings(''); setIngredientsInput(''); setInstructionsInput('');
            setTagsInput(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
            setFormError(''); setIsSubmitting(false);
        }
    }, [isOpen]);

    // Handle form submission
    const handleSubmit = async (e) => { // Make async
        e.preventDefault();
        setFormError('');
        if (!title.trim()) {
            setFormError('Recipe title is required.'); return;
        }

        setIsSubmitting(true); // Start loading

        // Prepare data for the API
        const newRecipeData = {
            title: title.trim(),
            description: description.trim(),
            image_url: imageUrl.trim() || null, // Use image_url to match DB
            prep_time: prepTime.trim() || null, // Use prep_time
            cook_time: cookTime.trim() || null, // Use cook_time
            servings: parseInt(servings, 10) || null,
            // Parse ingredients/instructions/tags for JSON columns
            ingredients: ingredientsInput.split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .map(name => ({ name })), // Simple structure for now, adjust if needed
            instructions: instructionsInput.split('\n')
                .map(step => step.trim())
                .filter(step => step),
            tags: tagsInput.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag),
            // Nutrition fields - ensure they match DB column names
            nutrition_calories: parseInt(calories, 10) || null,
            nutrition_protein: parseInt(protein, 10) || null,
            nutrition_carbs: parseInt(carbs, 10) || null,
            nutrition_fat: parseInt(fat, 10) || null,
            // user_id will be handled by the backend based on the token
        };

        try {
            // Call the onSubmit prop (which will be handleSaveRecipe calling the API)
            await onSubmit(newRecipeData);
            onClose(); // Close modal on success
        } catch (error) {
            // Display error from API call
            console.error("Error submitting recipe:", error);
            setFormError(error.message || "Failed to save recipe. Please try again.");
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    if (!isOpen) return null;

    // --- Modal JSX (Mostly unchanged, ensure input IDs/names are clear) ---
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-gradient-to-br from-white via-slate-50/90 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-500/10 p-6 sm:p-8 w-full max-w-3xl border border-white/20 animate-modalEnter max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200/80">
                    <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Add New Recipe</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button>
                 </div>
                 <form onSubmit={handleSubmit} className="space-y-5">
                     {/* Input fields using state variables like title, description, etc. */}
                     {/* Example for Ingredients */}
                     <div className="md:col-span-2">
                        <label htmlFor="recipe-ingredients" className="block text-sm font-medium text-slate-700 mb-1">Ingredients (one per line)</label>
                        <textarea id="recipe-ingredients" value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} rows="5" placeholder="e.g., 1 cup Flour&#10;2 large Eggs" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                     </div>
                     {/* Example for Instructions */}
                      <div className="md:col-span-2">
                        <label htmlFor="recipe-instructions" className="block text-sm font-medium text-slate-700 mb-1">Instructions (one step per line)</label>
                        <textarea id="recipe-instructions" value={instructionsInput} onChange={(e) => setInstructionsInput(e.target.value)} rows="7" placeholder="1. Preheat oven...&#10;2. Mix ingredients..." className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                     </div>
                     {/* Example for Tags */}
                      <div className="md:col-span-2">
                        <label htmlFor="recipe-tags" className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                        <input type="text" id="recipe-tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g., Quick, Healthy, Vegan" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                      </div>

                     {/* Other fields: title, description, imageUrl, prepTime, cookTime, servings, calories, protein, carbs, fat */}
                     {/* ... add the rest of the input fields similar to your previous code ... */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="md:col-span-2"><label htmlFor="recipe-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label><input type="text" id="recipe-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div className="md:col-span-2"><label htmlFor="recipe-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea id="recipe-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                        <div><label htmlFor="recipe-prep" className="block text-sm font-medium text-slate-700 mb-1">Prep Time</label><input type="text" id="recipe-prep" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="e.g., 15 mins" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-cook" className="block text-sm font-medium text-slate-700 mb-1">Cook Time</label><input type="text" id="recipe-cook" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g., 30 mins" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-servings" className="block text-sm font-medium text-slate-700 mb-1">Servings</label><input type="number" id="recipe-servings" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 4" min="1" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-image" className="block text-sm font-medium text-slate-700 mb-1">Image URL</label><input type="url" id="recipe-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>

                        <h4 className="text-md font-semibold text-slate-700 md:col-span-2 pt-2">Estimated Nutrition (per serving)</h4>
                        <div><label htmlFor="recipe-cal" className="block text-sm font-medium text-slate-700 mb-1">Calories (kcal)</label><input type="number" id="recipe-cal" value={calories} onChange={(e) => setCalories(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-pro" className="block text-sm font-medium text-slate-700 mb-1">Protein (g)</label><input type="number" id="recipe-pro" value={protein} onChange={(e) => setProtein(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-carb" className="block text-sm font-medium text-slate-700 mb-1">Carbs (g)</label><input type="number" id="recipe-carb" value={carbs} onChange={(e) => setCarbs(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-fat" className="block text-sm font-medium text-slate-700 mb-1">Fat (g)</label><input type="number" id="recipe-fat" value={fat} onChange={(e) => setFat(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    </div>

                     {/* Error and Submit Buttons */}
                     {formError && <p className="mt-4 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1 h-4 w-4"/> {formError}</p>}
                     <div className="flex justify-end gap-4 pt-5">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60">
                            {isSubmitting ? <FiLoader className="animate-spin mr-1.5"/> : <FiSave className="mr-1.5"/>}
                            {isSubmitting ? 'Saving...' : 'Save Recipe'}
                        </button>
                     </div>
                 </form>
            </div>
        </div>
    );
};


// --- RecipesPage Component ---
function RecipesPage() {
    // State for recipes, loading, error, search, filter, modal
    const [recipes, setRecipes] = useState([]); // Start with empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

    // --- Fetch Recipes Function ---
    const fetchRecipes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching recipes...");
        try {
            const data = await getAllRecipes();
            // --- IMPORTANT: Parse JSON fields if they come as strings ---
            const parsedData = data.map(recipe => ({
                ...recipe,
                tags: typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags || [],
                ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients || [],
                instructions: typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions || [],
                // Nutrition fields are separate columns, no parsing needed here
                // Combine nutrition fields into a nested object for the RecipeCard if needed
                nutrition: {
                    calories: recipe.nutrition_calories,
                    protein: recipe.nutrition_protein,
                    carbs: recipe.nutrition_carbs,
                    fat: recipe.nutrition_fat
                }
            }));
            setRecipes(parsedData);
            console.log("Recipes fetched and parsed:", parsedData);
        } catch (err) {
            console.error("Failed to fetch recipes:", err);
            setError(err.message || 'Failed to load recipes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies, fetch function is stable

    // --- useEffect to Fetch on Mount ---
    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]); // Depend on the fetch function

    // --- Memoized calculations for tags and filtering ---
    const allTags = useMemo(() => {
        const tagsSet = new Set();
        recipes.forEach(recipe => {
            if (Array.isArray(recipe.tags)) { // Check if tags is an array
                 recipe.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet).sort();
    }, [recipes]);

    const handleFilterToggle = (tag) => {
        setActiveFilters(prev => {
            const newFilters = new Set(prev);
            if (newFilters.has(tag)) { newFilters.delete(tag); } else { newFilters.add(tag); }
            return newFilters;
        });
    };

    const filteredRecipes = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filters = Array.from(activeFilters);
        return recipes.filter(recipe => {
            const matchesSearch = !searchTerm.trim() ||
                recipe.title?.toLowerCase().includes(lowerSearch) ||
                recipe.description?.toLowerCase().includes(lowerSearch) ||
                (Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(lowerSearch)));

            if (!matchesSearch) return false;

            const matchesFilters = filters.length === 0 ||
                filters.every(filterTag =>
                    Array.isArray(recipe.tags) && recipe.tags.some(recipeTag => recipeTag.toLowerCase() === filterTag.toLowerCase())
                );

            return matchesFilters;
        });
    }, [recipes, searchTerm, activeFilters]);

    // --- Handle Saving New Recipe (API Call) ---
    const handleSaveRecipe = async (newRecipeData) => {
        console.log("Attempting to save new recipe:", newRecipeData);
        // The actual API call happens in the modal's handleSubmit now
        // We just need to refresh the list on success
        try {
            const savedRecipe = await createRecipe(newRecipeData); // API call
            console.log("Recipe saved successfully via API:", savedRecipe);
            // Refresh the list by re-fetching all recipes
            fetchRecipes(); // Re-fetch to get the latest list including the new one
            // Or, for better UX, optimistically add the returned recipe to state:
            // setRecipes(prev => [savedRecipe, ...prev]); // Requires savedRecipe to be in correct format
        } catch (error) {
            console.error("Failed to save recipe via API:", error);
            // Re-throw the error so the modal can display it
            throw error;
        }
    };

    // --- Render Logic ---
    return (
        <>
            <div className="space-y-8 sm:space-y-10 animate-fadeIn">
                {/* Header and Add Button */}
                <div className="pb-6 border-b border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            <FiBookOpen className="mr-3 text-emerald-600"/> Recipe Collection
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">Find healthy and delicious meal ideas.</p>
                     </div>
                     <button onClick={() => setIsRecipeModalOpen(true)} className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 ease-in-out transform hover:scale-105">
                        <FiPlus className="mr-1.5 h-5 w-5"/> Add New Recipe
                     </button>
                </div>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span>
                        <input type="text" placeholder="Search recipes by name, description, or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm"/>
                     </div>
                     <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1 text-center md:text-left">Filter by Tag:</label>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {allTags.slice(0, 5).map(tag => (
                                <button key={tag} onClick={() => handleFilterToggle(tag)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${ activeFilters.has(tag) ? 'bg-indigo-600 text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400' }`}>
                                    {activeFilters.has(tag) && <FiCheck className="inline mr-1 -ml-1 h-3 w-3"/>} {tag}
                                </button>
                            ))}
                        </div>
                     </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                        <span className="ml-3 text-gray-600">Loading Recipes...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                     <div className="text-center py-12 px-6 bg-red-50 backdrop-blur-md rounded-2xl shadow-lg border border-red-200/50">
                        <FiAlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3"/>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Failed to Load Recipes</h3>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button onClick={fetchRecipes} className="px-4 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition">Try Again</button>
                    </div>
                )}

                {/* Recipe Grid or No Results Message */}
                {!isLoading && !error && (
                    <>
                        {filteredRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                                {filteredRecipes.map(recipe => (
                                    // Pass the parsed recipe object to RecipeCard
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recipes Found</h3>
                                <p className="text-gray-500">
                                    {searchTerm || activeFilters.size > 0 ? 'Try adjusting your search or filters.' : 'No recipes available. Add one!'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal for Adding Recipes */}
            <RecipeFormModal
                isOpen={isRecipeModalOpen}
                onClose={() => setIsRecipeModalOpen(false)}
                onSubmit={handleSaveRecipe} // Pass the handler that calls the API
            />
        </>
    );
}

export default RecipesPage;
