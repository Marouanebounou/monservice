import React, { useState } from "react";
import { FaSearch, FaFilter, FaStar, FaBriefcase, FaClock, FaDollarSign, FaCheck } from "react-icons/fa";

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const serviceRequests = [
    {
      id: 1,
      title: "Développement d'une application mobile",
      description: "Besoin d'une application iOS/Android pour une boutique en ligne avec système de paiement intégré.",
      budget: "$5,000",
      deadline: "2 mois",
      category: "Développement mobile",
      client: {
        name: "John Doe",
        rating: 4.8,
        completedProjects: 12
      },
      postedDate: "Il y a 2 jours",
      applications: 3
    },
    {
      id: 2,
      title: "Création de site vitrine",
      description: "Site web moderne pour présenter les services d'une entreprise locale.",
      budget: "$2,500",
      deadline: "1 mois",
      category: "Développement web",
      client: {
        name: "Jane Smith",
        rating: 4.9,
        completedProjects: 8
      },
      postedDate: "Il y a 1 jour",
      applications: 5
    }
  ];

  const categories = [
    "Tous",
    "Développement web",
    "Développement mobile",
    "Design",
    "Marketing",
    "Autre"
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Demandes de service</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher des demandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            >
              {categories.map(category => (
                <option key={category} value={category === "Tous" ? "" : category}>
                  {category}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Service Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(request => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">{request.title}</h3>
                <span className="text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded">
                  {request.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{request.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FaDollarSign className="text-teal-600" />
                  <span>Budget: {request.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <FaClock className="text-teal-600" />
                  <span>Délai: {request.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <FaBriefcase className="text-teal-600" />
                  <span>{request.applications} candidatures</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-medium text-sm">
                        {request.client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{request.client.name}</p>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-xs text-gray-500">
                          {request.client.rating} ({request.client.completedProjects} projets)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{request.postedDate}</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-lg hover:from-teal-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2">
                <FaCheck /> Postuler
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 