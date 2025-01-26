import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api/auth/';

// Login function
export const login = async (NIP, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      NIP,
      password
    });
    return response.data; // Renvoyer la réponse (OTP envoyé)
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw new Error(error.response.data.message || 'Erreur lors de la connexion');
  }
};

// Verify OTP function
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}verify-otp`, {
      email,
      otp
    });
    return response.data; // Renvoie le token JWT
  } catch (error) {
    console.error('OTP verification error:', error.response.data);
    throw new Error(error.response.data.message || 'Erreur lors de la vérification OTP');
  }
};

// Register function
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}register`, formData);
    return response.data; // Renvoie un message d'inscription réussie
  } catch (error) {
    console.error('Registration error:', error.response.data);
    throw new Error(error.response.data.message || 'Erreur lors de l\'inscription');
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token'); // Supprime le token JWT du localStorage
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user token
export const getToken = () => {
  return localStorage.getItem('token');
};

