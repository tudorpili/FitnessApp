// src/components/common/WorkoutPlanDetailModal.jsx
import React from 'react';
import { FiX, FiUser, FiList, FiInfo, FiHash, FiClipboard } from 'react-icons/fi'; // Added FiClipboard

function WorkoutPlanDetailModal({ isOpen, onClose, plan }) {
  if (!isOpen || !plan) return null;

  return (
    // Overlay with backdrop blur and transition
    <div
      // --- UPDATED: Changed background overlay color/opacity ---
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Panel with gradient, shadow, and animation */}
      <div
        className="bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl border border-white/30 animate-modalEnter max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/80 flex-shrink-0">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center">
             <FiClipboard className="mr-3 text-purple-600 opacity-80"/> {/* Added Header Icon */}
             {plan.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-grow overflow-y-auto pr-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
          {/* Creator Info */}
          <div className="flex items-center text-sm text-gray-600 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200/80 w-fit">
            <FiUser className="mr-1.5 h-4 w-4 text-indigo-500" />
            Created by: <span className="font-semibold ml-1 text-indigo-700">{plan.creator_username || 'Unknown'}</span>
          </div>

          {/* Description Section */}
          {plan.description && (
            <div className="text-base text-slate-700 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 p-4 rounded-xl border border-indigo-100/80 shadow-sm">
               <h4 className="font-semibold text-sm text-indigo-700 mb-2 flex items-center"><FiInfo className="mr-1.5"/>Description</h4>
               <p className="leading-relaxed">{plan.description}</p>
            </div>
          )}

          {/* Exercises List Section */}
          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <FiList className="mr-2.5 text-emerald-600"/> Exercises ({plan.exercises?.length || 0})
            </h4>
            {plan.exercises && plan.exercises.length > 0 ? (
              <ul className="space-y-3">
                {plan.exercises.map((ex, index) => (
                  <li
                    key={ex.exerciseId || index}
                    className="p-4 bg-white/90 border border-slate-200/70 rounded-xl shadow-sm text-sm text-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition-shadow hover:shadow-md"
                  >
                    <span className="font-medium text-slate-900 flex-grow">{ex.name || 'Unknown Exercise'}</span>
                    {/* Display Target Sets if available - Improved Badge Style */}
                    {ex.targetSets !== null && ex.targetSets !== undefined && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 px-3 py-1 rounded-full flex items-center whitespace-nowrap self-start sm:self-center mt-1 sm:mt-0">
                            <FiHash className="mr-1 h-3 w-3"/>
                            {ex.targetSets} Sets
                        </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50/80 p-4 rounded-lg border text-center">No exercises listed for this plan.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-5 mt-5 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlanDetailModal;
