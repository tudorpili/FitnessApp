// src/pages/InteractiveExercisesPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiX } from 'react-icons/fi';


import Illustration from '../components/Muscles/Illustration';
import ExerciseCard from '../components/common/ExerciseCard'; 
import { mockExercises } from '../mockData/exercises';

function InteractiveExercisesPage() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const toggleMuscle = (muscleName) => {
    setSelectedMuscles((prevSelected) =>
      prevSelected.includes(muscleName)
        ? prevSelected.filter((m) => m !== muscleName)
        : [...prevSelected, muscleName]
    );
  };

  const exerciseCountForMuscles = useMemo(() => {
    const musclesWithExercises = new Set();
    mockExercises.forEach(ex => {
      if (ex.muscle) {
        musclesWithExercises.add(ex.muscle);
      }
    });
    return Array.from(musclesWithExercises).map(muscleName => ({ _id: muscleName }));
  }, []); 

  const filteredExercises = useMemo(() => {
    if (selectedMuscles.length === 0) {
      return mockExercises;
    }
    return mockExercises.filter(ex =>
      ex.muscle && selectedMuscles.includes(ex.muscle)
    );
  }, [selectedMuscles]);

  return (
    <div className="font-sans animate-fadeIn"> 
 

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">

          <div className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0 self-start lg:sticky lg:top-6">
             <div className="bg-white/70 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-center mb-5 text-gray-800 tracking-tight">Select Muscle Group</h2>
                <Illustration
                  toggleMuscle={toggleMuscle}
                  muscles={selectedMuscles}
                  exerciseCount={exerciseCountForMuscles}
                />
                <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-600 mb-3">Selected:</p>
                    {selectedMuscles.length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {selectedMuscles.map(muscle => (
                                <span key={muscle} className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    {muscle}
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

          <div className="w-full lg:w-2/3">
             <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight mt-2 lg:mt-0">
              {selectedMuscles.length > 0 ? `Exercises for ${selectedMuscles.join(' & ')}` : 'All Exercises'}
              <span className="text-lg font-medium text-gray-500 ml-3">({filteredExercises.length} found)</span>
            </h2>
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
                        ? `Try selecting a different muscle group.`
                        : `No exercises available.`}
                </p>
              </div>
            )}
          </div>
        </div>
      
    </div>
  );
}

export default InteractiveExercisesPage;
