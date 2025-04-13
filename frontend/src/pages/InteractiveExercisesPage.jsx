// src/pages/InteractiveExercisesPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiInfo, FiLogIn, FiUserPlus } from 'react-icons/fi';

// Correct the import path if you placed Illustration.jsx in src/components/Muscles/
import Illustration from '../components/Muscles/Illustration';
import ExerciseCard from '../components/common/ExerciseCard';
import { mockExercises } from '../mockData/exercises';

function InteractiveExercisesPage() {
  // State for currently selected muscles (using the same name internally is fine)
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  // Function to add/remove a muscle from the selection
  const toggleMuscle = (muscleName) => {
    setSelectedMuscles((prevSelected) =>
      prevSelected.includes(muscleName)
        ? prevSelected.filter((m) => m !== muscleName) // Remove
        : [...prevSelected, muscleName] // Add
    );
  };

  // Calculate which muscles have exercises available
  // Format needed by Illustration: [{ _id: 'MuscleName' }, ...]
  const exerciseCountForMuscles = useMemo(() => {
    const musclesWithExercises = new Set();
    mockExercises.forEach(ex => {
      if (ex.muscle) {
        musclesWithExercises.add(ex.muscle);
      }
    });
    // Convert the Set into the array of objects format
    return Array.from(musclesWithExercises).map(muscleName => ({ _id: muscleName }));
  }, []); // Runs only once as mockExercises doesn't change

  // Filter exercises based on the selected muscles
  const filteredExercises = useMemo(() => {
    if (selectedMuscles.length === 0) {
      return mockExercises; // Show all if none selected
    }
    return mockExercises.filter(ex =>
      ex.muscle && selectedMuscles.includes(ex.muscle)
    );
  }, [selectedMuscles]); // Reruns when selectedMuscles changes

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">

        {/* Guest Call to Action Header */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
           <div className="flex items-center mb-2 sm:mb-0">
             <FiInfo className="text-2xl mr-3 flex-shrink-0" />
             <p className="text-sm sm:text-base">
               Click on highlighted body parts to filter exercises. <br className="hidden sm:inline"/>
               {selectedMuscles.length > 0 ? `Showing exercises for: ${selectedMuscles.join(', ')}` : 'Showing all exercises.'}
             </p>
           </div>
           <div className="flex gap-2 flex-shrink-0">
             <Link to="/login" className="flex items-center bg-white text-blue-600 text-xs sm:text-sm font-semibold py-1.5 px-3 rounded-md hover:bg-blue-100 transition duration-150 shadow">
               <FiLogIn className="mr-1" /> Login
             </Link>
             <Link to="/register" className="flex items-center bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold py-1.5 px-3 rounded-md hover:bg-purple-200 transition duration-150 shadow">
               <FiUserPlus className="mr-1" /> Sign Up
             </Link>
           </div>
         </div>

        {/* Main Content Area: SVG and Exercise List */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side: Interactive SVG */}
          <div className="w-full lg:w-1/3 flex-shrink-0 bg-white p-4 rounded-lg shadow-lg self-start sticky top-4">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Select Muscle Group</h2>
            <Illustration
              // Pass props with the names expected by the Illustration component
              toggleMuscle={toggleMuscle}
              muscles={selectedMuscles} // Pass selectedMuscles array as 'muscles' prop
              exerciseCount={exerciseCountForMuscles} // Pass the calculated count/list as 'exerciseCount' prop
            />
             {/* Display selected muscles */}
             <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Selected:</p>
                {selectedMuscles.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-2">
                        {selectedMuscles.map(muscle => (
                            <span key={muscle} className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {muscle}
                            </span>
                        ))}
                         <button
                            onClick={() => setSelectedMuscles([])} // Clear selection
                            className="text-xs text-gray-500 hover:text-red-500 underline ml-2"
                         >
                             Clear All
                         </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">None (Showing all)</p>
                )}
             </div>
          </div>

          {/* Right Side: Exercise List */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {selectedMuscles.length > 0 ? `Exercises for ${selectedMuscles.join(' & ')}` : 'All Exercises'}
              <span className="text-base font-normal text-gray-500 ml-2">({filteredExercises.length} found)</span>
            </h2>
            {filteredExercises.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExercises.map(exercise => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Exercises Found</h3>
                <p className="text-gray-500">
                    {selectedMuscles.length > 0
                        ? `There are no exercises listed for ${selectedMuscles.join(', ')} yet.`
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
