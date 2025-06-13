import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { 
  FaUser, 
  FaEdit, 
  FaBriefcase, 
  FaStar, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaLock,
  FaBell,
  FaLanguage,
  FaPalette,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import ClientSideBar from "../components/ClientSideBar";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    linkedin: 'linkedin.com/',
    twitter: '',
    github: 'github.com/'
  });

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.firstname && user.secondname ? `${user.firstname} ${user.secondname}` : '',
        email: user.email || '',
        phone: user.number || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.pbio || '',
        linkedin: user.linkedin || 'linkedin.com/',
        twitter: user.twitter || '',
        github: user.github || 'github.com/'
      });
    }
  }, [user]);

  // Update user data when component mounts
  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  const stats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: "$0",
    averageRating: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
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
        <ClientSideBar />
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                        JD
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                          <p className="text-gray-500">Client</p>
                        </div>
                        <p className="text-gray-600">{profile.bio}</p>
                        <div className="flex flex-wrap gap-4">
                          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-gray-600 hover:text-teal-600">
                            <FaEnvelope /> {profile.email}
                          </a>
                          <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-teal-600">
                            <FaPhone /> {profile.phone}
                          </a>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt /> {profile.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
                      <div className="text-gray-500">Projets totaux</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">{stats.activeProjects}</div>
                      <div className="text-gray-500">Projets actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{stats.completedProjects}</div>
                      <div className="text-gray-500">Projets terminés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{stats.totalSpent}</div>
                      <div className="text-gray-500">Total dépensé</div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Liens sociaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href={profile.website} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                      <FaGlobe className="text-teal-600 text-xl" />
                      <span className="text-gray-600">Site web</span>
                    </a>
                    <a href={profile.linkedin} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                      <FaLinkedin className="text-blue-600 text-xl" />
                      <span className="text-gray-600">LinkedIn</span>
                    </a>
                    <a href={`https://twitter.com/${profile.twitter}`} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                      <FaTwitter className="text-blue-400 text-xl" />
                      <span className="text-gray-600">Twitter</span>
                    </a>
                    <a href={profile.github} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                      <FaGithub className="text-gray-800 text-xl" />
                      <span className="text-gray-600">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-8">
                {/* Account Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Paramètres du compte</h3>
                  <div className="space-y-4">
                    <a href="/client-settings" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaLock className="text-gray-600" />
                      <span className="text-gray-600">Sécurité du compte</span>
                    </a>
                    <a href="/client-settings" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaUser className="text-gray-600" />
                      <span className="text-gray-600">Profil</span>
                    </a>
                    <a href="/client-settings" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaBell className="text-gray-600" />
                      <span className="text-gray-600">Notifications</span>
                    </a>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Évaluation moyenne</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-4xl font-bold text-yellow-500">{stats.averageRating}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`text-xl ${i < Math.floor(stats.averageRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-gray-500 mt-2">Basé sur {stats.completedProjects} projets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
