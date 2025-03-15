// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

// Existing exports
export const fetchUserSegments = () => fetchData('/segments');
export const fetchUserJourneyData = () => fetchData('/user-journey');
export const fetchPersonalizationData = () => fetchData('/personalization');

// New exports following the same pattern
export const fetchChurnPredictionData = () => fetchData('/churn-prediction');
export const fetchReferralInsights = () => fetchData('/referral-insights');
export const fetchFeatureUsageAnalytics = () => fetchData('/feature-usage');