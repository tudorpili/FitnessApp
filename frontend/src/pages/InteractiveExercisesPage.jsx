// src/pages/InteractiveExercisesPage.jsx
import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { Link } from 'react-router-dom';
import { FiTrash2, FiX, FiLoader, FiAlertCircle } from 'react-icons/fi'; // Added Loader, Alert icons

import Illustration from '../components/Muscles/Illustration';
import ExerciseCard from '../components/common/ExerciseCard';
// Removed: import { mockExercises } from '../mockData/exercises'; // No longer using mock data here

// Define the base URL for the API - use environment variables in a real app
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port if needed

function InteractiveExercisesPage() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  // --- NEW: State for fetched exercises, loading, and errors ---
  const [exercises, setExercises] = useState([]); // Start with empty array
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const [error, setError] = useState(null); // To store any fetch errors
  // --- END NEW ---

  // --- NEW: Fetch exercises from API on component mount ---
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true); // Set loading true when fetch starts
      setError(null); // Clear previous errors
      console.log("Fetching exercises from API...");
      try {
        const response = await fetch(`${API_BASE_URL}/exercises`);
        if (!response.ok) {
          // Throw an error if response status is not 2xx
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data);

        // --- IMPORTANT: Parse the 'videos' JSON string ---
        const parsedData = data.map(ex => {
          let parsedVideos = null;
          if (ex.videos && typeof ex.videos === 'string') {
            try {
              parsedVideos = JSON.parse(ex.videos);
            } catch (parseError) {
              console.error(`Error parsing videos JSON for exercise ${ex.id}:`, parseError);
              // Keep videos as null or empty array if parsing fails
              parsedVideos = [];
            }
          } else if (Array.isArray(ex.videos)) {
             // If it's already an array (less likely from mysql2 default), use it directly
             parsedVideos = ex.videos;
          }
          return { ...ex, videos: parsedVideos }; // Return exercise with parsed videos array
        });
        // --- END PARSING ---

        setExercises(parsedData); // Update state with fetched and parsed data
        console.log("Exercises state updated.");

      } catch (err) {
        console.error("Failed to fetch exercises:", err);
        setError(err.message || 'Failed to load exercises. Please try again later.');
      } finally {
        setIsLoading(false); // Set loading false when fetch finishes (success or error)
      }
    };

    fetchExercises();
  }, []); // Empty dependency array means this runs only once on mount
  // --- END NEW ---


  const toggleMuscle = (muscleName) => {
    setSelectedMuscles((prevSelected) =>
      prevSelected.includes(muscleName)
        ? prevSelected.filter((m) => m !== muscleName)
        : [...prevSelected, muscleName]
    );
  };

  // Calculate enabled muscles based on fetched exercises
  const exerciseCountForMuscles = useMemo(() => {
    const musclesWithExercises = new Set();
    // Use the 'exercises' state variable now
    exercises.forEach(ex => {
      if (ex.muscle) {
        musclesWithExercises.add(ex.muscle);
      }
    });
    return Array.from(musclesWithExercises).map(muscleName => ({ _id: muscleName }));
  }, [exercises]); // Depend on fetched exercises state

  // Filter exercises based on fetched exercises state
  const filteredExercises = useMemo(() => {
    if (selectedMuscles.length === 0) {
      return exercises; // Use fetched exercises state
    }
    // Use the 'exercises' state variable now
    return exercises.filter(ex =>
      ex.muscle && selectedMuscles.includes(ex.muscle)
    );
  }, [selectedMuscles, exercises]); // Depend on selectedMuscles and fetched exercises

  return (
    <div className="font-sans animate-fadeIn">
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">

          {/* Left Side: Interactive SVG */}
          <div className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0 self-start lg:sticky lg:top-6">
             <div className="bg-white/70 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-center mb-5 text-gray-800 tracking-tight">Select Muscle Group</h2>
                {/* Pass potentially updated exercise count */}
                <Illustration
                  toggleMuscle={toggleMuscle}
                  muscles={selectedMuscles}
                  exerciseCount={exerciseCountForMuscles}
                />
                {/* Selected muscles display */}
                <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-600 mb-3">Selected:</p>
                    {selectedMuscles.length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {selectedMuscles.map(muscle => ( <span key={muscle} className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow"> {muscle} <button onClick={() => toggleMuscle(muscle)} className="ml-1.5 -mr-0.5 text-red-100 hover:text-white opacity-70 hover:opacity-100"><FiX size={12} /></button> </span> ))}
                             <button onClick={() => setSelectedMuscles([])} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition duration-150" title="Clear selection" aria-label="Clear selection"> <FiTrash2 size={16} /> </button>
                        </div>
                    ) : ( <p className="text-sm text-gray-400 italic">Click on the body</p> )}
                </div>
             </div>
          </div>

          {/* Right Side: Exercise List */}
          <div className="w-full lg:w-2/3">
             <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight mt-2 lg:mt-0">
              {selectedMuscles.length > 0 ? `Exercises for ${selectedMuscles.join(' & ')}` : 'All Exercises'}
              {/* Show count only when not loading/error */}
              {!isLoading && !error && <span className="text-lg font-medium text-gray-500 ml-3">({filteredExercises.length} found)</span>}
            </h2>

            {/* --- NEW: Loading and Error States --- */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <span className="ml-3 text-gray-600">Loading Exercises...</span>
                </div>
            )}
            {error && !isLoading && (
                 <div className="text-center py-12 px-6 bg-red-50 backdrop-blur-md rounded-2xl shadow-lg border border-red-200/50">
                    <FiAlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3"/>
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Loading Failed</h3>
                    <p className="text-red-600 text-sm">{error}</p>
                    {/* Optional: Add a retry button */}
                </div>
            )}
            {/* --- END NEW --- */}

            {/* Display exercises only if not loading and no error */}
            {!isLoading && !error && (
                <>
                    {filteredExercises.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredExercises.map(exercise => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-12 px-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exercises Found</h3>
                        <p className="text-gray-500">
                            {selectedMuscles.length > 0
                                ? `No exercises match the selected muscle group(s).`
                                : `No exercises available.`}
                        </p>
                    </div>
                    )}
                </>
            )}
          </div>
        </div>
      {/* </div> End Container */}
    </div> // End Page div
  );
}

export default InteractiveExercisesPage;
