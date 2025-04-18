// src/components/layout/ConditionalLayoutWrapper.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Adjust path if needed
import AppLayout from './AppLayout.jsx';
import GuestLayout from './GuestLayout.jsx';

/**
 * A wrapper component that renders either the AppLayout (for authenticated users)
 * or the GuestLayout (for guests), placing the actual route's content
 * within the chosen layout via <Outlet />.
 */
function ConditionalLayoutWrapper() {
  const { isAuthenticated } = useAuth();

  console.log('[ConditionalLayoutWrapper] Rendering, isAuthenticated:', isAuthenticated);

  // Render the appropriate layout based on authentication status
  // Both layouts need to contain an <Outlet /> for the child routes to render into.
  return isAuthenticated ? <AppLayout /> : <GuestLayout />;

  // Note: If AppLayout/GuestLayout didn't contain <Outlet />, you'd render like this:
  // return isAuthenticated
  //   ? <AppLayout><Outlet /></AppLayout>
  //   : <GuestLayout><Outlet /></GuestLayout>;
  // But since they already include <Outlet/>, just rendering the layout component is correct.

}

export default ConditionalLayoutWrapper;
