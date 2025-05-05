// src/components/common/ExerciseCard.jsx
import React, { useState } from 'react';
import { FiPlayCircle, FiTarget } from 'react-icons/fi';

function ExerciseCard({ exercise }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!exercise) {
    console.warn("ExerciseCard received null or undefined exercise prop.");
    return null; // Don't render if exercise is null/undefined
  }

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=Image+Not+Found';
  };

  // Check if videos exist and is an array before checking length
  const hasVideos = Array.isArray(exercise.videos) && exercise.videos.length > 0;

  const openModal = () => {
    if (hasVideos) {
        setIsModalOpen(true);
    } else {
        // Consider a less intrusive notification, like a disabled button state
        // alert('No video available for this exercise.');
        console.log(`No video available for exercise: ${exercise.name}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl flex flex-col group">
        {/* Image Section */}
        <div className="relative">
            <img
                // --- FIX: Use exercise.image_url (snake_case) ---
                // Use placeholder if image_url is null or empty
                src={exercise.image_url || 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=No+Image'}
                alt={`Image of ${exercise.name}`}
                className="w-full h-48 object-cover transition duration-300 group-hover:brightness-90"
                onError={handleImageError}
                loading="lazy" // Keep lazy loading
            />

            {/* Play button overlay if videos exist */}
            {hasVideos && (
                <button
                    onClick={openModal}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Watch video for ${exercise.name}`}
                >
                    <FiPlayCircle className="text-white text-6xl opacity-70 transform transition-transform group-hover:scale-110" />
                </button>
            )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
           {/* Exercise Name */}
           <h3 className="text-xl font-bold text-gray-800 mb-2 truncate tracking-tight" title={exercise.name}>
             {exercise.name || 'Unnamed Exercise'}
           </h3>

           {/* Muscle Group and Difficulty Tags */}
           <div className="flex items-center gap-2 mb-3">
                {/* Muscle Tag */}
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                    <FiTarget className="w-3 h-3 mr-1.5" />
                    {exercise.muscle || 'N/A'}
                </span>
                {/* Difficulty Tag */}
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

           {/* Description */}
           <p className="text-sm text-gray-600 mb-5 flex-grow leading-relaxed">
               {/* Truncate description */}
               {exercise.description ? exercise.description.substring(0, 90) + (exercise.description.length > 90 ? '...' : '') : 'No description available.'}
           </p>

           {/* Watch Video Button */}
          <button
            onClick={openModal}
            disabled={!hasVideos} // Button is disabled if no videos
            className="mt-auto w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-indigo-500 disabled:hover:to-purple-600"
          >
            <FiPlayCircle className="mr-2" /> Watch Video(s)
          </button>
        </div>
      </div>

      {/* Video Playback Modal */}
       {isModalOpen && hasVideos && (
            // Using inline styles for simplicity, consider Tailwind or CSS Modules for larger apps
            <div style={{ /* Outer overlay styles */
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                padding: '20px', zIndex: 1000, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
             }}
             onClick={closeModal} // Close modal when clicking overlay
             >
                {/* Inner modal content */}
                <div
                    style={{
                        background: 'white', padding: '25px', borderRadius: '16px', // rounded-2xl
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '95vw',
                        width: 'fit-content', maxHeight: '90vh', display: 'flex',
                        flexDirection: 'column', overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                    {/* Modal Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                        <h2 style={{ marginTop: '0', marginBottom: '0', fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>{exercise.name}</h2>
                        <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', padding: '0 5px', lineHeight: '1', color: '#888', }}>&times;</button>
                    </div>

                    {/* Modal Body - Video players */}
                    {/* Ensure exercise.videos is an array before mapping */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}>
                        {Array.isArray(exercise.videos) && exercise.videos.map((videoInfo, index) => (
                            <div key={index} style={{ flex: '1 1 320px' }}> {/* Allow videos to wrap */}
                                {/* Use videoInfo.view if available, otherwise default */}
                                <h3 style={{ fontSize: '1rem', marginBottom: '8px', textAlign: 'center', fontWeight: '600', color: '#555' }}>{videoInfo.view || `Video ${index + 1}`}</h3>
                                <video
                                    controls controlsList="nodownload"
                                    width="100%"
                                    style={{ display: 'block', maxHeight: '60vh', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
                                    src={videoInfo.url} // Use url from videoInfo object
                                    muted={index !== 0} // Mute subsequent videos
                                    autoPlay={index === 0} // Autoplay only the first video
                                    loop // Loop videos
                                    playsInline // Important for mobile
                                    preload="metadata"
                                >
                                    Your browser does not support the video tag. ({videoInfo.view || `Video ${index + 1}`})
                                </video>
                            </div>
                        ))}
                    </div>

                    {/* Modal Footer */}
                    <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', alignSelf: 'flex-end', background: '#eee', border: '1px solid #ccc', borderRadius: '8px', fontWeight: '500' }}>Close</button>
                </div>
            </div>
        )}
    </>
  );
}

export default ExerciseCard;
