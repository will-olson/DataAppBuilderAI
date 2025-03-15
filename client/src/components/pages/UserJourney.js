// src/pages/UserJourney.js
import React, { useState, useEffect } from 'react';
import { fetchUserJourneyData } from '../../services/api';

const UserJourneyPage = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserJourneyData = async () => {
      try {
        const data = await fetchUserJourneyData();
        if (data) {
          setJourneyData(data);
          setLoading(false);
        } else {
          throw new Error('No user journey data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserJourneyData();
  }, []);

  if (loading) return <div>Loading user journey data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Journey Stages</h1>
      {journeyData.map((stage, index) => (
        <div key={index}>
          <h2>{stage.stage}</h2>
          <div>
            <p>User Count: {stage.userCount}</p>
            <p>Average Lifetime Value: ${stage.avgLTV.toFixed(2)}</p>
            <p>Average Churn Risk: {(stage.avgChurnRisk * 100).toFixed(2)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserJourneyPage;