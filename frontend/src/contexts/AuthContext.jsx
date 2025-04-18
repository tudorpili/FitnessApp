// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage on initial load
  const [user, setUser] = useState(() => {
      try {
          const savedUser = localStorage.getItem('authUser');
          return savedUser ? JSON.parse(savedUser) : null;
      } catch (error) {
          console.error("Error reading user from localStorage", error);
          return null;
      }
  });
  const navigate = useNavigate();

  // Save user to localStorage whenever it changes
  useEffect(() => {
      try {
          if (user) {
              localStorage.setItem('authUser', JSON.stringify(user));
          } else {
              localStorage.removeItem('authUser');
          }
      } catch (error) {
          console.error("Error saving user to localStorage", error);
      }
  }, [user]);


  // Login function - updates state and localStorage
  const login = (userData) => {
    console.log('AuthContext: Logging in user', userData);
    setUser(userData);
    // Navigation is now handled by ProtectedRoute or LoginPage logic after state update
    // Optional: Navigate immediately if desired, but state propagation is key
    // const destination = userData.role === 'Admin' ? '/admin' : '/dashboard';
    // navigate(destination);
  };

  // Logout function - clears state and localStorage
  const logout = () => {
    console.log('AuthContext: Logging out');
    setUser(null);
    // No need to remove from localStorage here, useEffect handles it
    navigate('/login'); // Redirect to login page after logout
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin', // Helper flag for admin role
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
