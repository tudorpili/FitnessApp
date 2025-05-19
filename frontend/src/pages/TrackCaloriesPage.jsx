// src/pages/TrackCaloriesPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiCalendar, FiTarget, FiPieChart, FiBarChart, FiTrendingUp, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';
import { getMealHistory } from '../services/api';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

const InfoCard = ({ title, children, className = '', icon }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center">
        {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

const processMealDataToDailySummaries = (mealLogs) => {
    if (!mealLogs || mealLogs.length === 0) return [];
    const dailyMap = new Map();
    mealLogs.forEach(log => {
        const date = log.log_date.split('T')[0];
        const dayData = dailyMap.get(date) || { date: date, calories: 0, protein: 0, carbs: 0, fat: 0 };
        dayData.calories += parseFloat(log.calories) || 0;
        dayData.protein += parseFloat(log.protein_g) || 0;
        dayData.carbs += parseFloat(log.carbs_g) || 0;
        dayData.fat += parseFloat(log.fat_g) || 0;
        dailyMap.set(date, dayData);
    });
    return Array.from(dailyMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const getDbFormattedDate = (date) => {
    if (!date) return null; // Handle null or undefined date
    const d = new Date(date); // Ensure it's a Date object
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Updated to handle custom range
const getDateRangeParams = (range, customStart, customEnd) => {
    const today = new Date();
    let startDate = null;
    let endDate = null;

    switch (range) {
        case '7d':
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6);
            startDate = getDbFormattedDate(sevenDaysAgo);
            endDate = getDbFormattedDate(today);
            break;
        case '30d':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 29);
            startDate = getDbFormattedDate(thirtyDaysAgo);
            endDate = getDbFormattedDate(today);
            break;
        case 'custom':
            // Use custom dates if 'custom' range is selected and dates are valid
            startDate = customStart ? getDbFormattedDate(customStart) : null;
            endDate = customEnd ? getDbFormattedDate(customEnd) : null;
            // Basic validation: if custom range, ensure start is before or same as end
            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                // Optionally, swap them or return an error/default range
                console.warn("Custom date range: start date is after end date. Adjusting.");
                return { startDate: endDate, endDate: startDate }; // Or handle error appropriately
            }
            break;
        case 'all':
        default:
            startDate = null;
            endDate = null;
            break;
    }
    return { startDate, endDate };
};


function TrackCaloriesPage() {
    const [dateRange, setDateRange] = useState('all');
    // State for custom date pickers
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const [dailySummaries, setDailySummaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCalorieData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Pass custom dates if the range is 'custom'
            const { startDate, endDate } = getDateRangeParams(dateRange, customStartDate, customEndDate);
            
            // Only fetch if custom range has valid dates or if it's not a custom range
            if (dateRange === 'custom' && (!startDate || !endDate)) {
                // console.log("[TrackCaloriesPage] Custom range selected but dates are incomplete. Not fetching.");
                // setDailySummaries([]); // Optionally clear data or show a message
                setIsLoading(false); // Stop loading if not fetching
                return;
            }

            console.log(`[TrackCaloriesPage] Fetching meal history for range: ${dateRange}, Start: ${startDate}, End: ${endDate}`);
            const mealLogs = await getMealHistory(startDate, endDate);
            const processedData = processMealDataToDailySummaries(mealLogs);
            setDailySummaries(processedData);
        } catch (err) {
            console.error("Failed to fetch calorie data:", err);
            setError(err.message || "Could not load calorie and macro data.");
            setDailySummaries([]);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange, customStartDate, customEndDate]); // Add custom dates to dependencies

    useEffect(() => {
        // Fetch data when component mounts or when dependencies of fetchCalorieData change
        // For custom range, this will trigger when customStartDate or customEndDate changes IF dateRange is 'custom'
        if (dateRange === 'custom') {
            if (customStartDate && customEndDate && new Date(customStartDate) <= new Date(customEndDate)) {
                fetchCalorieData();
            } else if (customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate)) {
                setError("Start date cannot be after end date for custom range.");
                setDailySummaries([]); // Clear data if range is invalid
            }
            // If only one custom date is set, we might not fetch, or fetch with a default for the other.
            // Current logic: fetches only if both are set and start <= end.
        } else {
            fetchCalorieData();
        }
    }, [fetchCalorieData, dateRange, customStartDate, customEndDate]); // Ensure all relevant states trigger re-fetch

    const calorieChartData = useMemo(() => { /* ... (same as before) ... */ const sortedData = [...dailySummaries].sort((a, b) => new Date(a.date) - new Date(b.date)); return { labels: sortedData.map(entry => new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), datasets: [ { label: 'Calories', data: sortedData.map(entry => entry.calories), borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.3, fill: true, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: 'rgb(239, 68, 68)', }, ], }; }, [dailySummaries]);
    const averageMacros = useMemo(() => { /* ... (same as before) ... */ if (dailySummaries.length === 0) return { protein: 0, carbs: 0, fat: 0 }; const totals = dailySummaries.reduce((acc, day) => { acc.protein += day.protein || 0; acc.carbs += day.carbs || 0; acc.fat += day.fat || 0; return acc; }, { protein: 0, carbs: 0, fat: 0 }); return { protein: totals.protein / dailySummaries.length, carbs: totals.carbs / dailySummaries.length, fat: totals.fat / dailySummaries.length, }; }, [dailySummaries]);
    const macroChartData = useMemo(() => ({ /* ... (same as before) ... */ labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'], datasets: [{ label: 'Average Macronutrients', data: [averageMacros.protein, averageMacros.carbs, averageMacros.fat], backgroundColor: ['rgb(16, 185, 129)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)'], borderColor: '#fff', borderWidth: 2, hoverOffset: 4 }] }), [averageMacros]);
    const averageCalories = useMemo(() => { /* ... (same as before) ... */ if (dailySummaries.length === 0) return 0; const totalCalories = dailySummaries.reduce((sum, day) => sum + (day.calories || 0), 0); return Math.round(totalCalories / dailySummaries.length); }, [dailySummaries]);
    const lineChartOptions = { /* ... (same as before) ... */ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } }, scales: { y: { title: { display: true, text: 'Calories (kcal)' } }, x: { title: { display: true, text: 'Date' }, type: 'category' } } };
    const doughnutChartOptions = { /* ... (same as before) ... */ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, title: { display: false } } };

    if (isLoading) { /* ... loading JSX ... */ return ( <div className="flex justify-center items-center py-20"> <FiLoader className="animate-spin h-10 w-10 text-indigo-600" /> <span className="ml-4 text-lg text-gray-600">Loading Calorie Data...</span> </div> ); }
    // Error display for general fetch errors or invalid custom date range
    if (error) { return ( <div className="text-center py-12 px-6 bg-red-50 backdrop-blur-md rounded-2xl shadow-lg border border-red-200/50"> <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4"/> <h3 className="text-2xl font-semibold text-red-700 mb-3">Error</h3> <p className="text-red-600 text-md mb-6">{error}</p> <button onClick={fetchCalorieData} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors duration-150" > Try Again </button> </div> ); }
    if (!isLoading && dailySummaries.length === 0 && dateRange !== 'custom' && !(customStartDate && customEndDate)) { /* ... no data JSX ... */ return ( <div className="text-center py-20 max-w-lg mx-auto"> <FiPieChart className="mx-auto h-16 w-16 text-gray-400 mb-6"/> <h2 className="text-2xl font-semibold text-gray-700 mb-3">No Calorie Data Yet</h2> <p className="text-gray-500 mb-6"> Start logging your meals to see your calorie and macronutrient trends here. </p> </div> ); }

    const chartKeySuffix = dailySummaries.length > 0 ? dailySummaries[0].date + '-' + dailySummaries.length : 'no-data';
    let dateRangeText = 'All Time';
    if (dateRange === '7d') dateRangeText = 'Last 7 Days';
    else if (dateRange === '30d') dateRangeText = 'Last 30 Days';
    else if (dateRange === 'custom' && customStartDate && customEndDate) {
        dateRangeText = `Custom: ${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`;
    }


    return (
        <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            <div className="pb-6 border-b border-gray-200/80"> <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center"> <FiTarget className="mr-3 text-emerald-600"/> Calorie & Macro Tracking </h1> <p className="mt-2 text-lg text-gray-600"> Visualize your nutritional intake over time. </p> </div>
            
            <InfoCard title="Select Period" icon={<FiCalendar />}>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => { setDateRange('7d'); setCustomStartDate(''); setCustomEndDate('');}} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === '7d' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Last 7 Days</button>
                    <button onClick={() => { setDateRange('30d'); setCustomStartDate(''); setCustomEndDate('');}} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === '30d' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Last 30 Days</button>
                    <button onClick={() => { setDateRange('all'); setCustomStartDate(''); setCustomEndDate('');}} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === 'all' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>All Time</button>
                    <button onClick={() => setDateRange('custom')} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === 'custom' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Custom Range</button>
                </div>
                {dateRange === 'custom' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50/50">
                        <div>
                            <label htmlFor="custom-start-date" className="block text-xs font-medium text-gray-700 mb-1">Start Date:</label>
                            <input 
                                type="date" 
                                id="custom-start-date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="custom-end-date" className="block text-xs font-medium text-gray-700 mb-1">End Date:</label>
                            <input 
                                type="date" 
                                id="custom-end-date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                max={getDbFormattedDate(new Date())} // Prevent selecting future dates for end date
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                         {customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate) && (
                            <p className="sm:col-span-2 text-xs text-red-600 mt-1">Start date cannot be after end date.</p>
                        )}
                    </div>
                )}
            </InfoCard>

            <InfoCard title={`Average Daily Intake (${dateRangeText})`} icon={<FiBarChart />}>
                {dailySummaries.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><p className="text-xs font-medium text-yellow-700 uppercase flex items-center justify-center"><FaFire className="mr-1"/>Calories</p><p className="text-xl font-bold text-yellow-900">{averageCalories.toFixed(0)}</p><p className="text-xs text-yellow-600">kcal</p></div>
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200"><p className="text-xs font-medium text-emerald-700 uppercase flex items-center justify-center"><FaDrumstickBite className="mr-1"/>Protein</p><p className="text-xl font-bold text-emerald-900">{averageMacros.protein.toFixed(1)}</p><p className="text-xs text-emerald-600">g</p></div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><p className="text-xs font-medium text-blue-700 uppercase flex items-center justify-center"><FaBreadSlice className="mr-1"/>Carbs</p><p className="text-xl font-bold text-blue-900">{averageMacros.carbs.toFixed(1)}</p><p className="text-xs text-blue-600">g</p></div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200"><p className="text-xs font-medium text-red-700 uppercase flex items-center justify-center"><FaTint className="mr-1"/>Fat</p><p className="text-xl font-bold text-red-900">{averageMacros.fat.toFixed(1)}</p><p className="text-xs text-red-600">g</p></div>
                    </div>
                ) : (
                     <p className="text-center text-gray-500 italic py-4">No data available for the selected period to calculate averages.</p>
                )}
            </InfoCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                <InfoCard title="Calorie Trend" icon={<FiTrendingUp />} className="lg:col-span-2">
                    <div className="h-80 md:h-96">
                        {dailySummaries.length >= 1 ?
                            <Line key={`calorie-chart-${chartKeySuffix}`} options={lineChartOptions} data={calorieChartData} />
                            : <p className="text-center text-gray-500 italic pt-20">Not enough data to display calorie trend for the selected period.</p>
                        }
                    </div>
                </InfoCard>

                <InfoCard title="Avg. Macro Breakdown" icon={<FiPieChart />} className="lg:col-span-1">
                    {(averageMacros.protein > 0 || averageMacros.carbs > 0 || averageMacros.fat > 0) && dailySummaries.length > 0 ? (
                        <div className="h-80 md:h-96 flex items-center justify-center">
                            <Doughnut key={`macro-chart-${chartKeySuffix}`} options={doughnutChartOptions} data={macroChartData} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic pt-20">
                            No macro data to display for the selected period.
                        </div>
                    )}
                </InfoCard>
            </div>
        </div>
    );
}

export default TrackCaloriesPage;
