import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth';

import HomeLandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import WhyUsPage from './pages/whyUs.tsx';
import { HowToHire } from './pages/howToHire.tsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientProfile from './pages/ClientProfile.jsx';
import ClientDashboard from './pages/clientDashboard.jsx';
import FreelancerProfile from './pages/freelancerProfile.jsx';
import FreelancerSettings from './pages/freelancerSettings.jsx';
import ClientSettings from './pages/clientSettings.jsx';
import Clients from './pages/Clients.jsx';
import ClientMessages from './pages/Messages.jsx';
import FreelancerMessages from './pages/FreelancerMessages.jsx';
import ClientPosts from './pages/ClientPosts.jsx';

export default function AppRoutes() {
  const location = useLocation();

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

  return (
    <div className="app-container" key={location.pathname}>
      <Routes location={location}>
        {/* Landing page is always accessible */}
        <Route index element={<HomeLandingPage />} />
        
        {/* Public routes - only accessible to unauthenticated users */}
        <Route path='/signin' element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path='/signup' element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path='/whyus' element={
          <PublicRoute>
            <WhyUsPage />
          </PublicRoute>
        } />
        <Route path='/howtohire' element={
          <PublicRoute>
            <HowToHire />
          </PublicRoute>
        } />
        
        {/* Buyer/Client Routes */}
        <Route path='/client-dashboard' element={
          <RoleBasedRoute allowedRoles={['buyer']}>
            <ClientDashboard />
          </RoleBasedRoute>
        } />
        <Route path="/client-profile" element={
          <RoleBasedRoute allowedRoles={['buyer']}>
            <ClientProfile />
          </RoleBasedRoute>
        } />
        <Route path="/client-settings" element={
          <RoleBasedRoute allowedRoles={['buyer']}>
            <ClientSettings />
          </RoleBasedRoute>
        } />
        <Route path="/posts" element={
          <RoleBasedRoute allowedRoles={['buyer']}>
            <ClientPosts />
          </RoleBasedRoute>
        } />
        <Route path="/client-messages" element={
          <RoleBasedRoute allowedRoles={['buyer']}>
            <ClientMessages />
          </RoleBasedRoute>
        } />
        
        {/* Provider/Freelancer Routes */}
        <Route path='/freelancer-dashboard' element={
          <RoleBasedRoute allowedRoles={['provider']}>
            <Dashboard />
          </RoleBasedRoute>
        } />
        <Route path="/freelancer-profile" element={
          <RoleBasedRoute allowedRoles={['provider']}>
            <FreelancerProfile />
          </RoleBasedRoute>
        } />
        <Route path="/freelancer-settings" element={
          <RoleBasedRoute allowedRoles={['provider']}>
            <FreelancerSettings />
          </RoleBasedRoute>
        } />
        <Route path="/freelancer-messages" element={
          <RoleBasedRoute allowedRoles={['provider']}>
            <FreelancerMessages />
          </RoleBasedRoute>
        } />
        
        {/* Common Routes for both roles */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to home if route doesn't exist */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
} 