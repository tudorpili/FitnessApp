// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiTrash2, FiSettings, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { FaWeight } from 'react-icons/fa'; // Re-using weight icon for units

// --- Reusable Components (Ideally move to src/components/common/) ---

// Simple Card component
const InfoCard = ({ title, children, className = '', icon }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center">
        {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

// Unit Toggle Component
const UnitToggle = ({ selectedUnit, onUnitChange }) => (
  <div className="flex items-center bg-gray-200 rounded-full p-1 text-sm">
    <button
      onClick={() => onUnitChange('kg')}
      className={`px-4 py-1 rounded-full transition-colors duration-200 ${
        selectedUnit === 'kg' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
      }`}
    >
      kg
    </button>
    <button
      onClick={() => onUnitChange('lbs')}
      className={`px-4 py-1 rounded-full transition-colors duration-200 ${
        selectedUnit === 'lbs' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
      }`}
    >
      lbs
    </button>
  </div>
);
// --- End Reusable Components ---


function SettingsPage() {
    // Local state for preferences (won't persist without backend/storage)
    const [preferredUnit, setPreferredUnit] = useState('kg');
    const [notifications, setNotifications] = useState({
        reminders: true,
        blog: false,
    });

    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
        // In real app, save this preference
        console.log(`Notification ${name} set to ${checked}`);
    };

    // Placeholder action handlers
    const handleUpdateProfile = () => alert('Update Profile clicked (functionality not implemented).');
    const handleChangePassword = () => alert('Change Password clicked (functionality not implemented).');
    const handleDeactivate = () => alert('Deactivate Account clicked (functionality not implemented).');
    const handleDelete = () => alert('Delete Account clicked (functionality not implemented).');


    return (
        <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto"> {/* Centered content */}
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                   <FiSettings className="mr-3 text-indigo-600"/> Settings
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Manage your profile, preferences, and account.
                </p>
            </div>

            {/* Profile Section */}
            <InfoCard title="Profile Information" icon={<FiUser />}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" id="username" value="MockUser" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" />
                        <p className="text-xs text-gray-400 mt-1">Username cannot be changed currently.</p>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="email" value="mock.user@example.com" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                         <button
                            onClick={handleUpdateProfile}
                            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                         >
                            <FiCheck className="mr-2"/> Update Profile (Disabled)
                         </button>
                          <button
                            onClick={handleChangePassword}
                            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                         >
                             <FiLock className="mr-2"/> Change Password (Disabled)
                         </button>
                    </div>
                </div>
            </InfoCard>

            {/* Preferences Section */}
            <InfoCard title="Preferences" icon={<FiSettings />}>
                 <div className="space-y-5">
                    {/* Unit Preference */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaWeight className="mr-2 text-gray-500"/> Default Weight Unit
                        </label>
                        <UnitToggle selectedUnit={preferredUnit} onUnitChange={setPreferredUnit} />
                    </div>

                    {/* Theme Preference (Placeholder) */}
                    <div className="flex items-center justify-between">
                         <label className="text-sm font-medium text-gray-700">Theme</label>
                         <div className="text-sm text-gray-400 italic">(Theme switching not implemented)</div>
                         {/* Add Theme Toggle Component Here Later */}
                    </div>

                    {/* Notification Preferences (Placeholders) */}
                     <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Notifications</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input id="notif-reminders" name="reminders" type="checkbox" checked={notifications.reminders} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                <label htmlFor="notif-reminders" className="ml-2 block text-sm text-gray-900">Workout Reminders</label>
                            </div>
                             <div className="flex items-center">
                                <input id="notif-blog" name="blog" type="checkbox" checked={notifications.blog} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                <label htmlFor="notif-blog" className="ml-2 block text-sm text-gray-900">New Blog Post Alerts</label>
                            </div>
                        </div>
                    </div>
                 </div>
            </InfoCard>

             {/* Account Actions Section */}
             <InfoCard title="Account Actions" icon={<FiAlertTriangle />}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Manage your account status.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                         <button
                            onClick={handleDeactivate}
                            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150"
                         >
                            Deactivate Account (Disabled)
                         </button>
                          <button
                            onClick={handleDelete}
                            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                         >
                             <FiTrash2 className="mr-2"/> Delete Account (Disabled)
                         </button>
                    </div>
                     <p className="text-xs text-gray-500 pt-2">Note: Account actions are currently disabled in this prototype.</p>
                </div>
            </InfoCard>

        </div>
    );
}

export default SettingsPage;
