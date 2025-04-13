// src/components/common/ExerciseCard.jsx
import React, { useState } from 'react';
import { FiPlayCircle, FiTarget } from 'react-icons/fi'; // Added FiTarget for muscle icon

function ExerciseCard({ exercise }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=Image+Not+Found';
  };

  const hasVideos = exercise.videos && exercise.videos.length > 0;

  const openModal = () => {
    if (hasVideos) {
        setIsModalOpen(true);
    } else {
        alert('No video available for this exercise.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Card container with enhanced styling */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl flex flex-col group"> {/* Added group for potential group-hover effects */}
        <div className="relative">
            <img
                src={exercise.image || 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=No+Image'}
                alt={`Image of ${exercise.name}`}
                className="w-full h-48 object-cover transition duration-300 group-hover:brightness-90" // Image dims slightly on hover
                onError={handleImageError}
            />
            {/* Play button overlay */}
            {hasVideos && (
                <button
                    onClick={openModal}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100" // Smoother transition
                    aria-label={`Watch video for ${exercise.name}`}
                >
                    <FiPlayCircle className="text-white text-6xl opacity-70 transform transition-transform group-hover:scale-110" />
                </button>
            )}
        </div>

        {/* Card Content - Increased padding */}
        <div className="p-6 flex flex-col flex-grow">
           {/* Exercise Name - Larger, bolder */}
           <h3 className="text-xl font-bold text-gray-800 mb-2 truncate tracking-tight" title={exercise.name}>
             {exercise.name}
           </h3>

           {/* Muscle Group Info - with Icon */}
           <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                    <FiTarget className="w-3 h-3 mr-1.5" /> {/* Muscle Icon */}
                    {exercise.muscle || 'N/A'}
                </span>
                {/* Difficulty Badge (Optional) */}
                {exercise.difficulty && (
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    exercise.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {exercise.difficulty}
                </span>
                )}
           </div>

           {/* Short Description */}
           <p className="text-sm text-gray-600 mb-5 flex-grow leading-relaxed"> {/* Increased line height */}
               {exercise.description ? exercise.description.substring(0, 90) + '...' : 'No description available.'}
           </p>

          {/* Action Button - Enhanced style */}
          <button
            onClick={openModal}
            disabled={!hasVideos}
            className="mt-auto w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FiPlayCircle className="mr-2" /> Watch Video(s)
          </button>
        </div>
      </div>

      {/* --- Video Modal (Temporary Implementation) --- */}
       {isModalOpen && hasVideos && (
            // Basic modal structure with inline styles - Consider making a proper component
            <div style={{
                position: 'fixed', top: '0', left: '0', // Cover full screen
                width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', // Dark overlay
                backdropFilter: 'blur(5px)', // Background blur
                padding: '20px', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}
             onClick={closeModal} // Close on overlay click
             >
                <div
                    style={{ // Inner modal content
                        background: 'white', padding: '25px', borderRadius: '16px', // rounded-2xl
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '95vw', width: 'fit-content', maxHeight: '90vh',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                    {/* Modal Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                        <h2 style={{ marginTop: '0', marginBottom: '0', fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>{exercise.name}</h2>
                        <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', padding: '0 5px', lineHeight: '1', color: '#888', }}>&times;</button>
                    </div>

                    {/* Modal Body - Video players */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}> {/* Added padding for scrollbar */}
                        {exercise.videos.map((videoInfo, index) => (
                            <div key={index} style={{ flex: '1 1 320px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '8px', textAlign: 'center', fontWeight: '600', color: '#555' }}>{videoInfo.view}</h3>
                                <video
                                    controls controlsList="nodownload"
                                    width="100%"
                                    style={{ display: 'block', maxHeight: '60vh', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
                                    src={videoInfo.url}
                                    muted={index !== 0} // Mute all but the first video
                                    autoPlay={index === 0} // Autoplay only the first video
                                    loop
                                    playsInline
                                    preload="metadata"
                                >
                                    Your browser does not support the video tag. ({videoInfo.view})
                                </video>
                            </div>
                        ))}
                    </div>
                    {/* Optional: Footer with close button */}
                    <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', alignSelf: 'flex-end', background: '#eee', border: '1px solid #ccc', borderRadius: '8px', fontWeight: '500' }}>Close</button>
                </div>
            </div>
        )}
      {/* --- End Modal Placeholder --- */}
    </>
  );
}

export default ExerciseCard;
