// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { FiUsers, FiClipboard, FiGrid, FiMenu, FiX, FiLogOut } from 'react-icons/fi';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Enhanced NavLink styles for Admin sidebar
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
      isActive
        ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-inner scale-[1.02]' // Enhanced active state
        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900' // Enhanced inactive state
    }`;

  // Sidebar navigation content for Admin
  const sidebarNavigation = (
     <nav className="flex-1 space-y-1.5 px-3"> {/* Added padding */}
        <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <FiUsers className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Manage Users</span>
        </NavLink>
        <NavLink to="/admin/exercises" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <FiClipboard className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Manage Exercises</span>
        </NavLink>
        {/* Add links for Manage Food, Manage Blog Posts etc. later */}
        <div className="pt-4 mt-4 border-t border-slate-200">
             <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
                <FiGrid className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">User Dashboard</span>
            </NavLink>
             <NavLink to="/login" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
                <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">Logout (to Login)</span>
            </NavLink>
        </div>
     </nav>
  );


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 font-sans overflow-hidden"> {/* Page gradient */}

      {/* --- Universal Off-canvas Sidebar --- */}
      <div
        className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
      >
            {/* --- RE-ADDED Overlay for Mobile Only --- */}
            <div
              className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} // Added md:hidden and transition
              aria-hidden="true"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            {/* --- End Overlay --- */}

            {/* Sidebar Panel - Added glassmorphism */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-50/80 backdrop-blur-lg pt-5 pb-4 shadow-xl border-r border-slate-200/50">
                {/* Close Button */}
                <div className="absolute top-0 right-0 pt-2 pr-2 z-50">
                    <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 text-slate-500 hover:bg-slate-100/50" onClick={() => setIsSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <FiX className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                {/* Logo */}
                 <div className="flex items-center flex-shrink-0 px-4 h-16">
                     <Link to="/admin/users" className="text-2xl font-bold text-slate-800 tracking-tight" onClick={() => setIsSidebarOpen(false)}>
                        FitnessApp Admin
                     </Link>
                 </div>
                {/* Navigation */}
                 <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    {sidebarNavigation}
                 </div>
            </div>
       </div>


      {/* --- Main Content Area --- */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        {/* Header Area */}
        <div className="sticky top-0 z-30 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80"> {/* Added glassmorphism */}
          {/* Persistent Sidebar Toggle Button */}
          <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100/50" onClick={() => setIsSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* Optional Header Content */}
          <div className="flex-1 px-4 flex justify-between items-center">
             <div className="flex-1 flex">{/* Placeholder */}</div>
             <div className="ml-4 flex items-center md:ml-6">{/* Placeholder */}</div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {/* Increased padding */}
          <div className="py-10 px-4 sm:px-6 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
