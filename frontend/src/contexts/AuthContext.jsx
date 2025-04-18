// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    setUser(null);
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
