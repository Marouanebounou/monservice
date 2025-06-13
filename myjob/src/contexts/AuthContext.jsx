import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearAuth, getAuthData } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update user data
  const updateUserData = () => {
    const authData = getAuthData();
    if (authData && authData.user) {
      setUser(authData.user);
    }
    setLoading(false);
  };

  // Load user data on mount and when auth data changes
  useEffect(() => {
    updateUserData();
    
    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        updateUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    loading,
    setUser,
    updateUserData // Expose updateUserData to components
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 