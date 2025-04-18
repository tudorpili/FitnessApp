// src/components/common/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiHeart, FiTag } from 'react-icons/fi'; 

function RecipeCard({ recipe }) {
  if (!recipe) return null;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x400/e0e7eb/a5b4fc?text=Recipe'; 
  };

  // Truncate description helper
  const truncate = (str, num) => {
    return str?.length > num ? str.slice(0, num) + "..." : str;
  };

  return (
    <Link
      to={`/recipes/${recipe.id}`}
     
      className="group block bg-gradient-to-br from-white/70 via-white/60 to-indigo-50/40 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl shadow-indigo-100/50 overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] border border-white/30"
    >
      {/* Image container */}
      <div className="overflow-hidden h-52 relative">
        <img
          src={recipe.imageUrl || 'https://placehold.co/600x400/e0e7eb/a5b4fc?text=Recipe'}
          alt={`Image of ${recipe.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />

         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>


      <div className="p-5 sm:p-6 flex flex-col flex-grow">

        <h3 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-indigo-700 transition-colors duration-200" title={recipe.title}>
          {recipe.title}
        </h3>


        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow"> 
            {truncate(recipe.description, 100) || 'No description available.'}
        </p>


        {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
                {recipe.tags.slice(0, 3).map(tag => ( 
                    <span key={tag} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-full flex items-center">
                         <FiTag className="mr-1 h-3 w-3"/> {tag}
                    </span>
                ))}
            </div>
        )}


        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/80 pt-4 mt-auto">
            <span className="flex items-center" title="Prep Time">
                <FiClock className="mr-1 h-3.5 w-3.5 text-amber-600"/> {recipe.prepTime || '--'}
            </span>
             <span className="flex items-center" title="Servings">
                <FiUsers className="mr-1 h-3.5 w-3.5 text-blue-600"/> Serves {recipe.servings || '--'}
            </span>
             {recipe.nutrition?.calories && (
                 <span className="flex items-center font-semibold text-emerald-700" title="Calories per serving">
                    <FiHeart className="mr-1 h-3.5 w-3.5"/> ~{recipe.nutrition.calories} kcal
                 </span>
             )}
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
