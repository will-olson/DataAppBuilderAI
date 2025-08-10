// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request: ${url}`, config);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          await response.json().catch(() => ({}))
        );
      }

      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiError(
          `Network error: Fetch API not available - ${error.message}`,
          0,
          {}
        );
      }
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        throw new ApiError(
          `CORS error: ${error.message}`,
          0,
          {}
        );
      }
      
      throw new ApiError(
        `Network error: ${error.message}`,
        0,
        {}
      );
    }
  }

  // Generic methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Sigma framework endpoints
  async getSigmaStatus() {
    return this.get('/sigma/status');
  }

  async getSigmaCapabilities() {
    return this.get('/sigma/capabilities');
  }

  async getSigmaInputTables() {
    return this.get('/sigma/input-tables');
  }

  async getSigmaLayoutElements() {
    return this.get('/sigma/layout-elements');
  }

  async getSigmaActions() {
    return this.get('/sigma/actions');
  }

  async executeSigmaAction(actionId, parameters) {
    return this.post(`/sigma/actions/${actionId}/execute`, parameters);
  }

  async toggleSigmaMode(mode) {
    return this.post('/sigma/toggle-mode', { mode });
  }

  async getSigmaConfig() {
    return this.get('/sigma/config');
  }

  // Analytics endpoints
  async getUserSegments() {
    return this.get('/segments');
  }

  async getUserJourney() {
    return this.get('/user-journey');
  }

  async getPersonalizationData() {
    return this.get('/personalization');
  }

  async getChurnPrediction() {
    return this.get('/churn-prediction');
  }

  async getReferralInsights() {
    return this.get('/referral-insights');
  }

  async getFeatureUsage() {
    return this.get('/feature-usage');
  }

  async getRevenueForecast() {
    return this.get('/revenue-forecast');
  }

  async getRawUserData(limit = 100, offset = 0) {
    return this.get(`/raw-user-data?limit=${limit}&offset=${offset}`);
  }

  async getAIInsights() {
    return this.get('/ai-insights');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

// Export both the class and the instance
export { ApiClient, ApiError };
export default apiClient;

// Legacy exports for backward compatibility
export const fetchData = (endpoint) => apiClient.get(endpoint);
export const fetchUserSegments = () => apiClient.getUserSegments();

// Additional exports for components
export const fetchAIInsights = {
  getStrategicAnalysis: () => apiClient.get('/ai-insights/strategic-analysis'),
  getABTestingAnalysis: () => apiClient.get('/ai-insights/ab-testing'),
  getMarketingInsights: () => apiClient.get('/ai-insights/marketing'),
  getPredictiveInsights: () => apiClient.get('/ai-insights/predictive'),
};

export const fetchUserJourneyData = () => apiClient.getUserJourney();

export const fetchLayoutElements = () => apiClient.getSigmaLayoutElements();