import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaCog, 
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
  FaBars,
  FaTimes,
  FaClock,
  FaChartLine,
  FaUsers
} from "react-icons/fa";
import ClientSideBar from "../components/ClientSideBar";

export default function ClientDashboard() {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: ""
  });

  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      title: "Développement d'une application mobile",
      description: "Besoin d'une application iOS/Android pour une boutique en ligne avec système de paiement intégré.",
      budget: "$5,000",
      deadline: "2 mois",
      category: "Développement mobile",
      status: "En attente",
      applications: 3
    },
    {
      id: 2,
      title: "Création de site vitrine",
      description: "Site web moderne pour présenter les services d'une entreprise locale.",
      budget: "$2,500",
      deadline: "1 mois",
      category: "Développement web",
      status: "En cours",
      applications: 5
    }
  ]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({}); // { [postId_freelancerId]: 'pending' | 'accepted' | 'rejected' }

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/posts/client", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        console.log('Posts data:', res.data); // Debug log
        setPosts(res.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplication = async (postId, applicationId, action) => {
    try {
      setActionStatus(prev => ({ ...prev, [`${postId}_${applicationId}`]: 'pending' }));
      
      console.log('Sending application update request...');
      const response = await axios.patch(
        `http://localhost:3001/api/posts/${postId}/applications/${applicationId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Application update response:', response.data);

      // Refresh posts data after updating application
      const updatedPostsResponse = await axios.get("http://localhost:3001/api/posts/client", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(updatedPostsResponse.data);

      // If the application was accepted, create a conversation
      if (action === 'accepted') {
        console.log('Application accepted, creating conversation...');
        try {
          const conversationResponse = await axios.post(
            'http://localhost:3001/api/conversations',
            {
              post: postId,
              freelancer: applicationId
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          console.log('Conversation created:', conversationResponse.data);

          // Refresh posts data again after creating conversation
          const finalPostsResponse = await axios.get("http://localhost:3001/api/posts/client", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setPosts(finalPostsResponse.data);

          // Navigate to messages with the conversation ID
          console.log('Navigating to messages with conversation ID:', conversationResponse.data._id);
          
        } catch (error) {
          console.error('Error creating conversation:', error);
          alert('Erreur lors de la création de la conversation.');
        }
      }
    } catch (error) {
      console.error('Error handling application:', error);
      alert('Erreur lors de la mise à jour de la candidature.');
    } finally {
      setActionStatus(prev => ({ ...prev, [`${postId}_${applicationId}`]: null }));
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const newId = serviceRequests.length + 1;
    setServiceRequests([
      ...serviceRequests,
      {
        id: newId,
        ...newRequest,
        status: "En attente",
        applications: 0
      }
    ]);
    setShowNewRequestModal(false);
    setNewRequest({
      title: "",
      description: "",
      budget: "",
      deadline: "",
      category: ""
    });
  };

  const stats = [
    {
      title: "Projets en cours",
      value: "12",
      icon: <FaBriefcase className="text-teal-600 text-2xl" />,
      change: "+2",
      changeType: "positive"
    },
    {
      title: "Freelancers actifs",
      value: "8",
      icon: <FaUsers className="text-indigo-600 text-2xl" />,
      change: "+1",
      changeType: "positive"
    },
    {
      title: "Tâches complétées",
      value: "45",
      icon: <FaFileAlt className="text-blue-600 text-2xl" />,
      change: "+5",
      changeType: "positive"
    },
    {
      title: "Notifications",
      value: "3",
      icon: <FaBell className="text-yellow-600 text-2xl" />,
      change: "+1",
      changeType: "neutral"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <ClientSideBar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord client</h1>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                
              </div>
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

            {/* Show posts and applications */}
            {loading ? (
              <div className="text-center py-10">Chargement...</div>
            ) : (
              <div className="space-y-8">
                {posts.map(post => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-teal-600" /> {post.title}
                    </h3>
                    <div className="text-gray-700 mb-2">{post.description}</div>
                    <div className="text-xs text-gray-500 mb-4">Budget: {post.budget} $ | Deadline: {new Date(post.deadline).toLocaleDateString()}</div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Candidatures reçues :</h4>
                      {post.applications && post.applications.length > 0 ? (
                        <ul className="space-y-2">
                          {post.applications.map(app => {
                            console.log('Freelancer data:', app.freelancer); // Debug log
                            return (
                              <li key={app.freelancer._id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
                                {/* Avatar with initials */}
                                <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold text-lg">
                                  {app.freelancer.companyname ? app.freelancer.companyname[0].toUpperCase() : 'F'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-base">
                                    {app.freelancer.companyname || 'Freelancer'}
                                  </div>
                                  {app.status === 'accepted' ? (
                                    <div className="space-y-1 mt-2">
                                      <div className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {app.freelancer.email}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <span className="font-medium">Téléphone:</span> {app.freelancer.number || app.freelancer.phone || 'Non renseigné'}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <span className="font-medium">Localisation:</span> {app.freelancer.location || 'Non renseigné'}
                                      </div>
                                      {app.freelancer.bio && (
                                        <div className="text-sm text-gray-600 mt-2">
                                          <span className="font-medium">Bio:</span> {app.freelancer.bio}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">{app.freelancer.companyname || 'Freelancer'}</div>
                                  )}
                                </div>
                                {app.status === 'accepted' && (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                      Accepté
                                    </span>
                                  </div>
                                )}
                                {app.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <button
                                      className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-xs"
                                      disabled={actionStatus[`${post._id}_${app.freelancer._id}`] === 'pending'}
                                      onClick={() => handleApplication(post._id, app.freelancer._id, 'accepted')}
                                    >Accepter</button>
                                    <button
                                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                      disabled={actionStatus[`${post._id}_${app.freelancer._id}`] === 'pending'}
                                      onClick={() => handleApplication(post._id, app.freelancer._id, 'rejected')}
                                    >Refuser</button>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-gray-400 text-sm">Aucune candidature pour ce projet.</div>
                      )}
                    </div>
                  </div>
                ))}
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
