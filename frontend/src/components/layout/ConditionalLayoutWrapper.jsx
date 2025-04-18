// src/components/layout/ConditionalLayoutWrapper.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; 
import AppLayout from './AppLayout.jsx';
import GuestLayout from './GuestLayout.jsx';

function ConditionalLayoutWrapper() {
  const { isAuthenticated } = useAuth();

  console.log('[ConditionalLayoutWrapper] Rendering, isAuthenticated:', isAuthenticated);

  return isAuthenticated ? <AppLayout /> : <GuestLayout />;

}

export default ConditionalLayoutWrapper;
