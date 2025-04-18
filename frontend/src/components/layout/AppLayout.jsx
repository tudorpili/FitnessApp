// src/components/layout/AppLayout.jsx
import React, { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  FiGrid, FiActivity, FiBarChart2, FiCoffee, FiTarget, FiClipboard,
  FiMenu, FiX, FiSettings, FiBookOpen, FiZap,
  FiUser, FiLogOut // Added User and Logout icons
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // --- NEW: State for profile dropdown ---
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null); // Ref for click outside detection
  // --- END NEW ---

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
    }`;

  // --- Click outside handler for profile dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close if clicked outside the profile menu area (ref)
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    // Add listener if menu is open
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove listener if menu is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // Cleanup listener on component unmount or when menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]); // Re-run effect when menu open state changes
  // --- END Click outside handler ---


  // Sidebar navigation content for User
  const sidebarNavigation = (
     <nav className="flex-1 space-y-1.5 px-2">
        {/* Links remain the same, except Settings is removed */}
        <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiGrid className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Dashboard</span> </NavLink>
        <NavLink to="/log-workout" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiActivity className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Workout</span> </NavLink>
        <NavLink to="/track-weight" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBarChart2 className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Weight</span> </NavLink>
        <NavLink to="/track-calories" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiTarget className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Calories</span> </NavLink>
        <NavLink to="/log-meal" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiCoffee className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Meal</span> </NavLink>
        <NavLink to="/exercises" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Exercises</span> </NavLink>
        <NavLink to="/workout-plans" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiZap className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Workout Plans</span> </NavLink>
        <NavLink to="/calculators" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FaCalculator className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Calculators</span> </NavLink>
        <NavLink to="/recipes" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBookOpen className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Recipes</span> </NavLink>
        {/* Separator and Logout link */}
        <div className="pt-4 mt-4 border-t border-gray-200">
             {/* --- REMOVED Settings Link --- */}
             {/* <NavLink to="/settings" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiSettings className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Settings</span> </NavLink> */}
             <NavLink to="/login" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
                <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0" /> {/* Changed Icon */}
                <span className="truncate">Logout</span>
            </NavLink>
        </div>
     </nav>
  );


  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
        {/* --- Universal Off-canvas Sidebar --- */}
        {/* ... (Sidebar code remains the same) ... */}
         <div className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out ${ isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none' }`} role="dialog" aria-modal="true"> <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white pt-5 pb-4 shadow-xl border-r border-gray-200"> <div className="absolute top-0 right-0 pt-2 pr-2 z-50"><button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 text-gray-500 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}><span className="sr-only">Close sidebar</span><FiX className="h-6 w-6" aria-hidden="true" /></button></div> <div className="flex items-center flex-shrink-0 px-4 h-16"><Link to="/dashboard" className="text-2xl font-bold text-indigo-600 tracking-tight" onClick={() => setIsSidebarOpen(false)}>FitnessApp</Link></div> <div className="mt-5 flex-1 h-0 overflow-y-auto">{sidebarNavigation}</div> </div> </div>

        {/* --- Main Content Area --- */}
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
            {/* Header Area */}
            <div className="sticky top-0 z-30 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80">
                {/* Persistent Sidebar Toggle Button */}
                <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100/50" onClick={() => setIsSidebarOpen(true)}><span className="sr-only">Open sidebar</span><FiMenu className="h-6 w-6" aria-hidden="true" /></button>

                {/* Header Content Area (Right Side) */}
                <div className="flex-1 px-4 flex justify-between items-center">
                    <div className="flex-1 flex">{/* Optional Search bar placeholder */}</div>
                    {/* --- NEW: Profile Menu Section --- */}
                    <div className="ml-4 flex items-center md:ml-6 relative" ref={profileMenuRef}> {/* Added ref */}
                        {/* Profile Button */}
                        <button
                            type="button"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} // Toggle dropdown
                            className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                            id="user-menu-button"
                            aria-expanded={isProfileMenuOpen}
                            aria-haspopup="true"
                        >
                            <span className="sr-only">Open user menu</span>
                            <FiUser className="h-5 w-5" /> {/* User Icon */}
                        </button>

                        {/* Dropdown Panel */}
                        {/* Added transition classes */}
                        <div
                            className={`absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${isProfileMenuOpen ? 'transform opacity-100 scale-100 z-40' : 'transform opacity-0 scale-95 pointer-events-none'}`} // Conditional classes for visibility and animation
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu-button"
                            tabIndex="-1"
                        >
                            {/* Menu Item 1: Settings */}
                            <Link
                                to="/settings"
                                onClick={() => setIsProfileMenuOpen(false)} // Close menu on click
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem" tabIndex="-1" id="user-menu-item-0"
                            >
                                <FiSettings className="mr-2 h-4 w-4 text-gray-500"/> Settings
                            </Link>

                            {/* Menu Item 2: Logout */}
                            <Link
                                to="/login" // Navigate to login page on logout
                                onClick={() => setIsProfileMenuOpen(false)} // Close menu on click
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" // Logout styling
                                role="menuitem" tabIndex="-1" id="user-menu-item-1"
                            >
                                <FiLogOut className="mr-2 h-4 w-4"/> Logout
                            </Link>
                        </div>
                    </div>
                     {/* --- END NEW --- */}
                </div>
            </div>

            {/* Page Content */}
            <main className="flex-1"><div className="py-8 px-4 sm:px-6 md:px-8"><Outlet /></div></main>
        </div>
    </div>
  );
}

export default AppLayout;
