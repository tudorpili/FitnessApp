// src/pages/AdminUsersPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
// Added FiAlertCircle to imports, also FiUserCheck, FiUserX for clarity if needed later
import {
    FiUsers, FiPlus, FiEdit, FiToggleLeft, FiToggleRight, FiTrash2, FiSearch,
    FiX, FiSave, FiAlertTriangle, FiUserCheck, FiUserX, FiArrowUp, FiArrowDown,
    FiAlertCircle // <-- Added missing icon
} from 'react-icons/fi';

// Mock user data
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

// --- Add/Edit User Modal Component ---
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const isEditMode = useMemo(() => !!initialData, [initialData]);

    // Effect to populate form on open/edit
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setUsername(initialData.username || '');
                setEmail(initialData.email || '');
                setRole(initialData.role || 'User');
                setPassword('');
            } else {
                setUsername(''); setEmail(''); setRole('User'); setPassword('');
            }
            setFormError('');
        }
    }, [isOpen, initialData, isEditMode]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!username.trim() || !email.trim()) { setFormError('Username and Email are required.'); return; }
        if (!isEditMode && !password) { setFormError('Password is required for new users.'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setFormError('Please enter a valid email address.'); return; }

        const userData = { username, email, role, ...(password && { password }) };
        const submissionError = onSubmit(userData, initialData?.id); // Call parent handler

        if (submissionError) {
            setFormError(submissionError); // Show error from parent (e.g., duplicate)
        } else {
            onClose(); // Close modal on success
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
            onClick={onClose} // Close on overlay click
        >
            <div
                className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg animate-fadeIn"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {isEditMode ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label htmlFor="modal-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text" id="modal-username" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" id="modal-email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password {isEditMode ? '(Leave blank to keep current)' : '*'}
                        </label>
                        <input
                            type="password" id="modal-password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditMode}
                            placeholder={isEditMode ? 'Enter new password' : ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Role */}
                    <div>
                        <label htmlFor="modal-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="modal-role" value={role} onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {/* Error Display */}
                    {formError && (
                        <p className="text-sm text-red-600 flex items-center">
                            <FiAlertCircle className="mr-1 h-4 w-4"/> {formError}
                        </p>
                    )}
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow"
                        >
                            <FiSave className="mr-1.5"/> {isEditMode ? 'Save Changes' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, username }) => { /* ... Modal code remains the same ... */
    if (!isOpen) return null;
    return ( <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-200" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-4"> <h3 className="text-lg font-semibold text-gray-800 flex items-center"><FiAlertTriangle className="text-red-500 mr-2"/>Confirm Deletion</h3> <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button> </div> <p className="text-sm text-gray-600 mb-6"> Are you sure you want to delete the user <strong className="text-gray-900">{username || 'this user'}</strong>? This action cannot be undone. </p> <div className="flex justify-end gap-3"> <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150">Cancel</button> <button onClick={onConfirm} className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 shadow"> <FiTrash2 className="mr-1.5"/> Delete User </button> </div> </div> </div> );
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

    // Modal Control Functions
    const handleOpenAddModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
    const handleOpenEditModal = (userToEdit) => { setEditingUser(userToEdit); setIsUserModalOpen(true); };
    const handleOpenDeleteModal = (userToDelete) => { setDeletingUser(userToDelete); setIsDeleteModalOpen(true); };
    const handleCloseModals = () => { setIsUserModalOpen(false); setIsDeleteModalOpen(false); setEditingUser(null); setDeletingUser(null); };

    // Action Handlers (with validation)
    const handleSaveUser = (formData, userId) => {
        if (userId) { // Edit Mode
            const usernameExists = users.some(user => user.id !== userId && user.username.toLowerCase() === formData.username.toLowerCase());
            if (usernameExists) return "Username already exists.";
            const emailExists = users.some(user => user.id !== userId && user.email.toLowerCase() === formData.email.toLowerCase());
            if (emailExists) return "Email address is already registered.";
            setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, ...formData, password: formData.password || user.password } : user ));
            return null; // Success
        } else { // Add Mode
            const usernameExists = users.some(user => user.username.toLowerCase() === formData.username.toLowerCase());
            if (usernameExists) return "Username already exists.";
            const emailExists = users.some(user => user.email.toLowerCase() === formData.email.toLowerCase());
             if (emailExists) return "Email address is already registered.";
            const newUser = { ...formData, id: `u${Date.now()}`, status: 'Active', joined: getTodayDate() };
            setUsers(currentUsers => [newUser, ...currentUsers]);
            return null; // Success
        }
    };
    const handleToggleStatus = (userId) => { setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user )); };
    const handleConfirmDelete = () => { if (!deletingUser) return; setUsers(currentUsers => currentUsers.filter(user => user.id !== deletingUser.id)); handleCloseModals(); };

    // Filtering and Sorting Logic
    const filteredUsers = useMemo(() => { if (!searchTerm.trim()) return users; const lowerSearch = searchTerm.toLowerCase(); return users.filter(user => user.username.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch) || user.role.toLowerCase().includes(lowerSearch)); }, [users, searchTerm]);
    const sortedAndFilteredUsers = useMemo(() => { let sortableItems = [...filteredUsers]; if (sortColumn !== null) { sortableItems.sort((a, b) => { const valA = a[sortColumn]; const valB = b[sortColumn]; let comparison = 0; if (sortColumn === 'joined') { comparison = new Date(valA) - new Date(valB); } else if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' }); } else { if (valA < valB) comparison = -1; if (valA > valB) comparison = 1; } return sortDirection === 'asc' ? comparison : comparison * -1; }); } return sortableItems; }, [filteredUsers, sortColumn, sortDirection]);
    const handleSort = (columnName) => { if (sortColumn === columnName) { setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc')); } else { setSortColumn(columnName); setSortDirection('asc'); } };
    const SortIcon = ({ columnName }) => { if (sortColumn !== columnName) return null; return sortDirection === 'asc' ? <FiArrowUp className="inline ml-1 h-3 w-3" /> : <FiArrowDown className="inline ml-1 h-3 w-3" />; };

    return (
        <> {/* Using Fragment */}
            <div className="space-y-8 animate-fadeIn">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            User Management ({users.length})
                        </h1>
                        <p className="mt-1 text-md text-gray-600">
                            View, manage, and modify user accounts.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-1.5 h-5 w-5"/> Add New User
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by username, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm focus:shadow-md bg-white/80 backdrop-blur-sm"
                    />
                </div>

                {/* User Table Card */}
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200/80">
                            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                                <tr>
                                    {/* Header Cell with Button for Sorting */}
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('username')} className="flex items-center hover:text-slate-900 transition-colors">
                                            User <SortIcon columnName="username" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('role')} className="flex items-center hover:text-slate-900 transition-colors">
                                            Role <SortIcon columnName="role" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('status')} className="flex items-center hover:text-slate-900 transition-colors">
                                            Status <SortIcon columnName="status" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <button onClick={() => handleSort('joined')} className="flex items-center hover:text-slate-900 transition-colors">
                                            Joined <SortIcon columnName="joined" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200/50">
                                {sortedAndFilteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                        {/* User Info Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${getColorForName(user.username)}`}>
                                                    {getInitials(user.username)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Role Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${ user.role === 'Admin' ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800' : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800' }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* Status Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${ user.status === 'Active' ? 'bg-gradient-to-r from-green-100 to-cyan-100 text-green-800' : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800' }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        {/* Joined Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.joined}
                                        </td>
                                        {/* Actions Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => handleOpenEditModal(user)} title="Edit User" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150 transform hover:scale-110"><FiEdit className="h-4 w-4" /></button>
                                                <button onClick={() => handleToggleStatus(user.id)} title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'} className={`p-2 rounded-lg transition-colors duration-150 transform hover:scale-110 ${ user.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100' }`}>{user.status === 'Active' ? <FiToggleLeft className="h-4 w-4" /> : <FiToggleRight className="h-4 w-4" />}</button>
                                                <button onClick={() => handleOpenDeleteModal(user)} title="Delete User" className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150 transform hover:scale-110"><FiTrash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* No Results Row */}
                                {sortedAndFilteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                                            {searchTerm ? 'No users match your search.' : 'No users found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            <UserFormModal
                isOpen={isUserModalOpen}
                onClose={handleCloseModals}
                onSubmit={handleSaveUser}
                initialData={editingUser}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                username={deletingUser?.username}
            />
        </>
    );
}

export default AdminUsersPage;
