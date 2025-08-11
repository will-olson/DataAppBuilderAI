import React from 'react';
import { SigmaAPIProvider } from '../context/SigmaAPIContext';
import SigmaAPIDashboard from '../components/SigmaAPI/SigmaAPIDashboard';
import './SigmaAPIDemo.css';

const SigmaAPIDemo = () => {
  return (
    <div className="sigma-api-demo-page">
      <div className="demo-header">
        <h1>Sigma API Integration Demo</h1>
        <p>
          This page demonstrates the robust Sigma API integration capabilities.
          Configure your Sigma API credentials to test the full functionality.
        </p>
      </div>
      
      <SigmaAPIProvider>
        <SigmaAPIDashboard />
      </SigmaAPIProvider>
      
      <div className="demo-footer">
        <h3>Configuration Instructions</h3>
        <div className="config-steps">
          <div className="config-step">
            <h4>1. Set Environment Variables</h4>
            <pre>
{`export SIGMA_API_ENABLED=true
export SIGMA_API_CLIENT_ID=your_client_id
export SIGMA_API_CLIENT_SECRET=your_client_secret
export SIGMA_API_CLOUD_PROVIDER="AWS-US (West)"`}
            </pre>
          </div>
          
          <div className="config-step">
            <h4>2. Restart Backend Server</h4>
            <p>Restart your Flask backend to load the new configuration.</p>
          </div>
          
          <div className="config-step">
            <h4>3. Test Connection</h4>
            <p>The dashboard will automatically check the API connection status.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigmaAPIDemo; 