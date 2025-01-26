import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OTPVerify.css';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); // Ajout du champ email
  const [error, setError] = useState('');
  const { verifyUserOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyUserOTP(email, otp); // Appelle la fonction pour vérifier l'OTP et l'email
      navigate('/dashboard'); // Redirige vers le tableau de bord après une vérification réussie
    } catch (err) {
      setError(err.message); // Affiche une erreur si la vérification échoue
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Vérification du Code OTP</h2>
        <form onSubmit={handleVerifyOTP} className="otp-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Entrez votre email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="otp">Code OTP :</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Entrez votre code OTP"
            />
          </div>
          <button type="submit" className="btn btn-primary">Vérifier OTP</button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;
