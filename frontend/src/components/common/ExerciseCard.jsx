// src/components/common/ExerciseCard.jsx
import React, { useState } from 'react';
// Assume you create a Modal component later: import VideoModal from './VideoModal';
import { FiPlayCircle } from 'react-icons/fi'; // Import play icon

function ExerciseCard({ exercise }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null; // prevent infinite loop if fallback fails
    e.target.src = 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=Image+Not+Found';
  };

  const openModal = () => {
    if (exercise.video_url) {
        setIsModalOpen(true);
    } else {
        alert('No video available for this exercise.'); // Placeholder feedback
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col">
        <div className="relative">
            <img
                src={exercise.image || 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=No+Image'}
                alt={`Image of ${exercise.name}`}
                className="w-full h-48 object-cover"
                onError={handleImageError}
            />
            {/* Add a Play button overlay if video exists */}
            {exercise.video_url && (
                <button
                    onClick={openModal}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-opacity duration-200 opacity-0 hover:opacity-100 focus:opacity-100"
                    aria-label={`Watch video for ${exercise.name}`}
                >
                    <FiPlayCircle className="text-white text-5xl opacity-80" />
                </button>
            )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col flex-grow">
           {/* Exercise Name */}
           <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={exercise.name}>
             {exercise.name}
           </h3>
           {/* Muscle Group Badge */}
           <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
             {exercise.muscle || 'N/A'}
           </span>
            {/* Difficulty Badge (Optional) */}
            {exercise.difficulty && (
               <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start ${
                   exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                   exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                   exercise.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
               }`}>
                   {exercise.difficulty}
               </span>
            )}
           {/* Short Description (Optional) */}
           <p className="text-sm text-gray-600 mb-4 flex-grow">
               {exercise.description ? exercise.description.substring(0, 80) + '...' : 'No description available.'}
           </p>
          {/* Action Button - Now opens modal */}
          <button
            onClick={openModal}
            disabled={!exercise.video_url} // Disable if no video URL
            className="mt-auto w-full flex items-center justify-center bg-indigo-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlayCircle className="mr-2" /> Watch Video
          </button>
        </div>
      </div>

      {/* --- Video Modal (Placeholder - Implement separately) --- */}
      {/* Temporary Alert for demonstration */}
       {isModalOpen && (
            // Basic modal structure with inline styles
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '20px',
                zIndex: 1000, // Ensure it's on top
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                maxWidth: '90vw', // Prevent modal from being too wide
                maxHeight: '90vh', // Prevent modal from being too tall
                display: 'flex',
                flexDirection: 'column'
             }}>
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                    <h2 style={{ marginTop: '0', marginBottom: '0', fontSize: '1.25rem' }}>{exercise.name}</h2>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0 5px' }}>&times;</button>
                </div>

                {/* Modal Body - Contains the video */}
                <div style={{ overflow: 'auto' /* Handle potential overflow */ }}>
                    {/* === YOUR ENHANCED VIDEO TAG IS PLACED HERE === */}
                    <video
                        controls controlsList="nodownload" // Show player controls, hide download
                        width="100%" // Make video responsive within modal
                        style={{ display: 'block', maxHeight: 'calc(80vh - 100px)' }} // Prevent video from exceeding modal height, adjust as needed
                        src={exercise.video_url} // The path from your mock data
                        autoPlay // Start playing automatically
                        muted // Start muted (often required for autoplay)
                        loop // Loop the video
                        playsInline // Important for mobile browsers
                        preload="metadata" // Suggest browser loads metadata
                    >
                        {/* Fallback text if the browser doesn't support the video tag */}
                        Your browser does not support the video tag.
                    </video>
                    {/* === END OF VIDEO TAG === */}
                </div>

                {/* Optional: Modal Footer */}
                {/* <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '15px', textAlign: 'right' }}>
                    <button onClick={closeModal} style={{ padding: '8px 15px', cursor: 'pointer' }}>Close</button>
                </div> */}
            </div>
        )}
      {/* --- End Modal Placeholder --- */}
    </>
  );
}

export default ExerciseCard;
