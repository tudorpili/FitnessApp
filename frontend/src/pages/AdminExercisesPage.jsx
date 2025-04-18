// src/pages/AdminExercisesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { mockExercises } from '../mockData/exercises';
import {
    FiClipboard, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiSave,
    FiAlertTriangle, FiImage, FiVideo, FiType, FiBarChart2, FiTag,
    FiAlertCircle, FiArrowUp, FiArrowDown, FiList, FiPlayCircle
} from 'react-icons/fi';


const InfoCard = ({ title, children, className = '', icon }) => ( 
    <div className={`bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/30 overflow-hidden border border-white/20 ${className}`}> {title && ( <h2 className="text-xl font-semibold text-gray-800 p-6 pb-4 border-b border-slate-200/80 flex items-center"> {icon && <span className="mr-3 text-indigo-500">{icon}</span>} {title} </h2> )} <div className={title ? "p-6" : ""}>{children}</div> </div>
);

const ExerciseFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [muscle, setMuscle] = useState(''); const [difficulty, setDifficulty] = useState('Beginner'); const [equipment, setEquipment] = useState(''); const [image, setImage] = useState(''); const [videoUrl, setVideoUrl] = useState(''); const [formError, setFormError] = useState(''); const isEditMode = useMemo(() => !!initialData, [initialData]);
    useEffect(() => { if (isOpen) { if (isEditMode) { setName(initialData.name || ''); setDescription(initialData.description || ''); setMuscle(initialData.muscle || ''); setDifficulty(initialData.difficulty || 'Beginner'); setEquipment(initialData.equipment || ''); setImage(initialData.image || ''); const firstVideo = Array.isArray(initialData.videos) && initialData.videos.length > 0 ? initialData.videos[0].url : (typeof initialData.video_url === 'string' ? initialData.video_url : ''); setVideoUrl(firstVideo); } else { setName(''); setDescription(''); setMuscle(''); setDifficulty('Beginner'); setEquipment(''); setImage(''); setVideoUrl(''); } setFormError(''); } }, [isOpen, initialData, isEditMode]);
    const handleSubmit = (e) => { e.preventDefault(); setFormError(''); if (!name.trim() || !muscle.trim()) { setFormError('Exercise Name and Target Muscle are required.'); return; } const exerciseData = { name, description, muscle, difficulty, equipment, image, videos: videoUrl ? [{ view: 'Main', url: videoUrl }] : [] }; const submissionError = onSubmit(exerciseData, initialData?.id); if (submissionError) { setFormError(submissionError); } else { onClose(); } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const muscleGroups = useMemo(() => [...new Set(mockExercises.map(ex => ex?.muscle).filter(Boolean))], []);
    if (!isOpen) return null;
    return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className="bg-gradient-to-br from-white via-slate-50/90 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-500/10 p-6 sm:p-8 w-full max-w-2xl border border-white/20 animate-modalEnter max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200/80"> <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{isEditMode ? 'Edit Exercise' : 'Add New Exercise'}</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div> <form onSubmit={handleSubmit} className="space-y-5"> <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">{/* Form inputs... */} <div className="md:col-span-2"><label htmlFor="ex-name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label><input type="text" id="ex-name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80"/></div> <div><label htmlFor="ex-muscle" className="block text-sm font-medium text-slate-700 mb-1">Target Muscle *</label><select id="ex-muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"><option value="" disabled>Select muscle...</option>{muscleGroups.sort().map(m => <option key={m} value={m}>{m}</option>)}</select></div> <div><label htmlFor="ex-difficulty" className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label><select id="ex-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div> <div className="md:col-span-2"><label htmlFor="ex-equipment" className="block text-sm font-medium text-slate-700 mb-1">Equipment <span className="text-xs text-gray-400">(Optional)</span></label><input type="text" id="ex-equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="e.g., Barbell, Dumbbells, Bench" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80"/></div> <div className="md:col-span-2"><label htmlFor="ex-description" className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-xs text-gray-400">(Optional)</span></label><textarea id="ex-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="How to perform the exercise..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80"></textarea></div> <div><label htmlFor="ex-image" className="block text-sm font-medium text-slate-700 mb-1">Image URL <span className="text-xs text-gray-400">(Optional)</span></label><input type="url" id="ex-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80"/></div> <div><label htmlFor="ex-video" className="block text-sm font-medium text-slate-700 mb-1">Video URL <span className="text-xs text-gray-400">(Optional)</span></label><input type="text" id="ex-video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://... or /videos/local.mp4" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80"/></div> </div> {formError && ( <p className="mt-4 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1 h-4 w-4"/> {formError}</p> )} <div className="flex justify-end gap-4 pt-5"> <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button> <button type="submit" className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> <FiSave className="mr-1.5"/> {isEditMode ? 'Save Changes' : 'Add Exercise'} </button> </div> </form> </div> </div> );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => { 
    if (!isOpen) return null;
    return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-modalEnter border border-white/20" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200"> <h3 className="text-lg font-semibold text-slate-800 flex items-center"><FiAlertTriangle className="text-red-500 mr-2"/>Confirm Deletion</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div> <p className="text-sm text-slate-600 mb-6"> Are you sure you want to delete <strong className="text-slate-900">{itemName || 'this item'}</strong>? This action cannot be undone. </p> <div className="flex justify-end gap-3"> <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button> <button onClick={onConfirm} className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> <FiTrash2 className="mr-1.5"/> Delete </button> </div> </div> </div> );
};

const VideoPlaybackModal = ({ isOpen, onClose, exerciseName, videos = [] }) => { 
    if (!isOpen) return null;
    const videoList = Array.isArray(videos) ? videos : [];
    return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-4xl animate-modalEnter border border-white/20 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 flex-shrink-0"> <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{exerciseName} - Video(s)</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div> {videoList.length > 0 ? ( <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin"> <div className="flex flex-wrap justify-center gap-6"> {videoList.map((videoInfo, index) => ( <div key={index} className="flex-shrink-0 w-full md:max-w-md"> <h4 className="text-sm font-medium text-center text-gray-600 mb-2">{videoInfo.view || `Video ${index + 1}`}</h4> <video controls controlsList="nodownload" width="100%" style={{ maxHeight: '65vh', borderRadius: '8px', backgroundColor: '#000' }} src={videoInfo.url} muted={index > 0} autoPlay={index === 0} loop={videoList.length === 1} playsInline preload="metadata"> Your browser does not support the video tag. </video> </div> ))} </div> </div> ) : ( <p className="text-center text-gray-500 py-10 italic">No videos available for this exercise.</p> )} <div className="flex justify-end pt-4 mt-auto flex-shrink-0"> <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Close</button> </div> </div> </div> );
};


function AdminExercisesPage() {
    const [exercises, setExercises] = useState(mockExercises);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingExercise, setDeletingExercise] = useState(null);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedExerciseForVideo, setSelectedExerciseForVideo] = useState(null);

    const handleOpenAddModal = () => { setEditingExercise(null); setIsExerciseModalOpen(true); };
    const handleOpenEditModal = (exerciseToEdit) => { setEditingExercise(exerciseToEdit); setIsExerciseModalOpen(true); };
    const handleOpenDeleteModal = (exerciseToDelete) => { setDeletingExercise(exerciseToDelete); setIsDeleteModalOpen(true); };
    const handleOpenVideoModal = (exercise) => { setSelectedExerciseForVideo(exercise); setIsVideoModalOpen(true); };
    const handleCloseVideoModal = () => { setIsVideoModalOpen(false); setSelectedExerciseForVideo(null); };
    const handleCloseModals = () => { setIsExerciseModalOpen(false); setIsDeleteModalOpen(false); setIsVideoModalOpen(false); setEditingExercise(null); setDeletingExercise(null); setSelectedExerciseForVideo(null); };

    const handleSaveExercise = (formData, exerciseId) => { const nameExists = exercises.some(ex => ex.name.toLowerCase() === formData.name.toLowerCase() && ex.id !== exerciseId); if (nameExists) { return "An exercise with this name already exists."; } if (exerciseId) { setExercises(currentExercises => currentExercises.map(ex => ex.id === exerciseId ? { ...ex, ...formData } : ex )); } else { const newExercise = { ...formData, id: `ex-${Date.now()}` }; setExercises(currentExercises => [newExercise, ...currentExercises]); } return null; };
    const handleConfirmDelete = () => { if (!deletingExercise) return; setExercises(currentExercises => currentExercises.filter(ex => ex.id !== deletingExercise.id)); handleCloseModals(); };

    const filteredExercises = useMemo(() => { if (!searchTerm.trim()) return exercises; const lowerSearch = searchTerm.toLowerCase(); return exercises.filter(ex => ex.name.toLowerCase().includes(lowerSearch) || ex.muscle?.toLowerCase().includes(lowerSearch) || ex.difficulty?.toLowerCase().includes(lowerSearch) || ex.equipment?.toLowerCase().includes(lowerSearch)); }, [exercises, searchTerm]);
    const sortedAndFilteredExercises = useMemo(() => { let sortableItems = [...filteredExercises]; if (sortColumn !== null) { sortableItems.sort((a, b) => { const valA = a[sortColumn] ?? ''; const valB = b[sortColumn] ?? ''; let comparison = 0; comparison = String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base', numeric: false }); return sortDirection === 'asc' ? comparison : comparison * -1; }); } return sortableItems; }, [filteredExercises, sortColumn, sortDirection]);
    const handleSort = (columnName) => { if (sortColumn === columnName) { setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc')); } else { setSortColumn(columnName); setSortDirection('asc'); } };
    const SortIcon = ({ columnName }) => { if (sortColumn !== columnName) return null; return sortDirection === 'asc' ? <FiArrowUp className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" /> : <FiArrowDown className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" />; };


    return (
        <>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div> <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center"><FiClipboard className="mr-3 text-slate-700"/> Manage Exercises ({exercises.length})</h1> <p className="mt-1 text-md text-gray-600">Add, edit, or remove exercises available in the app.</p> </div> <button onClick={handleOpenAddModal} className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"> <FiPlus className="mr-1.5 h-5 w-5"/> Add New Exercise </button>
                </div>

                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span> <input type="text" placeholder="Search by name, muscle, difficulty, equipment..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm"/>
                </div>

                <InfoCard title="Exercise List" icon={<FiList />}>
                    <div className="overflow-x-auto -mx-6 -my-6 sm:-mx-8 sm:-my-8">
                        <table className="min-w-full divide-y divide-slate-200/70">
                            <thead className="bg-slate-100/80 backdrop-blur-sm sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('name')} className="group flex items-center hover:text-indigo-700 transition-colors">Name <SortIcon columnName="name" /></button></th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('muscle')} className="group flex items-center hover:text-indigo-700 transition-colors">Muscle <SortIcon columnName="muscle" /></button></th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('difficulty')} className="group flex items-center hover:text-indigo-700 transition-colors">Difficulty <SortIcon columnName="difficulty" /></button></th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('equipment')} className="group flex items-center hover:text-indigo-700 transition-colors">Equipment <SortIcon columnName="equipment" /></button></th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Video</th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/80 divide-y divide-slate-200/50">{}
                                {sortedAndFilteredExercises.map((exercise) => {
                                    const hasVideos = exercise.videos && Array.isArray(exercise.videos) && exercise.videos.length > 0;
                                    return (
                                        <tr key={exercise.id} className="hover:bg-indigo-50/30 transition-colors duration-150">{}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{exercise.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{exercise.muscle || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${ exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : exercise.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800' }`}>{exercise.difficulty || 'N/A'}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{exercise.equipment || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center"><button onClick={() => handleOpenVideoModal(exercise)} disabled={!hasVideos} title={hasVideos ? "Watch Video" : "No Video Available"} className={`p-2 rounded-lg transition-all duration-150 transform hover:scale-110 ${hasVideos ? 'text-emerald-600 hover:bg-emerald-100/80' : 'text-gray-300 cursor-not-allowed'}`}><FiPlayCircle className="h-4 w-4" /></button></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"><div className="flex justify-center items-center space-x-2"><button onClick={() => handleOpenEditModal(exercise)} title="Edit Exercise" className="p-2 text-blue-600 hover:bg-blue-100/80 rounded-lg transition-all duration-150 transform hover:scale-110"><FiEdit className="h-4 w-4" /></button><button onClick={() => handleOpenDeleteModal(exercise)} title="Delete Exercise" className="p-2 text-red-600 hover:bg-red-100/80 rounded-lg transition-all duration-150 transform hover:scale-110"><FiTrash2 className="h-4 w-4" /></button></div></td>
                                        </tr>
                                    );
                                })}
                                {sortedAndFilteredExercises.length === 0 && (
                                    <tr>{}
                                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                                            {searchTerm ? 'No exercises match your search.' : 'No exercises found.'}
                                        </td>{}
                                    </tr>
                                )}
                            </tbody>{}
                        </table>
                    </div>
                </InfoCard>
            </div>

            {/* Render Modals */}
            <ExerciseFormModal isOpen={isExerciseModalOpen} onClose={handleCloseModals} onSubmit={handleSaveExercise} initialData={editingExercise} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} onConfirm={handleConfirmDelete} itemName={deletingExercise?.name} />
            <VideoPlaybackModal isOpen={isVideoModalOpen} onClose={handleCloseVideoModal} exerciseName={selectedExerciseForVideo?.name} videos={selectedExerciseForVideo?.videos} />
        </>
    );
}

export default AdminExercisesPage;
