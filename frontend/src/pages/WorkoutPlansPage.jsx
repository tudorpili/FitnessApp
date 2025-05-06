// src/pages/WorkoutPlansPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    FiPlus, FiSearch, FiTrash2, FiX, FiSave, FiClipboard, FiEdit, FiEye,
    FiList, FiPlusCircle, FiLoader, FiAlertCircle, FiCheck, FiHash // Added FiHash for sets
} from 'react-icons/fi';
// Import API functions
import {
    getAllExercises, getAllWorkoutPlans, createWorkoutPlan,
    deleteWorkoutPlan, updateWorkoutPlan
} from '../services/api';
// Import the new modal component
import WorkoutPlanDetailModal from '../components/common/WorkoutPlanDetailModal';

// --- Components ---
const InfoCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-indigo-100/50 p-6 sm:p-8 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center"> {icon && <span className="mr-3 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );

// --- WorkoutPlansPage Component ---
function WorkoutPlansPage() {
    // --- Hooks ---
    const { user } = useAuth();
    const navigate = useNavigate();

    // --- State Definitions ---
    const [plans, setPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [fetchPlansError, setFetchPlansError] = useState(null);
    const [allExercises, setAllExercises] = useState([]);
    const [exerciseLoadError, setExerciseLoadError] = useState(null);

    // Form / Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [viewingPlan, setViewingPlan] = useState(null);

    // Form Field State
    const [planName, setPlanName] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    // planExercises now stores { exerciseId, name, targetSets }
    const [planExercises, setPlanExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formError, setFormError] = useState('');
    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [savePlanSuccess, setSavePlanSuccess] = useState(false);

    // --- Fetching Functions ---
    const fetchPlans = useCallback(async () => { /* ... */ setIsLoadingPlans(true); setFetchPlansError(null); try { const data = await getAllWorkoutPlans(); const plansWithExercises = data.map(plan => ({ ...plan, exercises: Array.isArray(plan.exercises) ? plan.exercises : [] })); setPlans(plansWithExercises || []); } catch (error) { setFetchPlansError(error.message || "Could not load workout plans."); } finally { setIsLoadingPlans(false); } }, []);
    const fetchAllExercises = useCallback(async () => { /* ... */ setExerciseLoadError(null); try { const data = await getAllExercises(); const parsedData = data.map(ex => ({ ...ex, videos: typeof ex.videos === 'string' ? JSON.parse(ex.videos) : ex.videos || [] })); setAllExercises(parsedData); } catch (error) { setExerciseLoadError("Could not load exercises. Search disabled."); } }, []);

    // --- useEffect Hooks ---
    useEffect(() => { fetchPlans(); fetchAllExercises(); }, [fetchPlans, fetchAllExercises]);

    // --- Memoized Values ---
    const searchResults = useMemo(() => {
        if (!searchTerm.trim() || allExercises.length === 0) return [];
        const addedIds = new Set(planExercises.map(ex => ex.exerciseId));
        return allExercises
            .filter(ex => !addedIds.has(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8);
    }, [searchTerm, planExercises, allExercises]);

    // --- Event Handlers ---
    const resetFormState = () => { /* ... */ setPlanName(''); setPlanDescription(''); setPlanExercises([]); setSearchTerm(''); setFormError(''); setIsSavingPlan(false); setSavePlanSuccess(false); setEditingPlan(null); };
    const handleOpenCreateForm = () => { /* ... */ resetFormState(); setIsFormOpen(true); };

    const handleOpenEditForm = (planToEdit) => {
        console.log("Opening edit form for plan:", planToEdit);
        setEditingPlan(planToEdit);
        setPlanName(planToEdit.name || '');
        setPlanDescription(planToEdit.description || '');
        // Map exercises to include targetSets (default to empty string for input)
        setPlanExercises(planToEdit.exercises?.map(ex => ({
            exerciseId: ex.exerciseId,
            name: ex.name,
            targetSets: ex.targetSets || '' // Default to empty string for input field
        })) || []);
        setSearchTerm(''); setFormError(''); setSavePlanSuccess(false);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => { /* ... */ setIsFormOpen(false); resetFormState(); };

    // Add exercise with default empty targetSets
    const handleAddExerciseToPlan = (exercise) => {
        if (!planExercises.some(ex => ex.exerciseId === exercise.id)) {
            setPlanExercises(prev => [...prev, { exerciseId: exercise.id, name: exercise.name, targetSets: '' }]); // Add with empty targetSets
        }
        setSearchTerm('');
    };

    // Update target sets for a specific exercise in the form state
    const handleTargetSetsChange = (exerciseId, value) => {
        const setsValue = value.trim() === '' ? '' : parseInt(value, 10);
        // Allow empty string or positive integers
        if (value.trim() === '' || (!isNaN(setsValue) && setsValue > 0)) {
            setPlanExercises(prev =>
                prev.map(ex =>
                    ex.exerciseId === exerciseId ? { ...ex, targetSets: value.trim() === '' ? '' : setsValue } : ex
                )
            );
        } else if (!isNaN(setsValue) && setsValue <= 0) {
             // Optionally handle zero/negative input, maybe clear it or show validation
             setPlanExercises(prev =>
                prev.map(ex =>
                    ex.exerciseId === exerciseId ? { ...ex, targetSets: '' } : ex // Clear if invalid number
                )
            );
        }
         // If input is not a number and not empty, do nothing or show validation
    };


    const handleRemoveExerciseFromPlan = (exerciseIdToRemove) => { /* ... */ setPlanExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseIdToRemove)); };

    // Save/Update Plan (API Call)
    const handleSaveOrUpdatePlan = async () => {
        setFormError(''); setSavePlanSuccess(false);
        if (!planName.trim()) { setFormError('Plan name is required.'); return; }
        if (planExercises.length === 0) { setFormError('Please add at least one exercise.'); return; }

        setIsSavingPlan(true);

        // Prepare payload including targetSets (send null if empty string)
        const planPayload = {
            name: planName.trim(),
            description: planDescription.trim() || null,
            exercises: planExercises.map(ex => ({
                exerciseId: ex.exerciseId,
                targetSets: ex.targetSets === '' ? null : parseInt(ex.targetSets, 10) // Convert empty string to null
            }))
        };

        try {
            if (editingPlan) {
                await updateWorkoutPlan(editingPlan.id, planPayload);
            } else {
                await createWorkoutPlan(planPayload);
            }
            setSavePlanSuccess(true);
            fetchPlans(); // Refresh the list
            handleCloseForm(); // Close and reset form
        } catch (error) {
            setFormError(error.message || `An error occurred while ${editingPlan ? 'updating' : 'saving'} the plan.`);
        } finally {
            setIsSavingPlan(false);
        }
    };

     const handleDeletePlan = async (planIdToDelete) => { /* ... */ if (!window.confirm("Are you sure you want to delete this workout plan?")) { return; } try { await deleteWorkoutPlan(planIdToDelete); fetchPlans(); alert("Plan deleted successfully."); } catch (error) { alert(`Error deleting plan: ${error.message}`); } };
    const handleOpenViewModal = (planToView) => { /* ... */ setViewingPlan(planToView); setIsViewing(true); };
    const handleCloseViewModal = () => { /* ... */ setIsViewing(false); setViewingPlan(null); };

    // --- Render Logic ---
    const formTitle = editingPlan ? "Edit Workout Plan" : "Create New Workout Plan";

    return (
        <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="pb-6 border-b border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> <div> <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center"> <FiClipboard className="mr-3 text-purple-600"/> Workout Plans </h1> <p className="mt-2 text-lg text-gray-600"> Create, view, and manage your training routines. </p> </div> {!isFormOpen && ( <button onClick={handleOpenCreateForm} className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"> <FiPlus className="mr-1.5 h-5 w-5"/> Create New Plan </button> )} </div>

            {/* Create/Edit Plan Form (Conditional) */}
            {isFormOpen && ( <InfoCard title={formTitle} icon={editingPlan ? <FiEdit/> : <FiPlus />}> <div className="space-y-6"> {/* Plan Name & Description */} <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label> <input type="text" id="plan-name" value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="e.g., Push Day Alpha" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/> </div> <div> <label htmlFor="plan-desc" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-xs text-gray-400">(Optional)</span></label> <input type="text" id="plan-desc" value={planDescription} onChange={(e) => setPlanDescription(e.target.value)} placeholder="Focus, frequency, etc." className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/> </div> </div> {/* Add Exercises Section */} <div> <label className="block text-sm font-medium text-gray-700 mb-1">Add Exercises</label> {exerciseLoadError && <p className="text-xs text-red-500 mb-2">{exerciseLoadError}</p>} <div className="relative mb-3"> <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span> <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!!exerciseLoadError} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md disabled:bg-gray-100"/> </div> {searchTerm && !exerciseLoadError && ( <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-white shadow-inner mb-4">{searchResults.length > 0 ? ( <ul className="divide-y divide-gray-100"> {searchResults.map(ex => ( <li key={ex.id} className="p-3 flex justify-between items-center hover:bg-indigo-50 transition duration-150 group"> <p className="text-sm font-medium text-gray-900">{ex.name} <span className="text-xs text-gray-500">({ex.muscle})</span></p> <button onClick={() => handleAddExerciseToPlan(ex)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150 transform group-hover:scale-110" title={`Add ${ex.name}`} aria-label={`Add ${ex.name}`}><FiPlusCircle className="h-5 w-5"/></button> </li> ))} </ul> ) : ( <p className="p-4 text-sm text-gray-500 text-center italic">No matching exercises found.</p> )}</div> )} </div>
                        {/* Exercises In Plan List with Target Sets Input */}
                        <div> <h3 className="text-md font-semibold text-gray-700 mb-2">Exercises in Plan ({planExercises.length})</h3> {planExercises.length > 0 ? ( <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50"> {planExercises.map(ex => ( <li key={ex.exerciseId} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white rounded-lg shadow-sm gap-3"> <span className="text-sm text-gray-800 flex-grow font-medium">{ex.name}</span> <div className="flex items-center gap-2 w-full sm:w-auto"> <label htmlFor={`sets-${ex.exerciseId}`} className="text-xs font-medium text-gray-600 whitespace-nowrap">Target Sets:</label> <input type="number" id={`sets-${ex.exerciseId}`} value={ex.targetSets} onChange={(e) => handleTargetSetsChange(ex.exerciseId, e.target.value)} min="1" placeholder="e.g., 3" className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"/> <button onClick={() => handleRemoveExerciseFromPlan(ex.exerciseId)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full" title={`Remove ${ex.name}`}><FiTrash2 size={14}/></button> </div> </li> ))} </ul> ) : ( <p className="text-sm text-gray-500 italic text-center py-4 border border-dashed rounded-lg">Search and add exercises above.</p> )} </div>
                        {/* Form Error & Success */} {formError && <p className="text-sm text-red-600 flex items-center gap-1"><FiAlertCircle/> {formError}</p>} {savePlanSuccess && <p className="text-sm text-green-600 flex items-center gap-1"><FiCheck/> Plan saved successfully!</p>} {/* Action Buttons */} <div className="flex justify-end gap-4 pt-4 border-t border-gray-200"> <button onClick={handleCloseForm} type="button" className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150"> Cancel </button> <button onClick={handleSaveOrUpdatePlan} type="button" disabled={isSavingPlan} className="flex items-center px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 shadow disabled:opacity-60"> {isSavingPlan ? <FiLoader className="animate-spin mr-1.5"/> : <FiSave className="mr-1.5"/>} {isSavingPlan ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Save Plan')} </button> </div> </div> </InfoCard> )}

            {/* Display Plans List (Conditional) */}
            {!isFormOpen && ( <InfoCard title="Workout Plans" icon={<FiList />}> {isLoadingPlans && <div className="flex justify-center p-6"><FiLoader className="animate-spin h-6 w-6 text-indigo-500"/></div>} {fetchPlansError && !isLoadingPlans && <p className="text-center text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {fetchPlansError}</p>} {!isLoadingPlans && !fetchPlansError && plans.length === 0 && <p className="text-sm text-gray-500 italic text-center py-6">No workout plans found. Click "Create New Plan" to start!</p>} {!isLoadingPlans && !fetchPlansError && plans.length > 0 && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {plans.map(plan => ( <div key={plan.id} className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"> <div> <h3 className="text-lg font-semibold text-indigo-800 mb-1 truncate">{plan.name}</h3> <p className="text-xs text-gray-500 mb-2">By: {plan.creator_username || 'Unknown'}</p> <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{plan.description || 'No description.'}</p> <p className="text-xs font-medium text-gray-500 mb-1">Exercises ({plan.exercises.length})</p> <ul className="text-xs list-disc list-inside pl-1 text-gray-500 space-y-0.5 max-h-16 overflow-hidden"> {plan.exercises.slice(0, 3).map(ex => <li key={ex.exerciseId} className="truncate">{ex.name} {ex.targetSets ? `(${ex.targetSets} sets)` : ''}</li>)} {plan.exercises.length > 3 && <li>...</li>} </ul> </div> {/* Action Buttons */} <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3"> <button onClick={() => handleOpenViewModal(plan)} className="flex-1 text-xs text-center py-1 px-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition">View</button> {user && user.id === plan.user_id && ( <> <button onClick={() => handleOpenEditForm(plan)} className="flex-1 text-xs text-center py-1 px-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">Edit</button> <button onClick={() => handleDeletePlan(plan.id)} className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete Plan"><FiTrash2 size={14}/></button> </> )} {(!user || user.id !== plan.user_id) && ( <div className="flex-1"></div> )} </div> </div> ))} </div> )} </InfoCard> )}

            {/* View Plan Detail Modal */}
             <WorkoutPlanDetailModal isOpen={isViewing} onClose={handleCloseViewModal} plan={viewingPlan} />

            {/* Edit Plan Modal could be a separate component or reuse the create form logic */}
            {/* For now, editing reuses the create form section when isFormOpen && editingPlan */}

        </div>
    );
}

export default WorkoutPlansPage;
