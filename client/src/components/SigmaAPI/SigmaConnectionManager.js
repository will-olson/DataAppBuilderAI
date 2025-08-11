import React, { useState, useEffect } from 'react';
import { useSigmaAPI } from '../../context/SigmaAPIContext';
import './SigmaConnectionManager.css';

const SigmaConnectionManager = () => {
  const {
    connections,
    pagination,
    loading,
    fetchConnections
  } = useSigmaAPI();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    fetchConnections(currentPage, pageSize);
  }, [currentPage, pageSize, fetchConnections]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const totalPages = Math.ceil(pagination.connections.total / pageSize);

  if (loading) {
    return (
      <div className="connection-manager loading">
        <div className="loading-spinner"></div>
        <p>Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="connection-manager">
      <div className="manager-header">
        <h3>Sigma Connections</h3>
        <div className="pagination-controls">
          <label>
            Page Size:
            <select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>
        </div>
      </div>

      <div className="connections-list">
        {connections.length === 0 ? (
          <div className="no-data">
            <p>No connections found.</p>
          </div>
        ) : (
          <div className="connections-grid">
            {connections.map((connection) => (
              <div key={connection.id} className="connection-card">
                <div className="connection-header">
                  <h4>{connection.name || 'Unnamed Connection'}</h4>
                  <span className="connection-type">{connection.type || 'Unknown'}</span>
                </div>
                <div className="connection-details">
                  <p><strong>ID:</strong> {connection.id}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${connection.status || 'unknown'}`}>
                      {connection.status || 'Unknown'}
                    </span>
                  </p>
                  {connection.description && (
                    <p><strong>Description:</strong> {connection.description}</p>
                  )}
                  {connection.created_at && (
                    <p><strong>Created:</strong> {new Date(connection.created_at).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="connection-actions">
                  <button className="action-button view">View Details</button>
                  <button className="action-button test">Test Connection</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Last
          </button>
        </div>
      )}

      <div className="summary-info">
        <p>
          Showing {connections.length} of {pagination.connections.total} connections
          (Page {currentPage} of {totalPages})
        </p>
      </div>
    </div>
  );
};

export default SigmaConnectionManager; 