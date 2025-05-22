// frontend/src/pages/WorkoutPlansPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    FiPlus, FiSearch, FiTrash2, FiX, FiSave, FiClipboard, FiEdit, FiEye,
    FiList, FiPlusCircle, FiLoader, FiAlertCircle, FiCheck, FiHash, FiUser,
    FiArchive, FiThumbsUp, FiFilter, FiCalendar, FiHeart // Added ThumbsUp, Filter, Calendar, Heart
} from 'react-icons/fi';
import {
    getAllWorkoutPlans, createWorkoutPlan, deleteWorkoutPlan, updateWorkoutPlan,
    getAllExercises, // Need this for the form
    likeWorkoutPlan, unlikeWorkoutPlan // New API functions
} from '../services/api';
import WorkoutPlanDetailModal from '../components/common/WorkoutPlanDetailModal';

// Enhanced InfoCard for a more modern look, especially for the form container
const InfoCard = ({ title, children, className = '', icon }) => (
    <div className={`bg-gradient-to-br from-white/80 via-slate-50/70 to-indigo-50/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-indigo-200/30 overflow-hidden ${className}`}>
        {title && (
            <h2 className="text-2xl font-bold text-slate-800 p-6 pb-5 border-b border-slate-200/80 flex items-center tracking-tight">
                {icon && <span className="mr-3 text-indigo-600 opacity-80 text-3xl">{icon}</span>}
                {title}
            </h2>
        )}
        <div className={title ? "p-6 sm:p-8" : ""}>{children}</div>
    </div>
);

const PlanCard = ({ plan, onOpenViewModal, onOpenEditForm, onDeletePlan, currentUser, onLikeUnlike, isLiking }) => {
    const handleLikeUnlike = (e) => {
        e.stopPropagation(); // Prevent card click if like button is clicked
        onLikeUnlike(plan.id, plan.user_has_liked);
    };
    return (
        <div className="bg-gradient-to-br from-white via-slate-50/90 to-purple-50/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-purple-200/60 border border-white/40 p-6 flex flex-col justify-between transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors" title={plan.name}>
                        {plan.name}
                    </h3>
                    {plan.status !== 'approved' && (
                         <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                            plan.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            plan.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600'
                         }`}>
                            {plan.status}
                         </span>
                    )}
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                    <FiUser className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                    Created by: <span className="font-medium ml-1 text-purple-700">{plan.creator_username || 'Unknown'}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 h-16 leading-relaxed">
                    {plan.description || 'No description provided for this plan.'}
                </p>
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center"><FiList className="mr-1.5 text-purple-500"/>Exercises ({plan.exercises?.length || 0})</h4>
                    {plan.exercises && plan.exercises.length > 0 ? (
                        <ul className="space-y-1 max-h-20 overflow-y-auto text-xs text-slate-700 pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {plan.exercises.slice(0, 3).map(ex => (
                                <li key={ex.exerciseId || ex.name} className="truncate flex items-center">
                                    <FiCheck className="mr-1.5 h-3 w-3 text-purple-400 flex-shrink-0"/>
                                    {ex.name} {ex.targetSets ? <span className="ml-1 text-purple-600 font-medium">({ex.targetSets} sets)</span> : ''}
                                </li>
                            ))}
                            {plan.exercises.length > 3 && <li className="text-purple-500 italic">...and more</li>}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No exercises in this plan.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-auto border-t border-slate-200/70 pt-4 items-center">
                <button
                    onClick={() => onOpenViewModal(plan)}
                    className="flex-1 flex items-center justify-center text-sm py-2 px-4 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-150 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
                >
                    <FiEye className="mr-1.5"/> View
                </button>
                {currentUser && (plan.status === 'approved' || plan.user_id === currentUser.id) && ( // Allow liking only for approved or own plans
                     <button
                        onClick={handleLikeUnlike}
                        disabled={isLiking}
                        className={`flex items-center justify-center gap-1.5 text-sm py-2 px-3 rounded-lg border transition-colors duration-150 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            plan.user_has_liked
                            ? 'bg-pink-500 text-white border-transparent hover:bg-pink-600 focus:ring-pink-400'
                            : 'bg-white text-pink-600 border-pink-300 hover:bg-pink-50 focus:ring-pink-300'
                        }`}
                        title={plan.user_has_liked ? "Unlike Plan" : "Like Plan"}
                    >
                        {isLiking ? <FiLoader className="animate-spin h-4 w-4"/> : <FiHeart className={`h-4 w-4 ${plan.user_has_liked ? 'fill-current' : ''}`}/>}
                        <span>{plan.likes_count || 0}</span>
                    </button>
                )}
                {currentUser && currentUser.id === plan.user_id && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onOpenEditForm(plan);}}
                            className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors duration-150 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1" title="Edit Plan"
                        >
                            <FiEdit size={16}/>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeletePlan(plan.id);}}
                            className="p-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-150 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1" title="Delete Plan"
                        >
                            <FiTrash2 size={16}/>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


function WorkoutPlansPage() {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [fetchPlansError, setFetchPlansError] = useState(null);
    const [allExercises, setAllExercises] = useState([]);
    const [exerciseLoadError, setExerciseLoadError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [viewingPlan, setViewingPlan] = useState(null);
    const [planName, setPlanName] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    const [planExercises, setPlanExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // For exercise search in form
    const [formError, setFormError] = useState('');
    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [savePlanSuccess, setSavePlanSuccess] = useState(false);

    const [filterSearchTerm, setFilterSearchTerm] = useState(''); // For filtering displayed plans
    const [sortBy, setSortBy] = useState('created_at'); // 'created_at', 'name', 'likes_count'
    const [sortOrder, setSortOrder] = useState('DESC'); // 'ASC', 'DESC'
    const [likingStates, setLikingStates] = useState({}); // Store loading state for each like button { planId: boolean }


    const fetchPlans = useCallback(async () => {
        setIsLoadingPlans(true);
        setFetchPlansError(null);
        try {
            // Pass sort parameters to API
            const data = await getAllWorkoutPlans(sortBy, sortOrder);
            // Backend now handles filtering by status for non-admins and includes like info
            setPlans(data || []);
        } catch (error) {
            setFetchPlansError(error.message || "Could not load workout plans.");
            setPlans([]);
        } finally {
            setIsLoadingPlans(false);
        }
    }, [sortBy, sortOrder]); // Re-fetch when sort changes

    const fetchAllExercisesForForm = useCallback(async () => {
        setExerciseLoadError(null);
        try {
            const data = await getAllExercises();
            setAllExercises(data || []);
        } catch (error) {
            setExerciseLoadError("Could not load exercises. Search disabled.");
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]); // Initial fetch and on sort change

    useEffect(() => { // Fetch exercises only when form is about to open
        if (isFormOpen && allExercises.length === 0 && !exerciseLoadError) {
            fetchAllExercisesForForm();
        }
    }, [isFormOpen, allExercises.length, fetchAllExercisesForForm, exerciseLoadError]);


    const searchResultsForForm = useMemo(() => {
        if (!searchTerm.trim() || allExercises.length === 0) return [];
        const addedIds = new Set(planExercises.map(ex => ex.exerciseId));
        return allExercises
            .filter(ex => !addedIds.has(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8);
    }, [searchTerm, planExercises, allExercises]);

    const filteredAndSortedPlans = useMemo(() => {
        let displayablePlans = [...plans];
        if (filterSearchTerm.trim()) {
            const lowerSearch = filterSearchTerm.toLowerCase();
            displayablePlans = displayablePlans.filter(plan =>
                plan.name.toLowerCase().includes(lowerSearch) ||
                plan.description?.toLowerCase().includes(lowerSearch) ||
                plan.creator_username?.toLowerCase().includes(lowerSearch)
            );
        }
        // Sorting is now handled by the backend, but frontend could re-sort if needed after filtering
        return displayablePlans;
    }, [plans, filterSearchTerm]);


    const resetFormState = () => { setPlanName(''); setPlanDescription(''); setPlanExercises([]); setSearchTerm(''); setFormError(''); setIsSavingPlan(false); setSavePlanSuccess(false); setEditingPlan(null); };
    const handleOpenCreateForm = () => { resetFormState(); setIsFormOpen(true); };
    const handleOpenEditForm = (planToEdit) => { setEditingPlan(planToEdit); setPlanName(planToEdit.name || ''); setPlanDescription(planToEdit.description || ''); setPlanExercises(planToEdit.exercises?.map(ex => ({ exerciseId: ex.exerciseId, name: ex.name, targetSets: ex.targetSets || '' })) || []); setSearchTerm(''); setFormError(''); setSavePlanSuccess(false); setIsFormOpen(true); };
    const handleCloseForm = () => { setIsFormOpen(false); resetFormState(); };
    const handleAddExerciseToPlan = (exercise) => { if (!planExercises.some(ex => ex.exerciseId === exercise.id)) { setPlanExercises(prev => [...prev, { exerciseId: exercise.id, name: exercise.name, targetSets: '' }]); } setSearchTerm(''); };
    const handleTargetSetsChange = (exerciseId, value) => { const setsValue = value.trim() === '' ? '' : parseInt(value, 10); if (value.trim() === '' || (!isNaN(setsValue) && setsValue > 0)) { setPlanExercises(prev => prev.map(ex => ex.exerciseId === exerciseId ? { ...ex, targetSets: value.trim() === '' ? '' : setsValue } : ex)); } else if (!isNaN(setsValue) && setsValue <= 0) { setPlanExercises(prev => prev.map(ex => ex.exerciseId === exerciseId ? { ...ex, targetSets: '' } : ex )); }};
    const handleRemoveExerciseFromPlan = (exerciseIdToRemove) => { setPlanExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseIdToRemove)); };

    const handleSaveOrUpdatePlan = async () => {
        setFormError(''); setSavePlanSuccess(false);
        if (!planName.trim()) { setFormError('Plan name is required.'); return; }
        // if (planExercises.length === 0) { setFormError('Please add at least one exercise.'); return; } // Allow empty for now
        setIsSavingPlan(true);
        const planPayload = {
            name: planName.trim(),
            description: planDescription.trim() || null,
            exercises: planExercises.map(ex => ({
                exerciseId: ex.exerciseId,
                targetSets: ex.targetSets === '' || ex.targetSets === null ? null : parseInt(ex.targetSets, 10)
            }))
        };
        try {
            if (editingPlan) {
                await updateWorkoutPlan(editingPlan.id, planPayload);
            } else {
                await createWorkoutPlan(planPayload);
            }
            setSavePlanSuccess(true);
            fetchPlans(); // Re-fetch plans
            handleCloseForm();
            alert(`Plan ${editingPlan ? 'updated' : 'created'} successfully! It is now pending admin approval.`);
            setTimeout(() => setSavePlanSuccess(false), 3000);
        } catch (error) {
            setFormError(error.message || `An error occurred while ${editingPlan ? 'updating' : 'saving'} the plan.`);
        } finally {
            setIsSavingPlan(false);
        }
    };

    const handleDeletePlan = async (planIdToDelete) => {
        if (!window.confirm("Are you sure you want to delete this workout plan? This action cannot be undone.")) return;
        try {
            await deleteWorkoutPlan(planIdToDelete);
            fetchPlans(); // Re-fetch plans
            alert("Plan deleted successfully.");
        } catch (error) {
            alert(`Error deleting plan: ${error.message}`);
        }
    };

    const handleLikeUnlikePlan = async (planId, currentlyLiked) => {
        if (!user) {
            alert("Please log in to like plans.");
            return;
        }
        setLikingStates(prev => ({ ...prev, [planId]: true }));
        try {
            const updatedPlan = currentlyLiked
                ? await unlikeWorkoutPlan(planId)
                : await likeWorkoutPlan(planId);

            // Update the specific plan in the local state
            setPlans(prevPlans => prevPlans.map(p =>
                p.id === planId
                ? { ...p, likes_count: updatedPlan.plan.likes_count, user_has_liked: updatedPlan.plan.user_has_liked }
                : p
            ));
        } catch (error) {
            console.error("Error liking/unliking plan:", error);
            alert(`Failed to ${currentlyLiked ? 'unlike' : 'like'} plan: ${error.message}`);
        } finally {
            setLikingStates(prev => ({ ...prev, [planId]: false }));
        }
    };


    const handleOpenViewModal = (planToView) => { setViewingPlan(planToView); setIsViewing(true); };
    const handleCloseViewModal = () => { setIsViewing(false); setViewingPlan(null); };

    const formTitle = editingPlan ? "Edit Workout Plan" : "Create New Workout Plan";
    const formIcon = editingPlan ? <FiEdit /> : <FiPlusCircle />;

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(prevOrder => prevOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(newSortBy);
            setSortOrder('DESC'); // Default to DESC for new sort columns (e.g. likes_count)
        }
        // fetchPlans will be called by useEffect due to sortBy/sortOrder change
    };


    return (
        <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto animate-fadeIn">
            <div className="pb-8 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center">
                        <FiArchive className="mr-4 text-purple-600"/> Workout Plans
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Design, discover, and manage your training routines.
                    </p>
                </div>
                {!isFormOpen && user && ( // Only show if user is logged in
                    <button onClick={handleOpenCreateForm} className="flex-shrink-0 flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ease-in-out transform hover:scale-105">
                        <FiPlus className="mr-2 h-5 w-5"/> Create New Plan
                    </button>
                )}
            </div>

            {isFormOpen && (
                <InfoCard title={formTitle} icon={formIcon} className="mb-12">
                    {/* Form JSX remains largely the same, ensure it uses planName, planDescription, planExercises etc. */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="plan-name" className="block text-sm font-medium text-slate-700 mb-1.5">Plan Name *</label>
                                <input type="text" id="plan-name" value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="e.g., Full Body Blast" className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white/90"/>
                            </div>
                            <div>
                                <label htmlFor="plan-desc" className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-xs text-slate-400">(Optional)</span></label>
                                <input type="text" id="plan-desc" value={planDescription} onChange={(e) => setPlanDescription(e.target.value)} placeholder="Focus, frequency, goals..." className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white/90"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Add Exercises</label>
                            {exerciseLoadError && <p className="text-xs text-red-500 mb-2 flex items-center"><FiAlertCircle className="mr-1"/>{exerciseLoadError}</p>}
                            <div className="relative mb-3">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none"> <FiSearch /> </span>
                                <input type="text" placeholder="Search exercises to add..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!!exerciseLoadError} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm hover:shadow-md focus:shadow-lg bg-white/90 disabled:bg-slate-100"/>
                            </div>
                            {searchTerm && !exerciseLoadError && (
                                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto bg-white shadow-md mb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    {searchResultsForForm.length > 0 ? (
                                        <ul className="divide-y divide-slate-100">
                                            {searchResultsForForm.map(ex => (
                                                <li key={ex.id} className="p-3 flex justify-between items-center hover:bg-purple-50/70 transition duration-150 group">
                                                    <p className="text-sm font-medium text-slate-800">{ex.name} <span className="text-xs text-slate-500">({ex.muscle})</span></p>
                                                    <button onClick={() => handleAddExerciseToPlan(ex)} className="p-2 text-purple-600 hover:text-white hover:bg-purple-500 rounded-full transition-all duration-150 transform group-hover:scale-110" title={`Add ${ex.name}`}><FiPlusCircle className="h-5 w-5"/></button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : ( <p className="p-4 text-sm text-slate-500 text-center italic">No matching exercises found.</p> )}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-md font-semibold text-slate-700 mb-2 flex items-center"><FiList className="mr-2 text-purple-500"/>Exercises in Plan ({planExercises.length})</h3>
                            {planExercises.length > 0 ? (
                                <ul className="space-y-3 max-h-72 overflow-y-auto pr-2 border border-slate-200/80 rounded-xl p-4 bg-slate-50/60 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                                    {planExercises.map(ex => (
                                        <li key={ex.exerciseId} className="flex flex-col sm:flex-row justify-between items-center p-3.5 bg-white rounded-lg shadow-sm gap-3 border border-slate-200 hover:border-purple-300 transition-colors">
                                            <span className="text-sm text-slate-800 flex-grow font-medium">{ex.name}</span>
                                            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <label htmlFor={`sets-${ex.exerciseId}`} className="text-xs font-medium text-slate-600 whitespace-nowrap flex items-center"><FiHash className="mr-1"/>Target Sets:</label>
                                                <input type="number" id={`sets-${ex.exerciseId}`} value={ex.targetSets} onChange={(e) => handleTargetSetsChange(ex.exerciseId, e.target.value)} min="1" placeholder="e.g., 3" className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"/>
                                                <button onClick={() => handleRemoveExerciseFromPlan(ex.exerciseId)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100/70 rounded-full transition-colors" title={`Remove ${ex.name}`}><FiTrash2 size={16}/></button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : ( <p className="text-sm text-slate-500 italic text-center py-6 border border-dashed border-slate-300 rounded-lg bg-slate-50/50">Search and add exercises above to build your plan.</p> )}
                        </div>
                        {formError && <p className="mt-3 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle/> {formError}</p>}
                        {savePlanSuccess && !editingPlan && <p className="mt-3 text-sm text-green-600 flex items-center gap-1"><FiCheck/> Plan submitted for approval!</p>}
                        {savePlanSuccess && editingPlan && <p className="mt-3 text-sm text-green-600 flex items-center gap-1"><FiCheck/> Plan updated! It may require re-approval.</p>}
                        <div className="flex justify-end gap-4 pt-5 border-t border-slate-200/80 mt-6">
                            <button onClick={handleCloseForm} type="button" className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 shadow-sm hover:shadow-md"> Cancel </button>
                            <button onClick={handleSaveOrUpdatePlan} type="button" disabled={isSavingPlan} className="flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60">
                                {isSavingPlan ? <FiLoader className="animate-spin mr-2"/> : <FiSave className="mr-2"/>}
                                {isSavingPlan ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Save Plan')}
                            </button>
                        </div>
                    </div>
                </InfoCard>
            )}

            {!isFormOpen && (
                <div className="mt-8">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow">
                        <div className="relative w-full sm:w-2/3 lg:w-1/2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none"> <FiSearch /> </span>
                            <input
                                type="text"
                                placeholder="Search plans by name, description, creator..."
                                value={filterSearchTerm}
                                onChange={(e) => setFilterSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 font-medium">Sort by:</span>
                            <button onClick={() => handleSortChange('created_at')} className={`px-3 py-1 rounded-md border ${sortBy === 'created_at' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'hover:bg-gray-100'}`}>
                                <FiCalendar className="inline mr-1"/> Date {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </button>
                            <button onClick={() => handleSortChange('likes_count')} className={`px-3 py-1 rounded-md border ${sortBy === 'likes_count' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'hover:bg-gray-100'}`}>
                                <FiHeart className="inline mr-1"/> Likes {sortBy === 'likes_count' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </button>
                        </div>
                    </div>

                    {isLoadingPlans && <div className="flex justify-center p-10"><FiLoader className="animate-spin h-8 w-8 text-purple-500"/></div>}
                    {fetchPlansError && !isLoadingPlans && <p className="text-center text-red-600 flex items-center justify-center gap-2 p-6 bg-red-50 rounded-xl border border-red-200"><FiAlertCircle/> {fetchPlansError}</p>}
                    {!isLoadingPlans && !fetchPlansError && filteredAndSortedPlans.length === 0 && (
                        <p className="text-lg text-slate-500 italic text-center py-10 bg-white/50 backdrop-blur-sm rounded-xl shadow">
                            {filterSearchTerm ? 'No plans match your search.' : 'No workout plans found. Click "Create New Plan" to start!'}
                        </p>
                    )}
                    {!isLoadingPlans && !fetchPlansError && filteredAndSortedPlans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredAndSortedPlans.map(plan => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    onOpenViewModal={handleOpenViewModal}
                                    onOpenEditForm={handleOpenEditForm}
                                    onDeletePlan={handleDeletePlan}
                                    currentUser={user}
                                    onLikeUnlike={handleLikeUnlikePlan}
                                    isLiking={likingStates[plan.id] || false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {viewingPlan && (
                <WorkoutPlanDetailModal
                    isOpen={isViewing}
                    onClose={handleCloseViewModal}
                    plan={viewingPlan}
                />
            )}
        </div>
    );
}

export default WorkoutPlansPage;
