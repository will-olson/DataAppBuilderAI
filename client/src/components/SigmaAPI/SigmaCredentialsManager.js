import React, { useState, useEffect } from 'react';
import { useSigmaAPI } from '../../context/SigmaAPIContext';
import './SigmaCredentialsManager.css';

const SigmaCredentialsManager = () => {
  const {
    credentials,
    updateCredentials,
    testCredentials,
    loading,
    error,
    clearError
  } = useSigmaAPI();

  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    cloudProvider: 'AWS-US (West)',
    baseUrl: '',
    enabled: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Cloud provider options
  const cloudProviders = [
    { value: 'AWS-US (West)', label: 'AWS-US (West)', url: 'https://aws-api.sigmacomputing.com' },
    { value: 'AWS-US (East)', label: 'AWS-US (East)', url: 'https://api.us-a.aws.sigmacomputing.com' },
    { value: 'AWS-CA', label: 'AWS-CA', url: 'https://api.ca.aws.sigmacomputing.com' },
    { value: 'AWS-EU', label: 'AWS-EU', url: 'https://api.eu.aws.sigmacomputing.com' },
    { value: 'AWS-UK', label: 'AWS-UK', url: 'https://api.uk.aws.sigmacomputing.com' },
    { value: 'AWS-AU', label: 'AWS-AU', url: 'https://api.au.aws.sigmacomputing.com' },
    { value: 'Azure-US', label: 'Azure-US', url: 'https://api.us.azure.sigmacomputing.com' },
    { value: 'Azure-EU', label: 'Azure-EU', url: 'https://api.eu.azure.sigmacomputing.com' },
    { value: 'Azure-CA', label: 'Azure-CA', url: 'https://api.ca.azure.sigmacomputing.com' },
    { value: 'Azure-UK', label: 'Azure-UK', url: 'https://api.uk.azure.sigmacomputing.com' },
    { value: 'GCP', label: 'GCP', url: 'https://api.sigmacomputing.com' },
    { value: 'custom', label: 'Custom URL', url: '' }
  ];

  useEffect(() => {
    if (credentials) {
      setFormData({
        clientId: credentials.client_id || '',
        clientSecret: credentials.client_secret || '',
        cloudProvider: credentials.cloud_provider || 'AWS-US (West)',
        baseUrl: credentials.base_url || '',
        enabled: credentials.enabled !== false
      });
    }
  }, [credentials]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-update base URL when cloud provider changes
    if (name === 'cloudProvider') {
      const provider = cloudProviders.find(p => p.value === value);
      if (provider && provider.value !== 'custom') {
        setFormData(prev => ({
          ...prev,
          cloudProvider: value,
          baseUrl: provider.url
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCredentials({
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        cloud_provider: formData.cloudProvider,
        base_url: formData.baseUrl,
        enabled: formData.enabled
      });
      setIsEditing(false);
      setTestResult(null);
    } catch (error) {
      console.error('Failed to update credentials:', error);
    }
  };

  const handleTest = async () => {
    setTestResult(null);
    try {
      const result = await testCredentials({
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        cloud_provider: formData.cloudProvider,
        base_url: formData.baseUrl
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    }
  };

  const handleReset = () => {
    if (credentials) {
      setFormData({
        clientId: credentials.client_id || '',
        clientSecret: credentials.client_secret || '',
        cloudProvider: credentials.cloud_provider || 'AWS-US (West)',
        baseUrl: credentials.base_url || '',
        enabled: credentials.enabled !== false
      });
    }
    setIsEditing(false);
    setTestResult(null);
    clearError();
  };

  if (loading) {
    return (
      <div className="credentials-manager loading">
        <div className="loading-spinner"></div>
        <p>Loading credentials...</p>
      </div>
    );
  }

  return (
    <div className="credentials-manager">
      <div className="manager-header">
        <h3>Sigma API Credentials</h3>
        <p className="description">
          Configure your Sigma API credentials for testing and production use.
          Changes are applied immediately and stored in the current session.
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{typeof error === 'string' ? error : 'An error occurred'}</p>
          <button onClick={clearError} className="clear-error-button">
            ✕
          </button>
        </div>
      )}

      <div className="credentials-display">
        <div className="credentials-info">
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`status ${formData.enabled ? 'enabled' : 'disabled'}`}>
              {formData.enabled ? '🟢 Enabled' : '🔴 Disabled'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Cloud Provider:</span>
            <span className="value">{formData.cloudProvider}</span>
          </div>
          <div className="info-row">
            <span className="label">Base URL:</span>
            <span className="value">{formData.baseUrl || 'Auto-detected'}</span>
          </div>
          <div className="info-row">
            <span className="label">Client ID:</span>
            <span className="value">
              {formData.clientId ? `${formData.clientId.substring(0, 8)}...` : 'Not configured'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Client Secret:</span>
            <span className="value">
              {formData.clientSecret ? '••••••••' : 'Not configured'}
            </span>
          </div>
        </div>

        <div className="credentials-actions">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Edit Credentials
              </button>
              <button
                onClick={handleTest}
                disabled={!formData.clientId || !formData.clientSecret}
                className="test-button"
              >
                Test Connection
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                disabled={!formData.clientId || !formData.clientSecret}
                className="save-button"
              >
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="cancel-button"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <form className="credentials-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>Basic Configuration</h4>
            
            <div className="form-group">
              <label htmlFor="enabled">
                <input
                  id="enabled"
                  name="enabled"
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={handleInputChange}
                />
                Enable Sigma API
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="cloudProvider">Cloud Provider:</label>
              <select
                id="cloudProvider"
                name="cloudProvider"
                value={formData.cloudProvider}
                onChange={handleInputChange}
                className="form-select"
              >
                {cloudProviders.map(provider => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.cloudProvider === 'custom' && (
              <div className="form-group">
                <label htmlFor="baseUrl">Custom Base URL:</label>
                <input
                  id="baseUrl"
                  name="baseUrl"
                  type="url"
                  value={formData.baseUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-custom-sigma-api.com"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="clientId">Client ID:</label>
              <input
                id="clientId"
                name="clientId"
                type="text"
                value={formData.clientId}
                onChange={handleInputChange}
                placeholder="Enter your Sigma API client ID"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientSecret">Client Secret:</label>
              <input
                id="clientSecret"
                name="clientSecret"
                type="password"
                value={formData.clientSecret}
                onChange={handleInputChange}
                placeholder="Enter your Sigma API client secret"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={!formData.clientId || !formData.clientSecret}
              className="submit-button"
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h4>Connection Test Result</h4>
          {testResult.success ? (
            <div className="success-content">
              <p>✅ Connection successful!</p>
              {testResult.user && (
                <div className="user-info">
                  <p><strong>User:</strong> {testResult.user.name || testResult.user.email}</p>
                  <p><strong>Email:</strong> {testResult.user.email}</p>
                  {testResult.user.id && <p><strong>ID:</strong> {testResult.user.id}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="error-content">
              <p>❌ Connection failed</p>
              <p><strong>Error:</strong> {testResult.error ? (typeof testResult.error === 'string' ? testResult.error : 'Unknown error') : 'Connection failed'}</p>
            </div>
          )}
          <button
            onClick={() => setTestResult(null)}
            className="close-result-button"
          >
            Close
          </button>
        </div>
      )}

      <div className="credentials-help">
        <h4>How to Get Sigma API Credentials</h4>
        <div className="help-content">
          <ol>
            <li>
              <strong>Navigate to Sigma:</strong> Go to your Sigma instance and log in
            </li>
            <li>
              <strong>Access Admin Panel:</strong> Go to Admin → API Keys
            </li>
            <li>
              <strong>Create New API Key:</strong> Click "Create API Key" and give it a name
            </li>
            <li>
              <strong>Copy Credentials:</strong> Copy the Client ID and Client Secret
            </li>
            <li>
              <strong>Set Permissions:</strong> Ensure the API key has appropriate permissions for your use case
            </li>
          </ol>
          
          <div className="security-note">
            <p><strong>Security Note:</strong></p>
            <ul>
              <li>Credentials are stored in memory and cleared when the page is refreshed</li>
              <li>Never commit API credentials to version control</li>
              <li>Use environment variables for production deployments</li>
              <li>Rotate API keys regularly for security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigmaCredentialsManager; 