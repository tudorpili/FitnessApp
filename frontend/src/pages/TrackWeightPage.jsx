// src/pages/TrackWeightPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
// Import API functions
import { getWeightHistory, addOrUpdateWeight, deleteWeightLog } from '../services/api';
import {
    FiTrendingUp, FiCalendar, FiSave, FiTrash2, FiAlertCircle, FiArrowDownRight,
    FiArrowUpRight, FiMinus, FiLoader, FiCheck // Added Loader, Check
} from 'react-icons/fi';
import { FaWeight, FaQuoteLeft } from 'react-icons/fa';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

// --- Helper Functions & Components ---
const getTodayDate = () => { /* ... */ const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; };
const InfoCard = ({ title, children, className = '', icon }) => ( <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}> <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center"> {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>} {title} </h2> {children} </div> );
const UnitToggle = ({ selectedUnit, onUnitChange }) => ( <div className="flex items-center bg-gray-200 rounded-full p-1 text-sm"> <button onClick={() => onUnitChange('kg')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${ selectedUnit === 'kg' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300' }`}> kg </button> <button onClick={() => onUnitChange('lbs')} className={`px-4 py-1 rounded-full transition-colors duration-200 ${ selectedUnit === 'lbs' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300' }`}> lbs </button> </div> );
const quotes = [ "Progress, not perfection.", "You’re stronger than yesterday.", "The only bad workout is the one that didn't happen.", "Believe you can and you're halfway there.", "Strive for progress.", ];
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;

// --- TrackWeightPage Component ---
function TrackWeightPage() {
    // State for weight log data fetched from API
    const [weightLog, setWeightLog] = useState([]); // Store logs fetched from API
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // State for the input form
    const [weightInput, setWeightInput] = useState('');
    const [dateInput, setDateInput] = useState(getTodayDate());
    const [unitInput, setUnitInput] = useState('kg'); // Unit for NEW entries
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false); // For success feedback

    // State for display preference (doesn't affect saving)
    const [displayUnit, setDisplayUnit] = useState('kg'); // User's preferred display unit

    // State for quote
    const [quoteIndex, setQuoteIndex] = useState(0);

    // --- Fetch History Function ---
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            console.log("Fetching weight history...");
            const historyData = await getWeightHistory();
            // Data from backend has `weight_kg`
            setWeightLog(historyData || []); // Ensure it's an array
            console.log("Weight history fetched:", historyData);
        } catch (error) {
            console.error("Failed to fetch weight history:", error);
            setFetchError(error.message || "Could not load weight history.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- useEffect Hooks ---
    // Fetch history on mount
    useEffect(() => {
        fetchHistory();
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, [fetchHistory]);

    // --- Memoized Calculations (using fetched weightLog) ---
    const sortedLogForList = useMemo(() => {
        // Display requires conversion based on displayUnit
        return [...weightLog]
            .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
            .map(entry => {
                // --- FIX: Convert weight_kg to number before calculations/formatting ---
                const weightKgNum = parseFloat(entry.weight_kg);
                if (isNaN(weightKgNum)) {
                    // Handle cases where conversion might fail (though unlikely if DB is correct)
                    console.warn(`Invalid weight_kg value found for entry ID ${entry.id}:`, entry.weight_kg);
                    return { ...entry, displayWeight: 'N/A', displayUnit: displayUnit };
                }
                // --- End Fix ---

                return {
                    ...entry,
                    // Now use weightKgNum for calculations and formatting
                    displayWeight: displayUnit === 'lbs'
                        ? (weightKgNum * KG_TO_LBS).toFixed(1)
                        : weightKgNum.toFixed(1),
                    displayUnit: displayUnit
                };
            });
    }, [weightLog, displayUnit]);

    const summaryStats = useMemo(() => {
        // Calculations are always based on weight_kg from the log
        if (weightLog.length < 1) return { lastEntry: null, changeKg: null, trend: 'stable' };

        // Ensure sorting works correctly even if log_date isn't a Date object initially
        const sorted = [...weightLog].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
        const lastEntry = sorted[sorted.length - 1];

        // --- FIX: Convert weight_kg to number for calculations ---
        const lastWeightKgNum = parseFloat(lastEntry.weight_kg);
        // --- End Fix ---

        let changeKg = null;
        let trend = 'stable';

        if (sorted.length >= 2 && !isNaN(lastWeightKgNum)) {
            const previousEntry = sorted[sorted.length - 2];
            // --- FIX: Convert previous weight_kg to number ---
            const prevWeightKgNum = parseFloat(previousEntry.weight_kg);
            // --- End Fix ---

            if (!isNaN(prevWeightKgNum)) {
                changeKg = (lastWeightKgNum - prevWeightKgNum); // Calculate difference using numbers
                if (changeKg > 0.05) trend = 'up';
                else if (changeKg < -0.05) trend = 'down';
                else trend = 'stable';
            }
        }

        // Convert last entry and change for display based on displayUnit
        const displayLastWeight = !isNaN(lastWeightKgNum)
            ? (displayUnit === 'lbs' ? (lastWeightKgNum * KG_TO_LBS).toFixed(1) : lastWeightKgNum.toFixed(1))
            : 'N/A';
        const displayChange = changeKg !== null
            ? (displayUnit === 'lbs' ? (changeKg * KG_TO_LBS).toFixed(1) : changeKg.toFixed(1))
            : null;

        return {
            lastEntryDate: lastEntry.log_date,
            lastEntryDisplayWeight: displayLastWeight,
            displayUnit: displayUnit,
            displayChange: displayChange,
            trend: trend
        };
    }, [weightLog, displayUnit]);

    const chartData = useMemo(() => {
        // Chart always uses kg data
        const sortedLogForChart = [...weightLog].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
        return {
            labels: sortedLogForChart.map(entry => entry.log_date),
            datasets: [{
                label: 'Weight (kg)',
                 // --- FIX: Ensure data passed to chart is numeric ---
                data: sortedLogForChart.map(entry => parseFloat(entry.weight_kg) || 0), // Convert to number, default to 0 if invalid
                 // --- End Fix ---
                borderColor: 'rgb(99, 102, 241)', backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.3, fill: true, pointBackgroundColor: 'rgb(79, 70, 229)',
                pointRadius: 4, pointHoverRadius: 7, pointBorderColor: '#fff', pointBorderWidth: 1,
            }],
        };
    }, [weightLog]);

    const chartOptions = { /* ... (options remain the same) ... */ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10, boxPadding: 4, cornerRadius: 4, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) label += ': '; if (context.parsed.y !== null) label += context.parsed.y.toFixed(1) + ' kg'; return label; } } } }, scales: { y: { beginAtZero: false, title: { display: true, text: 'Weight (kg)', font: { size: 12 } }, grid: { color: 'rgba(200, 200, 200, 0.1)' } }, x: { title: { display: true, text: 'Date', font: { size: 12 } }, grid: { display: false } } }, interaction: { intersect: false, mode: 'index', }, };

    // --- Event Handlers ---
    const handleAddWeight = async (e) => { // Make async
        e.preventDefault();
        setFormError('');
        setSaveSuccess(false);
        const weightValue = parseFloat(weightInput);

        // Client-side validation
        if (isNaN(weightValue) || weightValue <= 0) { setFormError('Please enter a valid weight > 0.'); return; }
        if (!dateInput) { setFormError('Please select a date.'); return; }

        setIsSaving(true); // Start loading

        try {
            // Call the API service function
            const response = await addOrUpdateWeight(dateInput, weightValue, unitInput);
            console.log("Weight log saved/updated:", response);

            // Refresh the history list after successful save
            fetchHistory();

            setWeightInput(''); // Clear input on success
            setFormError(''); // Clear any previous errors
            setSaveSuccess(true); // Show success message
            setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3s

        } catch (error) {
            console.error("Failed to save weight log:", error);
            setFormError(error.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false); // Stop loading
        }
    };

    const handleDeleteWeight = async (idToDelete) => { // Make async
        console.log(`Attempting to delete weight entry with id: ${idToDelete}`);
        // Optional: Add a confirmation dialog here
        // if (!window.confirm("Are you sure you want to delete this weight entry?")) {
        //   return;
        // }
        try {
            await deleteWeightLog(idToDelete); // Call API
            console.log(`Weight log ${idToDelete} deleted successfully.`);
            // Refresh history list
            fetchHistory();
        } catch (error) {
            console.error(`Failed to delete weight log ${idToDelete}:`, error);
            // Display error to user (e.g., using a state variable and alert/toast)
            alert(`Error deleting entry: ${error.message}`);
        }
    };

    const TrendIcon = ({ trend }) => { /* ... */ if (trend === 'down') return <FiArrowDownRight className="text-green-500" />; if (trend === 'up') return <FiArrowUpRight className="text-red-500" />; return <FiMinus className="text-gray-500" />; };

    // --- Render Logic ---
    return (
        <div className="space-y-8 sm:space-y-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-1 rounded-lg">
            {/* Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Track Your Weight</h1>
                <p className="mt-2 text-lg text-gray-600">Monitor your progress by logging your weight regularly.</p>
            </div>

            {/* Loading State for Initial Fetch */}
            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <span className="ml-3 text-gray-600">Loading History...</span>
                </div>
            )}

            {/* Fetch Error State */}
            {fetchError && !isLoading && (
                 <div className="text-center py-10 px-6 bg-red-50 rounded-2xl shadow border border-red-200/50">
                    <FiAlertCircle className="mx-auto h-8 w-8 text-red-500 mb-3"/>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load History</h3>
                    <p className="text-red-600 text-sm mb-4">{fetchError}</p>
                    <button onClick={fetchHistory} className="px-4 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition">Try Again</button>
                </div>
            )}

            {/* Main Content (Show only if not loading initial data and no fetch error) */}
            {!isLoading && !fetchError && (
                <>
                    {/* Summary & Motivation Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <InfoCard title="Summary" icon={<FaWeight />} className="h-full">
                                {weightLog.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600"> Last entry: <span className="font-bold text-indigo-700">{summaryStats.lastEntryDisplayWeight} {summaryStats.displayUnit}</span> on {summaryStats.lastEntryDate} </p>
                                        {summaryStats.displayChange !== null && ( <p className="text-sm text-gray-600 flex items-center gap-1"> Trend: <TrendIcon trend={summaryStats.trend} /> <span className={`font-semibold ${ summaryStats.trend === 'down' ? 'text-green-600' : summaryStats.trend === 'up' ? 'text-red-600' : 'text-gray-600' }`}> {summaryStats.displayChange > 0 ? `+${summaryStats.displayChange}` : summaryStats.displayChange} {summaryStats.displayUnit} </span> since previous entry. </p> )}
                                        {summaryStats.displayChange === null && weightLog.length === 1 && <p className="text-sm text-gray-500 italic">Log another entry to see trend.</p>}
                                    </div>
                                ) : ( <p className="text-sm text-gray-500 italic">Log your weight to see a summary.</p> )}
                            </InfoCard>
                        </div>
                        <div className="md:col-span-1">
                            <InfoCard title="Motivation" icon={<FaQuoteLeft />} className="h-full"> <p className="text-md italic text-gray-700">"{quotes[quoteIndex]}"</p> </InfoCard>
                        </div>
                    </div>

                    {/* Main Grid: Log Form, History, Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                        {/* Log Form & History Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <InfoCard title="Log Weight" icon={<FiSave />}>
                                <form onSubmit={handleAddWeight} className="space-y-5">
                                    {/* Date Input */}
                                    <div> <label htmlFor="weight-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label> <input type="date" id="weight-date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /> </div>
                                    {/* Weight Input & Unit Toggle */}
                                    <div> <label htmlFor="weight-value" className="block text-sm font-medium text-gray-700 mb-1">Weight</label> <div className="flex items-center gap-3"> <input type="number" id="weight-value" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} required step="0.1" min="0" placeholder="e.g., 75.5" className={`flex-grow px-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 ${formError && (isNaN(parseFloat(weightInput)) || parseFloat(weightInput) <= 0) ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} /> <UnitToggle selectedUnit={unitInput} onUnitChange={setUnitInput} /> </div> </div>
                                    {/* Form Error */}
                                    {formError && ( <p className="text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1"/> {formError}</p> )}
                                    {/* Save Success Feedback */}
                                    {saveSuccess && ( <p className="text-sm text-green-600 flex items-center"><FiCheck className="mr-1"/> Weight logged successfully!</p> )}
                                    {/* Submit Button */}
                                    <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-60"> {isSaving ? <FiLoader className="animate-spin mr-2"/> : <FiSave className="mr-2" />} {isSaving ? 'Saving...' : 'Log Weight'} </button>
                                </form>
                            </InfoCard>

                            {/* Weight History Card */}
                            <InfoCard title="Weight History" icon={<FiCalendar />}>
                                 {/* Display Unit Preference Toggle */}
                                 <div className="flex justify-end mb-3 -mt-2">
                                     <label className="text-xs font-medium text-gray-500 mr-2 self-center">Display unit:</label>
                                     <UnitToggle selectedUnit={displayUnit} onUnitChange={setDisplayUnit} />
                                 </div>
                                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3">
                                    {sortedLogForList.length > 0 ? ( <ul className="space-y-3"> {sortedLogForList.map(entry => ( <li key={entry.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm animate-fadeIn"> <div> <p className="text-sm font-medium text-gray-500">{entry.log_date}</p> <p className="text-lg font-bold text-indigo-700">{entry.displayWeight} <span className="text-xs font-medium text-gray-500">{entry.displayUnit}</span></p> </div> <button onClick={() => handleDeleteWeight(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150" title="Delete entry" aria-label="Delete entry"> <FiTrash2 className="h-4 w-4" /> </button> </li> ))} </ul> ) : ( <p className="text-sm text-gray-500 italic text-center py-4">No weight logged yet.</p> )}
                                </div>
                            </InfoCard>
                        </div>

                        {/* Chart Column */}
                        <div className="lg:col-span-2">
                            <InfoCard title="Weight Chart" icon={<FiTrendingUp />}>
                                <div className="h-[65vh] min-h-[300px]"> {weightLog.length >= 2 ? ( <Line options={chartOptions} data={chartData} /> ) : ( <div className="flex items-center justify-center h-full text-gray-500 italic"> Log at least two weight entries to see the chart. </div> )} </div>
                            </InfoCard>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default TrackWeightPage;
