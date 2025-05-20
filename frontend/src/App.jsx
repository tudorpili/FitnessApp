// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Auth
import AppLayout from './components/layout/AppLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ConditionalLayoutWrapper from './components/layout/ConditionalLayoutWrapper.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Page Components
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
import CalculatorsPage from './pages/CalculatorsPage.jsx';
import RecipesPage from './pages/RecipesPage.jsx';
import RecipeDetailPage from './pages/RecipeDetailPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx'; 
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminExercisesPage from './pages/AdminExercisesPage.jsx';
import AdminRecipesPage from './pages/AdminRecipesPage.jsx'; // <-- Import AdminRecipesPage

const NotFoundPage = () => <div className="p-4">404 - Page Not Found</div>;

function App() {
  return (
    <Routes>
      {/* --- Public Auth Routes (No Layout) --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- User Protected Routes (AppLayout) --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/log-workout" element={<LogWorkoutPage />} />
          <Route path="/track-weight" element={<TrackWeightPage />} />
          <Route path="/track-calories" element={<TrackCaloriesPage />} />
          <Route path="/log-meal" element={<LogMealPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Exercises and Recipes are now under ConditionalLayoutWrapper for guest/user access */}
        </Route>
      </Route>

      {/* --- Conditionally Layouted Routes (Guest or AppLayout) --- */}
      <Route element={<ConditionalLayoutWrapper />}>
        <Route path="/exercises" element={<InteractiveExercisesPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
      </Route>

      {/* --- Admin Protected Routes (AdminLayout) --- */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="exercises" element={<AdminExercisesPage />} />
          <Route path="recipes" element={<AdminRecipesPage />} /> {/* <-- NEW ADMIN RECIPES ROUTE */}
        </Route>
      </Route>

      {/* --- Default Redirects and Not Found --- */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
