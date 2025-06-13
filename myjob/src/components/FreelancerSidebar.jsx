import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaComments,
  FaStar,
  FaChartLine
} from "react-icons/fa";
import { clearAuth } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function FreelancerSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('redirectAfterLogin');
    navigate('/signin', { replace: true });
  };

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return 'FR';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
      >
        {isSidebarOpen ? (
          <FaTimes className="text-gray-600 text-xl" />
        ) : (
          <FaBars className="text-gray-600 text-xl" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {user?.companyname}
              </h2>
              <p className="text-sm text-gray-500">Freelancer</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => handleNavigation('/freelancer-dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/freelancer-dashboard')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaHome className="text-xl" />
              <span>Tableau de bord</span>
            </button>
            <button
              onClick={() => handleNavigation('/freelancer-profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/freelancer-profile')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaUser className="text-xl" />
              <span>Profil</span>
            </button>
            
            
            <button
              onClick={() => handleNavigation('/freelancer-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/freelancer-settings')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaCog className="text-xl" />
              <span>Paramètres</span>
            </button>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mt-auto"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
