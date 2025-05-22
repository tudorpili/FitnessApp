// frontend/src/pages/LogWorkoutPage.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth
import { getAllExercises, logWorkout, getAllWorkoutPlans } from '../services/api';
import {
    FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiSave, FiEdit3, FiCheckSquare,
    FiActivity, FiPlay, FiPause, FiSquare, FiPlus, FiClock, FiList, FiRepeat,
    FiMaximize2, FiLoader, FiAlertCircle, FiDownload,FiX
} from 'react-icons/fi';
import { FaDumbbell, FaWeightHanging } from 'react-icons/fa';

const getTodayDate = () => { const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };
const formatTime = (totalSeconds) => { if (typeof totalSeconds !== 'number' || totalSeconds < 0) return '00:00'; const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; };
const InfoCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg shadow-indigo-100/50 p-6 sm:p-8 ${className}`}> <h2 className="text-xl font-bold text-gray-800 mb-5 tracking-tight flex items-center"> {icon && <span className="mr-3 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );
const LoggedExerciseEntry = ({ entry, onUpdateSet, onRemoveExercise, onAddSet, onRemoveSet }) => { return ( <li className="bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-md p-5 space-y-4 transition-all duration-300 ease-out animate-fadeIn"> <div className="flex justify-between items-center pb-3 border-b border-indigo-100"> <p className="text-lg font-semibold text-indigo-900 tracking-wide">{entry.name}</p> <button onClick={() => onRemoveExercise(entry.exerciseId)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0" title={`Remove ${entry.name}`} aria-label={`Remove ${entry.name}`}> <FiTrash2 className="h-5 w-5"/> </button> </div> <ul className="space-y-3"> {entry.sets.map((set, setIndex) => ( <li key={set.id} className="flex flex-col sm:flex-row gap-3 items-center bg-white/80 p-3 rounded-xl border border-indigo-100 shadow-sm animate-fadeIn"> <span className="text-sm font-semibold text-indigo-600 mr-2 w-12 text-center sm:text-left">Set {setIndex + 1}</span> <div className="flex-1 w-full sm:w-auto relative"> <FiRepeat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/> <label htmlFor={`reps-${entry.exerciseId}-${set.id}`} className="sr-only">Reps</label> <input type="number" id={`reps-${entry.exerciseId}-${set.id}`} value={set.reps} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'reps', e.target.value)} placeholder="Reps" min="0" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"/> </div> <div className="flex-1 w-full sm:w-auto relative"> <FaWeightHanging className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/> <label htmlFor={`weight-${entry.exerciseId}-${set.id}`} className="sr-only">Weight</label> <input type="number" id={`weight-${entry.exerciseId}-${set.id}`} value={set.weight} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'weight', e.target.value)} placeholder="Weight" step="0.1" min="0" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"/> </div> <div className="self-center"> <label htmlFor={`unit-${entry.exerciseId}-${set.id}`} className="sr-only">Unit</label> <select id={`unit-${entry.exerciseId}-${set.id}`} value={set.unit} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'unit', e.target.value)} className="px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 h-[42px]"> <option value="kg">kg</option> <option value="lbs">lbs</option> </select> </div> {entry.sets.length > 1 && ( <button onClick={() => onRemoveSet(entry.exerciseId, set.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150" title="Remove set" aria-label="Remove set"> <FiTrash2 className="h-4 w-4" /> </button> )} </li> ))} </ul> <button onClick={() => onAddSet(entry.exerciseId)} className="w-full sm:w-auto mt-3 flex items-center justify-center px-4 py-2 border-2 border-dashed border-indigo-300 text-sm font-medium rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-200 ease-in-out group"> <FiPlus className="mr-1.5 h-4 w-4 group-hover:scale-110 transition-transform"/> Add Set </button> </li> ); };

function LogWorkoutPage() {
    const { user } = useAuth(); // Destructuring user here
    // ADDED CONSOLE LOG FOR DEBUGGING
    console.log('[LogWorkoutPage] User object from useAuth():', user);

    const [workoutDate, setWorkoutDate] = useState(getTodayDate());
    const [workoutName, setWorkoutName] = useState('');
    const [workoutNotes, setWorkoutNotes] = useState('');
    const [currentExercises, setCurrentExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [exerciseLoadError, setExerciseLoadError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerIntervalRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [finishedLogs, setFinishedLogs] = useState([]);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedPlanToImport, setSelectedPlanToImport] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                console.log("[LogWorkoutPage] Fetching all exercises for search...");
                const exercisesData = await getAllExercises();
                const parsedExercises = exercisesData.map(ex => ({ ...ex, videos: typeof ex.videos === 'string' ? JSON.parse(ex.videos) : ex.videos || [] }));
                setAllExercises(parsedExercises);
                console.log("[LogWorkoutPage] All exercises loaded:", parsedExercises);
            } catch (error) {
                console.error("[LogWorkoutPage] Failed to load exercises for search:", error);
                setExerciseLoadError("Could not load exercises. Search might not work.");
            }
        };
        fetchInitialData();
    }, []);

    const fetchAvailablePlans = useCallback(async () => {
        console.log("[LogWorkoutPage] fetchAvailablePlans called. Current user:", user);
        setIsLoadingPlans(true);
        try {
            const plansData = await getAllWorkoutPlans();
            // Ensure user object is available before accessing user.id
            // Filter for approved plans OR plans created by the current user
            setAvailablePlans(plansData.filter(p => p.status === 'approved' || (user && p.user_id === user.id)) || []);
        } catch (error) {
            console.error("[LogWorkoutPage] Failed to load workout plans for import:", error);
        } finally {
            setIsLoadingPlans(false);
        }
    }, [user]); // user is a dependency

    useEffect(() => {
        if (isImportModalOpen) {
            console.log("[LogWorkoutPage] Import modal opened. Fetching available plans. User state:", user);
            fetchAvailablePlans();
        }
    }, [isImportModalOpen, fetchAvailablePlans]); // fetchAvailablePlans will change if user changes


    useEffect(() => { if (isTimerRunning) { timerIntervalRef.current = setInterval(() => { setElapsedSeconds(prev => prev + 1); }, 1000); } else { clearInterval(timerIntervalRef.current); } return () => clearInterval(timerIntervalRef.current); }, [isTimerRunning]);
    const handleStartTimer = () => setIsTimerRunning(true);
    const handlePauseTimer = () => setIsTimerRunning(false);
    const handleStopTimer = () => { setIsTimerRunning(false); setElapsedSeconds(0); };

    const searchResults = useMemo(() => { if (!searchTerm.trim() || allExercises.length === 0) return []; const addedIds = new Set(currentExercises.map(ex => ex.exerciseId)); return allExercises.filter(ex => !addedIds.has(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 8); }, [searchTerm, currentExercises, allExercises]);
    const handleAddExercise = (exercise) => { setCurrentExercises(prev => [ ...prev, { exerciseId: exercise.id, name: exercise.name, sets: [{ id: `set-${Date.now()}`, reps: '', weight: '', unit: 'kg' }] } ]); setSearchTerm(''); };
    const handleRemoveExercise = (exerciseIdToRemove) => { setCurrentExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseIdToRemove)); };
    const handleAddSet = (exerciseId) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const newSet = { id: `set-${Date.now()}-${ex.sets.length}`, reps: '', weight: '', unit: ex.sets[ex.sets.length - 1]?.unit || 'kg' }; return { ...ex, sets: [...ex.sets, newSet] }; } return ex; })); };
    const handleRemoveSet = (exerciseId, setIdToRemove) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const updatedSets = ex.sets.filter(set => set.id !== setIdToRemove); return { ...ex, sets: updatedSets.length > 0 ? updatedSets : [{ id: `set-${Date.now()}-0`, reps: '', weight: '', unit: 'kg' }] }; } return ex; })); };
    const handleUpdateSetDetails = (exerciseId, setIndex, field, value) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const updatedSets = ex.sets.map((set, index) => { if (index === setIndex) { return { ...set, [field]: value }; } return set; }); return { ...ex, sets: updatedSets }; } return ex; })); };

    const handleImportPlan = () => {
        if (!selectedPlanToImport) return;
        const planToImport = availablePlans.find(p => p.id === parseInt(selectedPlanToImport));
        if (!planToImport) {
            alert("Selected plan not found.");
            return;
        }
        const exercisesFromPlan = planToImport.exercises.map(ex => {
            let initialSets = [];
            const targetSets = ex.targetSets ? parseInt(ex.targetSets, 10) : 1;
            for (let i = 0; i < Math.max(1, targetSets); i++) {
                initialSets.push({ id: `set-${Date.now()}-${ex.exerciseId}-${i}`, reps: '', weight: '', unit: 'kg' });
            }
            return { exerciseId: ex.exerciseId, name: ex.name, sets: initialSets };
        });
        setCurrentExercises(prevCurrent => [...prevCurrent, ...exercisesFromPlan.filter(newEx => !prevCurrent.some(currEx => currEx.exerciseId === newEx.exerciseId))]);
        setWorkoutName(prevName => prevName || planToImport.name);
        setWorkoutNotes(prevNotes => prevNotes || planToImport.description);
        setIsImportModalOpen(false);
        setSelectedPlanToImport(null);
    };

    const handleFinishWorkout = async () => { handlePauseTimer(); setSaveError(null); setSaveSuccess(false); const validExercises = currentExercises.map(ex => ({ ...ex, sets: ex.sets.filter(set => (set.reps && set.reps > 0) || (set.weight && set.weight > 0)) })).filter(ex => ex.sets.length > 0); if (validExercises.length === 0) { setSaveError("Please add at least one exercise with valid set details (reps or weight > 0)."); return; } setIsSaving(true); const workoutData = { sessionDate: workoutDate, name: workoutName.trim() || null, notes: workoutNotes.trim() || null, durationSeconds: elapsedSeconds > 0 ? elapsedSeconds : null, exercises: validExercises.map(ex => ({ exerciseId: ex.exerciseId, sets: ex.sets.map(set => ({ reps: set.reps ? parseInt(set.reps, 10) : null, weight: set.weight ? parseFloat(set.weight) : null, unit: set.unit || 'kg' })) })) }; try { const response = await logWorkout(workoutData); setFinishedLogs(prevLogs => [{ ...workoutData, logId: response?.session?.id || `local-${Date.now()}` }, ...prevLogs]); setCurrentExercises([]); setWorkoutName(''); setWorkoutNotes(''); setWorkoutDate(getTodayDate()); setElapsedSeconds(0); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 4000); } catch (error) { setSaveError(error.message || "An unknown error occurred while saving."); } finally { setIsSaving(false); } };

    return (
        <div className="space-y-10 sm:space-y-12 font-sans max-w-6xl mx-auto animate-fadeIn">
            <div className="pb-6 border-b border-gray-200/80"> <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center"><FiActivity className="mr-4 text-indigo-600"/> Log Workout</h1> <p className="mt-3 text-lg text-gray-600">Actively track your sets, reps, weight, and time.</p> </div>
            <InfoCard title="Workout Timer" icon={<FiClock />}> <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> <div className={`text-5xl font-mono font-bold text-indigo-700 bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-3 rounded-2xl shadow-inner ${isTimerRunning ? 'animate-pulse' : ''}`}>{formatTime(elapsedSeconds)}</div> <div className="flex gap-3"> {!isTimerRunning ? ( <button onClick={handleStartTimer} disabled={isTimerRunning && elapsedSeconds > 0} className={`flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition duration-200 transform hover:scale-105 ${elapsedSeconds > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}`}><FiPlay className="mr-1.5"/> {elapsedSeconds > 0 ? 'Resume' : 'Start'}</button> ) : ( <button onClick={handlePauseTimer} className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-md transition duration-200 transform hover:scale-105"><FiPause className="mr-1.5"/> Pause</button> )} <button onClick={handleStopTimer} className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md transition duration-200 transform hover:scale-105"><FiSquare className="mr-1.5"/> Reset</button> </div> </div> </InfoCard>
            <InfoCard title="Workout Details" icon={<FiEdit3 />}> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div><label htmlFor="workout-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" id="workout-date" value={workoutDate} onChange={(e) => setWorkoutDate(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div> <div><label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 mb-1">Workout Name <span className="text-xs text-gray-400">(Optional)</span></label><input type="text" id="workout-name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder="e.g., Upper Body Push" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div> <div className="md:col-span-2"><label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-xs text-gray-400">(Optional)</span></label><textarea id="workout-notes" value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} rows="3" placeholder="e.g., Felt strong today, focused on form..." className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div> </div> </InfoCard>

            <div className="text-center">
                <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center justify-center mx-auto px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 ease-in-out transform hover:scale-105"
                >
                    <FiDownload className="mr-2"/> Import Exercises from Plan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                <InfoCard title="Add Exercises" icon={<FaDumbbell />} className="lg:sticky lg:top-6"> {exerciseLoadError && <p className="text-sm text-red-600 mb-3 flex items-center"><FiAlertCircle className="mr-1"/> {exerciseLoadError}</p>} <div className="relative mb-4"> <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span> <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!!exerciseLoadError} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md focus:scale-[1.02] disabled:bg-gray-100 disabled:cursor-not-allowed"/> </div> {searchTerm && !exerciseLoadError && ( <div className="border border-gray-200 rounded-xl max-h-60 overflow-y-auto bg-white shadow-inner">{searchResults.length > 0 ? ( <ul className="divide-y divide-gray-100"> {searchResults.map(ex => ( <li key={ex.id} className="p-3 flex justify-between items-center hover:bg-indigo-50 transition duration-150 group"> <p className="text-sm font-medium text-gray-900">{ex.name} <span className="text-xs text-gray-500">({ex.muscle})</span></p> <button onClick={() => handleAddExercise(ex)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150 transform group-hover:scale-110" title={`Add ${ex.name}`} aria-label={`Add ${ex.name}`}><FiPlusCircle className="h-5 w-5"/></button> </li> ))} </ul> ) : ( <p className="p-4 text-sm text-gray-500 text-center italic">No matching exercises found.</p> )}</div> )} </InfoCard>
                <InfoCard title="Current Workout Log" icon={<FiEdit3 />}> {currentExercises.length > 0 ? ( <ul className="space-y-6"> {currentExercises.map(entry => ( <LoggedExerciseEntry key={entry.exerciseId} entry={entry} onUpdateSet={handleUpdateSetDetails} onRemoveExercise={handleRemoveExercise} onAddSet={handleAddSet} onRemoveSet={handleRemoveSet} /> ))} </ul> ) : ( <p className="text-sm text-gray-500 italic text-center py-6">Add exercises using search or import a plan.</p> )} </InfoCard>
            </div>
            <div className="flex flex-col items-center pt-8 pb-4"> {saveError && ( <div className="mb-4 w-full max-w-xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm flex items-center justify-center" role="alert"><FiAlertCircle className="mr-2 h-4 w-4"/> <span className="block sm:inline">{saveError}</span></div> )} {saveSuccess && ( <div className="mb-4 w-full max-w-xl bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative text-sm flex items-center justify-center" role="alert"><FiCheckSquare className="mr-2 h-4 w-4"/> <span className="block sm:inline">Workout logged successfully!</span></div> )} <button onClick={handleFinishWorkout} disabled={currentExercises.length === 0 || isSaving} className="flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"> {isSaving ? ( <FiLoader className="animate-spin mr-2.5 h-6 w-6"/> ) : ( <FiCheckSquare className="mr-2.5 h-6 w-6"/> )} {isSaving ? 'Saving Workout...' : 'Finish & Log Workout'} </button> </div>
            {finishedLogs.length > 0 && ( <InfoCard title="Saved Workouts (This Session)" icon={<FiList />}> <div className="flex space-x-6 overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"> {finishedLogs.map(log => ( <div key={log.logId} className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"> <div className="flex justify-between items-center mb-3"> <p className="font-semibold text-md text-indigo-800 truncate" title={log.name}>{log.name || "Unnamed Workout"}</p> <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">{log.sessionDate}</span> </div> <p className="text-sm text-gray-600 mb-3">Duration: <span className="font-medium">{formatTime(log.durationSeconds)}</span></p> <details className="text-sm"> <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">View Exercises ({log.exercises.length})</summary> <ul className="mt-2 pl-1 space-y-2 text-gray-700 max-h-40 overflow-y-auto pr-1 scrollbar-thin"> {log.exercises.map(ex => ( <li key={ex.exerciseId} className="border-b border-gray-100 pb-1 last:border-0"> <span className="font-medium text-xs block">{ex.name || ex.exerciseId}</span> <ul className="pl-3 mt-0.5 space-y-0.5"> {ex.sets.map((set, setIndex) => ( <li key={setIndex} className="text-xs text-gray-500 list-disc list-inside"> {set.reps || 0} reps @ {set.weight || 0} {set.unit} </li> ))} </ul> </li> ))} </ul> </details> </div> ))} <div className="flex-shrink-0 w-1"></div> </div> </InfoCard> )}

            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg animate-modalEnter">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Import Workout Plan</h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24}/></button>
                        </div>
                        {isLoadingPlans ? (
                            <div className="flex justify-center items-center py-6"><FiLoader className="animate-spin h-6 w-6 text-indigo-500"/> Loading plans...</div>
                        ) : availablePlans.length === 0 ? (
                            <p className="text-gray-600 text-center">No workout plans available to import. Create one first, or wait for admin approval!</p>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-1">Select a plan to import:</label>
                                    <select
                                        id="plan-select"
                                        value={selectedPlanToImport || ''}
                                        onChange={(e) => setSelectedPlanToImport(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="" disabled>-- Select a Plan --</option>
                                        {availablePlans.map(plan => (
                                            <option key={plan.id} value={plan.id}>{plan.name} ({plan.exercises?.length || 0} exercises)</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100">Cancel</button>
                                    <button
                                        onClick={handleImportPlan}
                                        disabled={!selectedPlanToImport}
                                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Import Selected Plan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LogWorkoutPage;
