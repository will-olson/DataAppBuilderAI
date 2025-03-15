// src/components/personalization/PersonalizationDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchPersonalizationData } from '../../services/api';
import ContentRecommendationEngine from './ContentRecommendationEngine';

const PersonalizationDashboard = () => {
  const [personalizationData, setPersonalizationData] = useState({
    contentPreferences: [],
    communicationPreferences: [],
    userSegments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalizationInsights = async () => {
      try {
        const data = await fetchPersonalizationData();
        
        if (data) {
          // Enhance data with additional insights
          const enhancedData = {
            contentPreferences: data.contentPreferences.map(pref => ({
              ...pref,
              potentialReach: Math.round(pref.userCount / 100)
            })),
            communicationPreferences: data.communicationPreferences.map(comm => ({
              ...comm,
              engagementPotential: (comm.avgOpenRate * 100).toFixed(2)
            })),
            userSegments: [
              {
                name: 'Highly Engaged Users',
                criteria: 'Frequent content consumers',
                size: Math.round(data.contentPreferences.reduce((sum, pref) => sum + pref.userCount, 0) * 0.3)
              },
              {
                name: 'Potential Churners',
                criteria: 'Low engagement, infrequent interactions',
                size: Math.round(data.contentPreferences.reduce((sum, pref) => sum + pref.userCount, 0) * 0.2)
              }
            ]
          };

          setPersonalizationData(enhancedData);
          setLoading(false);
        } else {
          throw new Error('No personalization data available');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPersonalizationInsights();
  }, []);

  if (loading) return <div>Loading personalization insights...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="personalization-dashboard">
      <h1>Personalization Insights</h1>
      
      <section>
        <h2>Content Preferences</h2>
        {personalizationData.contentPreferences.map((pref, index) => (
          <div key={index} className="content-preference-card">
            <h3>{pref.type}</h3>
            <p>User Count: {pref.userCount}</p>
            <p>Potential Reach: {pref.potentialReach}k</p>
            <p>Average Engagement: {(pref.avgEngagement * 100).toFixed(2)}%</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Communication Preferences</h2>
        {personalizationData.communicationPreferences.map((pref, index) => (
          <div key={index} className="communication-preference-card">
            <h3>{pref.channel}</h3>
            <p>User Count: {pref.userCount}</p>
            <p>Engagement Potential: {pref.engagementPotential}%</p>
          </div>
        ))}
      </section>

      <section>
        <h2>User Segments</h2>
        {personalizationData.userSegments.map((segment, index) => (
          <div key={index} className="user-segment-card">
            <h3>{segment.name}</h3>
            <p>Criteria: {segment.criteria}</p>
            <p>Segment Size: {segment.size}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Content Recommendations</h2>
        <ContentRecommendationEngine />
      </section>
    </div>
  );
};

export default PersonalizationDashboard;