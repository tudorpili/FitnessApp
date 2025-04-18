// src/pages/RecipeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUsers, FiHeart, FiList, FiCheckCircle, FiTag } from 'react-icons/fi';
import { FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';

function RecipeDetailPage() {
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // --- END NEW ---

    useEffect(() => {
        setIsLoading(true);
        setError('');
        try {
            const allRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
            const foundRecipe = allRecipes.find(r => r.id === recipeId);

            if (foundRecipe) {
                setRecipe(foundRecipe);
            } else {
                setError(`Recipe with ID "${recipeId}" not found in local storage.`);
                console.warn(`Recipe ID ${recipeId} not found in localStorage.`);
            }
        } catch (err) {
            console.error("Error loading or parsing recipes from localStorage", err);
            setError("Could not load recipe data.");
        } finally {
            setIsLoading(false);
        }
    }, [recipeId]); // Re-run if recipeId changes


    if (isLoading) {
        return <div className="text-center py-20">Loading recipe...</div>;
    }

    if (error || !recipe) {
        return (
            <div className="text-center py-20 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Recipe Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "Sorry, we couldn't find the recipe you're looking for."}</p>
                <Link to="/recipes" className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                    <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back to Recipes
                </Link>
            </div>
        );
    }

    const handleImageError = (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/e5e7eb/9ca3af?text=Image+Not+Available'; };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn space-y-8">
            <div> <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"> <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back to Recipes </button> </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <img src={recipe.imageUrl || 'https://placehold.co/1200x600/e5e7eb/9ca3af?text=No+Image'} alt={`Image of ${recipe.title}`} className="w-full h-64 sm:h-80 object-cover" onError={handleImageError} />
                <div className="p-6 sm:p-10 space-y-6">
                    <div> <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{recipe.title}</h1> <p className="text-lg text-slate-600 leading-relaxed">{recipe.description}</p> </div>
                    {recipe.tags && recipe.tags.length > 0 && ( <div className="flex flex-wrap gap-2">{recipe.tags.map(tag => ( <span key={tag} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full flex items-center"><FiTag className="mr-1 h-3 w-3"/> {tag}</span> ))}</div> )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center border-y border-gray-200/80 py-4"> <div className="text-sm"><FiClock className="mx-auto mb-1 h-5 w-5 text-amber-600"/> <span className="font-semibold block text-gray-700">Prep Time</span> <span className="text-gray-500">{recipe.prepTime || '--'}</span></div> <div className="text-sm"><FaFire className="mx-auto mb-1 h-5 w-5 text-red-500"/> <span className="font-semibold block text-gray-700">Cook Time</span> <span className="text-gray-500">{recipe.cookTime || '--'}</span></div> <div className="text-sm col-span-2 sm:col-span-1"><FiUsers className="mx-auto mb-1 h-5 w-5 text-blue-600"/> <span className="font-semibold block text-gray-700">Servings</span> <span className="text-gray-500">{recipe.servings || '--'}</span></div> </div>
                    <div> <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center"><FiList className="mr-2 text-emerald-600"/> Ingredients</h2> <ul className="list-disc list-outside pl-5 space-y-1.5 text-slate-700">{recipe.ingredients?.map((ing, index) => ( <li key={index}> {ing.quantity} {ing.unit} {ing.name} </li> ))}</ul> </div>
                    <div> <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center"><FiCheckCircle className="mr-2 text-purple-600"/> Instructions</h2> <ol className="list-decimal list-outside pl-5 space-y-3 text-slate-700 leading-relaxed">{recipe.instructions?.map((step, index) => ( <li key={index}>{step}</li> ))} </ol> </div>
                    {recipe.nutrition && ( <div> <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center"><FiHeart className="mr-2 text-red-500"/> Nutrition (per serving, approx.)</h2> <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm"> <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><span className="font-semibold block text-yellow-800">{recipe.nutrition.calories || '--'}</span><span className="text-xs text-yellow-700">kcal</span></div> <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200"><span className="font-semibold block text-emerald-800">{recipe.nutrition.protein || '--'}g</span><span className="text-xs text-emerald-700">Protein</span></div> <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><span className="font-semibold block text-blue-800">{recipe.nutrition.carbs || '--'}g</span><span className="text-xs text-blue-700">Carbs</span></div> <div className="bg-red-50 p-3 rounded-lg border border-red-200"><span className="font-semibold block text-red-800">{recipe.nutrition.fat || '--'}g</span><span className="text-xs text-red-700">Fat</span></div> </div> </div> )}
                </div>
            </div>
        </div>
    );
}

export default RecipeDetailPage;
