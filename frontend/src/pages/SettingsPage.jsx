// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { FiCoffee, FiActivity, FiUser, FiMail, FiLock, FiBell, FiTrash2, FiSettings, FiCheck, FiAlertTriangle, FiDownload } from 'react-icons/fi'; // Added FiDownload
import { FaWeight } from 'react-icons/fa';

const InfoCard = ({ title, children, className = '', icon }) => (
    <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center"> {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>} {title} </h2> <div className="space-y-5">{children}</div> </div>
);
const UnitToggle = ({ selectedUnit, onUnitChange }) => (
    <div className="flex items-center bg-gray-200 rounded-full p-1 text-sm"> <button onClick={() => onUnitChange('kg')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${ selectedUnit === 'kg' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300' }`}> kg </button> <button onClick={() => onUnitChange('lbs')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${ selectedUnit === 'lbs' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300' }`}> lbs </button> </div>
);



const convertToCSV = (dataArray, headers) => {
    if (!dataArray || dataArray.length === 0) return '';

    const headerKeys = headers || Object.keys(dataArray[0]);
    const headerString = headerKeys.join(',');

    const rows = dataArray.map(obj => {
        return headerKeys.map(key => {
            let fieldValue = obj[key] === null || obj[key] === undefined ? '' : obj[key];
            if (typeof fieldValue === 'object') {
                fieldValue = JSON.stringify(fieldValue);
            }
            let stringValue = String(fieldValue);
            if (stringValue.includes('"') || stringValue.includes(',')) {
                stringValue = `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });

    return [headerString, ...rows].join('\n');
};

const downloadCSV = (csvString, filename) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        alert("CSV download is not supported in your browser.");
    }
};



const mockWorkoutExportData = [
    { date: '2025-04-18', name: 'Push Day', duration: 3600, notes: 'Good session', exercises: JSON.stringify([{ name: 'Bench Press', sets: [{ reps: 8, weight: 80, unit: 'kg' }, { reps: 8, weight: 80, unit: 'kg' }] }, { name: 'OHP', sets: [{ reps: 10, weight: 40, unit: 'kg' }] }]) },
    { date: '2025-04-16', name: 'Leg Day', duration: 4500, notes: '', exercises: JSON.stringify([{ name: 'Squat', sets: [{ reps: 5, weight: 100, unit: 'kg' }] }, { name: 'Leg Press', sets: [{ reps: 12, weight: 150, unit: 'kg' }] }]) },
];
const mockWeightExportData = [
    { date: '2025-04-14', weight: 75.5, unit: 'kg' },
    { date: '2025-04-10', weight: 75.8, unit: 'kg' },
    { date: '2025-04-05', weight: 76.1, unit: 'kg' },
];
const mockMealExportData = [
    { date: '2025-04-18', meal: 'Breakfast', foodName: 'Oatmeal', quantity: 50, unit: 'g', calories: 190 },
    { date: '2025-04-18', meal: 'Lunch', foodName: 'Chicken Salad', quantity: 250, unit: 'g', calories: 450 },
    { date: '2025-04-17', meal: 'Dinner', foodName: 'Salmon & Broccoli', quantity: 300, unit: 'g', calories: 550 },
];


function SettingsPage() {
    const [preferredUnit, setPreferredUnit] = useState('kg');
    const [notifications, setNotifications] = useState({ reminders: true, blog: false });

    const handleNotificationChange = (event) => { /* ... */ const { name, checked } = event.target; setNotifications(prev => ({ ...prev, [name]: checked })); console.log(`Notification ${name} set to ${checked}`); };
    const handleUpdateProfile = () => alert('Update Profile clicked (functionality not implemented).');
    const handleChangePassword = () => alert('Change Password clicked (functionality not implemented).');
    const handleDeactivate = () => alert('Deactivate Account clicked (functionality not implemented).');
    const handleDelete = () => alert('Delete Account clicked (functionality not implemented).');

    const handleExportWorkouts = () => {
        const headers = ['date', 'name', 'duration_seconds', 'notes', 'exercises_json']; 
        const csv = convertToCSV(mockWorkoutExportData.map(log => ({ 
            date: log.date,
            name: log.name,
            duration_seconds: log.duration,
            notes: log.notes,
            exercises_json: log.exercises 
        })), headers);
        if (csv) {
            downloadCSV(csv, 'mock_workout_export.csv');
        } else {
            alert("No sample workout data to export.");
        }
    };

     const handleExportWeight = () => {
        const csv = convertToCSV(mockWeightExportData); 
        if (csv) {
            downloadCSV(csv, 'mock_weight_export.csv');
        } else {
             alert("No sample weight data to export.");
        }
    };

     const handleExportMeals = () => {
        const csv = convertToCSV(mockMealExportData);
        if (csv) {
            downloadCSV(csv, 'mock_meal_export.csv');
        } else {
             alert("No sample meal data to export.");
        }
    };


    return (
        <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto animate-fadeIn">
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                   <FiSettings className="mr-3 text-indigo-600"/> Settings
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Manage your profile, preferences, and account data.
                </p>
            </div>

            <InfoCard title="Profile Information" icon={<FiUser />}>
                 <div className="space-y-4"> <div> <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label> <input type="text" id="username" value="MockUser" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" /> <p className="text-xs text-gray-400 mt-1">Username cannot be changed currently.</p> </div> <div> <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label> <input type="email" id="email" value="mock.user@example.com" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500" /> </div> <div className="flex flex-col sm:flex-row gap-3 pt-2"> <button onClick={handleUpdateProfile} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"> <FiCheck className="mr-2"/> Update Profile (Disabled) </button> <button onClick={handleChangePassword} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"> <FiLock className="mr-2"/> Change Password (Disabled) </button> </div> </div>
            </InfoCard>

            <InfoCard title="Preferences" icon={<FiSettings />}>
                  <div className="space-y-5"> <div className="flex items-center justify-between"> <label className="text-sm font-medium text-gray-700 flex items-center"> <FaWeight className="mr-2 text-gray-500"/> Default Weight Unit </label> <UnitToggle selectedUnit={preferredUnit} onUnitChange={setPreferredUnit} /> </div> <div className="flex items-center justify-between"> <label className="text-sm font-medium text-gray-700">Theme</label> <div className="text-sm text-gray-400 italic">(Theme switching not implemented)</div> </div> <div> <label className="text-sm font-medium text-gray-700 mb-2 block">Notifications</label> <div className="space-y-2"> <div className="flex items-center"> <input id="notif-reminders" name="reminders" type="checkbox" checked={notifications.reminders} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/> <label htmlFor="notif-reminders" className="ml-2 block text-sm text-gray-900">Workout Reminders</label> </div> <div className="flex items-center"> <input id="notif-blog" name="blog" type="checkbox" checked={notifications.blog} onChange={handleNotificationChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/> <label htmlFor="notif-blog" className="ml-2 block text-sm text-gray-900">New Blog Post Alerts</label> </div> </div> </div> </div>
            </InfoCard>

            <InfoCard title="Data Export" icon={<FiDownload />}>
                 <p className="text-sm text-gray-600 mb-5">Download your logged data. Currently provides sample data only.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <button
                        onClick={handleExportWorkouts}
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 transform hover:scale-[1.03]"
                     >
                         <FiActivity className="mr-2"/> Export Workouts (Sample)
                     </button>
                     <button
                        onClick={handleExportWeight}
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 transform hover:scale-[1.03]"
                     >
                         <FaWeight className="mr-2"/> Export Weight (Sample)
                     </button>
                     <button
                        onClick={handleExportMeals}
                        className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 transform hover:scale-[1.03]"
                     >
                         <FiCoffee className="mr-2"/> Export Meals (Sample)
                     </button>
                 </div>
            </InfoCard>


             <InfoCard title="Account Actions" icon={<FiAlertTriangle />}>
                  <div className="space-y-4"> <p className="text-sm text-gray-600">Manage your account status.</p> <div className="flex flex-col sm:flex-row gap-3"> <button onClick={handleDeactivate} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150"> Deactivate Account (Disabled) </button> <button onClick={handleDelete} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"> <FiTrash2 className="mr-2"/> Delete Account (Disabled) </button> </div> <p className="text-xs text-gray-500 pt-2">Note: Account actions are currently disabled in this prototype.</p> </div>
            </InfoCard>

        </div>
    );
}

export default SettingsPage;
