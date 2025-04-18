// src/pages/DashboardPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPlusSquare, FiTrendingUp, FiCoffee, FiZap, FiList, FiBarChart2, FiTarget,
    FiSettings, FiX, FiCheck, FiGrid, FiActivity, FiSunrise, FiAward, FiGift,
    FiDroplet, FiEdit, FiCheckSquare 
} from 'react-icons/fi';
import { FaQuoteLeft, FaFire } from 'react-icons/fa'; // Icon for quote
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

const DashboardCard = ({ title, children, className = '', icon, onRemove, isEditing, category = 'default' }) => {
    const categoryStyles = {
        fitness: 'from-indigo-50/70 to-purple-50/60 border-indigo-100',
        nutrition: 'from-emerald-50/70 to-green-50/60 border-emerald-100',
        tracking: 'from-sky-50/70 to-blue-50/60 border-sky-100',
        motivation: 'from-amber-50/70 to-orange-50/60 border-amber-100',
        default: 'from-white/70 via-white/60 to-slate-50/60 border-white/30'
    };
    const categoryIconColor = {
         fitness: 'text-indigo-500',
         nutrition: 'text-emerald-600',
         tracking: 'text-sky-500',
         motivation: 'text-amber-500',
         default: 'text-gray-500'
    }

    return (
        <div className={`relative bg-gradient-to-br ${categoryStyles[category] || categoryStyles.default} backdrop-blur-lg rounded-3xl shadow-xl shadow-slate-200/50 border p-6 group transition-all duration-300 ease-out ${className}`}>
            {isEditing && onRemove && (
                <button onClick={onRemove} className="absolute -top-2 -right-2 z-10 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition transform hover:scale-110" title="Remove Widget" aria-label="Remove Widget">
                    <FiX size={14} />
                </button>
            )}
            {title && (
                <h2 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight flex items-center">
                    {icon && <span className={`mr-2.5 ${categoryIconColor[category] || categoryIconColor.default}`}>{icon}</span>}
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};



const QuickActionsWidget = () => ( /* ... Widget JSX (minor style tweaks maybe) ... */
     <> <p className="text-sm text-gray-500 -mt-3 mb-4">Quickly log your activities.</p> <div className="grid grid-cols-2 gap-4"> <Link to="/log-workout" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiPlusSquare className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Workout</span> </Link> <Link to="/log-meal" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiCoffee className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Meal</span> </Link> <Link to="/track-weight" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiTrendingUp className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Weight</span> </Link> <Link to="/workout-plans" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiZap className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">My Plans</span> </Link> </div> </>
);

const RecentActivityWidget = () => { /* ... Widget JSX (minor style tweaks maybe) ... */
    const recentActivity = [ { id: 1, type: 'Workout', description: 'Logged Upper Body Workout', date: 'Apr 18, 2025' }, { id: 2, type: 'Weight', description: 'Logged weight: 75.0 kg', date: 'Apr 17, 2025' }, { id: 3, type: 'Meal', description: 'Logged Lunch', date: 'Apr 17, 2025' }, ];
     return ( <> {recentActivity.length > 0 ? ( <ul className="space-y-3.5"> {recentActivity.map(activity => ( <li key={activity.id} className="flex items-center space-x-3 group"> <div className={`flex-shrink-0 p-2 rounded-full shadow-sm ${ activity.type === 'Workout' ? 'bg-indigo-100 text-indigo-600' : activity.type === 'Weight' ? 'bg-blue-100 text-blue-600' : activity.type === 'Meal' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600' }`}> {activity.type === 'Workout' ? <FiActivity size={16}/> : activity.type === 'Weight' ? <FiTrendingUp size={16}/> : activity.type === 'Meal' ? <FiCoffee size={16}/> : <FiList size={16}/>} </div> <div className="flex-1"> <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{activity.description}</p> <p className="text-xs text-gray-500">{activity.date}</p> </div> </li> ))} <Link to="/activity-log" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 pt-2 inline-block transition-colors">View all activity &rarr;</Link> </ul> ) : ( <p className="text-gray-500 text-sm italic text-center py-4">No recent activity recorded yet.</p> )} </> );
};

const ProgressOverviewWidget = () => { /* ... Chart Logic (remains the same) ... */
    const mockWeightData = useMemo(() => [ { date: 'Apr 01', weight: 76.5 }, { date: 'Apr 05', weight: 76.1 }, { date: 'Apr 10', weight: 75.8 }, { date: 'Apr 14', weight: 75.5 }, { date: 'Apr 18', weight: 75.0 } ], []);
    const mockCalorieData = useMemo(() => [ { date: 'Apr 07', calories: 2150 }, { date: 'Apr 08', calories: 2300 }, { date: 'Apr 09', calories: 2050 }, { date: 'Apr 10', calories: 2250 }, { date: 'Apr 11', calories: 2400 }, { date: 'Apr 12', calories: 2100 }, { date: 'Apr 13', calories: 2350 } ], []);
    const dashboardChartOptions = useMemo(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false }, tooltip: { enabled: true, mode: 'index', intersect: false, bodyFont: { size: 10 }, titleFont: { size: 12 }, padding: 6 } }, scales: { y: { display: true, ticks: { font: { size: 10 }, maxTicksLimit: 5 } }, x: { display: true, ticks: { font: { size: 10 }, maxTicksLimit: 6 } } }, elements: { point: { radius: 2, hoverRadius: 4 }, line: { tension: 0.3, borderWidth: 2 } } }), []);
    const weightChartData = useMemo(() => ({ labels: mockWeightData.map(d => d.date), datasets: [{ label: 'Weight (kg)', data: mockWeightData.map(d => d.weight), borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, }] }), [mockWeightData]);
    const calorieChartData = useMemo(() => ({ labels: mockCalorieData.map(d => d.date), datasets: [{ label: 'Calories (kcal)', data: mockCalorieData.map(d => d.calories), borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, }] }), [mockCalorieData]);
    return ( <> <p className="text-gray-500 text-sm italic -mt-3 mb-5"> Recent trends (Sample Data). </p> <div className="grid grid-cols-1 gap-6"> <div> <h4 className="text-xs font-semibold text-gray-600 mb-2 text-center">Weight Trend (kg)</h4> <div className="h-48"> <Line options={dashboardChartOptions} data={weightChartData} /> </div> </div> <div> <h4 className="text-xs font-semibold text-gray-600 mb-2 text-center">Calorie Trend (kcal)</h4> <div className="h-48"> <Line options={dashboardChartOptions} data={calorieChartData} /> </div> </div> </div> </> );
};


const MotivationalQuoteWidget = () => {
    const quotes = useMemo(() => [ "Progress, not perfection.", "You’re stronger than yesterday.", "The body achieves what the mind believes.", "Strive for progress.", "Be stronger than your excuses." ], []);
    const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]); // Select one quote on mount

    return (
        <div className="text-center italic text-amber-800">
            <FaQuoteLeft className="inline mr-2 opacity-40" size={12}/>
            {quote}
        </div>
    );
};

const TodaysSummaryWidget = () => {
    const summary = { calories: 850, protein: 60, steps: 3450, waterMl: 750 };
    const goals = { calories: 2200, protein: 150, steps: 8000, waterMl: 2000 };


    return (
        <div className="space-y-4">
             <p className="text-sm text-gray-500 -mt-3 mb-3">Your snapshot for today.</p>
             <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span className="flex items-center text-yellow-600"><FaFire className="mr-1.5"/> Calories</span>
                <span className="font-semibold">{summary.calories} / {goals.calories} kcal</span>
             </div>
              <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span className="flex items-center text-emerald-600"><FiActivity className="mr-1.5"/> Steps</span>
                <span className="font-semibold">{summary.steps} / {goals.steps}</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-blue-600"><FiDroplet className="mr-1.5"/> Water</span>
                <span className="font-semibold">{summary.waterMl} / {goals.waterMl} ml</span>
             </div>
        </div>
    );
};

const GoalTrackerWidget = () => {
    const goals = [
        { id: 'g1', name: 'Complete 3 Workouts this Week', current: 2, target: 3 },
        { id: 'g2', name: 'Reach 74kg Bodyweight', current: 75.0, target: 74.0 },
    ];

    return (
        <div className="space-y-3">
             <p className="text-sm text-gray-500 -mt-3 mb-3">Your current goals.</p>
             {goals.map(goal => {
                 const progress = goal.target > 0 ? Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100))) : 0;
                 return (
                     <div key={goal.id} className="text-sm">
                         <p className="font-medium text-gray-700 mb-1">{goal.name}</p>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                             <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                         </div>
                         <p className="text-xs text-gray-500 text-right mt-0.5">{goal.current} / {goal.target}</p>
                     </div>
                 );
             })}
        </div>
    );
};

const SuggestionsWidget = () => (
     <div className="space-y-3">
        <p className="text-sm text-gray-500 -mt-3 mb-3">Quick tips for today.</p>
        <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-sm text-sky-800">
            💡 Try adding 10 minutes of stretching after your next workout!
        </div>
         <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800">
            💧 Remember to stay hydrated. Aim for 8 glasses today!
        </div>
    </div>
);


const ALL_WIDGETS_CONFIG = [
    { id: 'quickActions', title: 'Quick Actions', icon: <FiZap/>, component: QuickActionsWidget, category: 'default' },
    { id: 'todaysSummary', title: "Today's Summary", icon: <FiCheckSquare/>, component: TodaysSummaryWidget, category: 'tracking' }, // NEW
    { id: 'recentActivity', title: 'Recent Activity', icon: <FiList/>, component: RecentActivityWidget, category: 'tracking' },
    { id: 'progressOverview', title: 'Progress Overview', icon: <FiTrendingUp/>, component: ProgressOverviewWidget, category: 'tracking' },
    { id: 'goalTracker', title: 'Goal Progress', icon: <FiAward/>, component: GoalTrackerWidget, category: 'fitness' }, // NEW
    { id: 'quote', title: 'Quote of the Day', icon: <FaQuoteLeft/>, component: MotivationalQuoteWidget, category: 'motivation' }, // NEW
    { id: 'suggestions', title: 'Suggestions', icon: <FiGift/>, component: SuggestionsWidget, category: 'motivation' }, // NEW
];

const CustomizeDashboardModal = ({ isOpen, onClose, allWidgets, visibleIds, onSave }) => { /* ... Modal code remains the same ... */
    const [currentSelection, setCurrentSelection] = useState(new Set(visibleIds));
    useEffect(() => { if (isOpen) { setCurrentSelection(new Set(visibleIds)); } }, [isOpen, visibleIds]);
    const handleCheckboxChange = (widgetId, isChecked) => { setCurrentSelection(prev => { const newSelection = new Set(prev); if (isChecked) { newSelection.add(widgetId); } else { newSelection.delete(widgetId); } return newSelection; }); };
    const handleSaveChanges = () => { onSave(Array.from(currentSelection)); onClose(); };
    if (!isOpen) return null;
    return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-modalEnter border border-white/20" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200"> <h3 className="text-xl font-semibold text-gray-800 flex items-center"><FiSettings className="mr-2"/> Customize Dashboard</h3> <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button> </div> <p className="text-sm text-gray-600 mb-5">Select the widgets you want to see on your dashboard.</p> <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {allWidgets.map(widget => ( <div key={widget.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200"> <input type="checkbox" id={`widget-${widget.id}`} checked={currentSelection.has(widget.id)} onChange={(e) => handleCheckboxChange(widget.id, e.target.checked)} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"/> <label htmlFor={`widget-${widget.id}`} className="text-sm font-medium text-gray-700 flex items-center"> {widget.icon && <span className="mr-2 opacity-70">{widget.icon}</span>} {widget.title} </label> </div> ))} </div> <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200"> <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150">Cancel</button> <button onClick={handleSaveChanges} className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow"> <FiCheck className="mr-1.5"/> Save Changes </button> </div> </div> </div> );
};


function DashboardPage() {
    const [visibleWidgetIds, setVisibleWidgetIds] = useState(() => {
        const saved = localStorage.getItem('dashboardWidgets');
        return saved ? JSON.parse(saved) : ['quickActions', 'todaysSummary', 'recentActivity', 'progressOverview', 'goalTracker', 'quote']; // Updated default
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { localStorage.setItem('dashboardWidgets', JSON.stringify(visibleWidgetIds)); }, [visibleWidgetIds]);

    const visibleWidgets = useMemo(() => { return visibleWidgetIds .map(id => ALL_WIDGETS_CONFIG.find(widget => widget.id === id)) .filter(Boolean); }, [visibleWidgetIds]);

    const handleSaveCustomization = (newVisibleIds) => { setVisibleWidgetIds(newVisibleIds); setIsEditing(false); };
    const handleRemoveWidget = (widgetIdToRemove) => { setVisibleWidgetIds(prevIds => prevIds.filter(id => id !== widgetIdToRemove)); };

    return (
        <>
            <div className="space-y-10 sm:space-y-12 animate-fadeIn">
                <div className="pb-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back! 
                    </h1>
                    <p className="mt-3 text-xl text-slate-600">
                        Here's your fitness snapshot for today.
                    </p>
                </div>

                <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-slate-800">Your Dashboard</h2>
                     <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ease-out shadow-sm ${ isEditing ? 'bg-indigo-600 text-white border-transparent scale-105 shadow-lg' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105' }`}>
                        <FiEdit className="mr-1.5 h-4 w-4"/> {isEditing ? 'Done Editing' : 'Customize'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                    {visibleWidgets.length > 0 ? (
                        visibleWidgets.map(widget => {
                            const WidgetComponent = widget.component;
                            const colSpan = (widget.id === 'progressOverview' || widget.id === 'recentActivity') ? 'xl:col-span-1' : 'xl:col-span-1';
                            return (
                                <div key={widget.id} className={`animate-fadeIn ${colSpan}`}> {/* Add animation to each card */}
                                    <DashboardCard
                                        title={widget.title}
                                        icon={widget.icon || <FiGrid />}
                                        category={widget.category} 
                                        onRemove={() => handleRemoveWidget(widget.id)}
                                        isEditing={isEditing}
                                    >
                                        <WidgetComponent />
                                    </DashboardCard>
                                </div>
                            );
                        })
                    ) : (
                         <div className="md:col-span-2 xl:col-span-3 text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">Dashboard Empty</h3>
                            <p className="text-gray-500 text-base mb-5">Add some widgets to get started!</p>
                             <button onClick={() => setIsEditing(true)} className="flex items-center justify-center mx-auto px-5 py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 transition duration-150 shadow-sm hover:shadow-md">
                                <FiSettings className="mr-1.5 h-4 w-4"/> Customize Dashboard
                            </button>
                        </div>
                    )}
                </div>
                 {isEditing && ( <p className="text-center text-sm text-indigo-700 font-medium pt-4"> Editing mode active. Click (X) on widgets to remove. Click "Done Editing" to save. </p> )}
            </div>

            <CustomizeDashboardModal isOpen={isEditing} onClose={() => setIsEditing(false)} allWidgets={ALL_WIDGETS_CONFIG} visibleIds={visibleWidgetIds} onSave={handleSaveCustomization} />
        </>
    );
}

export default DashboardPage;
