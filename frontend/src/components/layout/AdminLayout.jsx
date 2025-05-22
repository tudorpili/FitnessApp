// src/components/layout/AdminLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { FiUsers, FiClipboard, FiGrid, FiMenu, FiX, FiLogOut, FiUser, FiBookOpen, FiArchive } from 'react-icons/fi'; // Added FiArchive

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const { user, logout } = useAuth();

    useEffect(() => { const handleClickOutside = (event) => { if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) { setIsProfileMenuOpen(false); } }; if (isProfileMenuOpen) { document.addEventListener('mousedown', handleClickOutside); } else { document.removeEventListener('mousedown', handleClickOutside); } return () => { document.removeEventListener('mousedown', handleClickOutside); }; }, [isProfileMenuOpen]);

    const navLinkClass = ({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-inner scale-[1.02]' : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'}`;

    const sidebarNavigation = (
        <nav className="flex-1 space-y-1.5 px-3">
            <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiUsers className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">Manage Users</span> </NavLink>
            <NavLink to="/admin/exercises" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">Manage Exercises</span> </NavLink>
            <NavLink to="/admin/recipes" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiBookOpen className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">Manage Recipes</span> </NavLink>
            <NavLink to="/admin/plans" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiArchive className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">Manage Plans</span> </NavLink> {/* <-- NEW LINK for Workout Plans */}

            <div className="pt-4 mt-4 border-t border-slate-200">
                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}> <FiGrid className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">User Dashboard</span> </NavLink>
            </div>
        </nav>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`} role="dialog" aria-modal="true">
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-50/80 backdrop-blur-lg pt-5 pb-4 shadow-xl border-r border-slate-200/50">
                    <div className="absolute top-0 right-0 pt-2 pr-2 z-50"><button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 text-slate-500 hover:bg-slate-100/50" onClick={() => setIsSidebarOpen(false)}><span className="sr-only">Close sidebar</span><FiX className="h-6 w-6" aria-hidden="true" /></button></div>
                    <div className="flex items-center flex-shrink-0 px-4 h-16"><Link to="/admin/users" className="text-2xl font-bold text-slate-800 tracking-tight" onClick={() => setIsSidebarOpen(false)}>FitnessApp Admin</Link></div>
                    <div className="px-4 mb-4 mt-2">
                        <div className="flex items-center p-3 bg-slate-200/50 rounded-lg border border-slate-300/50">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-600 text-white font-semibold text-xs mr-3">
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 truncate">{user?.username || 'Admin'}</p>
                                <p className="text-xs text-slate-500">{user?.role || 'Admin Role'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 h-0 overflow-y-auto">{sidebarNavigation}</div>
                    <div className="flex-shrink-0 px-4 py-4 border-t border-slate-200">
                        <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150">
                            <FiLogOut className="mr-2 h-5 w-5" /> Logout
                        </button>
                    </div>
                </div>
            </div>
            {/* Main content area */}
            <div className="flex flex-col flex-1 w-full overflow-y-auto">
                <div className="sticky top-0 z-30 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80">
                    <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100/50" onClick={() => setIsSidebarOpen(true)}><span className="sr-only">Open sidebar</span><FiMenu className="h-6 w-6" aria-hidden="true" /></button>
                    <div className="flex-1 px-4 flex justify-end items-center">
                        <div className="ml-4 flex items-center md:ml-6 relative" ref={profileMenuRef}>
                            <button type="button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150" aria-expanded={isProfileMenuOpen} aria-haspopup="true">
                                <span className="sr-only">Open user menu</span>
                                <FiUser className="h-5 w-5" />
                            </button>
                            <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${isProfileMenuOpen ? 'transform opacity-100 scale-100 z-40' : 'transform opacity-0 scale-95 pointer-events-none'}`} role="menu" aria-orientation="vertical" tabIndex="-1">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-700 truncate">Signed in as (Admin)</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || 'Admin'}</p>
                                </div>
                                <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem" tabIndex="-1"><FiLogOut className="mr-2 h-4 w-4"/> Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <main className="flex-1"><div className="py-10 px-4 sm:px-6 lg:px-10"><Outlet /></div></main>
            </div>
        </div>
    );
}

export default AdminLayout;
