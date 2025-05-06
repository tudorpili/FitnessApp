// src/pages/AdminUsersPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // To prevent admin deleting self
// Import API functions
import { adminGetAllUsers, adminUpdateUser, adminDeleteUser, registerUser } from '../services/api';
import {
    FiUsers, FiPlus, FiEdit, FiToggleLeft, FiToggleRight, FiTrash2, FiSearch,
    FiX, FiSave, FiAlertTriangle, FiUserCheck, FiUserX, FiArrowUp, FiArrowDown,
    FiAlertCircle, FiLoader, FiCheck // Added Loader, Check
} from 'react-icons/fi';

// --- Helper Functions (getTodayDate, getInitials, getColorForName remain the same) ---
const getTodayDate = () => { const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };
const getInitials = (name = '') => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
const getColorForName = (name = '') => { let hash = 0; for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); hash = hash & hash; } const colors = ['bg-blue-100 text-blue-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-800', 'bg-violet-100 text-violet-800', 'bg-cyan-100 text-cyan-800']; return colors[Math.abs(hash) % colors.length]; };

// --- UserFormModal Component ---
// Updated to handle async submit and API errors
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User');
    const [password, setPassword] = useState(''); // Only used for adding new user
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = useMemo(() => !!initialData, [initialData]);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && initialData) {
                setUsername(initialData.username || '');
                setEmail(initialData.email || '');
                setRole(initialData.role || 'User');
                setPassword(''); // Clear password field in edit mode
            } else {
                // Reset for add mode
                setUsername(''); setEmail(''); setRole('User'); setPassword('');
            }
            setFormError('');
            setIsSubmitting(false);
        }
    }, [isOpen, initialData, isEditMode]);

    const handleSubmit = async (e) => { // Make async
        e.preventDefault();
        setFormError('');

        // Client-side validation
        if (!username.trim() || !email.trim()) { setFormError('Username and Email are required.'); return; }
        if (!isEditMode && !password) { setFormError('Password is required for new users.'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setFormError('Please enter a valid email address.'); return; }

        setIsSubmitting(true);

        // Prepare data based on mode
        const userData = isEditMode
            ? { username: username.trim(), email: email.trim(), role } // Only send fields that can be updated by admin
            : { username: username.trim(), email: email.trim(), password, role }; // Include password for new user

        try {
            // Call the passed onSubmit function (which triggers API call)
            await onSubmit(userData, initialData?.id);
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Error saving user:", error);
            setFormError(error.message || `Failed to ${isEditMode ? 'update' : 'add'} user.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        // Modal JSX (mostly unchanged, added loading state to button)
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-gradient-to-br from-white/90 via-slate-50/90 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-500/10 p-6 sm:p-8 w-full max-w-lg border border-white/20 animate-modalEnter" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200/80"> <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{isEditMode ? 'Edit User Details' : 'Add New User'}</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div> <label htmlFor="modal-username" className="block text-sm font-medium text-slate-700 mb-1">Username</label> <input type="text" id="modal-username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" /> </div>
                    {/* Email */}
                    <div> <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label> <input type="email" id="modal-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" /> </div>
                    {/* Password (only for Add mode) */}
                    {!isEditMode && ( <div> <label htmlFor="modal-password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label> <input type="password" id="modal-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white/80" /> </div> )}
                    {/* Role */}
                    <div> <label htmlFor="modal-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label> <select id="modal-role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none"> <option value="User">User</option> <option value="Admin">Admin</option> </select> </div>
                    {/* Form Error */}
                    {formError && ( <p className="text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1 h-4 w-4"/> {formError}</p> )}
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-5"> <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button> <button type="submit" disabled={isSubmitting} className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60"> {isSubmitting ? <FiLoader className="animate-spin mr-1.5"/> : <FiSave className="mr-1.5"/>} {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add User')} </button> </div>
                </form>
            </div>
        </div>
    );
};

// --- DeleteConfirmModal (remains the same) ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, username }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-modalEnter border border-white/20" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200"> <h3 className="text-lg font-semibold text-slate-800 flex items-center"><FiAlertTriangle className="text-red-500 mr-2"/> Confirm Deletion</h3> <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={24} /></button> </div> <p className="text-sm text-slate-600 mb-6"> Are you sure you want to delete the user <strong className="text-slate-900">{username || 'this user'}</strong>? This action cannot be undone. </p> <div className="flex justify-end gap-3"> <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Cancel</button> <button onClick={onConfirm} className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> <FiTrash2 className="mr-1.5"/> Delete User </button> </div> </div> </div> ); };


// --- AdminUsersPage Component ---
function AdminUsersPage() {
    const { user: loggedInUser } = useAuth(); // Get logged-in user to prevent self-delete/deactivate

    // State for user list, loading, error
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for search and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('username');
    const [sortDirection, setSortDirection] = useState('asc');

    // State for modals
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null for Add, user object for Edit
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    // --- Fetch Users Function ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching users for admin page...");
            const data = await adminGetAllUsers(); // API Call
            // Format joined date (created_at from backend)
            const formattedData = data.map(u => ({
                ...u,
                joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'
            }));
            setUsers(formattedData || []);
            console.log("Admin users fetched:", formattedData);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError(err.message || "Could not load users.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- useEffect to Fetch on Mount ---
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Memoized Calculations (Filtering and Sorting) ---
    const filteredUsers = useMemo(() => { /* ... (remains the same) ... */ if (!searchTerm.trim()) return users; const lowerSearch = searchTerm.toLowerCase(); return users.filter(user => user.username.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch) || user.role.toLowerCase().includes(lowerSearch)); }, [users, searchTerm]);
    const sortedAndFilteredUsers = useMemo(() => { /* ... (remains the same) ... */ let sortableItems = [...filteredUsers]; if (sortColumn !== null) { sortableItems.sort((a, b) => { const valA = a[sortColumn]; const valB = b[sortColumn]; let comparison = 0; if (sortColumn === 'joined') { comparison = new Date(a.created_at) - new Date(b.created_at); } else if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' }); } else { if (valA < valB) comparison = -1; if (valA > valB) comparison = 1; } return sortDirection === 'asc' ? comparison : comparison * -1; }); } return sortableItems; }, [filteredUsers, sortColumn, sortDirection]);

    // --- Modal Handlers ---
    const handleOpenAddModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
    const handleOpenEditModal = (userToEdit) => { setEditingUser(userToEdit); setIsUserModalOpen(true); };
    const handleOpenDeleteModal = (userToDelete) => { setDeletingUser(userToDelete); setIsDeleteModalOpen(true); };
    const handleCloseModals = () => { setIsUserModalOpen(false); setIsDeleteModalOpen(false); setEditingUser(null); setDeletingUser(null); };

    // --- API Interaction Handlers ---
    // Handle Add/Update User
    const handleSaveUser = async (formData, userId) => { // Made async
        console.log("handleSaveUser called. Mode:", userId ? "Update" : "Add", "Data:", formData);
        try {
            if (userId) {
                // --- UPDATE ---
                // Don't send password if not provided (backend handles this)
                await adminUpdateUser(userId, formData); // API call
                console.log(`User ${userId} updated.`);
            } else {
                // --- ADD ---
                // Use registerUser for adding (backend handles hashing etc.)
                await registerUser(formData.username, formData.email, formData.password, formData.role); // API call
                console.log("New user added.");
            }
            fetchUsers(); // Refresh list on success
            // Error handling is now done within the modal's handleSubmit
            return null; // Indicate success to modal
        } catch (error) {
            console.error("API Error during save/update user:", error);
            // Re-throw the error so the modal can display it
            throw error;
        }
    };

    // Handle Toggle Status
    const handleToggleStatus = async (userToToggle) => { // Make async
        if (loggedInUser && loggedInUser.id === userToToggle.id) {
            alert("Admins cannot change their own status via user management.");
            return;
        }
        const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active';
        console.log(`Toggling status for user ID ${userToToggle.id} to ${newStatus}`);
        try {
            await adminUpdateUser(userToToggle.id, { status: newStatus }); // API call
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("API Error toggling user status:", error);
            alert(`Error updating status: ${error.message}`);
        }
    };

    // Handle Delete User
    const handleConfirmDelete = async () => { // Make async
        if (!deletingUser) return;
        if (loggedInUser && loggedInUser.id === deletingUser.id) {
             alert("Admins cannot delete their own account via user management.");
             handleCloseModals();
             return;
        }
        console.log(`Attempting to delete user ID: ${deletingUser.id}`);
        try {
            await adminDeleteUser(deletingUser.id); // API call
            console.log(`User ${deletingUser.id} deleted.`);
            fetchUsers(); // Refresh list
            handleCloseModals(); // Close delete confirmation modal
        } catch (error) {
            console.error("API Error during delete user:", error);
            alert(`Error deleting user: ${error.message}`);
            // Don't close modal on error, let user retry or cancel
        }
    };

    // --- Sorting Handler ---
    const handleSort = (columnName) => { /* ... */ if (sortColumn === columnName) { setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc')); } else { setSortColumn(columnName); setSortDirection('asc'); } };
    const SortIcon = ({ columnName }) => { /* ... */ if (sortColumn !== columnName) return null; return sortDirection === 'asc' ? <FiArrowUp className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" /> : <FiArrowDown className="inline ml-1.5 h-3.5 w-3.5 text-slate-500" />; };

    // --- Render Logic ---
    return (
        <>
            <div className="space-y-10 p-2 animate-fadeIn">
                {/* Header and Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div> <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"> User Management <span className="ml-3 text-lg font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full"> {users.length} Users </span> </h1> <p className="mt-2 text-lg text-slate-600"> View, manage, and modify user accounts. </p> </div>
                    <button onClick={handleOpenAddModal} className="flex-shrink-0 flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"> <FiPlus className="mr-2 h-5 w-5"/> Add New User </button>
                </div>

                {/* Search Input */}
                <div className="relative"> <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"> <FiSearch /> </span> <input type="text" placeholder="Search users by username, email, or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm"/> </div>

                {/* Loading State */}
                {isLoading && <div className="flex justify-center items-center py-10"><FiLoader className="animate-spin h-8 w-8 text-indigo-600" /><span className="ml-3 text-gray-600">Loading Users...</span></div>}

                {/* Error State */}
                {error && !isLoading && <div className="text-center py-10 px-6 bg-red-50 rounded-lg border border-red-200"><p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {error}</p><button onClick={fetchUsers} className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Retry</button></div>}

                {/* User Table */}
                {!isLoading && !error && (
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden border border-white/20">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200/70">
                                <thead className="bg-slate-100/80 backdrop-blur-md sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('username')} className="group flex items-center hover:text-indigo-700 transition-colors">User <SortIcon columnName="username" /></button></th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('role')} className="group flex items-center hover:text-indigo-700 transition-colors">Role <SortIcon columnName="role" /></button></th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('status')} className="group flex items-center hover:text-indigo-700 transition-colors">Status <SortIcon columnName="status" /></button></th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"><button onClick={() => handleSort('created_at')} className="group flex items-center hover:text-indigo-700 transition-colors">Joined <SortIcon columnName="created_at" /></button></th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/80 divide-y divide-slate-200/50">
                                    {sortedAndFilteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-indigo-50/40 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap"> <div className="flex items-center"> <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ring-1 ring-white/50 ${getColorForName(user.username)}`}>{getInitials(user.username)}</div> <div className="ml-4"> <div className="text-sm font-semibold text-slate-900">{user.username}</div> <div className="text-xs text-slate-500">{user.email}</div> </div> </div> </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"> <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm shadow-black/5 ${ user.role === 'Admin' ? 'bg-gradient-to-tr from-indigo-200 to-purple-200 text-indigo-900' : 'bg-gradient-to-tr from-emerald-200 to-green-200 text-emerald-900' }`}>{user.role}</span> </td>
                                            <td className="px-6 py-4 whitespace-nowrap"> <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm shadow-black/5 ${ user.status === 'Active' ? 'bg-gradient-to-tr from-green-200 to-cyan-200 text-green-900' : 'bg-gradient-to-tr from-red-200 to-orange-200 text-red-900' }`}>{user.status}</span> </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.joined}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"> <div className="flex justify-center items-center space-x-3"> <button onClick={() => handleOpenEditModal(user)} title="Edit User" className="p-2 text-blue-600 hover:bg-blue-100/80 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md"><FiEdit className="h-4 w-4" /></button> <button onClick={() => handleToggleStatus(user)} disabled={loggedInUser?.id === user.id} title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'} className={`p-2 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md ${ user.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-100/80' : 'text-green-600 hover:bg-green-100/80' } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}>{user.status === 'Active' ? <FiToggleLeft className="h-4 w-4" /> : <FiToggleRight className="h-4 w-4" />}</button> <button onClick={() => handleOpenDeleteModal(user)} disabled={loggedInUser?.id === user.id} title="Delete User" className="p-2 text-red-600 hover:bg-red-100/80 rounded-lg transition-all duration-150 transform hover:scale-110 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"><FiTrash2 className="h-4 w-4" /></button> </div> </td>
                                        </tr>
                                    ))}
                                    {sortedAndFilteredUsers.length === 0 && ( <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 italic">{searchTerm ? 'No users match your search.' : 'No users found.'}</td></tr> )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserFormModal isOpen={isUserModalOpen} onClose={handleCloseModals} onSubmit={handleSaveUser} initialData={editingUser} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} onConfirm={handleConfirmDelete} username={deletingUser?.username} />
        </>
    );
}

export default AdminUsersPage;
