import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import ClientSideBar from '../components/ClientSideBar';
export default function ClientPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    deadline: '',
    category: '',
    skills: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts/client', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.location || !formData.budget || !formData.deadline || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      console.log('Sending request to API...');
      // Convert budget to number
      const postData = {
        ...formData,
        budget: Number(formData.budget)
      };
      
      const response = await axios.post('http://localhost:3001/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      // Show success message
      alert('Post created successfully!');
      
      // Reset form and refresh posts
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        budget: '',
        deadline: '',
        category: '',
        skills: []
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show error message to user
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred while creating the post. Please try again.');
      }
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3001/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed">
          <ClientSideBar />
        </div>
        <div className="flex-1 ml-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed">
        <ClientSideBar />
      </div>
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Mes Annonces</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors"
            >
              <FaPlus /> Nouvelle Annonce
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Créer une nouvelle annonce</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Titre de l'annonce</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Développeur Full Stack pour projet e-commerce"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Description détaillée</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    rows="4"
                    placeholder="Décrivez votre projet, les compétences requises et les attentes..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Localisation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Ex: Casablanca, Maroc"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Budget (MAD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Ex: 5000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Date limite</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="web">Développement Web</option>
                      <option value="mobile">Développement Mobile</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="writing">Rédaction</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Annuler
                    </button>
                    <button
                    onClick={handleSubmit()}
                      type="submit"
                      className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Publier l'annonce
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaMoneyBillWave className="mr-2" />
                    <span>{post.budget} MAD</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    <span>Date limite: {new Date(post.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 