import React, { createContext, useState, useEffect } from 'react';
import { loginUser, verifyOTP, register, logout, getToken, isAuthenticated } from '../services/authService';

// Crée le contexte AuthContext
export const AuthContext = createContext();

// Fournisseur du contexte AuthContext
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stockage de l'utilisateur
  const [loading, setLoading] = useState(true); // Indique si les données utilisateur sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les erreurs

  useEffect(() => {
    const checkAuthStatus = () => {
      if (isAuthenticated()) {
        // Simule le chargement de l'utilisateur si le token existe
        setUser({ token: getToken() });
      }
      setLoading(false); // Fini le chargement
    };
    checkAuthStatus();
  }, []);

  // Fonction de connexion
  const loginUser = async (NIP, password) => {
    try {
      const response = await apiLoginUser(NIP, password); // Envoie la requête de connexion
      return response.message; // Renvoie le message pour l'OTP
    } catch (err) {
      setError(err.message); // Gère les erreurs
      throw err;
    }
  };

  // Fonction de vérification de l'OTP
  const verifyUserOTP = async (email, otp) => {
    try {
      const response = await verifyOTP(email, otp);
      localStorage.setItem('token', response.token); // Sauvegarde le token JWT dans le localStorage
      setUser({ token: response.token }); // Met à jour l'utilisateur
    } catch (err) {
      setError(err.message); // Gère les erreurs
      throw err;
    }
  };

  // Fonction d'inscription
  const registerUser = async (formData) => {
    try {
      const response = await register(formData);
      return response.message; // Renvoie le message d'inscription réussie
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction de déconnexion
  const logoutUser = () => {
    logout(); // Supprime le token
    setUser(null); // Réinitialise l'utilisateur
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        verifyUserOTP,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
