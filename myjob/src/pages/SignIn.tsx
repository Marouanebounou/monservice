// SignInPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending login request:', form);
      const res = await axios.post("http://localhost:3001/signin", form);
      
      if (res.status === 200) {
        // Store user data and token in localStorage
        const { token, ...userData } = res.data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Check for redirect URL
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectAfterLogin);
        } else {
          // Redirect based on user role
          if (userData.role === 'buyer') {
            navigate('/client-dashboard');
          } else if (userData.role === 'provider') {
            navigate('/freelancer-dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign in clicked');
  };

  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook sign in clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Se connecter</h2>

        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Adresse email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Connexion"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">Ou se connecter avec</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle size={20} /> <span>Continuer avec Google</span>
          </button>

          <button
            onClick={handleFacebookSignIn}
            className="flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FaFacebook size={20} className="text-blue-600" /> <span>Continuer avec Facebook</span>
          </button>
        </div>
        <p className="mt-4 text-center">
          Vous n'avez pas de compte ? {" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Créez-en un
          </a>
        </p>
      </div>
    </div>
  );
}
