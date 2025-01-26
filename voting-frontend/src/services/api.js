// api.js
import axios from 'axios';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // L'URL de base de l'API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction de connexion
export const loginUser = async (NIP, password) => {
  try {
    const response = await api.post('/login', { NIP, password }); // Utilisez le chemin relatif
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    throw error.response.data || error.message; // Gestion des erreurs
  }
};

// Fonction pour vérifier l'OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data; // Retourne les données après vérification
  } catch (error) {
    throw error.response.data || error.message; // Gestion des erreurs
  }
};

// Fonction pour enregistrer un nouvel utilisateur (électeur)
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData); // Appelle l'API backend d'inscription
    return response.data.message; // Retourne le message de succès
  } catch (error) {
    throw error.response.data; // Gère les erreurs et les retourne
  }
};


// Fonction pour obtenir les élections (exemple pour le dashboard)
// services/api.js
export const fetchElections = async (token) => {
  return await fetch('http://localhost:5000/api/elections/ongoing', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
};

// Fonction pour obtenir les résultats d'une élection spécifique
// src/services/api.js

export const fetchElectionResults = async (electionId, token) => {
  const response = await fetch(`http://localhost:5000/api/elections/${electionId}/results`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }
  return await response.json();
};



