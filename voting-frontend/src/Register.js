import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    NIP: '',
    nom: '',
    prenom: '',
    dob: '',
    email: '',
    province: '',
    ville: '',
    arrondissement: '',
    bureauVote: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/electors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);  // Afficher le message de réussite ou d'erreur
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="NIP" placeholder="NIP" onChange={handleChange} required />
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input type="date" name="dob" placeholder="Date de naissance" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="province" placeholder="Province" onChange={handleChange} required />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required />
        <input type="text" name="arrondissement" placeholder="Arrondissement" onChange={handleChange} required />
        <input type="text" name="bureauVote" placeholder="Bureau de vote" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
