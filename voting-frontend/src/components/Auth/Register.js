import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Register.css'; // Assurez-vous d'avoir un fichier CSS pour styliser votre page

const Register = () => {
  const { registerUser } = useContext(AuthContext);

  // Gestion des champs du formulaire
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
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      NIP,
      nom,
      prenom,
      dob,
      email,
      province,
      ville,
      arrondissement,
      bureauVote,
      password,
      confirmPassword,
    } = formData;

    // Validation des champs (par exemple, vérifier si les mots de passe correspondent)
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Envoi des données au backend
    try {
      const responseMessage = await registerUser({
        NIP,
        nom,
        prenom,
        dob,
        email,
        province,
        ville,
        arrondissement,
        bureauVote,
        password,
      });
      setSuccess(responseMessage);
      setError(''); // Réinitialiser les erreurs en cas de succès
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>NIP :</label>
          <input
            type="text"
            name="NIP"
            value={formData.NIP}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date de naissance :</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Province :</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ville :</label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Arrondissement :</label>
          <input
            type="text"
            name="arrondissement"
            value={formData.arrondissement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bureau de vote :</label>
          <input
            type="text"
            name="bureauVote"
            value={formData.bureauVote}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
