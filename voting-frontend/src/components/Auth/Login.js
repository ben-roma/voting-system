import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la navigation
import { loginUser } from '../../services/api'; // Importation de l'API pour la connexion
import './Login.css'; // Importation des styles spécifiques
import { Container, Form, Button } from 'react-bootstrap'; // Import Bootstrap components

const Login = () => {
  const navigate = useNavigate(); // Initialisation de la navigation
  const [NIP, setNIP] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(NIP, password);
      alert(response.message); // Affiche le message d'envoi de l'OTP
      
      // Redirige vers la page de vérification de l'OTP après l'envoi
      navigate('/verify-otp', { state: { email: response.email } }); // Passe l'email à la page suivante
    } catch (error) {
      setError(error.message || "Erreur lors de la connexion");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container">
        <Form onSubmit={handleLogin}>
          <h3>Connexion</h3>
          {error && <p className="error-message">{error}</p>}
          <Form.Group controlId="nip">
            <Form.Label>NIP :</Form.Label>
            <Form.Control
              type="text"
              value={NIP}
              onChange={(e) => setNIP(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Mot de passe :</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn btn-primary w-100">
            Envoyer le code OTP
          </Button>
        </Form>
        <div className="login-options">
          <p><a href="/forgot-password">Mot de passe oublié ?</a></p>
          <p>Vous n'avez pas encore de compte ? <a href="/register">Inscrivez-vous</a></p>
        </div>
      </div>
    </Container>
  );
};

export default Login;
