// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Auth
import AppLayout from './components/layout/AppLayout.jsx'; // Use .jsx
import AdminLayout from './components/layout/AdminLayout.jsx'; // Use .jsx
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'; // <-- Import ProtectedRoute

// Page Components (Ensure all have .jsx extension)
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import InteractiveExercisesPage from './pages/InteractiveExercisesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LogWorkoutPage from './pages/LogWorkoutPage.jsx';
import TrackWeightPage from './pages/TrackWeightPage.jsx';
import TrackCaloriesPage from './pages/TrackCaloriesPage.jsx';
import LogMealPage from './pages/LogMealPage.jsx';
import WorkoutPlansPage from './pages/WorkoutPlansPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
//import ActivityLogPage from './pages/ActivityLogPage.jsx'; // <-- Placeholder Component
import CalculatorsPage from './pages/CalculatorsPage.jsx';
import RecipesPage from './pages/RecipesPage.jsx';
import RecipeDetailPage from './pages/RecipeDetailPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminExercisesPage from './pages/AdminExercisesPage.jsx'; // <-- Placeholder Component

const NotFoundPage = () => <div className="p-4">404 - Page Not Found</div>;


function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* Accessible by everyone */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- User Routes (Requires Login) --- */}
      {/* Wrap the entire user section with ProtectedRoute */}
      <Route element={<ProtectedRoute />}> {/* Checks if user is authenticated */}
        <Route element={<AppLayout />}> {/* Apply AppLayout to nested routes */}
          {/* Default route for logged-in users */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Other user routes */}
          <Route path="/log-workout" element={<LogWorkoutPage />} />
          <Route path="/track-weight" element={<TrackWeightPage />} />
          <Route path="/track-calories" element={<TrackCaloriesPage />} />
          <Route path="/log-meal" element={<LogMealPage />} />
          <Route path="/exercises" element={<InteractiveExercisesPage />} />
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Add other user-specific routes here */}
        </Route>
      </Route>


      {/* --- Admin Routes (Requires Login + Admin Role) --- */}
       {/* Wrap the entire admin section with ProtectedRoute, specifying allowedRoles */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}> {/* Checks auth AND role */}
        <Route path="/admin" element={<AdminLayout />}> {/* Apply AdminLayout */}
          <Route index element={<Navigate to="/admin/users" replace />} /> {/* Default admin route */}
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="exercises" element={<AdminExercisesPage />} />
          {/* Add other admin routes like /admin/content etc. here */}
        </Route>
      </Route>


      {/* --- Default Route --- */}
      {/* Redirect root path. If user is logged in, ProtectedRoute on /dashboard will handle it. */}
      {/* If not logged in, ProtectedRoute will redirect from /dashboard to /login. */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />


      {/* --- Not Found Route --- */}
      {/* This will catch any route not defined above */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default App;
