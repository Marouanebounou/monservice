import React from "react";
import axios from "axios";
import FreelancerSidebar from "../components/FreelancerSidebar.jsx";

export default function FreelancerDashboard() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    axios.get("http://localhost:3001/api/posts/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <FreelancerSidebar />
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Offres de projets des clients</h1>
            <div className="space-y-6 mb-10">
              {posts.length === 0 && (
                <div className="text-gray-500">Aucune offre de projet disponible.</div>
              )}
              {posts.map(post => (
                <div key={post._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                    <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-2 text-gray-700">{post.description}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span><b>Catégorie:</b> {post.category}</span>
                    <span><b>Lieu:</b> {post.location}</span>
                    <span><b>Budget:</b> {post.budget} $</span>
                    <span><b>Deadline:</b> {new Date(post.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    {post.skills && post.skills.map((skill, i) => (
                      <span key={i} className="bg-teal-50 text-teal-700 px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Posté par: {post.client?.firstname} {post.client?.secondname} ({post.client?.email})
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