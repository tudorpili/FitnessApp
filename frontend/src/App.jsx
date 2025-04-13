// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import ExercisesPage from './pages/ExercisesPage'; // Comment out or remove old page
import InteractiveExercisesPage from './pages/InteractiveExercisesPage'; // Import the new page

// Other placeholders
const DashboardPage = () => <div className="p-4">Dashboard Page</div>;
const LogWorkoutPage = () => <div className="p-4">Log Workout Page</div>;
const TrackWeightPage = () => <div className="p-4">Track Weight Page</div>;
const AdminPage = () => <div className="p-4">Admin Page</div>;
const NotFoundPage = () => <div className="p-4">404 - Page Not Found</div>;


function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public/Guest Routes - Updated */}
      <Route path="/exercises" element={<InteractiveExercisesPage />} /> {/* Use the new interactive page */}

      {/* Protected Routes (Placeholders for now) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/log-workout" element={<LogWorkoutPage />} />
      <Route path="/track-weight" element={<TrackWeightPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* Default Route */}
      <Route path="/" element={<LoginPage />} /> {/* Still default to login */}

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
