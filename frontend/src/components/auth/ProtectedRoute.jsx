// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Ensure .jsx extension

/**
 * Protects routes based on authentication and optional roles.
 * Guests are redirected to /login.
 * Authenticated users without the required role are redirected to /dashboard.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. Check if authenticated
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /login from:', location.pathname);
    // Redirect to login, saving the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check roles if specified
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
     console.warn(`[ProtectedRoute] Role "${user?.role}" not authorized for "${location.pathname}". Redirecting to /dashboard.`);
     // Redirect non-admins trying to access admin routes to their dashboard
     return <Navigate to="/dashboard" replace />;
  }

  // 3. Authenticated and authorized
  console.log(`[ProtectedRoute] Auth OK for "${location.pathname}". Rendering Outlet.`);
  return <Outlet />; // Render the nested child route (which might be a Layout)
};

export default ProtectedRoute;
