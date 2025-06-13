import React, { useState } from "react";
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
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaEllipsisV,
  FaPlus
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const clients = [
    {
      id: 1,
      name: "TechCorp Solutions",
      avatar: "TC",
      rating: 4.5,
      projects: 3,
      lastProject: "2023-12-15",
      status: "active",
      contact: {
        email: "contact@techcorp.com",
        phone: "+1 234 567 890"
      }
    },
    {
      id: 2,
      name: "InnovateX",
      avatar: "IX",
      rating: 5,
      projects: 5,
      lastProject: "2024-01-20",
      status: "active",
      contact: {
        email: "info@innovatex.com",
        phone: "+1 234 567 891"
      }
    },
    {
      id: 3,
      name: "Digital Ventures",
      avatar: "DV",
      rating: 4,
      projects: 2,
      lastProject: "2023-11-10",
      status: "inactive",
      contact: {
        email: "hello@digitalventures.com",
        phone: "+1 234 567 892"
      }
    },
    {
      id: 4,
      name: "FutureTech",
      avatar: "FT",
      rating: 4.8,
      projects: 4,
      lastProject: "2024-02-01",
      status: "active",
      contact: {
        email: "contact@futuretech.com",
        phone: "+1 234 567 893"
      }
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.lastProject) - new Date(a.lastProject);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "projects") {
      return b.projects - a.projects;
    }
    return 0;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Clients</h1>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-lg hover:from-teal-700 hover:to-indigo-700 transition-all duration-200 w-full md:w-auto">
                <FaPlus />
                <span>Nouveau client</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="recent">Plus récent</option>
                    <option value="rating">Meilleure note</option>
                    <option value="projects">Plus de projets</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedClients.map(client => (
                <div key={client.id} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl font-bold">
                        {client.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{client.name}</h3>
                        <div className="flex items-center gap-1">
                          {renderStars(client.rating)}
                          <span className="text-xs md:text-sm text-gray-500 ml-1">({client.rating})</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisV />
                    </button>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaProjectDiagram className="text-sm" />
                      <span>{client.projects} projets</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaEnvelope className="text-sm" />
                      <span className="truncate">{client.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaPhone className="text-sm" />
                      <span>{client.contact.phone}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {client.status === "active" ? "Actif" : "Inactif"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Dernier projet: {new Date(client.lastProject).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors text-sm">
                      Voir les projets
                    </button>
                    <button className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                      Contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 