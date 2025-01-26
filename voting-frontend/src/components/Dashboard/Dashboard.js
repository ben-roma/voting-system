import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { fetchElections } from '../../services/api'; // Utiliser le fetchElections du service API
import Results from '../Results/Results';
const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Utilisation de useCallback pour éviter de recréer la fonction fetchElections à chaque rendu
  const fetchElectionData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchElections(user.token);
      console.log('Élections récupérées:', data);

      if (Array.isArray(data)) {
        setElections(data);
      } else {
        setElections([]);
        setError('Erreur lors de la récupération des élections.');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des élections (catch):', err);
      setError('Erreur lors de la récupération des élections.');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchElectionData();
    }
  }, [user, navigate, fetchElectionData]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <p>Chargement des élections...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <h3>Election </h3>
            <ul className="election-list">
              {elections.length > 0 ? (
                elections.map((election) => (
                  <li key={election._id}>
                    <h4>{election.name}</h4>
                    <p>Date de début: {new Date(election.createdAt).toLocaleDateString()}</p>
                  </li>
                ))
              ) : (
                <p>Aucune élection disponible pour le moment.</p>
              )}
            </ul>
            {/* <div>
            <h1>Dashboard</h1>
                <Results electionId="67248c457eaef3a8b51cae22" token="user-token" />
            </div> */}

          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
