import React, { useState, useEffect } from 'react';
import { useSigmaAPI } from '../../context/SigmaAPIContext';
import SigmaConnectionManager from './SigmaConnectionManager';
import SigmaWorkbookManager from './SigmaWorkbookManager';
import SigmaOAuthManager from './SigmaOAuthManager';
import SigmaWorkspaceManager from './SigmaWorkspaceManager';
import SigmaDatasetManager from './SigmaDatasetManager';
import SigmaCredentialsManager from './SigmaCredentialsManager';
import './SigmaAPIDashboard.css';

const SigmaAPIDashboard = () => {
  const {
    apiStatus,
    connectionInfo,
    loading,
    error,
    checkAPIStatus
  } = useSigmaAPI();

  const [activeTab, setActiveTab] = useState('credentials');

  useEffect(() => {
    checkAPIStatus();
  }, [checkAPIStatus]);

  if (loading) {
    return (
      <div className="sigma-api-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading Sigma API status...</p>
      </div>
    );
  }

  if (apiStatus === 'error') {
    return (
      <div className="sigma-api-dashboard error">
        <h3>Sigma API Connection Error</h3>
        <p>{error ? (typeof error === 'string' ? error : 'Unknown error occurred') : 'Connection failed'}</p>
        <button onClick={checkAPIStatus} className="retry-button">
          Retry Connection
        </button>
      </div>
    );
  }

  if (apiStatus === 'disabled') {
    return (
      <div className="sigma-api-dashboard disabled">
        <h3>Sigma API Not Enabled</h3>
        <p>{error ? (typeof error === 'string' ? error : 'API is disabled') : 'API is not enabled'}</p>
        <p>Please check your configuration and ensure the Sigma API is enabled.</p>
        <button onClick={checkAPIStatus} className="retry-button">
          Check Status
        </button>
      </div>
    );
  }

  if (apiStatus !== 'connected') {
    return (
      <div className="sigma-api-dashboard disconnected">
        <h3>Sigma API Not Connected</h3>
        <p>Please check your configuration and ensure the Sigma API is enabled.</p>
        <button onClick={checkAPIStatus} className="retry-button">
          Check Status
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'credentials', label: 'Credentials', icon: '🔑' },
    { id: 'connections', label: 'Connections', icon: '🔌' },
    { id: 'workbooks', label: 'Workbooks', icon: '📊' },
    { id: 'workspaces', label: 'Workspaces', icon: '🏢' },
    { id: 'datasets', label: 'Datasets', icon: '📋' },
    { id: 'oauth', label: 'OAuth Overrides', icon: '🔐' }
  ];

  return (
    <div className="sigma-api-dashboard">
      <div className="dashboard-header">
        <h2>Sigma API Dashboard</h2>
        <div className="connection-info">
          <span className={`status ${apiStatus}`}>
            {apiStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span className="provider">{connectionInfo?.cloud_provider}</span>
          <span className="base-url">{connectionInfo?.base_url}</span>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'credentials' && <SigmaCredentialsManager />}
        {activeTab === 'connections' && <SigmaConnectionManager />}
        {activeTab === 'workbooks' && <SigmaWorkbookManager />}
        {activeTab === 'workspaces' && <SigmaWorkspaceManager />}
        {activeTab === 'datasets' && <SigmaDatasetManager />}
        {activeTab === 'oauth' && <SigmaOAuthManager />}
      </div>
    </div>
  );
};

export default SigmaAPIDashboard; 