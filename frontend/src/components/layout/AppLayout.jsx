// src/components/layout/AppLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
    FiGrid, FiActivity, FiBarChart2, FiCoffee, FiTarget, FiClipboard,
    FiMenu, FiX, FiSettings, FiBookOpen, FiZap,
    FiUser, FiLogOut, FiAward, FiTrendingUp // Adăugat FiTrendingUp pentru Exercise Progress
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const { user, logout } = useAuth();

    useEffect(() => { const handleClickOutside = (event) => { if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) { setIsProfileMenuOpen(false); } }; if (isProfileMenuOpen) { document.addEventListener('mousedown', handleClickOutside); } else { document.removeEventListener('mousedown', handleClickOutside); } return () => { document.removeEventListener('mousedown', handleClickOutside); }; }, [isProfileMenuOpen]);

    const navLinkClass = ({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`;

    const sidebarNavigation = (
        <nav className="flex-1 space-y-1.5 px-2">
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiGrid className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Dashboard</span> </NavLink>
            <NavLink to="/log-workout" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiActivity className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Workout</span> </NavLink>
            <NavLink to="/track-weight" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBarChart2 className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Weight</span> </NavLink>
            <NavLink to="/track-calories" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiTarget className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Track Calories</span> </NavLink>
            <NavLink to="/log-meal" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiCoffee className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Log Meal</span> </NavLink>
            <NavLink to="/goals" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiAward className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">My Goals</span> </NavLink>
            {/* --- NEW LINK for Exercise Progress --- */}
            <NavLink to="/exercise-progress" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiTrendingUp className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Exercise Progress</span> </NavLink>
            {/* --- END NEW LINK --- */}
            <NavLink to="/exercises" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Exercises</span> </NavLink>
            <NavLink to="/workout-plans" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiZap className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Workout Plans</span> </NavLink>
            <NavLink to="/calculators" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FaCalculator className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Calculators</span> </NavLink>
            <NavLink to="/recipes" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBookOpen className="mr-3 h-5 w-5 flex-shrink-0" /> <span className="truncate">Recipes</span> </NavLink>
        </nav>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            <div className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`} role="dialog" aria-modal="true">
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white pt-5 pb-4 shadow-xl border-r border-gray-200">
                    <div className="absolute top-0 right-0 pt-2 pr-2 z-50"><button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 text-gray-500 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}><span className="sr-only">Close sidebar</span><FiX className="h-6 w-6" aria-hidden="true" /></button></div>
                    <div className="flex items-center flex-shrink-0 px-4 h-16"><Link to="/dashboard" className="text-2xl font-bold text-indigo-600 tracking-tight" onClick={() => setIsSidebarOpen(false)}>FitnessApp</Link></div>
                    <div className="px-4 mb-4 mt-2">
                        <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-700 font-semibold text-xs mr-3">
                                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.username || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 h-0 overflow-y-auto">{sidebarNavigation}</div>
                    <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
                        <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150">
                            <FiLogOut className="mr-2 h-5 w-5" /> Logout
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full overflow-y-auto">
                <div className="sticky top-0 z-30 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80">
                    <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100/50" onClick={() => setIsSidebarOpen(true)}><span className="sr-only">Open sidebar</span><FiMenu className="h-6 w-6" aria-hidden="true" /></button>
                    <div className="flex-1 px-4 flex justify-end items-center">
                        <div className="ml-4 flex items-center md:ml-6 relative" ref={profileMenuRef}>
                            <button type="button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150" id="user-menu-button" aria-expanded={isProfileMenuOpen} aria-haspopup="true">
                                <span className="sr-only">Open user menu</span>
                                <FiUser className="h-5 w-5" />
                            </button>
                            <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${isProfileMenuOpen ? 'transform opacity-100 scale-100 z-40' : 'transform opacity-0 scale-95 pointer-events-none'}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-700 truncate">Signed in as</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || 'User'}</p>
                                </div>
                                <Link to="/settings" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1"><FiSettings className="mr-2 h-4 w-4 text-gray-500"/> Settings</Link>
                                <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem" tabIndex="-1"><FiLogOut className="mr-2 h-4 w-4"/> Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <main className="flex-1"><div className="py-8 px-4 sm:px-6 md:px-8"><Outlet /></div></main>
            </div>
        </div>
    );
}

export default AppLayout;
