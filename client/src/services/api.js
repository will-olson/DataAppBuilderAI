// src/services/api.js
import axios from 'axios';

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
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error(`API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error);
        return Promise.reject(error);
      }
    );
  }

  async request(endpoint, options = {}) {
    try {
      const config = {
        url: endpoint,
        method: options.method || 'GET',
        data: options.body ? JSON.parse(options.body) : undefined,
        headers: options.headers,
        ...options,
      };

      const response = await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      
      if (error.response) {
        // Server responded with error status
        throw new ApiError(
          `HTTP error! status: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new ApiError(
          'Network error: No response received from server',
          0,
          {}
        );
      } else {
        // Something else happened
        throw new ApiError(
          `Network error: ${error.message}`,
          0,
          {}
        );
      }
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
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
    return this.request('/sigma/config');
  }

  async updateSigmaCredentials(credentialsData) {
    return this.request('/sigma/credentials', {
      method: 'PUT',
      body: JSON.stringify(credentialsData)
    });
  }

  async testSigmaCredentials(credentialsData) {
    return this.request('/sigma/test-credentials', {
      method: 'POST',
      body: JSON.stringify(credentialsData)
    });
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
    return this.get('/data-apps');
  }

  // Sigma AI methods
  async getSigmaAISuggestions(query, context = {}) {
    return this.post('/sigma/ai/suggestions', { query, context });
  }

  async getSigmaAITemplates() {
    return this.get('/sigma/ai/templates');
  }

  async getSigmaAITemplate(templateName) {
    return this.get(`/sigma/ai/templates/${templateName}`);
  }

  async generateSigmaAIConfig(requirements, templateName = null) {
    return this.post('/sigma/ai/generate-config', { requirements, templateName });
  }

  async analyzeSigmaAIRequirements(requirements) {
    return this.post('/sigma/ai/analyze-requirements', { requirements });
  }

  async optimizeSigmaAIWorkbook(workbookConfig, optimizationFocus = 'performance') {
    return this.post('/sigma/ai/optimize-workbook', { workbookConfig, optimizationFocus });
  }

  async checkSigmaAIHealth() {
    return this.get('/sigma/ai/health');
  }

  // Sigma API Methods
  async getSigmaConnections(page = 1, size = 50) {
    return this.get(`/sigma/connections?page=${page}&size=${size}`);
  }

  async getSigmaWorkbooks(page = 1, size = 50) {
    return this.get(`/sigma/workbooks?page=${page}&size=${size}`);
  }

  async getSigmaWorkbook(workbookId) {
    return this.get(`/sigma/workbooks/${workbookId}`);
  }

  async exportSigmaWorkbook(workbookId, exportData) {
    return this.post(`/sigma/workbooks/${workbookId}/export`, exportData);
  }

  async getSigmaWorkspaces(page = 1, size = 50) {
    return this.get(`/sigma/workspaces?page=${page}&size=${size}`);
  }

  async getSigmaDatasets(page = 1, size = 50) {
    return this.get(`/sigma/datasets?page=${page}&size=${size}`);
  }

  async getSigmaTeams(page = 1, size = 50) {
    return this.get(`/sigma/teams?page=${page}&size=${size}`);
  }

  async getSigmaMembers(page = 1, size = 50) {
    return this.get(`/sigma/members?page=${page}&size=${size}`);
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
  getStrategicAnalysis: () => apiClient.get('/api/ai-insights/strategic-analysis'),
  getABTestingAnalysis: () => apiClient.get('/api/ai-insights/ab-testing'),
  getMarketingInsights: () => apiClient.get('/api/ai-insights/marketing'),
  getPredictiveInsights: () => apiClient.get('/api/ai-insights/predictive'),
};

export const fetchUserJourneyData = () => apiClient.getUserJourney();

export const fetchLayoutElements = () => apiClient.getSigmaLayoutElements();