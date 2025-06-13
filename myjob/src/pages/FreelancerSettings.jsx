import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaHome, 
  FaProjectDiagram, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaBars, 
  FaTimes,
  FaLock,
  FaBell,
  FaLanguage,
  FaPalette,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaDollarSign,
  FaClock,
  FaCode,
  FaGraduationCap,
  FaCertificate,
  FaFileAlt
} from "react-icons/fa";
import FreelancerSidebar from "../components/FreelancerSidebar";

export default function FreelancerSettings() {
  const { user, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Account Settings
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Profile Settings
    name: "Sarah Smith",
    phone: "+1 234 567 890",
    location: "Lyon, France",
    bio: "Développeuse full-stack passionnée avec 5 ans d'expérience dans la création d'applications web modernes.",
    
    // Professional Settings
    hourlyRate: "50",
    availability: "Disponible",
    skills: [
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "AWS", level: 70 }
    ],
    
    // Education
    education: [
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
    ],
    
    // Certifications
    certifications: [
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
    ],
    
    // Social Links
    website: "www.sarahsmith.com",
    linkedin: "linkedin.com/in/sarahsmith",
    twitter: "@sarahsmith",
    github: "github.com/sarahsmith",
    
    // Notification Settings
    emailNotifications: true,
    projectUpdates: true,
    newMessages: true,
    marketingEmails: false,
    
    // Language & Appearance
    language: "fr",
    theme: "light",
    fontSize: "medium"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        // Account Settings
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        
        // Profile Settings
        name: user.companyname || "",
        phone: user.number || "",
        location: user.location || "",
        bio: user.pbio || "",
        
        // Professional Settings
        hourlyRate: user.hourlyRate || "50",
        availability: user.availability || "Disponible",
        skills: user.skills || [],
        
        // Education
        education: user.education || [],
        
        // Certifications
        certifications: user.certifications || []
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...settings.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSettings(prev => ({ ...prev, skills: newSkills }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...settings.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setSettings(prev => ({ ...prev, education: newEducation }));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...settings.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setSettings(prev => ({ ...prev, certifications: newCertifications }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !settings.skills.some(skill => skill.name === newSkill.trim())) {
      setSettings(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: 0 }]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSettings(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillToRemove)
    }));
  };

  const handleAddEducation = () => {
    setSettings(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        year: ''
      }]
    }));
  };

  const handleRemoveEducation = (index) => {
    setSettings(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    setSettings(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        year: ''
      }]
    }));
  };

  const handleRemoveCertification = (index) => {
    setSettings(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!user || !user._id) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur: Utilisateur non connecté'
      });
      setLoading(false);
      return;
    }

    try {
      // Prepare the data to send to the backend
      const dataToSend = {
        ...settings,
        companyname: settings.name, // Map the name field to companyname for the backend
        // Ensure arrays are properly formatted
        education: settings.education.filter(edu => edu.degree && edu.school && edu.year),
        certifications: settings.certifications.filter(cert => cert.name && cert.issuer && cert.year),
        skills: settings.skills.filter(skill => skill.name && skill.level > 0)
      };

      console.log('User ID:', user._id); // Debug log
      console.log('Sending data to backend:', dataToSend); // Debug log

      const response = await axios.put(
        `http://localhost:3001/api/freelancers/${user._id}`,
        dataToSend,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Response from backend:', response.data); // Debug log

      // Update the user context with the new data
      const updatedUser = {
        ...user,
        ...response.data,
        companyname: settings.name // Ensure companyname is updated
      };
      
      setUser(updatedUser);
      
      // Update local storage to persist the changes
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUser
      }));

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
    } catch (error) {
      console.error('Error updating profile:', error); // Debug log
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <FreelancerSidebar />
        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Account Security */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaLock className="text-teal-600" />
                  Sécurité du compte
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button type="button" className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100">
                        Modifier
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={settings.currentPassword}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCode className="text-teal-600" />
                  Paramètres professionnels
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux horaire ($)</label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={settings.hourlyRate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                    <select
                      name="availability"
                      value={settings.availability}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Occupé">Occupé</option>
                      <option value="En vacances">En vacances</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
                    <div className="space-y-4">
                      {settings.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Nom de la compétence"
                          />
                          <input
                            type="number"
                            value={skill.level}
                            onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                            className="w-24 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Niveau %"
                            min="0"
                            max="100"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ajouter une compétence"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaGraduationCap className="text-teal-600" />
                  Formation
                </h2>
                <div className="space-y-4">
                  {settings.education.map((edu, index) => (
                    <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: Master en Informatique"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: Université de Lyon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: 2018-2020"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                  >
                    + Ajouter une formation
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCertificate className="text-teal-600" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {settings.certifications.map((cert, index) => (
                    <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la certification</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: AWS Certified Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organisme</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: Amazon Web Services"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: 2022"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                  >
                    + Ajouter une certification
                  </button>
                </div>
              </div>

              {/* Profile Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUser className="text-teal-600" />
                  Profil
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="name"
                      value={settings.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={settings.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}