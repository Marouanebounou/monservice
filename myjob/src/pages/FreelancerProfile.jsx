import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FaCode,
  FaGraduationCap,
  FaCertificate,
  FaFileAlt,
  FaDollarSign,
  FaClock,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

import { useAuth } from "../contexts/AuthContext.jsx";
import FreelancerSidebar from "../components/FreelancerSidebar";

export default function FreelancerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
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
    

  const stats = {
    totalProjects: 25,
    activeProjects: 3,
    completedProjects: 22,
    totalEarned: "$45,000",
    averageRating: 4.9,
    responseTime: "2h"
  };

  const skills = [
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "MongoDB", level: 75 },
    { name: "AWS", level: 70 }
  ];

  const education = [
    {
      degree: "Master en Informatique",
      school: "Université de Lyon",
      year: "2018-2020"
    },
    {
      degree: "Licence en Génie Logiciel",
      school: "Université de Paris",
      year: "2015-2018"
    }
  ];

  const certifications = [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2022"
    },
    {
      name: "Professional Scrum Master",
      issuer: "Scrum.org",
      year: "2021"
    }
  ];

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      console.log('User data:', user); // Debug log
      const firstName = user.firstname || '';
      const secondName = user.secondname || '';
      setProfile(prev => ({
        ...prev,
        name: user.companyname ? `${user.companyname}` : 'No Name Set',
        email: user.email || '',
        phone: user.number || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.pbio || '',
        linkedin: user.linkedin || 'linkedin.com/',
        twitter: user.twitter || '',
        github: user.github || 'github.com/'
      }));
    }
  }, [user]);

  // Debug log for profile state
  useEffect(() => {
    console.log('Profile state:', profile);
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <FreelancerSidebar />
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
                        SS
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{user.companyname}</h2>
                          <p className="text-gray-500">Développeuse Full-Stack</p>
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

                {/* Skills Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Compétences</h3>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-indigo-600 h-2 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Education */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Formation</h3>
                    <div className="space-y-4">
                      {education.map((edu, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                              <FaGraduationCap className="text-teal-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.school}</p>
                            <p className="text-gray-500 text-sm">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h3>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                              <FaCertificate className="text-indigo-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                            <p className="text-gray-600">{cert.issuer}</p>
                            <p className="text-gray-500 text-sm">{cert.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Settings */}
              <div className="space-y-8">
                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistiques</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-teal-600" />
                        <span className="text-gray-600">Projets terminés</span>
                      </div>
                      <span className="font-medium">{stats.completedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-indigo-600" />
                        <span className="text-gray-600">Total gagné</span>
                      </div>
                      <span className="font-medium">{stats.totalEarned}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-purple-600" />
                        <span className="text-gray-600">Temps de réponse</span>
                      </div>
                      <span className="font-medium">{stats.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Availability Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Disponibilité</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-teal-600" />
                        <span className="text-gray-600">Statut</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                        {profile.availability}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-indigo-600" />
                        <span className="text-gray-600">Taux horaire</span>
                      </div>
                      <span className="font-medium">{profile.hourlyRate}</span>
                    </div>
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