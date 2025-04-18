// src/pages/AdminExercisesPage.jsx
import React from 'react';
import { FiClipboard } from 'react-icons/fi';

function AdminExercisesPage() {
    return (
         <div className="space-y-8">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                   <FiClipboard className="mr-3 text-slate-700"/> Manage Exercises
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                    Add, edit, or remove exercises from the database.
                </p>
            </div>

             {/* Placeholder Content */}
             <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-10 text-center">
                 <p className="text-gray-500 italic">Exercise management table and form will go here.</p>
             </div>
        </div>
    );
}

export default AdminExercisesPage;
