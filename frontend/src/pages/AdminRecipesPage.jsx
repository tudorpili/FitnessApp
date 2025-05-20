// src/pages/AdminRecipesPage.jsx
import React, { useState, useEffect, useCallback , useMemo } from 'react';
import { FiBookOpen, FiCheckCircle, FiXCircle, FiClock, FiLoader, FiAlertCircle, FiFilter, FiEye } from 'react-icons/fi';
import { getAllRecipes, adminUpdateRecipeStatus } from '../services/api';
import { Link } from 'react-router-dom'; // For linking to recipe detail page

const AdminRecipeCard = ({ recipe, onUpdateStatus }) => {
    const getStatusColor = (status) => {
        if (status === 'approved') return 'bg-green-100 text-green-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate" title={recipe.title}>
                        {recipe.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(recipe.status)}`}>
                        {recipe.status}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                    By: <span className="font-medium text-indigo-600">{recipe.creator_username || 'Unknown User'}</span>
                </p>
                <p className="text-xs text-gray-500 mb-3">
                    Submitted: {new Date(recipe.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                    {recipe.description || 'No description.'}
                </p>

                <div className="flex items-center text-xs text-gray-500 space-x-3 mb-4">
                    <span className="flex items-center"><FiClock className="mr-1"/> Prep: {recipe.prep_time || '--'}</span>
                    <span className="flex items-center"><FiClock className="mr-1"/> Cook: {recipe.cook_time || '--'}</span>
                </div>
                
                {recipe.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => onUpdateStatus(recipe.id, 'approved')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <FiCheckCircle className="mr-1.5"/> Approve
                        </button>
                        <button
                            onClick={() => onUpdateStatus(recipe.id, 'rejected')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            <FiXCircle className="mr-1.5"/> Reject
                        </button>
                    </div>
                )}
                 <div className="mt-2 pt-2 border-t border-gray-100">
                     <Link 
                        to={`/recipes/${recipe.id}`} // Assuming you have a route like this
                        target="_blank" // Open in new tab to not lose admin page context
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1"
                    >
                        <FiEye className="mr-1"/> View Full Recipe
                    </Link>
                </div>
            </div>
        </div>
    );
};

function AdminRecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

    const fetchAdminRecipes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // The backend's getAllRecipes will return all recipes for an admin
            const data = await getAllRecipes(); 
            setRecipes(data || []);
        } catch (err) {
            setError(err.message || "Failed to load recipes for admin.");
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminRecipes();
    }, [fetchAdminRecipes]);

    const handleUpdateStatus = async (recipeId, newStatus) => {
        // Optimistic update can be added here later if desired
        try {
            await adminUpdateRecipeStatus(recipeId, newStatus);
            // Refresh the list to show the change
            fetchAdminRecipes(); 
            alert(`Recipe ${recipeId} status updated to ${newStatus}.`);
        } catch (err) {
            alert(`Failed to update recipe status: ${err.message}`);
            // Optionally, revert optimistic update here
        }
    };

    const filteredRecipes = useMemo(() => {
        if (filterStatus === 'all') {
            return recipes;
        }
        return recipes.filter(recipe => recipe.status === filterStatus);
    }, [recipes, filterStatus]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <FiBookOpen className="mr-3 text-slate-700"/> Recipe Management
                    </h1>
                    <p className="mt-1 text-md text-gray-600">
                        Approve, reject, or view submitted recipes. ({filteredRecipes.length} showing)
                    </p>
                </div>
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500"/>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <span className="ml-3 text-gray-600">Loading Recipes...</span>
                </div>
            )}
            {error && !isLoading && (
                <div className="text-center py-10 px-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {error}</p>
                    <button onClick={fetchAdminRecipes} className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Retry</button>
                </div>
            )}

            {!isLoading && !error && filteredRecipes.length === 0 && (
                <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recipes Found</h3>
                    <p className="text-gray-500">
                        {filterStatus === 'all' ? 'There are no recipes in the system yet.' : `No recipes found with status "${filterStatus}".`}
                    </p>
                </div>
            )}

            {!isLoading && !error && filteredRecipes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map(recipe => (
                        <AdminRecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminRecipesPage;
