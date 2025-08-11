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

    // Check if fetch is available
    if (typeof fetch === 'undefined') {
      console.error('Fetch API is not available in this environment');
      throw new ApiError(
        'Fetch API not available in this environment. Please check browser compatibility or polyfill.',
        0,
        {}
      );
    }

    try {
      const response = await fetch(url, config);
      
      // Parse the response body first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not JSON, treat as text
        data = await response.text();
      }
      
      // Check if response is ok (2xx status)
      if (!response.ok) {
        // For 404 responses, check if they contain valid error messages
        if (response.status === 404 && data && typeof data === 'object' && data.message) {
          // This is a valid 404 response with an error message, return it as data
          console.log(`API Response (404 with message): ${url}`, data);
          return data;
        }
        
        // For other error statuses, throw an error
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          data
        );
      }

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

  async getUserCount() {
    return this.get('/user-count');
  }

  async getAIInsights() {
    return this.get('/ai-insights');
  }

  async getDataAppTemplates() {
    return this.get('/data-app-templates');
  }

  async createDataApp(data) {
    return this.post('/data-apps', data);
  }

  async updateDataApp(id, data) {
    return this.put(`/data-apps/${id}`, data);
  }

  async deleteDataApp(id) {
    return this.delete(`/data-apps/${id}`);
  }

  async getDataApp(id) {
    return this.get(`/data-apps/${id}`);
  }

  async listDataApps() {
    return this.get('/data-app-templates');
  }

  // Sigma AI methods
  async getSigmaAISuggestions(query, context = {}) {
    return this.post('/sigma-ai/suggestions', { query, context });
  }

  async getSigmaAITemplates() {
    return this.get('/sigma-ai/templates');
  }

  async getSigmaAITemplate(templateName) {
    return this.get(`/sigma-ai/templates/${templateName}`);
  }

  async generateSigmaAIConfig(requirements, templateName = null) {
    const data = { requirements };
    if (templateName) {
      data.template_name = templateName;
    }
    return this.post('/sigma-ai/generate-config', data);
  }

  async analyzeSigmaAIRequirements(requirements) {
    return this.post('/sigma-ai/analyze-requirements', { requirements });
  }

  async optimizeSigmaAIWorkbook(workbookConfig, optimizationFocus = 'performance') {
    return this.post('/sigma-ai/optimize-workbook', { 
      workbook_config: workbookConfig, 
      optimization_focus: optimizationFocus 
    });
  }

  async checkSigmaAIHealth() {
    return this.get('/sigma-ai/health');
  }

  // Sigma API Methods
  async getSigmaAPIStatus() {
    return this.request('/api/sigma/status');
  }

  async getSigmaConnections(page = 1, size = 50) {
    return this.request(`/api/sigma/connections?page=${page}&size=${size}`);
  }

  async getSigmaWorkbooks(page = 1, size = 50) {
    return this.request(`/api/sigma/workbooks?page=${page}&size=${size}`);
  }

  async getSigmaWorkbook(workbookId) {
    return this.request(`/api/sigma/workbooks/${workbookId}`);
  }

  async exportSigmaWorkbook(workbookId, exportData) {
    return this.request(`/api/sigma/workbooks/${workbookId}/export`, {
      method: 'POST',
      body: JSON.stringify(exportData)
    });
  }

  async getSigmaWorkspaces(page = 1, size = 50) {
    return this.request(`/api/sigma/workspaces?page=${page}&size=${size}`);
  }

  async getSigmaDatasets(page = 1, size = 50) {
    return this.request(`/api/sigma/datasets?page=${page}&size=${size}`);
  }

  async getSigmaTeams(page = 1, size = 50) {
    return this.request(`/api/sigma/teams?page=${page}&size=${size}`);
  }

  async getSigmaMembers(page = 1, size = 50) {
    return this.request(`/api/sigma/members?page=${page}&size=${size}`);
  }

  async getSigmaConfig() {
    return this.request('/api/sigma/config');
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