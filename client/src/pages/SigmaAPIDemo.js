import React, { useState, useEffect } from 'react';
import { SigmaAPIProvider } from '../context/SigmaAPIContext';
import SigmaAPIDashboard from '../components/SigmaAPI/SigmaAPIDashboard';
import './SigmaAPIDemo.css';

const SigmaAPIDemo = () => {
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  // Test Sigma API endpoints
  const testSigmaAPIEndpoints = async () => {
    setIsTesting(true);
    const results = {};
    
    try {
      // Test status endpoint
      const statusResponse = await fetch('http://localhost:5555/api/sigma/status');
      const statusData = await statusResponse.json();
      results.status = { success: statusResponse.ok, data: statusData };
      
      // Test config endpoint
      const configResponse = await fetch('http://localhost:5555/api/sigma/config');
      const configData = await configResponse.json();
      results.config = { success: configResponse.ok, data: configData };
      
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:5555/api/health');
      const healthData = await healthResponse.json();
      results.health = { success: healthResponse.ok, data: healthData };
      
    } catch (error) {
      results.error = error.message;
    }
    
    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="sigma-api-demo-page">
      <div className="demo-header">
        <h1>🚀 Sigma API Integration Demo</h1>
        <p>
          This page demonstrates the robust Sigma API integration capabilities with enterprise-grade features.
          Configure your Sigma API credentials to test the full functionality.
        </p>
        
        <div className="demo-actions">
          <button 
            className="test-button"
            onClick={testSigmaAPIEndpoints}
            disabled={isTesting}
          >
            {isTesting ? 'Testing...' : '🧪 Test API Endpoints'}
          </button>
          
          <button 
            className="config-button"
            onClick={() => setShowConfigGuide(!showConfigGuide)}
          >
            {showConfigGuide ? '📋 Hide Config Guide' : '📋 Show Config Guide'}
          </button>
        </div>
      </div>

      {/* Test Results Display */}
      {Object.keys(testResults).length > 0 && (
        <div className="test-results">
          <h3>🧪 API Test Results</h3>
          <div className="test-grid">
            {Object.entries(testResults).map(([endpoint, result]) => (
              <div key={endpoint} className={`test-result ${result.success ? 'success' : 'error'}`}>
                <h4>{endpoint.toUpperCase()}</h4>
                <div className="result-status">
                  {result.success ? '✅ Success' : '❌ Failed'}
                </div>
                <pre className="result-data">
                  {JSON.stringify(result.data || result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Configuration Guide */}
      {showConfigGuide && (
        <div className="config-guide">
          <h3>⚙️ Configuration Guide</h3>
          <div className="config-steps">
            <div className="config-step">
              <h4>1. Generate Sigma API Credentials</h4>
              <p>Follow these steps in your Sigma account:</p>
              <ol>
                <li>Navigate to <strong>Administration → Developer Access</strong></li>
                <li>Click <strong>"Create new"</strong> button</li>
                <li>Select <strong>"REST API"</strong> checkbox for scopes</li>
                <li>Enter unique name (e.g., "Web app service account")</li>
                <li>Select owner member with appropriate permissions</li>
                <li><strong>⚠️ Important:</strong> Copy client ID and secret immediately</li>
              </ol>
            </div>
            
            <div className="config-step">
              <h4>2. Set Environment Variables</h4>
              <p>Update your <code>server/.env</code> file:</p>
              <pre>
{`# Sigma API Configuration
SIGMA_API_ENABLED=true
SIGMA_API_CLIENT_ID=your_actual_client_id_here
SIGMA_API_CLIENT_SECRET=your_actual_client_secret_here
SIGMA_API_CLOUD_PROVIDER="AWS-US (West)"

# Optional: Override base URL if needed
# SIGMA_API_BASE_URL=https://your-custom-url.com`}
              </pre>
            </div>
            
            <div className="config-step">
              <h4>3. Cloud Provider Options</h4>
              <div className="cloud-providers">
                <div className="provider-group">
                  <h5>AWS Providers:</h5>
                  <ul>
                    <li><code>AWS-US (West)</code> - Default, US West Coast</li>
                    <li><code>AWS-US (East)</code> - US East Coast</li>
                    <li><code>AWS-EU</code> - European Union</li>
                    <li><code>AWS-UK</code> - United Kingdom</li>
                    <li><code>AWS-CA</code> - Canada</li>
                    <li><code>AWS-AU</code> - Australia</li>
                  </ul>
                </div>
                <div className="provider-group">
                  <h5>Azure Providers:</h5>
                  <ul>
                    <li><code>Azure-US</code> - Azure US</li>
                    <li><code>Azure-EU</code> - Azure Europe</li>
                    <li><code>Azure-CA</code> - Azure Canada</li>
                    <li><code>Azure-UK</code> - Azure UK</li>
                  </ul>
                </div>
                <div className="provider-group">
                  <h5>Other:</h5>
                  <ul>
                    <li><code>GCP</code> - Google Cloud Platform</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="config-step">
              <h4>4. Restart Backend Server</h4>
              <p>Restart your Flask backend to load the new configuration:</p>
              <pre>
{`cd server
python run.py`}
              </pre>
            </div>
            
            <div className="config-step">
              <h4>5. Test Connection</h4>
              <p>The dashboard will automatically check the API connection status once configured.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sigma API Dashboard */}
      <div className="dashboard-section">
        <h3>📊 Sigma API Dashboard</h3>
        <p>Interactive dashboard for managing Sigma resources, connections, and OAuth overrides.</p>
        
        <SigmaAPIProvider>
          <SigmaAPIDashboard />
        </SigmaAPIProvider>
      </div>
      
      {/* Features Overview */}
      <div className="features-overview">
        <h3>✨ Enterprise Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🔐 OAuth Override Support</h4>
            <p>Fine-grained access control with OAuth override tokens for secure data access.</p>
          </div>
          <div className="feature-card">
            <h4>📊 Comprehensive Data Management</h4>
            <p>Manage connections, workbooks, workspaces, datasets, teams, and members.</p>
          </div>
          <div className="feature-card">
            <h4>🔄 Advanced Pagination</h4>
            <p>Configurable page sizes with API limit compliance (1-1000 items per page).</p>
          </div>
          <div className="feature-card">
            <h4>🛡️ Robust Error Handling</h4>
            <p>Exponential backoff, request ID tracking, and graceful degradation.</p>
          </div>
          <div className="feature-card">
            <h4>⚡ Real-time Monitoring</h4>
            <p>Live connection status and health checks with visual indicators.</p>
          </div>
          <div className="feature-card">
            <h4>📱 Responsive UI</h4>
            <p>Modern, mobile-friendly interface for all operations.</p>
          </div>
        </div>
      </div>
      
      {/* API Endpoints Reference */}
      <div className="api-reference">
        <h3>🔗 API Endpoints Reference</h3>
        <div className="endpoints-grid">
          <div className="endpoint-group">
            <h4>Status & Configuration</h4>
            <ul>
              <li><code>GET /api/sigma/status</code> - Connection status</li>
              <li><code>GET /api/sigma/config</code> - Configuration info</li>
            </ul>
          </div>
          <div className="endpoint-group">
            <h4>Data Management</h4>
            <ul>
              <li><code>GET /api/sigma/connections</code> - List connections</li>
              <li><code>GET /api/sigma/workbooks</code> - List workbooks</li>
              <li><code>GET /api/sigma/workspaces</code> - List workspaces</li>
              <li><code>GET /api/sigma/datasets</code> - List datasets</li>
            </ul>
          </div>
          <div className="endpoint-group">
            <h4>Operations</h4>
            <ul>
              <li><code>GET /api/sigma/workbooks/{'{id}'}</code> - Get workbook details</li>
              <li><code>POST /api/sigma/workbooks/{'{id}'}/export</code> - Export workbook</li>
              <li><code>GET /api/sigma/teams</code> - List teams</li>
              <li><code>GET /api/sigma/members</code> - List members</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="demo-footer">
        <h3>🚀 Ready to Test?</h3>
        <p>
          Follow the configuration steps above to enable the Sigma API integration.
          Once configured, you'll be able to test all the dashboard features including
          connection management, OAuth overrides, and data operations.
        </p>
        
        <div className="next-steps">
          <h4>Next Steps:</h4>
          <ol>
            <li>Generate Sigma API credentials in your Sigma account</li>
            <li>Update the environment configuration</li>
            <li>Restart the backend server</li>
            <li>Test the API endpoints using the button above</li>
            <li>Explore the interactive dashboard features</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SigmaAPIDemo; 