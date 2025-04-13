// src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Import desired icons
import { FiPlusSquare, FiTrendingUp, FiCoffee, FiZap, FiClipboard, FiActivity, FiBarChart2, FiTarget } from 'react-icons/fi';

// Simple Card component for dashboard widgets (can be moved to components/common later)
const DashboardCard = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">{title}</h2>
    {children}
  </div>
);

function DashboardPage() {
  // No useAuth hook needed in this version

  // Mock data for recent activity (replace with real data later if needed)
  const recentActivity = [
    { id: 1, type: 'Workout', description: 'Logged Upper Body Workout', date: 'Apr 13, 2025' },
    { id: 2, type: 'Weight', description: 'Logged weight: 75.0 kg', date: 'Apr 12, 2025' },
    { id: 3, type: 'Workout', description: 'Logged Leg Day', date: 'Apr 11, 2025' },
  ];

  return (
    // Apply font-sans and basic page styling
    // Added padding directly here since AppLayout is removed
    <div className="space-y-8 sm:space-y-10 p-6 sm:p-8 md:p-10 font-sans bg-gradient-to-b from-gray-50 via-indigo-50 to-purple-100 min-h-screen">
      {/* Generic Welcome Header */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {/* Generic welcome message */}
          Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Your fitness journey overview.
        </p>
        {/* Simple navigation back to exercises or login */}
         <div className="mt-4 text-sm">
            <Link to="/exercises" className="text-indigo-600 hover:text-indigo-800 mr-4">Browse Exercises</Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-700">(Back to Login)</Link>
         </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Use Link component for navigation - Update paths as needed when pages are built */}
          <Link to="/log-workout" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center">
            <FiPlusSquare className="h-9 w-9 mb-2" />
            <span className="font-semibold text-base">Log Workout</span>
          </Link>
          <Link to="/log-meal" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center">
            <FiCoffee className="h-9 w-9 mb-2" />
            <span className="font-semibold text-base">Log Meal</span>
          </Link>
           <Link to="/track-weight" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center">
            <FiTrendingUp className="h-9 w-9 mb-2" />
            <span className="font-semibold text-base">Log Weight</span>
          </Link>
           <Link to="/workout-plans" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center">
            <FiZap className="h-9 w-9 mb-2" />
            <span className="font-semibold text-base">My Plans</span>
          </Link>
        </div>
      </div>

      {/* Grid for Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">

        {/* Recent Activity Card */}
        <DashboardCard title="Recent Activity" className="lg:col-span-1">
            {recentActivity.length > 0 ? (
                <ul className="space-y-4">
                    {recentActivity.map(activity => (
                        <li key={activity.id} className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                             <div className={`p-1.5 rounded-full ${
                                activity.type === 'Workout' ? 'bg-indigo-100 text-indigo-600' :
                                activity.type === 'Weight' ? 'bg-blue-100 text-blue-600' :
                                activity.type === 'Meal' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {activity.type === 'Workout' ? <FiActivity size={16}/> :
                                 activity.type === 'Weight' ? <FiTrendingUp size={16}/> :
                                 activity.type === 'Meal' ? <FiCoffee size={16}/> :
                                 <FiClipboard size={16}/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                                <p className="text-xs text-gray-500">{activity.date}</p>
                            </div>
                        </li>
                    ))}
                     {/* Update link path when activity log page exists */}
                     <Link to="/activity-log" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 pt-3 inline-block">View all activity &rarr;</Link>
                </ul>
            ) : (
                 <p className="text-gray-500 text-sm italic">No recent activity recorded yet.</p>
            )}
        </DashboardCard>

        {/* Progress Overview Card */}
        <DashboardCard title="Progress Overview" className="lg:col-span-1">
          <p className="text-gray-500 text-sm italic mb-4">
            Charts showing your progress will appear here soon.
          </p>
          {/* Placeholder for mini charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
                <FiBarChart2 className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
                <p className="text-xs text-gray-500">Weight Chart</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg text-center">
                <FiTarget className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
                <p className="text-xs text-gray-500">Calorie Goal</p>
            </div>
          </div>
        </DashboardCard>

      </div>
    </div>
  );
}

export default DashboardPage;
