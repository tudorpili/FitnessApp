// src/pages/LogWorkoutPage.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { mockExercises } from '../mockData/exercises'; // Using single-muscle version
import {
    FiSearch, FiPlusCircle, FiTrash2, FiCalendar, FiSave, FiEdit3, FiCheckSquare,
    FiActivity, FiPlay, FiPause, FiSquare, FiPlus, FiClock, FiList, FiRepeat, FiMaximize2 // Added icons
} from 'react-icons/fi';
import { FaDumbbell, FaWeightHanging } from 'react-icons/fa'; // Added weight icon

// Helper to get today's date
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to format seconds into MM:SS
const formatTime = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || totalSeconds < 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


// Enhanced Card component with glassmorphism
const InfoCard = ({ title, children, className = '', icon }) => (
  // Using rounded-3xl, softer shadow, glassmorphism
  <div className={`bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg shadow-indigo-100/50 p-6 sm:p-8 ${className}`}>
    <h2 className="text-xl font-bold text-gray-800 mb-5 tracking-tight flex items-center">
        {icon && <span className="mr-3 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

// Enhanced component for displaying and editing sets
const LoggedExerciseEntry = ({ entry, onUpdateSet, onRemoveExercise, onAddSet, onRemoveSet }) => {
    return (
        // Use card styling for the whole exercise entry
        <li className="bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-md p-5 space-y-4 transition-all duration-300 ease-out animate-fadeIn">
            {/* Exercise Header */}
            <div className="flex justify-between items-center pb-3 border-b border-indigo-100">
                <p className="text-lg font-semibold text-indigo-900 tracking-wide">{entry.name}</p>
                <button onClick={() => onRemoveExercise(entry.exerciseId)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0" title={`Remove ${entry.name}`} aria-label={`Remove ${entry.name}`}>
                    <FiTrash2 className="h-5 w-5"/>
                </button>
            </div>

            {/* List of Sets */}
            <ul className="space-y-3">
                {entry.sets.map((set, setIndex) => (
                    // Styling for each set row
                    <li key={set.id} className="flex flex-col sm:flex-row gap-3 items-center bg-white/80 p-3 rounded-xl border border-indigo-100 shadow-sm animate-fadeIn">
                        <span className="text-sm font-semibold text-indigo-600 mr-2 w-12 text-center sm:text-left">Set {setIndex + 1}</span>
                        {/* Reps Input */}
                        <div className="flex-1 w-full sm:w-auto relative">
                            <FiRepeat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                            <label htmlFor={`reps-${entry.exerciseId}-${set.id}`} className="sr-only">Reps</label>
                            <input type="number" id={`reps-${entry.exerciseId}-${set.id}`} value={set.reps} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'reps', e.target.value)} placeholder="Reps" min="0" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"/>
                        </div>
                        {/* Weight Input */}
                        <div className="flex-1 w-full sm:w-auto relative">
                             <FaWeightHanging className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                            <label htmlFor={`weight-${entry.exerciseId}-${set.id}`} className="sr-only">Weight</label>
                            <input type="number" id={`weight-${entry.exerciseId}-${set.id}`} value={set.weight} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'weight', e.target.value)} placeholder="Weight" step="0.1" min="0" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"/>
                        </div>
                        {/* Unit Select */}
                        <div className="self-center">
                            <label htmlFor={`unit-${entry.exerciseId}-${set.id}`} className="sr-only">Unit</label>
                            <select id={`unit-${entry.exerciseId}-${set.id}`} value={set.unit} onChange={(e) => onUpdateSet(entry.exerciseId, setIndex, 'unit', e.target.value)} className="px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 h-[42px]">
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                        {/* Remove Set Button */}
                        {entry.sets.length > 1 && ( <button onClick={() => onRemoveSet(entry.exerciseId, set.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150" title="Remove set" aria-label="Remove set"> <FiTrash2 className="h-4 w-4" /> </button> )}
                    </li>
                ))}
            </ul>

            {/* Add Set Button - Enhanced style */}
            <button onClick={() => onAddSet(entry.exerciseId)} className="w-full sm:w-auto mt-3 flex items-center justify-center px-4 py-2 border-2 border-dashed border-indigo-300 text-sm font-medium rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-200 ease-in-out group">
                <FiPlus className="mr-1.5 h-4 w-4 group-hover:scale-110 transition-transform"/> Add Set
            </button>
        </li>
    );
};


// --- Main LogWorkoutPage Component ---
function LogWorkoutPage() {
    const [workoutDate, setWorkoutDate] = useState(getTodayDate());
    const [workoutName, setWorkoutName] = useState('');
    const [workoutNotes, setWorkoutNotes] = useState('');
    const [currentExercises, setCurrentExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerIntervalRef = useRef(null);
    const [finishedLogs, setFinishedLogs] = useState([]);
    //const [showSavedDetailId, setShowSavedDetailId] = useState(null); // State for saved log expansion

    // Timer Effect
    useEffect(() => {
        if (isTimerRunning) {
            timerIntervalRef.current = setInterval(() => { setElapsedSeconds(prev => prev + 1); }, 1000);
        } else { clearInterval(timerIntervalRef.current); }
        return () => clearInterval(timerIntervalRef.current);
    }, [isTimerRunning]);

    // Timer Controls
    const handleStartTimer = () => setIsTimerRunning(true);
    const handlePauseTimer = () => setIsTimerRunning(false);
    const handleStopTimer = () => { setIsTimerRunning(false); setElapsedSeconds(0); };

    // Filter exercises
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const addedIds = new Set(currentExercises.map(ex => ex.exerciseId));
        return mockExercises.filter(ex => !addedIds.has(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 8);
    }, [searchTerm, currentExercises]);

    // Exercise/Set Handlers (logic remains the same)
    const handleAddExercise = (exercise) => { setCurrentExercises(prev => [ ...prev, { exerciseId: exercise.id, name: exercise.name, sets: [{ id: `set-${Date.now()}`, reps: '', weight: '', unit: 'kg' }] } ]); setSearchTerm(''); };
    const handleRemoveExercise = (exerciseIdToRemove) => { setCurrentExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseIdToRemove)); };
    const handleAddSet = (exerciseId) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const newSet = { id: `set-${Date.now()}-${ex.sets.length}`, reps: '', weight: '', unit: ex.sets[ex.sets.length - 1]?.unit || 'kg' }; return { ...ex, sets: [...ex.sets, newSet] }; } return ex; })); };
    const handleRemoveSet = (exerciseId, setIdToRemove) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const updatedSets = ex.sets.filter(set => set.id !== setIdToRemove); return { ...ex, sets: updatedSets.length > 0 ? updatedSets : [{ id: `set-${Date.now()}-0`, reps: '', weight: '', unit: 'kg' }] }; } return ex; })); }; // Ensure at least one set remains after delete
    const handleUpdateSetDetails = (exerciseId, setIndex, field, value) => { setCurrentExercises(prev => prev.map(ex => { if (ex.exerciseId === exerciseId) { const updatedSets = ex.sets.map((set, index) => { if (index === setIndex) { return { ...set, [field]: value }; } return set; }); return { ...ex, sets: updatedSets }; } return ex; })); };

    // Finish workout
    const handleFinishWorkout = () => {
        handlePauseTimer();
        const workoutLog = {
            logId: `log-${Date.now()}`, date: workoutDate, name: workoutName || `Workout on ${workoutDate}`,
            notes: workoutNotes, durationSeconds: elapsedSeconds,
            exercises: currentExercises.map(ex => ({
                exerciseId: ex.exerciseId, name: ex.name,
                sets: ex.sets.map(set => ({
                    reps: set.reps ? parseInt(set.reps, 10) : 0,
                    weight: set.weight ? parseFloat(set.weight) : 0,
                    unit: set.unit || 'kg'
                })).filter(set => set.reps > 0 || set.weight > 0)
            })).filter(ex => ex.sets.length > 0)
        };
        if (workoutLog.exercises.length === 0) { alert("Please add at least one exercise with set details before finishing."); return; }
        console.log("--- Workout Log Finished (Mock Save) ---");
        console.log(JSON.stringify(workoutLog, null, 2));
        setFinishedLogs(prevLogs => [workoutLog, ...prevLogs]);
        // Simple success feedback
        alert(`Workout for ${workoutDate} (Duration: ${formatTime(elapsedSeconds)}) logged! (Session only)`);
        setCurrentExercises([]); setWorkoutName(''); setWorkoutNotes('');
        setWorkoutDate(getTodayDate()); setElapsedSeconds(0);
    };


    return (
         // Added page gradient, enhanced spacing, overall font
        <div className="space-y-10 sm:space-y-12 font-sans max-w-6xl mx-auto animate-fadeIn">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center"><FiActivity className="mr-4 text-indigo-600"/> Log Workout</h1>
                 <p className="mt-3 text-lg text-gray-600">Actively track your sets, reps, weight, and time.</p>
            </div>

            {/* Timer Section - Enhanced Styling */}
            <InfoCard title="Workout Timer" icon={<FiClock />}>
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Timer Display with Pulse Animation */}
                     <div className={`text-5xl font-mono font-bold text-indigo-700 bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-3 rounded-2xl shadow-inner ${isTimerRunning ? 'animate-pulse' : ''}`}>
                         {formatTime(elapsedSeconds)}
                     </div>
                     {/* Control Buttons */}
                     <div className="flex gap-3">
                         {!isTimerRunning ? (
                             <button onClick={handleStartTimer} disabled={isTimerRunning && elapsedSeconds > 0} className={`flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition duration-200 transform hover:scale-105 ${elapsedSeconds > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}`}>
                                 <FiPlay className="mr-1.5"/> {elapsedSeconds > 0 ? 'Resume' : 'Start'}
                             </button>
                         ) : (
                             <button onClick={handlePauseTimer} className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-md transition duration-200 transform hover:scale-105">
                                 <FiPause className="mr-1.5"/> Pause
                             </button>
                         )}
                         <button onClick={handleStopTimer} className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md transition duration-200 transform hover:scale-105">
                             <FiSquare className="mr-1.5"/> Reset
                         </button>
                     </div>
                 </div>
            </InfoCard>

            {/* Workout Details Form */}
             <InfoCard title="Workout Details" icon={<FiEdit3 />}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ... (Inputs remain largely the same, using rounded-xl) ... */}
                    <div><label htmlFor="workout-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" id="workout-date" value={workoutDate} onChange={(e) => setWorkoutDate(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
                    <div><label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 mb-1">Workout Name <span className="text-xs text-gray-400">(Optional)</span></label><input type="text" id="workout-name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder="e.g., Upper Body Push" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
                    <div className="md:col-span-2"><label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-xs text-gray-400">(Optional)</span></label><textarea id="workout-notes" value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} rows="3" placeholder="e.g., Felt strong today, focused on form..." className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                 </div>
            </InfoCard>

            {/* Grid for Add Exercises & Current Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                {/* Add Exercises Section */}
                <InfoCard title="Add Exercises" icon={<FaDumbbell />} className="lg:sticky lg:top-6">
                    {/* Search Input - Enhanced */}
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span>
                        <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md focus:scale-[1.02]"/>
                    </div>
                    {/* Search Results */}
                    {searchTerm && ( <div className="border border-gray-200 rounded-xl max-h-60 overflow-y-auto bg-white shadow-inner">{searchResults.length > 0 ? ( <ul className="divide-y divide-gray-100"> {searchResults.map(ex => ( <li key={ex.id} className="p-3 flex justify-between items-center hover:bg-indigo-50 transition duration-150 group"> <p className="text-sm font-medium text-gray-900">{ex.name} <span className="text-xs text-gray-500">({ex.muscle})</span></p> <button onClick={() => handleAddExercise(ex)} className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-full transition-all duration-150 transform group-hover:scale-110" title={`Add ${ex.name}`} aria-label={`Add ${ex.name}`}><FiPlusCircle className="h-5 w-5"/></button> </li> ))} </ul> ) : ( <p className="p-4 text-sm text-gray-500 text-center italic">No matching exercises found.</p> )}</div> )}
                </InfoCard>

                {/* Current Workout Log Section */}
                <InfoCard title="Current Workout Log" icon={<FiEdit3 />}>
                    {currentExercises.length > 0 ? ( <ul className="space-y-6"> {currentExercises.map(entry => ( <LoggedExerciseEntry key={entry.exerciseId} entry={entry} onUpdateSet={handleUpdateSetDetails} onRemoveExercise={handleRemoveExercise} onAddSet={handleAddSet} onRemoveSet={handleRemoveSet} /> ))} </ul> ) : ( <p className="text-sm text-gray-500 italic text-center py-6">Add exercises using the search above.</p> )}
                </InfoCard>
            </div>


            {/* Finish Button */}
            <div className="flex justify-center pt-8 pb-4">
                 <button onClick={handleFinishWorkout} disabled={currentExercises.length === 0} className="flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed">
                    <FiCheckSquare className="mr-2.5 h-6 w-6"/> Finish & Log Workout
                </button>
            </div>

            {/* Saved Workouts Display (Horizontal Scroll Gallery) */}
            {finishedLogs.length > 0 && (
                 <InfoCard title="Saved Workouts (This Session)" icon={<FiList />}>
                    {/* Horizontal scroll container */}
                    <div className="flex space-x-6 overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                        {finishedLogs.map(log => (
                            // Individual log card in the gallery
                            <div key={log.logId} className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="font-semibold text-md text-indigo-800 truncate" title={log.name}>{log.name}</p>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">{log.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Duration: <span className="font-medium">{formatTime(log.durationSeconds)}</span></p>
                                <details className="text-sm">
                                    <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">View Exercises ({log.exercises.length})</summary>
                                    <ul className="mt-2 pl-1 space-y-2 text-gray-700 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                                        {log.exercises.map(ex => (
                                            <li key={ex.exerciseId} className="border-b border-gray-100 pb-1 last:border-0">
                                                <span className="font-medium text-xs block">{ex.name}</span>
                                                <ul className="pl-3 mt-0.5 space-y-0.5">
                                                    {ex.sets.map((set, setIndex) => (
                                                        <li key={setIndex} className="text-xs text-gray-500 list-disc list-inside">
                                                            {set.reps} reps @ {set.weight} {set.unit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        ))}
                         {/* Add padding at the end for scroll spacing */}
                         <div className="flex-shrink-0 w-1"></div>
                    </div>
                 </InfoCard>
            )}

        </div> // End Page Container
    );
}

export default LogWorkoutPage;
