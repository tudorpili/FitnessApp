// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Component
import AppLayout from './components/layout/AppLayout'; // Import the layout

// Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InteractiveExercisesPage from './pages/InteractiveExercisesPage';
import DashboardPage from './pages/DashboardPage';
import LogMealPage from './pages/LogMealPage';
import TrackWeightPage from './pages/TrackWeightPage';
import SettingsPage from './pages/SettingsPage';
import TrackCaloriesPage from './pages/TrackCaloriesPage';
import LogWorkoutPage from './pages/LogWorkoutPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';

// Placeholders for new pages linked in the sidebar
//const LogWorkoutPage = () => <div className="p-4 bg-white rounded-lg shadow">Log Workout Page Content</div>;
//const TrackWeightPage = () => <div className="p-4 bg-white rounded-lg shadow">Track Weight Page Content</div>;
//const TrackCaloriesPage = () => <div className="p-4 bg-white rounded-lg shadow">Track Calories Page Content</div>;
//const LogMealPage = () => <div className="p-4 bg-white rounded-lg shadow">Log Meal Page Content</div>;
//const WorkoutPlansPage = () => <div className="p-4 bg-white rounded-lg shadow">Workout Plans Page Content</div>;
//const SettingsPage = () => <div className="p-4 bg-white rounded-lg shadow">Settings Page Content</div>;
const ActivityLogPage = () => <div className="p-4 bg-white rounded-lg shadow">Activity Log Page Content</div>;

// Other placeholders
const AdminPlaceholder = () => <div className="p-4">Admin Page Placeholder</div>;
const NotFoundPage = () => <div className="p-4">404 - Page Not Found</div>;


function App() {
  return (
    <Routes>
      {/* Routes WITHOUT the main AppLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Keep exercises public for guests? Or move inside layout? Assuming public for now */}
      {/* <Route path="/exercises" element={<InteractiveExercisesPage />} /> */}

      {/* Routes WITH the main AppLayout */}
      <Route element={<AppLayout />}>
        {/* Default route within layout */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Other routes using the layout */}
        <Route path="/log-workout" element={<LogWorkoutPage />} />
        <Route path="/track-weight" element={<TrackWeightPage />} />
        <Route path="/track-calories" element={<TrackCaloriesPage />} />
        <Route path="/log-meal" element={<LogMealPage />} />
         <Route path="/exercises" element={<InteractiveExercisesPage />} /> {/* Moved exercises inside */}
        <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        {/* Add other routes like profile, etc. here */}
      </Route>

      {/* Admin Route (still separate, could potentially use AppLayout too if designed for it) */}
      <Route path="/admin" element={<AdminPlaceholder />} />

      {/* Default Route - Redirects to login */}
      <Route path="/" element={<LoginPage />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
