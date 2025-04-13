// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
import { FiPlusSquare, FiTrendingUp, FiCoffee, FiZap } from 'react-icons/fi'; // Example icons

function DashboardPage() {
  const { user } = useAuth(); // Get user info from context

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="mt-1 text-md text-gray-600">
          Ready to crush your goals today? Let's get started.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Example Quick Action Card */}
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
            <FiPlusSquare className="h-8 w-8 mb-2" />
            <span className="font-semibold">Log Workout</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
            <FiCoffee className="h-8 w-8 mb-2" />
            <span className="font-semibold">Log Meal</span>
          </button>
           <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
            <FiTrendingUp className="h-8 w-8 mb-2" />
            <span className="font-semibold">Log Weight</span>
          </button>
           <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
            <FiZap className="h-8 w-8 mb-2" />
            <span className="font-semibold">Start Plan</span>
          </button>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">Your recent workouts and logs will appear here...</p>
        {/* Later: Map over recent workout data */}
      </div>

       {/* Placeholder for Progress Overview */}
       <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress Overview</h2>
        <p className="text-gray-500 text-sm">Charts showing your weight trends, calorie intake, etc., will go here...</p>
         {/* Later: Add Chart components */}
      </div>

    </div>
  );
}

export default DashboardPage;
