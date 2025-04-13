// src/pages/ExercisesPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockExercises } from '../mockData/exercises'; // Import mock data
import ExerciseCard from '../components/common/ExerciseCard'; // Import card component
import { FiSearch, FiFilter, FiLogIn, FiUserPlus } from 'react-icons/fi'; // Import icons

function ExercisesPage() {
  // State for search term and muscle group filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Memoize unique muscle groups and difficulties for filter dropdowns
  const muscleGroups = useMemo(() => [...new Set(mockExercises.map(ex => ex.muscle).filter(Boolean))], []);
  const difficulties = useMemo(() => [...new Set(mockExercises.map(ex => ex.difficulty).filter(Boolean))], []);


  // Filter exercises based on search term and selected filters
  const filteredExercises = useMemo(() => {
    return mockExercises.filter(ex => {
      const nameMatch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const muscleMatch = filterMuscle ? ex.muscle?.toLowerCase() === filterMuscle.toLowerCase() : true;
      const difficultyMatch = filterDifficulty ? ex.difficulty?.toLowerCase() === filterDifficulty.toLowerCase() : true;
      return nameMatch && muscleMatch && difficultyMatch;
    });
  }, [searchTerm, filterMuscle, filterDifficulty]);


  return (
    // Main container - Add padding. We'll wrap this in the main layout later.
    // Using a subtle background gradient
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 py-8 sm:py-12">
      <div className="container mx-auto px-4">

        {/* Header Section for Guests */}
        <div className="text-center mb-10 p-6 md:p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            Explore Exercises
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
            Discover a wide range of exercises to build your perfect workout plan. Sign up or log in to track your progress!
          </p>
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              to="/register"
              className="flex items-center justify-center w-full sm:w-auto bg-white text-indigo-600 font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-100 transition duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              <FiUserPlus className="mr-2" /> Sign Up to Track
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center w-full sm:w-auto bg-transparent border-2 border-white text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white hover:text-indigo-600 transition duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              <FiLogIn className="mr-2" /> Login
            </Link>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-10 p-5 bg-white rounded-lg shadow-lg flex flex-col lg:flex-row gap-4 items-center sticky top-0 z-10"> {/* Made sticky */}
          {/* Search Input */}
          <div className="relative flex-grow w-full lg:w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          {/* Muscle Group Filter */}
          <div className="relative w-full lg:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiFilter />
            </span>
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition"
              aria-label="Filter by muscle group"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
           {/* Difficulty Filter */}
           <div className="relative w-full lg:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiFilter /> {/* Can use a different icon if desired */}
            </span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition"
              aria-label="Filter by difficulty"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredExercises.map(exercise => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          // Message when no exercises match filters
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exercises Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ExercisesPage;
