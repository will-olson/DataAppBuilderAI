// src/components/segments/SegmentationWorkspace.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const SegmentationWorkspace = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSegments = async () => {
      try {
        const data = await apiClient.getUserSegments();
        if (data) {
          setSegments(data);
          setLoading(false);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadSegments();
  }, []);

  if (loading) return <div>Loading segments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Segments</h2>
      {segments.map((segment, index) => (
        <div key={index}>
          <h3>{segment.name}</h3>
          <p>User Count: {segment.userCount}</p>
          <p>Average LTV: ${segment.avgLTV.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default SegmentationWorkspace;