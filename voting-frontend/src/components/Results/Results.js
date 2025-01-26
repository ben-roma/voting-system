// src/components/Results/Results.js

import React, { useState, useEffect } from 'react';
import { fetchElectionResults } from '../../services/api';

const Results = ({ electionId, token }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);
      try {
        const res = await fetchElectionResults(electionId, token);
        setResults(res.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load results');
        setLoading(false);
      }
    };

    getResults();
  }, [electionId, token]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p>{error}</p>;
  if (!results) return <p>No results available</p>;

  return (
    <div>
      <h1>Results for: {results.winnerName}</h1>
      <div>Total votes: {results.totalVotes}</div>
      <div>
        {results.candidates.map((candidate, index) => (
          <div key={index}>
            <h3>{candidate.name}</h3>
            <p>Votes: {candidate.voteCount}, {candidate.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
