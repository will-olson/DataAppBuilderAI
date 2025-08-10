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

// =============================================================================
// SIGMA FRAMEWORK API ENDPOINTS
// =============================================================================

// Sigma Framework Status and Health
export const fetchSigmaStatus = () => fetchData('/sigma/status');
export const fetchSigmaCapabilities = () => fetchData('/sigma/capabilities');
export const fetchDatabaseHealth = () => fetchData('/database/health');

// Sigma Input Tables Management
export const fetchInputTables = () => fetchData('/sigma/input-tables');
export const createInputTable = async (tableData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sigma/input-tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tableData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating input table:', error);
    throw error;
  }
};

// Sigma Layout Elements Management
export const fetchLayoutElements = () => fetchData('/sigma/layout-elements');
export const createLayoutElement = async (elementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sigma/layout-elements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(elementData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating layout element:', error);
    throw error;
  }
};

// Sigma Actions Framework
export const fetchActions = () => fetchData('/sigma/actions');
export const createAction = async (actionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sigma/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating action:', error);
    throw error;
  }
};

export const executeAction = async (actionId, parameters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sigma/actions/${actionId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameters)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error executing action:', error);
    throw error;
  }
};

// =============================================================================
// EXISTING FUNCTIONALITY (UPDATED)
// =============================================================================

// New method for raw user data with query parameter support
export const fetchRawUserData = async (filters = {}) => {
  try {
    // Convert filters to appropriate format
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );

    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.keys(cleanedFilters).forEach(key => {
      queryParams.append(key, cleanedFilters[key]);
    });

    // Construct full URL
    const endpoint = `/raw-user-data?${queryParams.toString()}`;
    
    // Use existing fetchData method
    const data = await fetchData(endpoint);

    // Additional validation
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of user data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching raw user data:', error);
    throw error;
  }
};

export const fetchAIInsights = {
  getStrategicAnalysis: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights?type=strategic`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Validate data structure
      if (!data.insights || !data.segment_profiles) {
        throw new Error('Invalid data structure received');
      }
      
      return data;
    } catch (error) {
      console.error('Strategic Analysis Fetch Error:', error);
      throw error;
    }
  },
  
  getABTestingAnalysis: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights?type=ab_testing`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Validate data structure for AB testing
      if (!data.insights) {
        throw new Error('Invalid AB testing data structure');
      }
      
      return data;
    } catch (error) {
      console.error('AB Testing Analysis Fetch Error:', error);
      throw error;
    }
  },
  
  getPredictiveInsights: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights?type=predictive`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Validate data structure for predictive insights
      if (!data.insights) {
        throw new Error('Invalid predictive insights data structure');
      }
      
      return data;
    } catch (error) {
      console.error('Predictive Insights Fetch Error:', error);
      throw error;
    }
  },
  
  getSegmentDetails: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/segment-details`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Segment Details Fetch Error:', error);
      throw error;
    }
  },
  
  getRevenueForecast: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/revenue-forecast`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Revenue Forecast Fetch Error:', error);
      throw error;
    }
  }
};