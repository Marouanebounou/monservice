import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaHome, 
  FaProjectDiagram, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaBars, 
  FaTimes,
  FaSearch,
  FaBell,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaBriefcase,
  FaEnvelope,
  FaChartBar,
  FaFileAlt,
  FaWallet,
  FaEdit,
  FaTrash,
  FaClock,
  FaChartLine,
  FaComments
} from "react-icons/fa";
import { clearAuth } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ClientSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear all authentication data
    clearAuth();
    // Clear any stored redirect URLs
    localStorage.removeItem('redirectAfterLogin');
    // Redirect to sign-in page
    navigate('/signin', { replace: true });
  };

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
    // Force a hard navigation to ensure the page reloads
    window.location.href = path;
  };

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'CS';
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {user?.firstname} {user?.secondname}
              </h2>
              <p className="text-sm text-gray-500">Client</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => handleNavigation('/client-dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/client-dashboard') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaHome className="text-xl" />
              <span>Tableau de bord</span>
            </button>
            <button 
              onClick={() => handleNavigation('/client-profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/client-profile') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaUser className="text-xl" />
              <span>Profil</span>
            </button>
            <button 
              onClick={() => handleNavigation('/posts')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/posts') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaBriefcase className="text-xl" />
              <span>Mes annonces</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('/client-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive('/client-settings') 
                  ? 'bg-teal-50 text-teal-600' 
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
