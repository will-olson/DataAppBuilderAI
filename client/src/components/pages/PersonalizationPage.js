// src/pages/Personalization.js
import React, { useState, useEffect } from 'react';
import { fetchPersonalizationData } from '../../services/api';

const PersonalizationPage = () => {
  const [personalizationData, setPersonalizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPersonalizationData = async () => {
      try {
        const data = await fetchPersonalizationData();
        if (data) {
          setPersonalizationData(data);
          setLoading(false);
        } else {
          throw new Error('No personalization data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadPersonalizationData();
  }, []);

  if (loading) return <div>Loading personalization insights...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Personalization Insights</h1>
      
      <section>
        <h2>Content Preferences</h2>
        {personalizationData.contentPreferences.map((pref, index) => (
          <div key={index}>
            <h3>{pref.type}</h3>
            <p>User Count: {pref.userCount}</p>
            <p>Average Engagement: {(pref.avgEngagement * 100).toFixed(2)}%</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Communication Preferences</h2>
        {personalizationData.communicationPreferences.map((pref, index) => (
          <div key={index}>
            <h3>{pref.channel}</h3>
            <p>User Count: {pref.userCount}</p>
            <p>Average Open Rate: {(pref.avgOpenRate * 100).toFixed(2)}%</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PersonalizationPage;