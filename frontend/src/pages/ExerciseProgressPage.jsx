// frontend/src/pages/ExerciseProgressPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiBarChart2, FiCalendar, FiFilter, FiLoader, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { getAllExercises, getExerciseProgressData } from '../services/api'; // Import API functions

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const InfoCard = ({ title, children, className = '', icon }) => (
    <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center">
            {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>}
            {title}
        </h2>
        {children}
    </div>
);

const getDbFormattedDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


function ExerciseProgressPage() {
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [selectedExerciseName, setSelectedExerciseName] = useState('');
    const [progressData, setProgressData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState('all'); // '30d', '365d', 'all', 'custom'
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [metric, setMetric] = useState('max_weight'); // 'max_weight', 'total_volume'

    // Fetch all exercises for the dropdown selector
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const exercises = await getAllExercises();
                setAllExercises(exercises || []);
                if (exercises && exercises.length > 0) {
                    // Optionally pre-select the first exercise
                    // setSelectedExerciseId(exercises[0].id.toString());
                    // setSelectedExerciseName(exercises[0].name);
                }
            } catch (err) {
                console.error("Failed to fetch exercises list:", err);
                setError("Could not load exercises list.");
            }
        };
        fetchExercises();
    }, []);

    const handleFetchProgress = useCallback(async () => {
        if (!selectedExerciseId) {
            setProgressData([]);
            return;
        }
        setIsLoading(true);
        setError(null);

        let startDateParam = null;
        let endDateParam = null;
        const today = new Date();

        if (dateRange === '30d') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            startDateParam = getDbFormattedDate(thirtyDaysAgo);
            endDateParam = getDbFormattedDate(today);
        } else if (dateRange === '365d') {
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            startDateParam = getDbFormattedDate(oneYearAgo);
            endDateParam = getDbFormattedDate(today);
        } else if (dateRange === 'custom') {
            if (customStartDate && customEndDate) {
                if (new Date(customStartDate) > new Date(customEndDate)) {
                    setError("Start date cannot be after end date for custom range.");
                    setIsLoading(false);
                    setProgressData([]);
                    return;
                }
                startDateParam = getDbFormattedDate(customStartDate);
                endDateParam = getDbFormattedDate(customEndDate);
            } else {
                 // If custom is selected but dates are not set, don't fetch or clear
                // setError("Please select both start and end dates for custom range.");
                setIsLoading(false);
                // setProgressData([]); // Optionally clear
                return;
            }
        }
        // For 'all', startDateParam and endDateParam remain null

        try {
            const data = await getExerciseProgressData(selectedExerciseId, metric, startDateParam, endDateParam);
            setProgressData(data || []);
            const currentEx = allExercises.find(ex => ex.id.toString() === selectedExerciseId);
            setSelectedExerciseName(currentEx ? currentEx.name : "Selected Exercise");
        } catch (err) {
            console.error("Failed to fetch exercise progress:", err);
            setError(err.message || "Could not load progress data for this exercise.");
            setProgressData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedExerciseId, dateRange, customStartDate, customEndDate, metric, allExercises]);

    // Fetch progress when selected exercise or date range changes
    useEffect(() => {
        if (selectedExerciseId) {
            handleFetchProgress();
        } else {
            setProgressData([]); // Clear data if no exercise is selected
        }
    }, [selectedExerciseId, handleFetchProgress]); // handleFetchProgress is memoized and includes its own deps

    const chartData = useMemo(() => {
        if (!progressData || progressData.length === 0) return { labels: [], datasets: [] };
        return {
            labels: progressData.map(entry => new Date(entry.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
            datasets: [{
                label: `${selectedExerciseName} - ${metric === 'max_weight' ? 'Max Weight (kg)' : 'Total Volume (kg*reps)'}`,
                data: progressData.map(entry => entry.metric_value),
                borderColor: 'rgb(129, 140, 248)', // indigo-400
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                tension: 0.2,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(79, 70, 229)', // indigo-600
            }],
        };
    }, [progressData, selectedExerciseName, metric]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(1);
                            if (metric === 'max_weight') label += ' kg';
                            else if (metric === 'total_volume') label += ' (kg*reps)';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false, // Start axis near the data, not necessarily at 0
                title: { display: true, text: metric === 'max_weight' ? 'Max Weight (kg)' : 'Total Volume (kg*reps)' }
            },
            x: { title: { display: true, text: 'Date' } }
        }
    };

    return (
        <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                    <FiTrendingUp className="mr-3 text-green-600"/> Exercise Progress
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Track your performance improvements for specific exercises over time.
                </p>
            </div>

            <InfoCard title="Select Exercise & Filters" icon={<FiFilter />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                        <select
                            id="exercise-select"
                            value={selectedExerciseId}
                            onChange={(e) => setSelectedExerciseId(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- Select an Exercise --</option>
                            {allExercises.map(ex => (
                                <option key={ex.id} value={ex.id.toString()}>{ex.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                        <select
                            id="metric-select"
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="max_weight">Max Weight Lifted</option>
                            <option value="total_volume">Total Volume (Weight x Reps)</option>
                            {/* <option value="max_reps_at_weight">Max Reps (at specific weight - TBD)</option> */}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date-range-select" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                            id="date-range-select"
                            value={dateRange}
                            onChange={(e) => { setDateRange(e.target.value); if (e.target.value !== 'custom') { setCustomStartDate(''); setCustomEndDate('');} }}
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="30d">Last 30 Days</option>
                            <option value="365d">Last Year</option>
                            <option value="all">All Time</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
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
                                max={getDbFormattedDate(new Date())}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </div>
                )}
                 <div className="mt-4">
                    <button
                        onClick={handleFetchProgress}
                        disabled={isLoading || !selectedExerciseId || (dateRange === 'custom' && (!customStartDate || !customEndDate))}
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
                    >
                        {isLoading ? <FiLoader className="animate-spin mr-2"/> : <FiFilter className="mr-2"/>}
                        {isLoading ? 'Loading...' : 'Apply Filters & View Progress'}
                    </button>
                </div>
            </InfoCard>

            {error && (
                <div className="text-center py-6 px-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {error}</p>
                </div>
            )}

            {selectedExerciseId && !isLoading && !error && (
                <InfoCard title={`Progress for ${selectedExerciseName || 'Exercise'}`} icon={<FiBarChart2 />}>
                    <div className="h-96 md:h-[500px]">
                        {progressData.length > 0 ? (
                            <Line options={chartOptions} data={chartData} />
                        ) : (
                            <p className="text-center text-gray-500 italic pt-20">
                                No progress data found for this exercise and period. Try logging some workouts!
                            </p>
                        )}
                    </div>
                </InfoCard>
            )}
             {!selectedExerciseId && !isLoading && !error && (
                <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an Exercise</h3>
                    <p className="text-gray-500">Choose an exercise from the dropdown above to view your progress.</p>
                </div>
            )}
        </div>
    );
}

export default ExerciseProgressPage;
