import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";

const LoggedInHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    clearAuth();
    // Clear any stored redirect URLs
    localStorage.removeItem('redirectAfterLogin');
    // Redirect to sign-in page
    navigate('/signin', { replace: true });
  };

  return (
    <>
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b">
        <a href="/">
          <h1 className="text-xl font-bold">MyJob.ma</h1>
        </a>
        <button
          className="md:hidden text-blue-600 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/client-profile" className="hover:text-blue-600">Profile</a>
          <a href="/messages" className="hover:text-blue-600">Messages</a>
          <a href="/settings" className="hover:text-blue-600">Settings</a>
          <button 
            onClick={handleLogout} 
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <button
          className="absolute top-4 left-4 text-gray-600 focus:outline-none"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <nav className="flex flex-col space-y-4 p-6 pt-20 text-sm font-medium">
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/profile" className="hover:text-blue-600">Profile</a>
          <a href="/messages" className="hover:text-blue-600">Messages</a>
          <a href="/settings" className="hover:text-blue-600">Settings</a>
          <button 
            onClick={handleLogout} 
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default LoggedInHeader;
