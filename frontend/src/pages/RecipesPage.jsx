// src/pages/RecipesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { mockRecipes } from '../mockData/recipes'; // Keep importing for initial default
import RecipeCard from '../components/common/RecipeCard';
import { FiBookOpen, FiPlus, FiSearch, FiFilter, FiX, FiSave, FiAlertCircle, FiTag, FiCheck } from 'react-icons/fi';

// --- RecipeFormModal Component ---
const RecipeFormModal = ({ isOpen, onClose, onSubmit }) => {
    // Basic form state - Expand later for ingredients, instructions etc.
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState(''); // Comma separated for now
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [formError, setFormError] = useState('');

    // --- REMOVED Unnecessary useMemo for muscleGroups ---
    // const muscleGroups = useMemo(() => [...new Set(mockExercises.map(ex => ex?.muscle).filter(Boolean))], []);
    // --- END REMOVAL ---

    useEffect(() => {
        if (!isOpen) { // Reset form on close
            setTitle(''); setDescription(''); setImageUrl(''); setPrepTime('');
            setCookTime(''); setServings(''); setIngredients(''); setInstructions('');
            setTags(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
            setFormError('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!title.trim()) {
            setFormError('Recipe title is required.'); return;
        }
        const newRecipeData = {
            title, description, imageUrl, prepTime, cookTime,
            servings: parseInt(servings, 10) || null,
            ingredients: ingredients.split('\n').map(line => ({ name: line.trim() })).filter(ing => ing.name),
            instructions: instructions.split('\n').filter(step => step.trim()),
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            nutrition: {
                calories: parseInt(calories, 10) || null,
                protein: parseInt(protein, 10) || null,
                carbs: parseInt(carbs, 10) || null,
                fat: parseInt(fat, 10) || null,
            }
        };
        onSubmit(newRecipeData); // Call parent save handler
        onClose(); // Close modal
    };

    if (!isOpen) return null;

    return (
        // Modal JSX (remains the same)
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-gradient-to-br from-white via-slate-50/90 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-500/10 p-6 sm:p-8 w-full max-w-3xl border border-white/20 animate-modalEnter max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200/80"> <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Add New Recipe</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div>
                 <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Form Inputs remain the same */}
                        <div className="md:col-span-2"><label htmlFor="recipe-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label><input type="text" id="recipe-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div className="md:col-span-2"><label htmlFor="recipe-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea id="recipe-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                        <div><label htmlFor="recipe-prep" className="block text-sm font-medium text-slate-700 mb-1">Prep Time</label><input type="text" id="recipe-prep" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="e.g., 15 mins" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-cook" className="block text-sm font-medium text-slate-700 mb-1">Cook Time</label><input type="text" id="recipe-cook" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g., 30 mins" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-servings" className="block text-sm font-medium text-slate-700 mb-1">Servings</label><input type="number" id="recipe-servings" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 4" min="1" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-image" className="block text-sm font-medium text-slate-700 mb-1">Image URL</label><input type="url" id="recipe-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div className="md:col-span-2"><label htmlFor="recipe-ingredients" className="block text-sm font-medium text-slate-700 mb-1">Ingredients (one per line)</label><textarea id="recipe-ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows="5" placeholder="e.g., 1 cup Flour&#10;2 large Eggs" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                        <div className="md:col-span-2"><label htmlFor="recipe-instructions" className="block text-sm font-medium text-slate-700 mb-1">Instructions (one step per line)</label><textarea id="recipe-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows="7" placeholder="1. Preheat oven...&#10;2. Mix ingredients..." className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                        <div className="md:col-span-2"><label htmlFor="recipe-tags" className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label><input type="text" id="recipe-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Quick, Healthy, Vegan" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <h4 className="text-md font-semibold text-slate-700 md:col-span-2 pt-2">Estimated Nutrition (per serving)</h4>
                        <div><label htmlFor="recipe-cal" className="block text-sm font-medium text-slate-700 mb-1">Calories (kcal)</label><input type="number" id="recipe-cal" value={calories} onChange={(e) => setCalories(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-pro" className="block text-sm font-medium text-slate-700 mb-1">Protein (g)</label><input type="number" id="recipe-pro" value={protein} onChange={(e) => setProtein(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-carb" className="block text-sm font-medium text-slate-700 mb-1">Carbs (g)</label><input type="number" id="recipe-carb" value={carbs} onChange={(e) => setCarbs(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                        <div><label htmlFor="recipe-fat" className="block text-sm font-medium text-slate-700 mb-1">Fat (g)</label><input type="number" id="recipe-fat" value={fat} onChange={(e) => setFat(e.target.value)} min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    </div>
                     {formError && <p className="mt-4 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1 h-4 w-4"/> {formError}</p>}
                     <div className="flex justify-end gap-4 pt-5"> <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button> <button type="submit" className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> <FiSave className="mr-1.5"/> Save Recipe </button> </div>
                 </form>
            </div>
        </div>
    );
};


// --- Main RecipesPage Component ---
function RecipesPage() {
    // State initialization from localStorage
    const [recipes, setRecipes] = useState(() => { try { const savedRecipes = localStorage.getItem('userRecipes'); return savedRecipes ? JSON.parse(savedRecipes) : mockRecipes; } catch (error) { console.error("Error reading recipes from localStorage", error); return mockRecipes; } });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

    // Save recipes to localStorage effect
    useEffect(() => { try { localStorage.setItem('userRecipes', JSON.stringify(recipes)); console.log("Recipes saved to localStorage"); } catch (error) { console.error("Error saving recipes to localStorage", error); } }, [recipes]);

    // Get all unique tags for filtering
    const allTags = useMemo(() => { const tagsSet = new Set(); recipes.forEach(recipe => { recipe.tags?.forEach(tag => tagsSet.add(tag)); }); return Array.from(tagsSet).sort(); }, [recipes]);

    // Toggle filter tag
    const handleFilterToggle = (tag) => { setActiveFilters(prev => { const newFilters = new Set(prev); if (newFilters.has(tag)) { newFilters.delete(tag); } else { newFilters.add(tag); } return newFilters; }); };

    // Combined filtering logic
    const filteredRecipes = useMemo(() => { const lowerSearch = searchTerm.toLowerCase(); const filters = Array.from(activeFilters); return recipes.filter(recipe => { const matchesSearch = !searchTerm.trim() || recipe.title.toLowerCase().includes(lowerSearch) || recipe.description.toLowerCase().includes(lowerSearch) || (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(lowerSearch))); if (!matchesSearch) return false; const matchesFilters = filters.length === 0 || filters.every(filterTag => recipe.tags?.some(recipeTag => recipeTag.toLowerCase() === filterTag.toLowerCase())); return matchesFilters; }); }, [recipes, searchTerm, activeFilters]);

    // Handle saving new recipe
    const handleSaveRecipe = (newRecipeData) => { const newRecipe = { ...newRecipeData, id: `recipe-${Date.now()}` }; setRecipes(prevRecipes => [newRecipe, ...prevRecipes]); console.log("New Recipe Added:", newRecipe); };

    return (
        <>
            <div className="space-y-8 sm:space-y-10 animate-fadeIn">
                {/* Page Header */}
                <div className="pb-6 border-b border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div> <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center"><FiBookOpen className="mr-3 text-emerald-600"/> Recipe Collection</h1> <p className="mt-2 text-lg text-gray-600">Find healthy and delicious meal ideas.</p> </div>
                     <button onClick={() => setIsRecipeModalOpen(true)} className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 ease-in-out transform hover:scale-105"> <FiPlus className="mr-1.5 h-5 w-5"/> Add New Recipe </button>
                </div>

                {/* Search & Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     <div className="relative md:col-span-2"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span><input type="text" placeholder="Search recipes by name, description, or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm"/></div>
                     <div className="md:col-span-1"> <label className="block text-xs font-medium text-gray-500 mb-1 text-center md:text-left">Filter by Tag:</label> <div className="flex flex-wrap gap-2 justify-center md:justify-start">{allTags.slice(0, 5).map(tag => ( <button key={tag} onClick={() => handleFilterToggle(tag)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${ activeFilters.has(tag) ? 'bg-indigo-600 text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400' }`}> {activeFilters.has(tag) && <FiCheck className="inline mr-1 -ml-1 h-3 w-3"/>} {tag} </button> ))}</div> </div>
                </div>

                {/* Recipe Grid */}
                {filteredRecipes.length > 0 ? ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"> {filteredRecipes.map(recipe => ( <RecipeCard key={recipe.id} recipe={recipe} /> ))} </div> ) : ( <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200"> <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recipes Found</h3> <p className="text-gray-500"> {searchTerm || activeFilters.size > 0 ? 'Try adjusting your search or filters.' : 'No recipes available.'} </p> </div> )}
            </div>

            {/* Render Add/Edit Modal */}
            <RecipeFormModal isOpen={isRecipeModalOpen} onClose={() => setIsRecipeModalOpen(false)} onSubmit={handleSaveRecipe} />
        </>
    );
}

export default RecipesPage;
