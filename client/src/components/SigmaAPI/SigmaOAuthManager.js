import React, { useState } from 'react';
import { useSigmaAPI } from '../../context/SigmaAPIContext';
import './SigmaOAuthManager.css';

const SigmaOAuthManager = () => {
  const {
    oauthOverrides,
    rejectDefaultTokens,
    addOAuthOverride,
    removeOAuthOverride,
    clearOAuthOverrides,
    setRejectDefaultTokens
  } = useSigmaAPI();

  const [newConnectionId, setNewConnectionId] = useState('');
  const [newToken, setNewToken] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddOverride = () => {
    if (newConnectionId.trim() && newToken.trim()) {
      addOAuthOverride(newConnectionId.trim(), newToken.trim());
      setNewConnectionId('');
      setNewToken('');
      setShowAddForm(false);
    }
  };

  const handleRemoveOverride = (connectionId) => {
    removeOAuthOverride(connectionId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all OAuth overrides?')) {
      clearOAuthOverrides();
    }
  };

  return (
    <div className="oauth-manager">
      <div className="manager-header">
        <h3>OAuth Override Tokens</h3>
        <p className="description">
          Manage OAuth override tokens for fine-grained access control to cloud data warehouse data.
        </p>
      </div>

      <div className="oauth-config">
        <div className="config-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rejectDefaultTokens}
              onChange={(e) => setRejectDefaultTokens(e.target.checked)}
            />
            <span className="checkmark"></span>
            Reject default OAuth tokens
          </label>
          <p className="help-text">
            When enabled, exports will fail if override tokens aren't provided for all connections.
            When disabled, the API user's OAuth token will be used as fallback.
          </p>
        </div>
      </div>

      <div className="oauth-overrides">
        <div className="overrides-header">
          <h4>Current Overrides ({oauthOverrides.length})</h4>
          <div className="header-actions">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-button"
            >
              {showAddForm ? 'Cancel' : 'Add Override'}
            </button>
            {oauthOverrides.length > 0 && (
              <button
                onClick={handleClearAll}
                className="clear-button"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="add-override-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="connectionId">Connection ID:</label>
                <input
                  id="connectionId"
                  type="text"
                  value={newConnectionId}
                  onChange={(e) => setNewConnectionId(e.target.value)}
                  placeholder="Enter connection ID"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="token">OAuth Token:</label>
                <input
                  id="token"
                  type="password"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  placeholder="Enter OAuth token"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <button
                  onClick={handleAddOverride}
                  disabled={!newConnectionId.trim() || !newToken.trim()}
                  className="submit-button"
                >
                  Add Override
                </button>
              </div>
            </div>
          </div>
        )}

        {oauthOverrides.length === 0 ? (
          <div className="no-overrides">
            <p>No OAuth overrides configured.</p>
            <p>Add overrides to enable fine-grained access control for specific connections.</p>
          </div>
        ) : (
          <div className="overrides-list">
            {oauthOverrides.map((override, index) => (
              <div key={index} className="override-item">
                <div className="override-info">
                  <div className="override-details">
                    <span className="connection-id">
                      <strong>Connection ID:</strong> {override.conn_id}
                    </span>
                    <span className="token-preview">
                      <strong>Token:</strong> {override.token.substring(0, 8)}...
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveOverride(override.conn_id)}
                    className="remove-button"
                    title="Remove this override"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="oauth-info">
        <h4>About OAuth Override Tokens</h4>
        <div className="info-content">
          <p>
            <strong>Use Cases:</strong>
          </p>
          <ul>
            <li><strong>Permission Separation:</strong> Manage workbook access and CDW access separately</li>
            <li><strong>Constrained Access:</strong> Limit API access while maintaining data permissions</li>
            <li><strong>Data Export:</strong> Export workbooks using connections the API user doesn't have access to</li>
          </ul>
          
          <p>
            <strong>Important Notes:</strong>
          </p>
          <ul>
            <li>OAuth override tokens only affect CDW permissions, not Sigma user permissions</li>
            <li>Tokens are stored in memory and cleared when the page is refreshed</li>
            <li>Use the "Reject default tokens" option for strict permission control</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SigmaOAuthManager; 