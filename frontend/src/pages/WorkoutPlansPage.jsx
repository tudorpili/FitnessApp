// src/pages/WorkoutPlansPage.jsx
import React, { useState, useMemo } from 'react';
import { mockExercises } from '../mockData/exercises'; // Using single-muscle version
import { FiPlus, FiSearch, FiTrash2, FiX, FiSave, FiClipboard, FiEdit, FiEye, FiList } from 'react-icons/fi'; // Import icons

// Mock initial plans (replace with fetched data or local storage later)
const initialPlans = [
    {
        id: 'plan1', name: 'Beginner Full Body A', description: 'Focus on compound movements, 3 times a week.',
        exercises: [ { exerciseId: '3', name: 'Barbell Squat' }, { exerciseId: '1', name: 'Barbell Bench Press' }, { exerciseId: '14', name: 'Bent Over Row' } ]
    },
    {
        id: 'plan2', name: 'Push Day', description: 'Chest, Shoulders, Triceps focus.',
        exercises: [ { exerciseId: '1', name: 'Barbell Bench Press' }, { exerciseId: '9', name: 'Overhead Press (OHP)' }, { exerciseId: '11', name: 'Triceps Pushdown' } ]
    },
     {
        id: 'plan3', name: 'Leg Day', description: 'Quads, Hamstrings, Glutes, Calves.',
        exercises: [ { exerciseId: '3', name: 'Barbell Squat' }, { exerciseId: '5', name: 'Barbell Romanian Deadlift (RDL)' }, { exerciseId: '4', name: 'Leg Extensions' }, { exerciseId: '7', name: 'Machine Standing Calf Raise' } ]
    },
];

// Reusable Card component
const InfoCard = ({ title, children, className = '', icon }) => (
  <div className={`bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-indigo-100/50 p-6 sm:p-8 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center">
        {icon && <span className="mr-3 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

// --- Main WorkoutPlansPage Component ---
function WorkoutPlansPage() {
    const [plans, setPlans] = useState(initialPlans); // Holds all plans
    const [isCreating, setIsCreating] = useState(false); // Toggle create form visibility

    // State for the new plan being created
    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanDescription, setNewPlanDescription] = useState('');
    const [newPlanExercises, setNewPlanExercises] = useState([]); // Array of { exerciseId, name }
    const [searchTerm, setSearchTerm] = useState('');
    const [formError, setFormError] = useState('');

    // Filter exercises for search (exclude already added)
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const addedIds = new Set(newPlanExercises.map(ex => ex.exerciseId));
        return mockExercises
            .filter(ex => !addedIds.has(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8);
    }, [searchTerm, newPlanExercises]);

    // Toggle create form
    const handleToggleCreate = (show) => {
        setIsCreating(show);
        if (!show) { // Reset form if closing
            setNewPlanName('');
            setNewPlanDescription('');
            setNewPlanExercises([]);
            setSearchTerm('');
            setFormError('');
        }
    };

    // Add exercise to the plan being created
    const handleAddExerciseToPlan = (exercise) => {
        if (!newPlanExercises.some(ex => ex.exerciseId === exercise.id)) {
            setNewPlanExercises(prev => [...prev, { exerciseId: exercise.id, name: exercise.name }]);
        }
        setSearchTerm(''); // Clear search after adding
    };

    // Remove exercise from the plan being created
    const handleRemoveExerciseFromPlan = (exerciseIdToRemove) => {
        setNewPlanExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseIdToRemove));
    };

    // Save the new plan (adds to state for session only)
    const handleSavePlan = () => {
        setFormError('');
        if (!newPlanName.trim()) {
            setFormError('Plan name is required.');
            return;
        }
        if (newPlanExercises.length === 0) {
            setFormError('Please add at least one exercise to the plan.');
            return;
        }

        const newPlan = {
            id: `plan-${Date.now()}`, // Simple unique ID
            name: newPlanName,
            description: newPlanDescription,
            exercises: newPlanExercises,
        };

        setPlans(prevPlans => [newPlan, ...prevPlans]); // Add new plan to the beginning
        handleToggleCreate(false); // Close the form
        console.log("New Plan Saved (Session Only):", newPlan);
    };


    return (
        <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto animate-fadeIn">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                       <FiClipboard className="mr-3 text-purple-600"/> Workout Plans
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Create, view, and manage your training routines.
                    </p>
                </div>
                 {/* Show Create button only when not already creating */}
                 {!isCreating && (
                    <button
                        onClick={() => handleToggleCreate(true)}
                        className="flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-1.5 h-5 w-5"/> Create New Plan
                    </button>
                 )}
            </div>

            {/* --- Create New Plan Form (Conditional) --- */}
            {isCreating && (
                <InfoCard title="Create New Workout Plan" icon={<FiPlus />}>
                    <div className="space-y-6">
                        {/* Plan Name & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                                <input type="text" id="plan-name" value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} required placeholder="e.g., Push Day Alpha" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                             <div>
                                <label htmlFor="plan-desc" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-xs text-gray-400">(Optional)</span></label>
                                <input type="text" id="plan-desc" value={newPlanDescription} onChange={(e) => setNewPlanDescription(e.target.value)} placeholder="Focus, frequency, etc." className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                        </div>

                        {/* Add Exercises Section */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Add Exercises</label>
                             <div className="relative mb-3">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span>
                                <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md"/>
                             </div>
                             {/* Search Results */}
                             {searchTerm && ( <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-white shadow-inner mb-4">{searchResults.length > 0 ? ( <ul className="divide-y divide-gray-100"> {searchResults.map(ex => ( <li key={ex.id} className="p-3 flex justify-between items-center hover:bg-indigo-50 transition duration-150 group"> <p className="text-sm font-medium text-gray-900">{ex.name} <span className="text-xs text-gray-500">({ex.muscle})</span></p> <button onClick={() => handleAddExerciseToPlan(ex)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150 transform group-hover:scale-110" title={`Add ${ex.name}`} aria-label={`Add ${ex.name}`}><FiPlusCircle className="h-5 w-5"/></button> </li> ))} </ul> ) : ( <p className="p-4 text-sm text-gray-500 text-center italic">No matching exercises found.</p> )}</div> )}
                        </div>

                        {/* Exercises Added to Plan */}
                        <div>
                             <h3 className="text-md font-semibold text-gray-700 mb-2">Exercises in Plan ({newPlanExercises.length})</h3>
                             {newPlanExercises.length > 0 ? (
                                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                                    {newPlanExercises.map(ex => (
                                        <li key={ex.exerciseId} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                            <span className="text-sm text-gray-800">{ex.name}</span>
                                            <button onClick={() => handleRemoveExerciseFromPlan(ex.exerciseId)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full" title={`Remove ${ex.name}`}><FiTrash2 size={14}/></button>
                                        </li>
                                    ))}
                                </ul>
                             ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4 border border-dashed rounded-lg">Search and add exercises above.</p>
                             )}
                        </div>

                        {/* Form Error */}
                        {formError && <p className="text-sm text-red-600">{formError}</p>}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <button onClick={() => handleToggleCreate(false)} type="button" className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150">
                                Cancel
                            </button>
                             <button onClick={handleSavePlan} type="button" className="flex items-center px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 shadow">
                                <FiSave className="mr-1.5"/> Save Plan
                            </button>
                        </div>
                    </div>
                </InfoCard>
            )}

            {/* --- Display Existing Plans (Conditional) --- */}
            {!isCreating && (
                <InfoCard title="Your Plans" icon={<FiList />}>
                    {plans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-800 mb-1 truncate">{plan.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plan.description || 'No description.'}</p>
                                        <p className="text-xs font-medium text-gray-500 mb-3">Exercises: {plan.exercises.length}</p>
                                        {/* Placeholder for exercise list preview */}
                                        {/* <ul className="text-xs list-disc list-inside pl-1 text-gray-500 truncate">
                                            {plan.exercises.slice(0, 2).map(ex => <li key={ex.exerciseId}>{ex.name}</li>)}
                                            {plan.exercises.length > 2 && <li>...</li>}
                                        </ul> */}
                                    </div>
                                    {/* Placeholder Action Buttons */}
                                    <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                        <button className="flex-1 text-xs text-center py-1 px-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition">View</button>
                                        <button className="flex-1 text-xs text-center py-1 px-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">Edit</button>
                                        <button className="p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"><FiTrash2 size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic text-center py-6">You haven't created any workout plans yet. Click "Create New Plan" to start!</p>
                    )}
                </InfoCard>
            )}

        </div> // End Page Container
    );
}

export default WorkoutPlansPage;
