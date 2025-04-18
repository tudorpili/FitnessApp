// src/pages/InteractiveExercisesPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiInfo, FiLogIn, FiUserPlus, FiTrash2 } from 'react-icons/fi'; // Added FiTrash2

// Correct the import path if you placed Illustration.jsx in src/components/Muscles/
import Illustration from '../components/Muscles/Illustration';
import ExerciseCard from '../components/common/ExerciseCard'; // Assuming ExerciseCard uses enhanced UI
import { mockExercises } from '../mockData/exercises'; // Using single-muscle version

function InteractiveExercisesPage() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const toggleMuscle = (muscleName) => {
    setSelectedMuscles((prevSelected) =>
      prevSelected.includes(muscleName)
        ? prevSelected.filter((m) => m !== muscleName)
        : [...prevSelected, muscleName]
    );
  };

  // Calculate which muscles have exercises available
  const exerciseCountForMuscles = useMemo(() => {
    const musclesWithExercises = new Set();
    mockExercises.forEach(ex => {
      // Ensure muscle property exists and is truthy
      if (ex.muscle) {
        musclesWithExercises.add(ex.muscle);
      }
    });
    return Array.from(musclesWithExercises).map(muscleName => ({ _id: muscleName }));
  }, []); // Dependency array is empty as mockExercises is static

  // Filter exercises based on the selected muscles
  const filteredExercises = useMemo(() => {
    if (selectedMuscles.length === 0) {
      return mockExercises;
    }
    return mockExercises.filter(ex =>
      ex.muscle && selectedMuscles.includes(ex.muscle)
    );
  }, [selectedMuscles]);

  return (
    // Apply consistent page background and font
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50 to-purple-100 py-10 sm:py-16 font-sans">
      {/* Increased overall padding */}
      <div className="container mx-auto px-6 lg:px-8">

        {/* Guest Call to Action Header - Refined style */}
        <div className="mb-10 p-5 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
           {/* ... (Header content remains largely the same, maybe adjust text/button styles) ... */}
            <div className="flex items-center text-center sm:text-left"> <FiInfo className="text-3xl mr-4 flex-shrink-0 hidden sm:block" /> <div> <p className="font-semibold tracking-wide"> Click highlighted body parts to filter exercises. </p> <p className="text-sm text-blue-100 tracking-wide"> {selectedMuscles.length > 0 ? `Showing: ${selectedMuscles.join(', ')}` : 'Showing all exercises.'} </p> </div> </div> <div className="flex gap-3 flex-shrink-0"> <Link to="/login" className="flex items-center bg-white text-blue-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5"> <FiLogIn className="mr-1.5" /> Login </Link> <Link to="/register" className="flex items-center bg-purple-200 text-purple-800 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-purple-300 transition duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5"> <FiUserPlus className="mr-1.5" /> Sign Up </Link> </div>
         </div>

        {/* Main Content Area: Increased gap */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">

          {/* Left Side: Interactive SVG */}
          {/* --- MODIFIED: Added lg: prefix to sticky and top- classes --- */}
          <div className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0 self-start lg:sticky lg:top-6">
             {/* Applied consistent card styling */}
             <div className="bg-white/70 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-center mb-5 text-gray-800 tracking-tight">Select Muscle Group</h2>
                <Illustration
                  toggleMuscle={toggleMuscle}
                  muscles={selectedMuscles}
                  exerciseCount={exerciseCountForMuscles}
                />
                {/* Display selected muscles - Enhanced styling */}
                <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-600 mb-3">Selected:</p>
                    {selectedMuscles.length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {selectedMuscles.map(muscle => (
                                <span key={muscle} className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    {muscle}
                                     {/* Optional: Add remove button per muscle */}
                                     <button onClick={() => toggleMuscle(muscle)} className="ml-1.5 -mr-0.5 text-red-100 hover:text-white opacity-70 hover:opacity-100"><FiX size={12} /></button>
                                </span>
                            ))}
                             <button onClick={() => setSelectedMuscles([])} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition duration-150" title="Clear selection" aria-label="Clear selection">
                                 <FiTrash2 size={16} />
                             </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Click on the body</p>
                    )}
                </div>
             </div>
          </div>
          {/* --- END MODIFICATION --- */}


          {/* Right Side: Exercise List */}
          <div className="w-full lg:w-2/3">
             <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight"> {/* Larger heading */}
              {selectedMuscles.length > 0 ? `Exercises for ${selectedMuscles.join(' & ')}` : 'All Exercises'}
              <span className="text-lg font-medium text-gray-500 ml-3">({filteredExercises.length} found)</span>
            </h2>
            {/* Use enhanced ExerciseCard component */}
            {filteredExercises.length > 0 ? (
              // Adjusted grid columns for potentially 4-wide on largest screens
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
                {filteredExercises.map(exercise => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exercises Found</h3>
                <p className="text-gray-500">
                    {selectedMuscles.length > 0
                        ? `Try selecting a different muscle group.`
                        : `No exercises available.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveExercisesPage;
