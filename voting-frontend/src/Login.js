import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    NIP: '',
    password: '',
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.message === 'OTP envoyé') {
        setOtpSent(true);
      }
      alert(data.message);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="NIP" placeholder="NIP" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">Se connecter</button>
      </form>
      {otpSent && <p>Un OTP a été envoyé à votre adresse email.</p>}
    </div>
  );
};

export default Login;
