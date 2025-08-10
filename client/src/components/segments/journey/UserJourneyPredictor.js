// src/components/journey/UserJourneyPredictor.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const UserJourneyPredictor = () => {
  const [journeyData, setJourneyData] = useState({
    stages: [],
    transitionProbabilities: [],
    keyInsights: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const data = await apiClient.getUserJourney();
        
        if (data) {
          // Process journey data with additional insights
          const processedJourneyData = {
            stages: data.map(stage => ({
              name: stage.stage,
              userCount: stage.userCount,
              avgLTV: stage.avgLTV,
              churnRisk: stage.avgChurnRisk
            })),
            transitionProbabilities: [
              { from: 'Onboarding', to: 'Active', probability: 0.75 },
              { from: 'Active', to: 'Power User', probability: 0.4 },
              { from: 'Active', to: 'Churn', probability: 0.2 }
            ],
            keyInsights: [
              {
                title: 'Critical Conversion Points',
                description: 'Identify key stages where users are most likely to upgrade or churn'
              },
              {
                title: 'Engagement Optimization',
                description: 'Focus on improving user experience in early stages'
              }
            ]
          };

          setJourneyData(processedJourneyData);
          setLoading(false);
        } else {
          throw new Error('No user journey data available');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  if (loading) return <div>Loading User Journey Predictor...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-journey-predictor">
      <h2>User Journey Insights</h2>
      
      <section>
        <h3>Journey Stages</h3>
        {journeyData.stages.map((stage, index) => (
          <div key={index} className="journey-stage-card">
            <h4>{stage.name}</h4>
            <p>Users: {stage.userCount}</p>
            <p>Avg Lifetime Value: ${stage.avgLTV.toFixed(2)}</p>
            <p>Churn Risk: {(stage.churnRisk * 100).toFixed(2)}%</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Stage Transition Probabilities</h3>
        {journeyData.transitionProbabilities.map((transition, index) => (
          <div key={index} className="transition-card">
            <p>
              {transition.from} → {transition.to}: 
              {(transition.probability * 100).toFixed(2)}% chance
            </p>
          </div>
        ))}
      </section>

      <section>
        <h3>Key Insights</h3>
        {journeyData.keyInsights.map((insight, index) => (
          <div key={index} className="insight-card">
            <h4>{insight.title}</h4>
            <p>{insight.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserJourneyPredictor;