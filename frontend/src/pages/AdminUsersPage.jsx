// src/pages/AdminUsersPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    FiUsers, FiPlus, FiEdit, FiToggleLeft, FiToggleRight, FiTrash2, FiSearch,
    FiX, FiSave, FiAlertTriangle, FiUserCheck, FiUserX, FiArrowUp, FiArrowDown,
    FiAlertCircle
} from 'react-icons/fi';

// Mock user data (remains the same)
const initialUsers = [
    { id: 'u1', username: 'TestUser', email: 'user@app.com', role: 'User', status: 'Active', joined: '2025-04-10' },
    { id: 'a1', username: 'AdminUser', email: 'admin@app.com', role: 'Admin', status: 'Active', joined: '2025-04-01' },
    { id: 'u2', username: 'JaneDoe', email: 'jane@example.com', role: 'User', status: 'Inactive', joined: '2025-04-15' },
    { id: 'u3', username: 'MikeFit', email: 'mike.fitness@domain.net', role: 'User', status: 'Active', joined: '2025-03-20' },
    { id: 'u4', username: 'SarahLift', email: 'sarah.l@email.co', role: 'User', status: 'Active', joined: '2025-04-18' },
];

// --- Helper Functions ---
const getTodayDate = () => { const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };
const getInitials = (name = '') => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
const getColorForName = (name = '') => { let hash = 0; for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); hash = hash & hash; } const colors = ['bg-blue-100 text-blue-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-800', 'bg-violet-100 text-violet-800', 'bg-cyan-100 text-cyan-800']; return colors[Math.abs(hash) % colors.length]; };

// --- Add/Edit User Modal Component (Enhanced Styling) ---
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const isEditMode = useMemo(() => !!initialData, [initialData]);

    useEffect(() => { /* ... (logic remains the same) ... */ if (isOpen) { if (isEditMode) { setUsername(initialData.username || ''); setEmail(initialData.email || ''); setRole(initialData.role || 'User'); setPassword(''); } else { setUsername(''); setEmail(''); setRole('User'); setPassword(''); } setFormError(''); } }, [isOpen, initialData, isEditMode]);
    const handleSubmit = (e) => { /* ... (logic remains the same) ... */ e.preventDefault(); setFormError(''); if (!username.trim() || !email.trim()) { setFormError('Username and Email are required.'); return; } if (!isEditMode && !password) { setFormError('Password is required for new users.'); return; } if (!/\S+@\S+\.\S+/.test(email)) { setFormError('Please enter a valid email address.'); return; } const userData = { username, email, role, ...(password && { password }) }; const submissionError = onSubmit(userData, initialData?.id); if (submissionError) { setFormError(submissionError); } else { onClose(); } };

    if (!isOpen) return null;

    return (
        // Enhanced Overlay and Modal Styling
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                // Enhanced glassmorphism, shadow, animation
                className="bg-gradient-to-br from-white/90 via-slate-50/90 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-500/10 p-6 sm:p-8 w-full max-w-lg border border-white/20 animate-modalEnter"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200/80">
                    <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                        {isEditMode ? 'Edit User Details' : 'Add New User'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Form - Enhanced Inputs */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label htmlFor="modal-username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input type="text" id="modal-username" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" id="modal-email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" />
                    </div>
                    {/* Password */}
                    <div>
                        <label htmlFor="modal-password" className="block text-sm font-medium text-slate-700 mb-1">Password {isEditMode ? '(Leave blank to keep current)' : '*'}</label>
                        <input type="password" id="modal-password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditMode} placeholder={isEditMode ? 'Enter new password' : ''}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" />
                    </div>
                    {/* Role */}
                    <div>
                        <label htmlFor="modal-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select id="modal-role" value={role} onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none">
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {/* Error Display */}
                    {formError && ( <p className="text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1 h-4 w-4"/> {formError}</p> )}
                    {/* Action Buttons - Enhanced Styling */}
                    <div className="flex justify-end gap-4 pt-5">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button>
                        <button type="submit" className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                            <FiSave className="mr-1.5"/> {isEditMode ? 'Save Changes' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Delete Confirmation Modal Component (Enhanced Styling) ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, username }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-modalEnter border border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center"><FiAlertTriangle className="text-red-500 mr-2"/> Confirm Deletion</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button>
                </div>
                <p className="text-sm text-slate-600 mb-6"> Are you sure you want to delete the user <strong className="text-slate-900">{username || 'this user'}</strong>? This action cannot be undone. </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button>
                    <button onClick={onConfirm} className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                        <FiTrash2 className="mr-1.5"/> Delete User
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main AdminUsersPage Component ---
function AdminUsersPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [sortColumn, setSortColumn] = useState('username');
    const [sortDirection, setSortDirection] = useState('asc');

    // Modal Control Functions (remain the same)
    const handleOpenAddModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
    const handleOpenEditModal = (userToEdit) => { setEditingUser(userToEdit); setIsUserModalOpen(true); };
    const handleOpenDeleteModal = (userToDelete) => { setDeletingUser(userToDelete); setIsDeleteModalOpen(true); };
    const handleCloseModals = () => { setIsUserModalOpen(false); setIsDeleteModalOpen(false); setEditingUser(null); setDeletingUser(null); };

    // Action Handlers (remain the same)
    const handleSaveUser = (formData, userId) => { if (userId) { const usernameExists = users.some(user => user.id !== userId && user.username.toLowerCase() === formData.username.toLowerCase()); if (usernameExists) return "Username already exists."; const emailExists = users.some(user => user.id !== userId && user.email.toLowerCase() === formData.email.toLowerCase()); if (emailExists) return "Email address is already registered."; setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, ...formData, password: formData.password || user.password } : user )); return null; } else { const usernameExists = users.some(user => user.username.toLowerCase() === formData.username.toLowerCase()); if (usernameExists) return "Username already exists."; const emailExists = users.some(user => user.email.toLowerCase() === formData.email.toLowerCase()); if (emailExists) return "Email address is already registered."; const newUser = { ...formData, id: `u${Date.now()}`, status: 'Active', joined: getTodayDate() }; setUsers(currentUsers => [newUser, ...currentUsers]); return null; } };
    const handleToggleStatus = (userId) => { setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user )); };
    const handleConfirmDelete = () => { if (!deletingUser) return; setUsers(currentUsers => currentUsers.filter(user => user.id !== deletingUser.id)); handleCloseModals(); };

    // Filtering and Sorting Logic (remain the same)
    const filteredUsers = useMemo(() => { if (!searchTerm.trim()) return users; const lowerSearch = searchTerm.toLowerCase(); return users.filter(user => user.username.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch) || user.role.toLowerCase().includes(lowerSearch)); }, [users, searchTerm]);
    const sortedAndFilteredUsers = useMemo(() => { let sortableItems = [...filteredUsers]; if (sortColumn !== null) { sortableItems.sort((a, b) => { const valA = a[sortColumn]; const valB = b[sortColumn]; let comparison = 0; if (sortColumn === 'joined') { comparison = new Date(valA) - new Date(valB); } else if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' }); } else { if (valA < valB) comparison = -1; if (valA > valB) comparison = 1; } return sortDirection === 'asc' ? comparison : comparison * -1; }); } return sortableItems; }, [filteredUsers, sortColumn, sortDirection]);
    const handleSort = (columnName) => { if (sortColumn === columnName) { setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc')); } else { setSortColumn(columnName); setSortDirection('asc'); } };
    const SortIcon = ({ columnName }) => { if (sortColumn !== columnName) return null; return sortDirection === 'asc' ? <FiArrowUp className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" /> : <FiArrowDown className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" />; };

    return (
        <> {/* Using Fragment */}
            {/* Added page padding and overall animation */}
            <div className="space-y-10 p-2 animate-fadeIn">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        {/* Enhanced Typography */}
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                            User Management
                            <span className="ml-3 text-lg font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {users.length} Users
                            </span>
                        </h1>
                        <p className="mt-2 text-lg text-slate-600">
                            View, manage, and modify user accounts.
                        </p>
                    </div>
                    {/* Enhanced Button Style */}
                    <button
                        onClick={handleOpenAddModal}
                        className="flex-shrink-0 flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-2 h-5 w-5"/> Add New User
                    </button>
                </div>

                {/* Search Input - Enhanced Styling */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm"
                    />
                </div>

                {/* User Table Card - Enhanced Styling */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden border border-white/20">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/70">
                            {/* Sticky Header with enhanced style */}
                            <thead className="bg-slate-100/80 backdrop-blur-md sticky top-0 z-10">
                                <tr>
                                    {/* Header Cell Buttons - Enhanced styling */}
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('username')} className="group flex items-center hover:text-indigo-700 transition-colors">User <SortIcon columnName="username" /></button>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('role')} className="group flex items-center hover:text-indigo-700 transition-colors">Role <SortIcon columnName="role" /></button>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('status')} className="group flex items-center hover:text-indigo-700 transition-colors">Status <SortIcon columnName="status" /></button>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('joined')} className="group flex items-center hover:text-indigo-700 transition-colors">Joined <SortIcon columnName="joined" /></button>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/80 divide-y divide-slate-200/50">
                                {sortedAndFilteredUsers.map((user) => (
                                    // Enhanced Row Hover
                                    <tr key={user.id} className="hover:bg-indigo-50/40 transition-colors duration-150">
                                        {/* User Info Cell - Enhanced Avatar */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ring-1 ring-white/50 ${getColorForName(user.username)}`}>
                                                    {getInitials(user.username)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-slate-900">{user.username}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Role Cell - Enhanced Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm shadow-black/5 ${ user.role === 'Admin' ? 'bg-gradient-to-tr from-indigo-200 to-purple-200 text-indigo-900' : 'bg-gradient-to-tr from-emerald-200 to-green-200 text-emerald-900' }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* Status Cell - Enhanced Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm shadow-black/5 ${ user.status === 'Active' ? 'bg-gradient-to-tr from-green-200 to-cyan-200 text-green-900' : 'bg-gradient-to-tr from-red-200 to-orange-200 text-red-900' }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        {/* Joined Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.joined}</td>
                                        {/* Actions Cell - Enhanced Buttons */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center items-center space-x-3"> {/* Increased spacing */}
                                                <button onClick={() => handleOpenEditModal(user)} title="Edit User" className="p-2 text-blue-600 hover:bg-blue-100/80 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md"><FiEdit className="h-4 w-4" /></button>
                                                <button onClick={() => handleToggleStatus(user.id)} title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'} className={`p-2 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md ${ user.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-100/80' : 'text-green-600 hover:bg-green-100/80' }`}>{user.status === 'Active' ? <FiToggleLeft className="h-4 w-4" /> : <FiToggleRight className="h-4 w-4" />}</button>
                                                <button onClick={() => handleOpenDeleteModal(user)} title="Delete User" className="p-2 text-red-600 hover:bg-red-100/80 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md"><FiTrash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* No Results Row */}
                                {sortedAndFilteredUsers.length === 0 && ( <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 italic">{searchTerm ? 'No users match your search.' : 'No users found.'}</td></tr> )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Render Modals (Styling enhanced inside definitions) */}
            <UserFormModal isOpen={isUserModalOpen} onClose={handleCloseModals} onSubmit={handleSaveUser} initialData={editingUser} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} onConfirm={handleConfirmDelete} username={deletingUser?.username} />
        </>
    );
}

export default AdminUsersPage;
