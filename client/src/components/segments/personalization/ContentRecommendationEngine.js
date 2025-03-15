// src/components/personalization/ContentRecommendationEngine.js
import React, { useState, useEffect } from 'react';
import { fetchPersonalizationData } from '../../services/api';

const ContentRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState({
    contentTypes: [],
    topContent: [],
    personalizedSuggestions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await fetchPersonalizationData();
        
        if (data) {
          // Process content preferences
          const contentTypes = data.contentPreferences.sort((a, b) => 
            b.avgEngagement - a.avgEngagement
          );

          // Simulate personalized content suggestions
          const personalizedSuggestions = [
            {
              type: 'Recommended for You',
              items: [
                { 
                  title: 'Advanced User Insights', 
                  type: contentTypes[0]?.type || 'video',
                  relevanceScore: 0.85
                },
                { 
                  title: 'Marketing Strategy Deep Dive', 
                  type: contentTypes[1]?.type || 'text',
                  relevanceScore: 0.75
                }
              ]
            }
          ];

          setRecommendations({
            contentTypes,
            topContent: contentTypes.slice(0, 3),
            personalizedSuggestions
          });
          setLoading(false);
        } else {
          throw new Error('No recommendation data available');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content-recommendation-engine">
      <h2>Content Recommendations</h2>
      
      <section>
        <h3>Top Content Types</h3>
        {recommendations.topContent.map((content, index) => (
          <div key={index} className="content-type-card">
            <h4>{content.type}</h4>
            <p>Engagement: {(content.avgEngagement * 100).toFixed(2)}%</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Personalized Suggestions</h3>
        {recommendations.personalizedSuggestions.map((group, index) => (
          <div key={index}>
            <h4>{group.type}</h4>
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="recommendation-item">
                <h5>{item.title}</h5>
                <p>Content Type: {item.type}</p>
                <p>Relevance Score: {(item.relevanceScore * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContentRecommendationEngine;