// src/components/layout/GuestLayout.jsx
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { FiLogIn, FiUserPlus, FiBookOpen, FiClipboard } from 'react-icons/fi'; // Icons for links

function GuestLayout() {

  // Simple NavLink styling for guest header
   const guestNavLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    }`;


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-stone-100 font-sans">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-200/80">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/exercises" className="text-xl font-bold text-indigo-600 tracking-tight">
            FitnessApp (Guest)
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             <NavLink to="/exercises" className={guestNavLinkClass}>
                <FiClipboard className="mr-1.5 h-4 w-4" /> Exercises
             </NavLink>
             <NavLink to="/recipes" className={guestNavLinkClass}>
                 <FiBookOpen className="mr-1.5 h-4 w-4" /> Recipes
             </NavLink>
             <div className="w-px h-6 bg-gray-300 mx-2"></div> {/* Separator */}
             <NavLink to="/login" className={guestNavLinkClass}>
                 <FiLogIn className="mr-1.5 h-4 w-4" /> Login
             </NavLink>
             <NavLink to="/register" className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm">
                 <FiUserPlus className="mr-1.5 h-4 w-4" /> Sign Up
             </NavLink>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet /> {/* Renders the matched guest page (ExercisesPage, RecipesPage, etc.) */}
      </main>

       {/* Optional Footer */}
       <footer className="py-4 text-center text-xs text-gray-500 border-t border-gray-200 bg-white">
            © {new Date().getFullYear()} FitnessApp Demo
       </footer>
    </div>
  );
}

export default GuestLayout;
