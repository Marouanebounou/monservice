// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaCog, 
  FaBriefcase, 
  FaEnvelope, 
  FaChartBar,
  FaBell,
  FaSearch,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaDollarSign,
  FaClock,
  FaCheck,
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaMapPin
} from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import FreelancerSidebar from "../components/FreelancerSidebar.jsx";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [addingUserId, setAddingUserId] = useState(null);
  const [myContacts, setMyContacts] = useState([]);
  const [clientPosts, setClientPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  // Modal state for post details
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add state for postulation requests
  const [postuleStatus, setPostuleStatus] = useState({}); // { [postId]: 'pending' | 'sent' | 'accepted' | 'already_applied' }

  useEffect(() => {
    axios.get("http://localhost:3001/api/users")
      .then(res => setUsers(res.data.users || []))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/api/posts/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setClientPosts(res.data);
        // Set postuleStatus for already applied posts
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
          const statusMap = {};
          res.data.forEach(post => {
            if (post.applications && post.applications.some(app => app.freelancer?._id === user.id)) {
              statusMap[post._id] = 'already_applied';
            }
          });
          setPostuleStatus(statusMap);
        }
      })
      .catch(() => setClientPosts([]));
  }, []);

  const handleAddContact = (user) => {
    if (!myContacts.find(u => u._id === user._id)) {
      setMyContacts([...myContacts, user]);
    }
  };

  const handleShowMorePosts = () => {
    setVisiblePosts((prev) => prev + 3);
  };

  const handleShowDetails = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Send postulation request
  const handlePostule = async (post) => {
    try {
      setPostuleStatus((prev) => ({ ...prev, [post._id]: 'pending' }));
      await axios.post(
        'http://localhost:3001/api/posts/apply',
        { postId: post._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPostuleStatus((prev) => ({ ...prev, [post._id]: 'sent' }));
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error === 'Already applied') {
        setPostuleStatus((prev) => ({ ...prev, [post._id]: 'already_applied' }));
      } else {
        setPostuleStatus((prev) => ({ ...prev, [post._id]: undefined }));
        alert('Erreur lors de la postulation.');
      }
    }
  };

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

  const stats = [
    {
      title: "Projets en cours",
      value: "8",
      icon: <FaBriefcase className="text-teal-600 text-2xl" />,
      change: "+2",
      changeType: "positive"
    },
    {
      title: "Clients actifs",
      value: "12",
      icon: <FaUsers className="text-indigo-600 text-2xl" />,
      change: "+3",
      changeType: "positive"
    },
    {
      title: "Tâches complétées",
      value: "32",
      icon: <FaFileAlt className="text-blue-600 text-2xl" />,
      change: "+8",
      changeType: "positive"
    },
    {
      title: "Notifications",
      value: "5",
      icon: <FaBell className="text-yellow-600 text-2xl" />,
      change: "+2",
      changeType: "neutral"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <FreelancerSidebar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {stat.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600' 
                        : stat.changeType === 'negative' 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Show posts of other users (clients) */}
            {clientPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <FaBriefcase className="text-teal-600 text-2xl" />
                  Offres de projets des clients
                </h2>
                <div className="flex flex-col gap-4">
                  {clientPosts.slice(0, visiblePosts).map(post => (
                    <div
                      key={post._id}
                      className="flex items-center bg-gradient-to-br from-white to-teal-50 border border-gray-200 rounded-xl shadow-md p-4 transition-transform hover:-translate-y-1 hover:shadow-xl gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg font-bold">
                        {post.client?.firstname?.[0] || <FaUser />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-base truncate">
                            {post.title}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {post.description}
                        </div>
                        {/* Always show badges under description for mobile and desktop */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FaStar className="text-yellow-400" /> {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FaMapPin className="text-indigo-400" /> {post.location}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FaDollarSign className="text-green-400" /> {post.budget} $
                          </span>
                          <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FaClock className="text-pink-400" /> {new Date(post.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-xs font-medium shadow disabled:opacity-50"
                          onClick={() => handlePostule(post)}
                          disabled={
                            postuleStatus[post._id] === 'pending' ||
                            postuleStatus[post._id] === 'sent' ||
                            postuleStatus[post._id] === 'already_applied'
                          }
                        >
                          {postuleStatus[post._id] === 'pending'
                            ? 'Envoi...'
                            : postuleStatus[post._id] === 'sent'
                            ? 'Demande envoyée'
                            : postuleStatus[post._id] === 'already_applied'
                            ? 'Déjà postulé'
                            : 'Postuler'}
                        </button>
                        <button className="px-3 py-1 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-xs font-medium" onClick={() => handleShowDetails(post)}>
                          Détail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {visiblePosts < clientPosts.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow"
                      onClick={handleShowMorePosts}
                    >
                      Afficher plus
                    </button>
                  </div>
                )}
                {/* Modal for post details */}
                {isModalOpen && selectedPost && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-teal-600 text-2xl"
                        onClick={handleCloseModal}
                        aria-label="Fermer"
                      >
                        &times;
                      </button>
                      <h3 className="text-2xl font-bold text-teal-700 mb-2 flex items-center gap-2">
                        <FaFileAlt className="text-teal-400" /> {selectedPost.title}
                      </h3>
                      <div className="mb-4 text-gray-700">
                        {selectedPost.description}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                          <FaStar className="text-yellow-400" /> {selectedPost.category}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                          <FaMapPin className="text-indigo-400" /> {selectedPost.location}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          <FaDollarSign className="text-green-400" /> {selectedPost.budget} $
                        </span>
                        <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                          <FaClock className="text-pink-400" /> {new Date(selectedPost.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedPost.skills && selectedPost.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedPost.skills.map((skill, i) => (
                            <span key={i} className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-semibold border border-teal-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg font-bold">
                          {selectedPost.client?.firstname?.[0] || <FaUser />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {selectedPost.client?.firstname} {selectedPost.client?.secondname}
                          </div>
                          <div className="text-xs text-gray-500">{selectedPost.client?.email}</div>
                        </div>
                        <span className="ml-auto text-xs text-gray-400">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow">
                          Postuler
                        </button>
                        <button className="flex-1 px-4 py-2 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium" onClick={handleCloseModal}>
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Projets récents</h2>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((project) => (
                  <div key={project} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
                        <FaBriefcase className="text-teal-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Projet de développement web {project}</h3>
                        <p className="text-sm text-gray-500">2 freelancers • En cours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Dernière mise à jour: Aujourd'hui</span>
                      <button className="text-teal-600 hover:text-teal-700">
                        <FaChartLine />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Activité récente</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((activity) => (
                  <div key={activity} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <FaBell className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">
                        <span className="font-medium">John Doe</span> a mis à jour le statut du projet
                      </p>
                      <p className="text-sm text-gray-500">Il y a {activity} heure{activity > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
