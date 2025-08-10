// src/components/journey/ChurnRiskForecaster.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const ChurnRiskForecaster = () => {
  const [churnData, setChurnData] = useState({
    overallChurnRisk: 0,
    segmentChurnRisks: [],
    interventionRecommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChurnData = async () => {
      try {
        const journeyData = await apiClient.getUserJourney();
        
        if (journeyData) {
          // Process churn risk data
          const processedData = {
            overallChurnRisk: journeyData.reduce((avg, stage) => 
              avg + stage.avgChurnRisk, 0) / journeyData.length,
            
            segmentChurnRisks: journeyData.map(stage => ({
              stage: stage.stage,
              churnRisk: stage.avgChurnRisk,
              userCount: stage.userCount
            })),
            
            interventionRecommendations: [
              {
                stage: 'High Risk Segments',
                recommendations: [
                  'Personalized Engagement Campaign',
                  'Targeted Retention Offers',
                  'Proactive Customer Support'
                ]
              }
            ]
          };

          setChurnData(processedData);
          setLoading(false);
        } else {
          throw new Error('No churn data available');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChurnData();
  }, []);

  if (loading) return <div>Loading Churn Risk Forecast...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="churn-risk-forecaster">
      <h2>Churn Risk Forecast</h2>
      
      <section>
        <h3>Overall Churn Risk</h3>
        <div className="churn-risk-indicator">
          <p>Estimated Risk: {(churnData.overallChurnRisk * 100).toFixed(2)}%</p>
          <div 
            className="risk-meter" 
            style={{
              width: `${churnData.overallChurnRisk * 100}%`,
              backgroundColor: 
                churnData.overallChurnRisk < 0.3 ? 'green' : 
                churnData.overallChurnRisk < 0.6 ? 'orange' : 'red'
            }}
          />
        </div>
      </section>

      <section>
        <h3>Churn Risk by User Stage</h3>
        {churnData.segmentChurnRisks.map((segment, index) => (
          <div key={index} className="churn-segment-card">
            <h4>{segment.stage}</h4>
            <p>Churn Risk: {(segment.churnRisk * 100).toFixed(2)}%</p>
            <p>Users at Risk: {segment.userCount}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Intervention Recommendations</h3>
        {churnData.interventionRecommendations.map((intervention, index) => (
          <div key={index} className="intervention-card">
            <h4>{intervention.stage}</h4>
            <ul>
              {intervention.recommendations.map((rec, recIndex) => (
                <li key={recIndex}>{rec}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ChurnRiskForecaster;