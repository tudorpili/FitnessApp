// src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  FiGrid, FiActivity, FiBarChart2, FiCoffee, FiTarget, FiClipboard,
  FiMenu, FiX, FiSettings} from 'react-icons/fi';
  import { FaCalculator } from 'react-icons/fa';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
    }`;

  const sidebarNavigation = (
     <nav className="flex-1 space-y-1.5 px-2">
        <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiGrid className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Dashboard</span> </NavLink>
        <NavLink to="/log-workout" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiActivity className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Workout</span> </NavLink>
        <NavLink to="/track-weight" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBarChart2 className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Weight</span> </NavLink>
        <NavLink to="/track-calories" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiTarget className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Calories</span> </NavLink>
        <NavLink to="/log-meal" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiCoffee className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Meal</span> </NavLink>
        <NavLink to="/exercises" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Exercises</span> </NavLink>
        {/* --- NEW: Calculators Link --- */}
        <NavLink to="/calculators" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <FaCalculator className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">Calculators</span>
        </NavLink>
         {/* --- END NEW --- */}
        <div className="pt-4 mt-4 border-t border-gray-200">
             <NavLink to="/settings" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiSettings className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Settings</span> </NavLink>
             <NavLink to="/login" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Back to Login</span> </NavLink>
        </div>
     </nav>
  );

  return (
    // Main layout container
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
        {/* --- Universal Off-canvas Sidebar --- */}
        <div className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out ${ isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none' }`} role="dialog" aria-modal="true">
            {/* Sidebar Panel */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white pt-5 pb-4 shadow-xl border-r border-gray-200">
                {/* Close Button */}
                <div className="absolute top-0 right-0 pt-2 pr-2 z-50"><button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 text-gray-500 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}><span className="sr-only">Close sidebar</span><FiX className="h-6 w-6" aria-hidden="true" /></button></div>
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 px-4 h-16"><Link to="/dashboard" className="text-2xl font-bold text-indigo-600 tracking-tight" onClick={() => setIsSidebarOpen(false)}>FitnessApp</Link></div>
                {/* Navigation */}
                <div className="mt-5 flex-1 h-0 overflow-y-auto">{sidebarNavigation}</div>
            </div>
        </div>
        {/* --- Main Content Area --- */}
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
            {/* Header Area */}
            <div className="sticky top-0 z-30 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80">
                {/* Persistent Sidebar Toggle Button */}
                <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100/50" onClick={() => setIsSidebarOpen(true)}><span className="sr-only">Open sidebar</span><FiMenu className="h-6 w-6" aria-hidden="true" /></button>
                {/* Optional Header Content */}
                <div className="flex-1 px-4 flex justify-between items-center"><div className="flex-1 flex"></div><div className="ml-4 flex items-center md:ml-6"></div></div>
            </div>
            {/* Page Content */}
            <main className="flex-1"><div className="py-8 px-4 sm:px-6 md:px-8"><Outlet /></div></main>
        </div>
    </div>
  );
}

export default AppLayout;
