// src/pages/TrackCaloriesPage.jsx
import React, { useState, useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiCalendar, FiTarget, FiPieChart, FiBarChart, FiTrendingUp } from 'react-icons/fi'; // Added FiTrendingUp back
import { FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

// Simple Card component (reuse or define)
const InfoCard = ({ title, children, className = '', icon }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight flex items-center">
        {icon && <span className="mr-2.5 text-indigo-500">{icon}</span>}
        {title}
    </h2>
    {children}
  </div>
);

// Mock historical data (defined outside the component)
const mockDailySummaries = [
  { date: '2025-04-07', calories: 2150, protein: 155, carbs: 220, fat: 70 },
  { date: '2025-04-08', calories: 2300, protein: 160, carbs: 240, fat: 75 },
  { date: '2025-04-09', calories: 2050, protein: 140, carbs: 210, fat: 65 },
  { date: '2025-04-10', calories: 2250, protein: 150, carbs: 230, fat: 72 },
  { date: '2025-04-11', calories: 2400, protein: 165, carbs: 250, fat: 80 },
  { date: '2025-04-12', calories: 2100, protein: 145, carbs: 215, fat: 68 },
  { date: '2025-04-13', calories: 2350, protein: 158, carbs: 235, fat: 77 },
];

function TrackCaloriesPage() {
    const [dateRange, setDateRange] = useState('7d');

    // Process data for charts
    const calorieChartData = useMemo(() => {
        // TODO: Filter mockDailySummaries based on dateRange state later
        const periodData = mockDailySummaries; // Using all data for now
        const sortedData = [...periodData].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
            labels: sortedData.map(entry => entry.date),
            datasets: [
                {
                    label: 'Calories',
                    data: sortedData.map(entry => entry.calories),
                    borderColor: 'rgb(239, 68, 68)', // red-500
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3, fill: true, pointRadius: 3, pointHoverRadius: 5,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                },
            ],
        };
    // }, [mockDailySummaries, dateRange]); // OLD Deps
    }, []); // CORRECTED: Dependency array is empty as mockDailySummaries is constant and dateRange isn't used yet

    // Calculate average macros
    const averageMacros = useMemo(() => {
        // TODO: Filter mockDailySummaries based on dateRange state later
        const periodData = mockDailySummaries; // Using all data for now
        if (periodData.length === 0) return { protein: 0, carbs: 0, fat: 0 };

        const totals = periodData.reduce((acc, day) => {
            acc.protein += day.protein || 0;
            acc.carbs += day.carbs || 0;
            acc.fat += day.fat || 0;
            return acc;
        }, { protein: 0, carbs: 0, fat: 0 });

        return {
            protein: totals.protein / periodData.length,
            carbs: totals.carbs / periodData.length,
            fat: totals.fat / periodData.length,
        };
    // }, [mockDailySummaries, dateRange]); // OLD Deps
    }, []); // CORRECTED: Dependency array is empty

    // Data for the macro breakdown doughnut chart
    const macroChartData = {
        labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
        datasets: [{
            label: 'Average Macronutrients',
            // Use the calculated averages
            data: [averageMacros.protein, averageMacros.carbs, averageMacros.fat],
            backgroundColor: [
                'rgb(16, 185, 129)', // emerald-500 (Protein)
                'rgb(59, 130, 246)', // blue-500 (Carbs)
                'rgb(239, 68, 68)',  // red-500 (Fat)
            ],
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    // Calculate average calories
     const averageCalories = useMemo(() => {
        // TODO: Filter mockDailySummaries based on dateRange state later
        const periodData = mockDailySummaries; // Using all data for now
        if (periodData.length === 0) return 0;
        const totalCalories = periodData.reduce((sum, day) => sum + (day.calories || 0), 0);
        return Math.round(totalCalories / periodData.length);
    // }, [mockDailySummaries, dateRange]); // OLD Deps
    }, []); // CORRECTED: Dependency array is empty


    // Chart options remain the same
    const lineChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } }, scales: { y: { title: { display: true, text: 'Calories (kcal)' } }, x: { title: { display: true, text: 'Date' } } } };
    const doughnutChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, title: { display: false } } };


    return (
        <div className="space-y-8 sm:space-y-10">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                   <FiTarget className="mr-3 text-emerald-600"/> Calorie & Macro Tracking
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Visualize your nutritional intake over time.
                </p>
                 <p className="mt-1 text-sm text-orange-600 italic">
                    Note: This page currently displays sample data.
                 </p>
            </div>

             {/* Date Range Selection (Placeholder UI) */}
            <InfoCard title="Select Period" icon={<FiCalendar />}>
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => setDateRange('7d')} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === '7d' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Last 7 Days</button>
                    <button onClick={() => setDateRange('30d')} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${dateRange === '30d' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Last 30 Days</button>
                    {/* Add custom date range inputs later */}
                     <span className="text-sm text-gray-400 italic self-center ml-auto">(Date filtering not yet implemented)</span>
                 </div>
            </InfoCard>

            {/* Summary Stats */}
             <InfoCard title="Average Daily Intake (Sample Period)" icon={<FiBarChart />}>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {/* ... summary stat divs ... */}
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><p className="text-xs font-medium text-yellow-700 uppercase flex items-center justify-center"><FaFire className="mr-1"/>Calories</p><p className="text-xl font-bold text-yellow-900">{averageCalories}</p><p className="text-xs text-yellow-600">kcal</p></div>
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200"><p className="text-xs font-medium text-emerald-700 uppercase flex items-center justify-center"><FaDrumstickBite className="mr-1"/>Protein</p><p className="text-xl font-bold text-emerald-900">{averageMacros.protein.toFixed(1)}</p><p className="text-xs text-emerald-600">g</p></div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><p className="text-xs font-medium text-blue-700 uppercase flex items-center justify-center"><FaBreadSlice className="mr-1"/>Carbs</p><p className="text-xl font-bold text-blue-900">{averageMacros.carbs.toFixed(1)}</p><p className="text-xs text-blue-600">g</p></div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200"><p className="text-xs font-medium text-red-700 uppercase flex items-center justify-center"><FaTint className="mr-1"/>Fat</p><p className="text-xl font-bold text-red-900">{averageMacros.fat.toFixed(1)}</p><p className="text-xs text-red-600">g</p></div>
                    </div>
             </InfoCard>


            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                 {/* Calorie Trend Chart */}
                 <InfoCard title="Calorie Trend" icon={<FiTrendingUp />} className="lg:col-span-2">
                    <div className="h-80 md:h-96">
                         <Line options={lineChartOptions} data={calorieChartData} />
                    </div>
                 </InfoCard>

                 {/* Average Macro Breakdown Chart */}
                 <InfoCard title="Avg. Macro Breakdown" icon={<FiPieChart />} className="lg:col-span-1">
                    {/* Check if data exists before rendering chart */}
                    {averageMacros.protein > 0 || averageMacros.carbs > 0 || averageMacros.fat > 0 ? (
                         <div className="h-80 md:h-96 flex items-center justify-center">
                            <Doughnut options={doughnutChartOptions} data={macroChartData} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic">
                            No macro data to display.
                        </div>
                    )}
                 </InfoCard>
            </div>

        </div>
    );
}

export default TrackCaloriesPage;
