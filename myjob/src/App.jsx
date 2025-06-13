import './App.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initAuth, isAuthenticated, getUser } from './utils/auth'
import React from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import AppRoutes from './AppRoutes'
import PageLoader from './components/PageLoader'

import HomeLandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/SignUp.tsx'
import WhyUsPage from './pages/whyUs.tsx'
import {HowToHire} from './pages/howToHire.tsx'
import Dashboard from './pages/Dashboard.jsx'
import ClientProfile from './pages/ClientProfile.jsx'
import ClientDashboard from './pages/clientDashboard.jsx'
import FreelancerProfile from './pages/FreelancerProfile.jsx'
import FreelancerSettings from './pages/FreelancerSettings.jsx'
import ClientSettings from './pages/ClientSettings.jsx'
import Clients from './pages/Clients.jsx'
import Messages from './pages/Messages.jsx'
import FreelancerSidebar from './components/FreelancerSidebar.jsx'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state
    initAuth();
    
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      // Store the attempted URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  // Public route wrapper - redirects authenticated users to their role-specific dashboard
  const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.role === 'buyer') {
        return <Navigate to="/client-dashboard" replace />;
      } else if (user?.role === 'provider') {
        return <Navigate to="/freelancer-dashboard" replace />;
      }
    }
    return children;
  };

  // Role-based route wrapper
  const RoleBasedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      return <Navigate to="/signin" replace />;
    }

    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'buyer') {
        return <Navigate to="/client-dashboard" replace />;
      } else if (user?.role === 'provider') {
        return <Navigate to="/freelancer-dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }

    return children;
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
