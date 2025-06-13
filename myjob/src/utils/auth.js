import axios from 'axios';

// Get the stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get the stored user data
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get all authentication data
export const getAuthData = () => {
  return {
    token: getToken(),
    user: getUser()
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Set up axios default headers with token
export const setupAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize auth state
export const initAuth = () => {
  setupAuthHeader();
}; 