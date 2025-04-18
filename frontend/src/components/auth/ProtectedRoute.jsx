// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();


  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /login from:', location.pathname);

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user?.role)) {
     console.warn(`[ProtectedRoute] Role "${user?.role}" not authorized for "${location.pathname}". Redirecting to /dashboard.`);

     return <Navigate to="/dashboard" replace />;
  }

  console.log(`[ProtectedRoute] Auth OK for "${location.pathname}". Rendering Outlet.`);
  return <Outlet />; 
};

export default ProtectedRoute;
