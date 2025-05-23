// src/pages/DashboardPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
    getRecentActivity, getTodaySummary, adjustTodaySteps, adjustTodayWater,
    getWeightTrendData, getCalorieTrendData, getGoalsProgress, getRandomQuote // Ensure getRandomQuote is imported
} from '../services/api';
import {
    FiPlusSquare, FiTrendingUp, FiCoffee, FiZap, FiList, FiBarChart2, FiTarget,
    FiSettings, FiX, FiCheck, FiGrid, FiActivity, FiAward, FiGift,
    FiEdit, FiCheckSquare, FiShield, FiLoader, FiAlertCircle,
    FiPlus, FiMinus, FiMove, FiColumns
} from 'react-icons/fi';
import { FaQuoteLeft, FaFire, FaShoePrints, FaTint } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';

import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

const SortableDashboardCard = ({ id, title, children, className = '', icon, onRemove, isEditModeActive, category = 'default' }) => {
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };
    const categoryStyles = { fitness: 'from-indigo-50/70 to-purple-50/60 border-indigo-100', nutrition: 'from-emerald-50/70 to-green-50/60 border-emerald-100', tracking: 'from-sky-50/70 to-blue-50/60 border-sky-100', motivation: 'from-amber-50/70 to-orange-50/60 border-amber-100', default: 'from-white/70 via-white/60 to-slate-50/60 border-white/30' };
    const categoryIconColor = { fitness: 'text-indigo-500', nutrition: 'text-emerald-600', tracking: 'text-sky-500', motivation: 'text-amber-500', default: 'text-gray-500' };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-gradient-to-br ${categoryStyles[category] || categoryStyles.default} backdrop-blur-lg rounded-3xl shadow-xl shadow-slate-200/50 border p-6 group transition-all duration-300 ease-out ${className} ${isEditModeActive ? 'cursor-grab' : ''}`}
        >
            {isEditModeActive && (
                <>
                    <button
                        {...attributes}
                        {...listeners}
                        className="absolute -top-2 -left-2 z-20 p-1.5 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition transform hover:scale-110"
                        title="Drag to reorder"
                        aria-label="Drag to reorder widget"
                    >
                        <FiMove size={14} />
                    </button>
                    {onRemove && (
                         <button onClick={onRemove} className="absolute -top-2 -right-2 z-20 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition transform hover:scale-110" title="Remove Widget" aria-label="Remove Widget">
                            <FiX size={14} />
                        </button>
                    )}
                </>
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

// --- Widget Components (QuickActions, RecentActivity, etc. remain the same) ---
const QuickActionsWidget = () => ( <> <p className="text-sm text-gray-500 -mt-3 mb-4">Quickly log your activities.</p> <div className="grid grid-cols-2 gap-4"> <Link to="/log-workout" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiPlusSquare className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Workout</span> </Link> <Link to="/log-meal" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiCoffee className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Meal</span> </Link> <Link to="/track-weight" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiTrendingUp className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">Log Weight</span> </Link> <Link to="/workout-plans" className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out text-center"> <FiZap className="h-7 w-7 mb-1.5 group-hover:scale-110 transition-transform" /> <span className="font-semibold text-xs sm:text-sm">My Plans</span> </Link> </div> </> );
const RecentActivityWidget = ({ activities = [], isLoading, error }) => { if (isLoading) { return <div className="flex items-center justify-center py-4"><FiLoader className="animate-spin h-5 w-5 text-gray-400"/></div>; } if (error) { return <div className="text-center text-xs text-red-500 py-4 flex items-center justify-center gap-1"><FiAlertCircle/> {error}</div>; } if (!activities || activities.length === 0) { return <p className="text-gray-500 text-sm italic text-center py-4">No recent activity recorded yet.</p>; } return ( <> <ul className="space-y-3.5"> {activities.map(activity => ( <li key={`${activity.type}-${activity.id}`} className="flex items-center space-x-3 group"> <div className={`flex-shrink-0 p-2 rounded-full shadow-sm ${ activity.type === 'Workout' ? 'bg-indigo-100 text-indigo-600' : activity.type === 'Weight' ? 'bg-blue-100 text-blue-600' : activity.type === 'Meal' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600' }`}> {activity.type === 'Workout' ? <FiActivity size={16}/> : activity.type === 'Weight' ? <FiTrendingUp size={16}/> : activity.type === 'Meal' ? <FiCoffee size={16}/> : <FiList size={16}/>} </div> <div className="flex-1"> <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors" title={activity.description}>{activity.description}</p> <p className="text-xs text-gray-500">{activity.date}</p> </div> </li> ))} </ul> </> ); };
const ProgressOverviewWidget = ({ weightTrend, calorieTrend, isLoading, error }) => { const defaultChartOptions = useMemo(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false }, tooltip: { enabled: true, mode: 'index', intersect: false, bodyFont: { size: 10 }, titleFont: { size: 12 }, padding: 6 } }, scales: { y: { display: true, ticks: { font: { size: 10 }, maxTicksLimit: 5 }, grid: { color: 'rgba(200, 200, 200, 0.1)' } }, x: { display: true, ticks: { font: { size: 10 }, maxTicksLimit: 7 }, grid: { display: false } } }, elements: { point: { radius: 3, hoverRadius: 5 }, line: { tension: 0.3, borderWidth: 2 } } }), []); const weightChartData = useMemo(() => ({ labels: weightTrend?.labels || [], datasets: [{ label: 'Weight (kg)', data: weightTrend?.data || [], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, }] }), [weightTrend]); const calorieChartData = useMemo(() => ({ labels: calorieTrend?.labels || [], datasets: [{ label: 'Calories (kcal)', data: calorieTrend?.data || [], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, }] }), [calorieTrend]); if (isLoading) { return <div className="flex items-center justify-center py-4"><FiLoader className="animate-spin h-5 w-5 text-gray-400"/></div>; } if (error) { return <div className="text-center text-xs text-red-500 py-4 flex items-center justify-center gap-1"><FiAlertCircle/> {error}</div>; } const hasWeightData = weightTrend?.data?.length >= 2; const hasCalorieData = calorieTrend?.data?.length >= 2; return ( <> <p className="text-gray-500 text-sm italic -mt-3 mb-5"> Recent trends overview. </p> <div className="grid grid-cols-1 gap-6"> <div> <h4 className="text-xs font-semibold text-gray-600 mb-2 text-center">Weight Trend (kg)</h4> <div className="h-48"> {hasWeightData ? ( <Line options={defaultChartOptions} data={weightChartData} /> ) : ( <p className="text-center text-xs text-gray-400 italic pt-16">Not enough weight data logged.</p> )} </div> </div> <div> <h4 className="text-xs font-semibold text-gray-600 mb-2 text-center">Calorie Trend (kcal)</h4> <div className="h-48"> {hasCalorieData ? ( <Line options={defaultChartOptions} data={calorieChartData} /> ) : ( <p className="text-center text-xs text-gray-400 italic pt-16">Not enough calorie data logged.</p> )} </div> </div> </div> </> ); };
const MotivationalQuoteWidget = ({quoteText, isLoading, error}) => { if (isLoading) { return <div className="flex items-center justify-center py-4"><FiLoader className="animate-spin h-5 w-5 text-amber-500"/></div>; } if (error) { return <div className="text-center text-xs text-red-500 py-4 flex items-center justify-center gap-1"><FiAlertCircle/> {error}</div>; } if (!quoteText) { return <p className="text-gray-500 text-sm italic text-center py-4">Could not load quote.</p>; } return ( <div className="text-center italic text-amber-800"> <FaQuoteLeft className="inline mr-2 opacity-40" size={12}/> {quoteText} </div> ); };
const TodaysSummaryWidget = ({ summary, isLoading, error, onAdjustSteps, onAdjustWater }) => { const [isAdjustingSteps, setIsAdjustingSteps] = useState(false); const [isAdjustingWater, setIsAdjustingWater] = useState(false); const handleStepAdjust = async (amount) => { setIsAdjustingSteps(true); await onAdjustSteps(amount); setIsAdjustingSteps(false); }; const handleWaterAdjust = async (amountMl) => { setIsAdjustingWater(true); await onAdjustWater(amountMl); setIsAdjustingWater(false); }; if (isLoading) { return <div className="flex items-center justify-center py-4"><FiLoader className="animate-spin h-5 w-5 text-gray-400"/></div>; } if (error) { return <div className="text-center text-xs text-red-500 py-4 flex items-center justify-center gap-1"><FiAlertCircle/> {error}</div>; } if (!summary) { return <p className="text-gray-500 text-sm italic text-center py-4">Summary data not available.</p>; } const stepAdjustments = [1000, 3000, 5000]; const waterAdjustments = [250, 500, 1000]; return ( <div className="space-y-5"> <div className="flex items-center justify-between text-sm"> <span className="flex items-center text-yellow-700 font-medium"><FaFire className="mr-2 text-yellow-500"/> Calories</span> <span className="font-semibold text-gray-800">{summary.calories?.toFixed(0) ?? '0'} / {summary.goals?.calories ?? '?'} kcal</span> </div> <div className="border-t border-gray-100 pt-4 space-y-2"> <div className="flex items-center justify-between text-sm"> <span className="flex items-center text-emerald-700 font-medium"><FaShoePrints className="mr-2 text-emerald-500"/> Steps</span> <span className="font-semibold text-gray-800">{summary.steps?.toLocaleString() ?? '0'} / {summary.goals?.steps?.toLocaleString() ?? '?'}</span> </div> <div className="flex justify-end gap-1.5"> {stepAdjustments.map(amount => ( <button key={`step-${amount}`} onClick={() => handleStepAdjust(amount)} disabled={isAdjustingSteps} className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 disabled:opacity-50 transition">+{amount.toLocaleString()}</button> ))} <button onClick={() => handleStepAdjust(-1000)} disabled={isAdjustingSteps || (summary.steps ?? 0) < 1000} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition">-1k</button> </div> </div> <div className="border-t border-gray-100 pt-4 space-y-2"> <div className="flex items-center justify-between text-sm"> <span className="flex items-center text-blue-700 font-medium"><FaTint className="mr-2 text-blue-500"/> Water</span> <span className="font-semibold text-gray-800">{summary.waterMl ?? '0'} / {summary.goals?.waterMl ?? '?'} ml</span> </div> <div className="flex justify-end gap-1.5"> {waterAdjustments.map(amount => ( <button key={`water-${amount}`} onClick={() => handleWaterAdjust(amount)} disabled={isAdjustingWater} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition">+{amount}ml</button> ))} <button onClick={() => handleWaterAdjust(-250)} disabled={isAdjustingWater || (summary.waterMl ?? 0) < 250} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition">-250ml</button> </div> </div> </div> ); };
const SuggestionsWidget = () => ( <div className="space-y-3"> <p className="text-sm text-gray-500 -mt-3 mb-3">Quick tips for today.</p> <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-sm text-sky-800"> 💡 Try adding 10 minutes of stretching after your next workout! </div> <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800"> 💧 Remember to stay hydrated. Aim for 8 glasses today! </div> </div> );
const CustomizeDashboardModal = ({ isOpen, onClose, allWidgets, visibleIds, onSave }) => { const [currentSelection, setCurrentSelection] = useState(new Set(visibleIds)); useEffect(() => { if (isOpen) { setCurrentSelection(new Set(visibleIds)); } }, [isOpen, visibleIds]); const handleCheckboxChange = (widgetId, isChecked) => { setCurrentSelection(prev => { const newSelection = new Set(prev); if (isChecked) { newSelection.add(widgetId); } else { newSelection.delete(widgetId); } return newSelection; }); }; const handleSaveChanges = () => { onSave(Array.from(currentSelection)); onClose(); }; if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1001]" onClick={onClose}> <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-modalEnter border border-white/20" onClick={(e) => e.stopPropagation()}> <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200"> <h3 className="text-xl font-semibold text-gray-800 flex items-center"><FiSettings className="mr-2"/> Customize Dashboard</h3> <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button> </div> <p className="text-sm text-gray-600 mb-5">Select the widgets you want to see on your dashboard.</p> <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {allWidgets.map(widget => ( <div key={widget.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200"> <input type="checkbox" id={`widget-${widget.id}`} checked={currentSelection.has(widget.id)} onChange={(e) => handleCheckboxChange(widget.id, e.target.checked)} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"/> <label htmlFor={`widget-${widget.id}`} className="text-sm font-medium text-gray-700 flex items-center"> {widget.icon && <span className="mr-2 opacity-70">{widget.icon}</span>} {widget.title} </label> </div> ))} </div> <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200"> <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150">Cancel</button> <button onClick={handleSaveChanges} className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow"> <FiCheck className="mr-1.5"/> Save Changes </button> </div> </div> </div> ); };
const GoalTrackerWidget = ({ goals = [], isLoading, error }) => { if (isLoading) { return <div className="flex items-center justify-center py-4"><FiLoader className="animate-spin h-5 w-5 text-gray-400"/></div>; } if (error) { return <div className="text-center text-xs text-red-500 py-4 flex items-center justify-center gap-1"><FiAlertCircle/> {error}</div>; } if (!goals || goals.length === 0) { return <p className="text-gray-500 text-sm italic text-center py-4">No active goals set yet.</p>; } const getGoalName = (goal) => { if (goal.description) return goal.description; switch(goal.goal_type) { case 'WEIGHT_TARGET': return `Reach ${goal.target_value} ${goal.target_unit || 'kg'}`; case 'WORKOUT_FREQUENCY': return `Complete ${goal.target_value} workouts/week`; case 'STEP_TARGET_DAILY': return `${goal.target_value?.toLocaleString()} steps today`; case 'WATER_TARGET_DAILY': return `Drink ${goal.target_value}ml water today`; case 'CALORIE_TARGET_DAILY': return `Eat ${goal.target_value} kcal today`; case 'PROTEIN_TARGET_DAILY': return `Eat ${goal.target_value}g protein today`; case 'CARB_TARGET_DAILY': return `Eat ${goal.target_value}g carbs today`; case 'FAT_TARGET_DAILY': return `Eat ${goal.target_value}g fat today`; default: return 'Unnamed Goal'; } }; const calculateProgress = (current, target) => { if (target === null || target === undefined || target === 0 || current === null || current === undefined) { return 0; } const progress = Math.round((current / target) * 100); return Math.min(100, Math.max(0, progress)); }; return ( <div className="space-y-4"> {goals.map(goal => { const progressPercent = calculateProgress(goal.current_progress, goal.target_value); const goalName = getGoalName(goal); const currentProgressDisplay = goal.current_progress !== null ? goal.current_progress.toLocaleString() : 'N/A'; const targetValueDisplay = goal.target_value?.toLocaleString(); return ( <div key={goal.id} className="text-sm"> <div className="flex justify-between items-baseline mb-1"> <p className="font-medium text-gray-700 truncate" title={goalName}>{goalName}</p> <p className="text-xs text-gray-500 whitespace-nowrap"> {currentProgressDisplay} / {targetValueDisplay} {goal.target_unit || ''} </p> </div> <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden"> <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} title={`${progressPercent}% Complete`} ></div> </div> </div> ); })} </div> ); };

const ALL_WIDGETS_CONFIG = [ { id: 'quickActions', title: 'Quick Actions', icon: <FiZap/>, component: QuickActionsWidget, category: 'default' }, { id: 'todaysSummary', title: "Today's Summary", icon: <FiCheckSquare/>, component: TodaysSummaryWidget, category: 'tracking', requiresData: true }, { id: 'recentActivity', title: 'Recent Activity', icon: <FiList/>, component: RecentActivityWidget, category: 'tracking', requiresData: true }, { id: 'progressOverview', title: 'Progress Overview', icon: <FiTrendingUp/>, component: ProgressOverviewWidget, category: 'tracking', requiresData: true }, { id: 'goalTracker', title: 'Goal Progress', icon: <FiAward/>, component: GoalTrackerWidget, category: 'fitness', requiresData: true }, { id: 'quote', title: 'Quote of the Day', icon: <FaQuoteLeft/>, component: MotivationalQuoteWidget, category: 'motivation', requiresData: true }, { id: 'suggestions', title: 'Suggestions', icon: <FiGift/>, component: SuggestionsWidget, category: 'motivation' }, ];

function DashboardPage() {
    const { user } = useAuth();
    const [visibleWidgetIds, setVisibleWidgetIds] = useState(() => { const saved = localStorage.getItem('dashboardWidgets'); return saved ? JSON.parse(saved) : ['quickActions', 'todaysSummary', 'recentActivity', 'progressOverview', 'goalTracker', 'quote']; });
    const [isEditModeActive, setIsEditModeActive] = useState(false);
    const [isWidgetSelectorModalOpen, setIsWidgetSelectorModalOpen] = useState(false);
    const [recentActivityData, setRecentActivityData] = useState([]);
    const [isActivityLoading, setIsActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState(null);
    const [todaySummaryData, setTodaySummaryData] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState(null);
    const [weightTrendData, setWeightTrendData] = useState(null);
    const [calorieTrendData, setCalorieTrendData] = useState(null);
    const [isTrendLoading, setIsTrendLoading] = useState(true);
    const [trendError, setTrendError] = useState(null);
    const [goalsData, setGoalsData] = useState([]);
    const [isGoalsLoading, setIsGoalsLoading] = useState(true);
    const [goalsError, setGoalsError] = useState(null);
    const [quoteData, setQuoteData] = useState({ text: '', author: null }); // Initial state for quote
    const [isQuoteLoading, setIsQuoteLoading] = useState(true);
    const [quoteError, setQuoteError] = useState(null);
    
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, }) );

    const fetchActivity = useCallback(async () => { setIsActivityLoading(true); setActivityError(null); try { const data = await getRecentActivity(5); setRecentActivityData(data || []); } catch (error) { setActivityError(error.message || "Could not load activity."); } finally { setIsActivityLoading(false); } }, []);
    const fetchSummary = useCallback(async () => { setIsSummaryLoading(true); setSummaryError(null); try { const data = await getTodaySummary(); setTodaySummaryData(data); } catch (error) { setSummaryError(error.message || "Could not load summary."); } finally { setIsSummaryLoading(false); } }, []);
    const fetchTrends = useCallback(async () => { setIsTrendLoading(true); setTrendError(null); try { const [weightData, calorieData] = await Promise.all([ getWeightTrendData(), getCalorieTrendData() ]); setWeightTrendData(weightData); setCalorieTrendData(calorieData); } catch (error) { setTrendError(error.message || "Could not load progress trends."); setWeightTrendData(null); setCalorieTrendData(null); } finally { setIsTrendLoading(false); } }, []);
    const fetchGoals = useCallback(async () => { setIsGoalsLoading(true); setGoalsError(null); try { const data = await getGoalsProgress(); setGoalsData(data || []); } catch (error) { setGoalsError(error.message || "Could not load goals."); } finally { setIsGoalsLoading(false); } }, []);
    
    // --- CORRECTED fetchQuote ---
    const fetchQuote = useCallback(async () => {
        setIsQuoteLoading(true);
        setQuoteError(null);
        try {
            const data = await getRandomQuote(); // API call from services/api.js
            if (data && data.text) { // Check if data and data.text exist
                setQuoteData({ text: data.text, author: data.author }); // Use data.text
            } else if (data && data.quote_text) { // Fallback for old structure if any
                 console.warn("Using fallback data.quote_text for quote. API might have changed or table name mismatch.");
                 setQuoteData({ text: data.quote_text, author: data.author });
            }
            else {
                console.warn("No text found in quote data from API, or API returned null/undefined", data);
                setQuoteData({ text: "Keep pushing forward!", author: null}); // Default if no quote text
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuoteError(error.message || "Could not load quote.");
            setQuoteData({ text: "Stay motivated! (Error loading)", author: null}); // Fallback quote on error
        } finally {
            setIsQuoteLoading(false);
        }
    }, []);
    // --- END CORRECTION ---

    useEffect(() => { fetchActivity(); fetchSummary(); fetchTrends(); fetchGoals(); fetchQuote(); }, [fetchActivity, fetchSummary, fetchTrends, fetchGoals, fetchQuote]);
    
    const handleAdjustStepsApi = useCallback(async (amount) => { try { await adjustTodaySteps(amount); fetchSummary(); fetchGoals(); } catch (error) { alert(`Error adjusting steps: ${error.message}`); } }, [fetchSummary, fetchGoals]);
    const handleAdjustWaterApi = useCallback(async (amountMl) => { try { await adjustTodayWater(amountMl); fetchSummary(); fetchGoals(); } catch (error) { alert(`Error adjusting water: ${error.message}`); } }, [fetchSummary, fetchGoals]);

    useEffect(() => { localStorage.setItem('dashboardWidgets', JSON.stringify(visibleWidgetIds)); }, [visibleWidgetIds]);
    
    const visibleWidgets = useMemo(() => { return visibleWidgetIds .map(id => ALL_WIDGETS_CONFIG.find(widget => widget.id === id)) .filter(Boolean); }, [visibleWidgetIds]);
    
    const handleSaveWidgetSelection = (newVisibleIds) => { setVisibleWidgetIds(newVisibleIds); setIsWidgetSelectorModalOpen(false); };
    const handleRemoveWidget = (widgetIdToRemove) => { setVisibleWidgetIds(prevIds => prevIds.filter(id => id !== widgetIdToRemove)); };

    function handleDragStart(event) { setActiveId(event.active.id); }
    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            setVisibleWidgetIds((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    
    const activeWidgetConfig = activeId ? ALL_WIDGETS_CONFIG.find(w => w.id === activeId) : null;

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} >
                <div className="space-y-10 sm:space-y-12 animate-fadeIn">
                    <div className="pb-6"> <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"> Welcome Back{user ? `, ${user.username}` : ''}! </h1> <p className="mt-3 text-xl text-slate-600"> Here's your fitness snapshot for today. </p> </div>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">Your Dashboard</h2>
                        <div className="flex items-center gap-3">
                            {user?.role === 'Admin' && ( <Link to="/admin/users" className="flex items-center px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ease-out shadow-sm bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 hover:scale-105 hover:shadow-md" title="Go to Admin Panel"> <FiShield className="mr-1.5 h-4 w-4"/> Admin Panel </Link> )}
                            <button 
                                onClick={() => setIsEditModeActive(!isEditModeActive)} 
                                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ease-out shadow-sm ${ isEditModeActive ? 'bg-red-500 text-white border-transparent hover:bg-red-600' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700' }`}
                            >
                                <FiEdit className="mr-1.5 h-4 w-4"/> {isEditModeActive ? 'Done Reordering' : 'Customize Layout'}
                            </button>
                            {isEditModeActive && (
                                <button
                                    onClick={() => setIsWidgetSelectorModalOpen(true)}
                                    className="flex items-center px-4 py-2 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105 shadow-sm transition-all"
                                >
                                    <FiColumns className="mr-1.5 h-4 w-4" /> Select Widgets
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <SortableContext items={visibleWidgetIds} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                            {visibleWidgets.map(widgetConfig => {
                                const WidgetComponent = widgetConfig.component;
                                let widgetProps = {};
                                if (widgetConfig.requiresData) {
                                    if (widgetConfig.id === 'recentActivity') widgetProps = { activities: recentActivityData, isLoading: isActivityLoading, error: activityError };
                                    else if (widgetConfig.id === 'todaysSummary') widgetProps = { summary: todaySummaryData, isLoading: isSummaryLoading, error: summaryError, onAdjustSteps: handleAdjustStepsApi, onAdjustWater: handleAdjustWaterApi };
                                    else if (widgetConfig.id === 'progressOverview') widgetProps = { weightTrend: weightTrendData, calorieTrend: calorieTrendData, isLoading: isTrendLoading, error: trendError };
                                    else if (widgetConfig.id === 'goalTracker') widgetProps = { goals: goalsData, isLoading: isGoalsLoading, error: goalsError };
                                    else if (widgetConfig.id === 'quote') widgetProps = { quoteText: quoteData.text, isLoading: isQuoteLoading, error: quoteError };
                                }
                                return (
                                    <SortableDashboardCard
                                        key={widgetConfig.id}
                                        id={widgetConfig.id}
                                        title={widgetConfig.title}
                                        icon={widgetConfig.icon || <FiGrid />}
                                        category={widgetConfig.category}
                                        onRemove={() => handleRemoveWidget(widgetConfig.id)}
                                        isEditModeActive={isEditModeActive}
                                    >
                                        <WidgetComponent {...widgetProps} />
                                    </SortableDashboardCard>
                                );
                            })}
                            {visibleWidgets.length === 0 && ( <div className="md:col-span-2 xl:col-span-3 text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200"> <h3 className="text-xl font-semibold text-gray-700 mb-3">Dashboard Empty</h3> <p className="text-gray-500 text-base mb-5">Add some widgets to get started!</p> <button onClick={() => setIsWidgetSelectorModalOpen(true)} className="flex items-center justify-center mx-auto px-5 py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 transition duration-150 shadow-sm hover:shadow-md"> <FiSettings className="mr-1.5 h-4 w-4"/> Select Widgets </button> </div> )}
                        </div>
                    </SortableContext>
                    
                    <DragOverlay dropAnimation={null}>
                        {activeId && activeWidgetConfig ? (
                            <SortableDashboardCard
                                id={activeWidgetConfig.id}
                                title={activeWidgetConfig.title}
                                icon={activeWidgetConfig.icon || <FiGrid />}
                                category={activeWidgetConfig.category}
                                isEditModeActive={false}
                            >
                                <activeWidgetConfig.component isLoading={true} />
                            </SortableDashboardCard>
                        ) : null}
                    </DragOverlay>

                    {isEditModeActive && ( <p className="text-center text-sm text-indigo-700 font-medium pt-4"> Drag the <FiMove className="inline mx-1"/> icon to reorder widgets. Click "Done Reordering" to save. </p> )}
                </div>
            </DndContext>
            <CustomizeDashboardModal 
                isOpen={isWidgetSelectorModalOpen} 
                onClose={() => setIsWidgetSelectorModalOpen(false)} 
                allWidgets={ALL_WIDGETS_CONFIG} 
                visibleIds={visibleWidgetIds} 
                onSave={handleSaveWidgetSelection} 
            />
        </>
    );
}

export default DashboardPage;
