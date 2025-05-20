// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { 
    FiUser, FiMail, FiLock, FiBell, FiTrash2, FiSettings, 
    FiCheck, FiAlertCircle, FiDownload, FiSave, FiLoader, FiActivity, FiCoffee
} from 'react-icons/fi';
import { FaWeight } from 'react-icons/fa';
import { 
    updateUserProfile, 
    changeUserPassword,
    exportWorkoutsData,
    exportWeightData // Import new export function
    // We'll add exportMealsData later
} from '../services/api';
import PasswordInputWithToggle from '../components/common/PasswordInputWithToggle.jsx';

const InfoCard = ({ title, children, className = '', icon }) => ( /* ... (same as before) ... */ <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center"> {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>} {title} </h2> <div className="space-y-5">{children}</div> </div> );
const UnitToggle = ({ selectedUnit, onUnitChange }) => ( /* ... (same as before) ... */ <div className="flex items-center bg-gray-200 rounded-full p-1 text-sm"> <button onClick={() => onUnitChange('kg')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${selectedUnit === 'kg' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}> kg </button> <button onClick={() => onUnitChange('lbs')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${selectedUnit === 'lbs' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}> lbs </button> </div> );
const convertToCSV = (dataArray, headers) => { if (!dataArray || dataArray.length === 0) return ''; const headerKeys = headers || Object.keys(dataArray[0]); const headerString = headerKeys.join(','); const rows = dataArray.map(obj => { return headerKeys.map(key => { let fieldValue = obj[key] === null || obj[key] === undefined ? '' : obj[key]; if (typeof fieldValue === 'object') { fieldValue = JSON.stringify(fieldValue); } let stringValue = String(fieldValue); if (stringValue.includes('"') || stringValue.includes(',')) { stringValue = `"${stringValue.replace(/"/g, '""')}"`; } return stringValue; }).join(','); }); return [headerString, ...rows].join('\n'); };
const downloadCSV = (csvString, filename) => { const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); if (link.download !== undefined) {  const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", filename); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); } else { alert("CSV download is not supported in your browser."); } };

function SettingsPage() {
    const { user, login } = useAuth(); 

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileUpdateMessage, setProfileUpdateMessage] = useState({ type: '', text: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordChangeMessage, setPasswordChangeMessage] = useState({ type: '', text: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [preferredUnit, setPreferredUnit] = useState(() => localStorage.getItem('fitnessAppPreferredUnit') || 'kg');
    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('fitnessAppNotifications');
        return savedNotifications ? JSON.parse(savedNotifications) : { reminders: true, blog: false, updates: true };
    });
    const [preferencesSavedMessage, setPreferencesSavedMessage] = useState('');
    
    const [isExportingWorkouts, setIsExportingWorkouts] = useState(false);
    const [isExportingWeight, setIsExportingWeight] = useState(false); // New state for weight export
    // const [isExportingMeals, setIsExportingMeals] = useState(false);


    useEffect(() => { if (user) { setUsername(user.username); setEmail(user.email); } }, [user]);
    useEffect(() => { localStorage.setItem('fitnessAppPreferredUnit', preferredUnit); }, [preferredUnit]);
    useEffect(() => { localStorage.setItem('fitnessAppNotifications', JSON.stringify(notifications)); }, [notifications]);

    const handleNotificationChange = (event) => { const { name, checked } = event.target; setNotifications(prev => ({ ...prev, [name]: checked })); setPreferencesSavedMessage(''); };
    const handleUnitChange = (unit) => { setPreferredUnit(unit); setPreferencesSavedMessage(''); };
    const handleSavePreferences = () => { setPreferencesSavedMessage('Preferences saved to browser!'); setTimeout(() => setPreferencesSavedMessage(''), 3000); console.log("Preferences saved (to localStorage):", { preferredUnit, notifications }); };
    const handleUpdateProfile = async (e) => { e.preventDefault(); setProfileUpdateMessage({ type: '', text: '' }); if (!username.trim()) { setProfileUpdateMessage({ type: 'error', text: 'Username cannot be empty.' }); return; } setIsUpdatingProfile(true); try { const response = await updateUserProfile({ username: username.trim() }); setProfileUpdateMessage({ type: 'success', text: 'Profile updated successfully!' }); if (response.user && user && response.user.username !== user.username) { const updatedUserContext = { ...user, username: response.user.username }; login(updatedUserContext); } setTimeout(() => setProfileUpdateMessage({ type: '', text: '' }), 3000); } catch (error) { setProfileUpdateMessage({ type: 'error', text: error.message || 'Failed to update profile.' }); } finally { setIsUpdatingProfile(false); } };
    const handleChangePassword = async (e) => { e.preventDefault(); setPasswordChangeMessage({ type: '', text: '' }); if (!currentPassword || !newPassword || !confirmNewPassword) { setPasswordChangeMessage({ type: 'error', text: 'All password fields are required.' }); return; } if (newPassword !== confirmNewPassword) { setPasswordChangeMessage({ type: 'error', text: 'New passwords do not match.' }); return; } if (newPassword.length < 6) { setPasswordChangeMessage({ type: 'error', text: 'New password must be at least 6 characters long.' }); return; } setIsChangingPassword(true); try { await changeUserPassword({ currentPassword, newPassword }); setPasswordChangeMessage({ type: 'success', text: 'Password changed successfully!' }); setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword(''); } catch (error) { setPasswordChangeMessage({ type: 'error', text: error.message || 'Failed to change password.' }); } finally { setIsChangingPassword(false); setTimeout(() => setPasswordChangeMessage({ type: '', text: '' }), 4000); } };
    
    const handleDeactivate = () => alert('Deactivate Account clicked (functionality not implemented yet).');
    const handleDelete = () => alert('Delete Account clicked (functionality not implemented yet).');

    const handleExportWorkouts = async () => {
        setIsExportingWorkouts(true);
        try {
            const data = await exportWorkoutsData(); 
            if (data && data.length > 0) {
                const headers = ['session_date', 'session_name', 'duration_seconds', 'exercise_name', 'set_number', 'reps', 'weight', 'unit', 'session_notes'];
                const csv = convertToCSV(data, headers);
                downloadCSV(csv, `my_workouts_export_${new Date().toISOString().split('T')[0]}.csv`);
            } else {
                alert("No workout data found to export.");
            }
        } catch (error) {
            console.error("Error exporting workouts:", error);
            alert(`Failed to export workouts: ${error.message}`);
        } finally {
            setIsExportingWorkouts(false);
        }
    };

    // --- MODIFIED: handleExportWeight ---
    const handleExportWeight = async () => {
        setIsExportingWeight(true);
        try {
            const data = await exportWeightData(); // API call
            if (data && data.length > 0) {
                // Define headers based on the data structure from backend (log_date, weight_kg)
                const headers = ['log_date', 'weight_kg'];
                const csv = convertToCSV(data, headers);
                downloadCSV(csv, `my_weight_logs_export_${new Date().toISOString().split('T')[0]}.csv`);
            } else {
                alert("No weight data found to export.");
            }
        } catch (error) {
            console.error("Error exporting weight data:", error);
            alert(`Failed to export weight data: ${error.message}`);
        } finally {
            setIsExportingWeight(false);
        }
    };
    // --- END MODIFICATION ---

    const handleExportMeals = () => alert("Export Meal Data: Functionality to be implemented.");


    return (
        <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto animate-fadeIn">
            {/* ... (Header and Profile Info Card remain the same) ... */}
            <div className="pb-6 border-b border-gray-200/80"> <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center"> <FiSettings className="mr-3 text-indigo-600"/> Settings </h1> <p className="mt-2 text-lg text-gray-600"> Manage your profile, preferences, and account data. </p> </div>
            <InfoCard title="Profile Information" icon={<FiUser />}> <form onSubmit={handleUpdateProfile} className="space-y-4"> <div> <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label> <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /> </div> <div> <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label> <input type="email" id="email" value={email} disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" /> <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p> </div> {profileUpdateMessage.text && ( <p className={`text-sm ${profileUpdateMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}> {profileUpdateMessage.text} </p> )} <div className="pt-2"> <button type="submit" disabled={isUpdatingProfile || username === user?.username} className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-105 disabled:opacity-50"> {isUpdatingProfile ? <FiLoader className="animate-spin mr-2"/> : <FiSave className="mr-2"/>} {isUpdatingProfile ? 'Updating...' : 'Update Profile'} </button> </div> </form> </InfoCard>
            <InfoCard title="Change Password" icon={<FiLock />}> <form onSubmit={handleChangePassword} className="space-y-4"> <div> <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label> <PasswordInputWithToggle id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" autoComplete="current-password" /> </div> <div> <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label> <PasswordInputWithToggle id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" /> </div> <div> <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label> <PasswordInputWithToggle id="confirm-new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" /> </div> {passwordChangeMessage.text && ( <p className={`text-sm ${passwordChangeMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}> {passwordChangeMessage.text} </p> )} <div className="pt-2"> <button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 transform hover:scale-105 disabled:opacity-50"> {isChangingPassword ? <FiLoader className="animate-spin mr-2"/> : <FiLock className="mr-2"/>} {isChangingPassword ? 'Changing...' : 'Change Password'} </button> </div> </form> </InfoCard>
            <InfoCard title="Preferences" icon={<FiSettings />}> <div className="space-y-5"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> <label className="text-sm font-medium text-gray-700 flex items-center whitespace-nowrap"> <FaWeight className="mr-2 text-gray-500"/> Default Weight Unit </label> <UnitToggle selectedUnit={preferredUnit} onUnitChange={handleUnitChange} /> </div> <div> <label className="text-sm font-medium text-gray-700 mb-2 block">Notifications</label> <div className="space-y-2"> <div className="flex items-center"> <input id="notif-reminders" name="reminders" type="checkbox" checked={notifications.reminders} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/> <label htmlFor="notif-reminders" className="ml-2 block text-sm text-gray-900">Workout Reminders</label> </div> <div className="flex items-center"> <input id="notif-blog" name="blog" type="checkbox" checked={notifications.blog} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/> <label htmlFor="notif-blog" className="ml-2 block text-sm text-gray-900">New Blog Post Alerts</label> </div> <div className="flex items-center"> <input id="notif-updates" name="updates" type="checkbox" checked={notifications.updates} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/> <label htmlFor="notif-updates" className="ml-2 block text-sm text-gray-900">App Updates & Features</label> </div> </div> </div> {preferencesSavedMessage && <p className="text-sm text-green-600 text-right mt-2">{preferencesSavedMessage}</p>} <div className="pt-2 flex justify-end"> <button onClick={handleSavePreferences} className="flex items-center px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-105"> <FiCheck className="mr-1.5"/> Save Preferences </button> </div> </div> </InfoCard>
            
            <InfoCard title="Data Export" icon={<FiDownload />}>
                <p className="text-sm text-gray-600 mb-5">Download your logged data.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={handleExportWorkouts}
                        disabled={isExportingWorkouts}
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 transform hover:scale-[1.03] disabled:opacity-60"
                    >
                        {isExportingWorkouts ? <FiLoader className="animate-spin mr-2"/> : <FiActivity className="mr-2"/>}
                        {isExportingWorkouts ? 'Exporting...' : 'Export Workouts'}
                    </button>
                    <button 
                        onClick={handleExportWeight}
                        disabled={isExportingWeight} // Enable this button
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 transform hover:scale-[1.03] disabled:opacity-60"
                    >
                        {isExportingWeight ? <FiLoader className="animate-spin mr-2"/> : <FaWeight className="mr-2"/>}
                        {isExportingWeight ? 'Exporting...' : 'Export Weight'}
                    </button>
                    <button 
                        onClick={handleExportMeals}
                        // disabled={isExportingMeals} // Uncomment when implemented
                        disabled={true} // Keep disabled for now
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 transform hover:scale-[1.03] disabled:opacity-60"
                    >
                        <FiCoffee className="mr-2"/> Export Meals (TBD)
                    </button>
                </div>
            </InfoCard>

            <InfoCard title="Account Actions" icon={<FiAlertCircle className="text-red-500" />}> <div className="space-y-4"> <p className="text-sm text-gray-600">Manage your account status.</p> <div className="flex flex-col sm:flex-row gap-3"> <button onClick={handleDeactivate} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 disabled:opacity-50" disabled> Deactivate Account (Disabled) </button> <button onClick={handleDelete} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 disabled:opacity-50" disabled> <FiTrash2 className="mr-2"/> Delete Account (Disabled) </button> </div> <p className="text-xs text-gray-500 pt-2">Note: Account actions are currently disabled in this prototype.</p> </div> </InfoCard>
        </div>
    );
}

export default SettingsPage;
