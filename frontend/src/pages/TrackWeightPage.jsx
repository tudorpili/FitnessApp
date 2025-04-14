// src/pages/TrackWeightPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiTrendingUp, FiCalendar, FiSave, FiTrash2, FiAlertCircle, FiArrowDownRight, FiArrowUpRight, FiMinus } from 'react-icons/fi';
import { FaWeight, FaQuoteLeft } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// Helper to get today's date
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Simple Card component (Enhanced Styling)
const InfoCard = ({ title, children, className = '', icon }) => (
  // Applied glassmorphism, more rounding, consistent shadow
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
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

// Motivational Quotes
const quotes = [
    "Progress, not perfection.",
    "You’re stronger than yesterday.",
    "The only bad workout is the one that didn't happen.",
    "Believe you can and you're halfway there.",
    "Strive for progress.",
];

function TrackWeightPage() {
    // State for the log entries
    const [weightLog, setWeightLog] = useState([
        { id: '1', date: '2025-04-01', weight: 76.5, unit: 'kg' },
        { id: '2', date: '2025-04-05', weight: 76.1, unit: 'kg' },
        { id: '3', date: '2025-04-10', weight: 75.8, unit: 'kg' },
        { id: '4', date: '2025-04-14', weight: 75.5, unit: 'kg' },
    ]);

    // State for the input form
    const [weightInput, setWeightInput] = useState('');
    const [dateInput, setDateInput] = useState(getTodayDate());
    const [unitInput, setUnitInput] = useState('kg'); // Default unit for NEW entries
    const [formError, setFormError] = useState('');
    const [quoteIndex, setQuoteIndex] = useState(0);

    // Cycle quote periodically or on load
    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
        // Optional: Cycle quote every minute
        // const interval = setInterval(() => {
        //     setQuoteIndex(prev => (prev + 1) % quotes.length);
        // }, 60000);
        // return () => clearInterval(interval);
    }, []);


    // Sort log by date for display (most recent first)
    const sortedLogForList = useMemo(() => {
        return [...weightLog].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [weightLog]);

    // --- Summary Stats Calculation ---
    const summaryStats = useMemo(() => {
        if (weightLog.length < 1) return { lastEntry: null, change: null, trend: 'stable' };

        const sorted = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastEntry = sorted[sorted.length - 1];
        let change = null;
        let trend = 'stable';

        if (sorted.length >= 2) {
            const previousEntry = sorted[sorted.length - 2];
            // Convert both to kg for comparison
            const lastKg = lastEntry.unit === 'lbs' ? lastEntry.weight * 0.453592 : lastEntry.weight;
            const prevKg = previousEntry.unit === 'lbs' ? previousEntry.weight * 0.453592 : previousEntry.weight;
            change = (lastKg - prevKg).toFixed(1);
            if (change > 0) trend = 'up';
            if (change < 0) trend = 'down';
        }

        return { lastEntry, change, trend };
    }, [weightLog]);
    // --- End Summary Stats ---

    // Prepare data for Chart.js (sorted oldest to newest)
    const chartData = useMemo(() => {
        const sortedLogForChart = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const weightsInKg = sortedLogForChart.map(entry =>
            entry.unit === 'lbs' ? entry.weight * 0.453592 : entry.weight
        );

        return {
            labels: sortedLogForChart.map(entry => entry.date),
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: weightsInKg,
                    borderColor: 'rgb(99, 102, 241)', // indigo-500
                    backgroundColor: 'rgba(99, 102, 241, 0.1)', // indigo-500 with opacity
                    tension: 0.3, // Smoother curve
                    fill: true,
                    pointBackgroundColor: 'rgb(79, 70, 229)', // indigo-600
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                },
            ],
        };
    }, [weightLog]);

    // Chart options (refined)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }, // Title moved to card header
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14 }, bodyFont: { size: 12 },
                padding: 10, boxPadding: 4, cornerRadius: 4,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) label += context.parsed.y.toFixed(1) + ' kg';
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: { display: true, text: 'Weight (kg)', font: { size: 12 } },
                grid: { color: 'rgba(200, 200, 200, 0.1)' } // Lighter grid lines
            },
            x: {
                 title: { display: true, text: 'Date', font: { size: 12 } },
                 grid: { display: false } // Hide vertical grid lines
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    // Handle adding/updating a weight entry
    const handleAddWeight = (e) => {
        e.preventDefault();
        setFormError('');
        const weightValue = parseFloat(weightInput);

        if (isNaN(weightValue) || weightValue <= 0) {
            setFormError('Please enter a valid weight > 0.'); return;
        }
        if (!dateInput) {
            setFormError('Please select a date.'); return;
        }

        const existingEntryIndex = weightLog.findIndex(entry => entry.date === dateInput);
        const newEntry = { id: Date.now().toString(), date: dateInput, weight: weightValue, unit: unitInput };

        let updatedLog;
        if (existingEntryIndex > -1) {
            console.log(`Updating weight for ${dateInput}`);
            updatedLog = [...weightLog];
            updatedLog[existingEntryIndex] = newEntry;
        } else {
            console.log(`Adding weight for ${dateInput}`);
            updatedLog = [...weightLog, newEntry];
        }
        setWeightLog(updatedLog); // Update the state
        setWeightInput(''); // Clear input
    };

    // Handle deleting a weight entry
    const handleDeleteWeight = (idToDelete) => {
        console.log(`Deleting weight entry with id: ${idToDelete}`);
        setWeightLog(prevLog => prevLog.filter(entry => entry.id !== idToDelete));
    };

    // Get Trend Icon
    const TrendIcon = ({ trend }) => {
        if (trend === 'down') return <FiArrowDownRight className="text-green-500" />;
        if (trend === 'up') return <FiArrowUpRight className="text-red-500" />;
        return <FiMinus className="text-gray-500" />;
    };

    return (
        // Added subtle gradient background to page container
        <div className="space-y-8 sm:space-y-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-1 rounded-lg"> {/* Added padding to parent if needed */}
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Track Your Weight
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Monitor your progress by logging your weight regularly.
                </p>
            </div>

             {/* NEW: Summary Stats & Quote Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2">
                     <InfoCard title="Summary" icon={<FaWeight />} className="h-full">
                        {summaryStats.lastEntry ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Last entry: <span className="font-bold text-indigo-700">{summaryStats.lastEntry.weight} {summaryStats.lastEntry.unit}</span> on {summaryStats.lastEntry.date}
                                </p>
                                {summaryStats.change !== null && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        Trend:
                                        <TrendIcon trend={summaryStats.trend} />
                                        <span className={`font-semibold ${
                                            summaryStats.trend === 'down' ? 'text-green-600' : summaryStats.trend === 'up' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {summaryStats.change > 0 ? `+${summaryStats.change}` : summaryStats.change} kg
                                        </span>
                                        since previous entry.
                                    </p>
                                )}
                                {!summaryStats.change && <p className="text-sm text-gray-500 italic">Log another entry to see trend.</p>}
                            </div>
                        ) : (
                             <p className="text-sm text-gray-500 italic">Log your weight to see a summary.</p>
                        )}
                     </InfoCard>
                 </div>
                 <div className="md:col-span-1">
                      <InfoCard title="Motivation" icon={<FaQuoteLeft />} className="h-full">
                         <p className="text-md italic text-gray-700">"{quotes[quoteIndex]}"</p>
                      </InfoCard>
                 </div>
             </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

                {/* Left Column: Log Form & History */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Log Weight Form Card */}
                    <InfoCard title="Log Weight" icon={<FiSave />}>
                        <form onSubmit={handleAddWeight} className="space-y-5"> {/* Increased spacing */}
                            {/* Date Input */}
                            <div>
                                <label htmlFor="weight-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" id="weight-date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /> {/* Increased rounding/padding */}
                            </div>

                            {/* Weight Input & Unit Toggle */}
                            <div>
                                <label htmlFor="weight-value" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                                <div className="flex items-center gap-3"> {/* Increased gap */}
                                    <input
                                        type="number" id="weight-value" value={weightInput} onChange={(e) => setWeightInput(e.target.value)}
                                        required step="0.1" min="0" placeholder="e.g., 75.5"
                                        className={`flex-grow px-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 ${formError && (isNaN(parseFloat(weightInput)) || parseFloat(weightInput) <= 0) ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                                    {/* Unit Toggle Component */}
                                    <UnitToggle selectedUnit={unitInput} onUnitChange={setUnitInput} />
                                </div>
                            </div>

                            {/* Error Display */}
                            {formError && ( <p className="text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1"/> {formError}</p> )}

                            {/* Submit Button - Enhanced style */}
                            <button type="submit" className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-[1.02]">
                                <FiSave className="mr-2" /> Log Weight
                            </button>
                        </form>
                    </InfoCard>

                    {/* Weight History Card */}
                    <InfoCard title="Weight History" icon={<FiCalendar />}>
                        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3"> {/* Adjusted max-height, added space-y */}
                            {sortedLogForList.length > 0 ? (
                                <ul className="space-y-3">
                                    {sortedLogForList.map(entry => (
                                        // Enhanced list item styling
                                        <li key={entry.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm animate-fadeIn">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">{entry.date}</p>
                                                <p className="text-lg font-bold text-indigo-700">{entry.weight} <span className="text-xs font-medium text-gray-500">{entry.unit}</span></p>
                                            </div>
                                            <button onClick={() => handleDeleteWeight(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150" title="Delete entry" aria-label="Delete entry">
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : ( <p className="text-sm text-gray-500 italic text-center py-4">No weight logged yet.</p> )}
                        </div>
                    </InfoCard>
                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-2">
                    <InfoCard title="Weight Chart" icon={<FiTrendingUp />}>
                        {/* Adjusted chart height */}
                        <div className="h-[65vh] min-h-[300px]">
                            {weightLog.length >= 2 ? (
                                <Line options={chartOptions} data={chartData} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 italic">
                                    Log at least two weight entries to see the chart.
                                </div>
                            )}
                        </div>
                    </InfoCard>
                </div>

            </div> {/* End Main Content Grid */}
        </div> // End Page Container
    );
}

export default TrackWeightPage;

