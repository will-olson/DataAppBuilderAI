// src/pages/Segmentation.js
import React, { useState, useEffect } from 'react';
import { 
  fetchUserSegments 
} from '../../services/api';

// Optional: If you want to use Material-UI for styling
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress 
} from '@mui/material';

const Segmentation = () => {
  // State management for segments
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch segments on component mount
  useEffect(() => {
    const loadSegments = async () => {
      try {
        setLoading(true);
        const data = await fetchUserSegments();
        
        // Validate and process data
        if (Array.isArray(data)) {
          setSegments(data);
        } else {
          throw new Error('Invalid data format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching segments:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadSegments();
  }, []);

  // Color mapping for segments
  const getSegmentColor = (segmentName) => {
    const colorMap = {
      'High Engagement': '#4caf50',  // Green
      'Medium Engagement': '#ff9800', // Orange
      'Low Engagement': '#f44336'     // Red
    };
    return colorMap[segmentName] || '#2196f3'; // Default blue
  };

  // Render loading state
  if (loading) {
    return (
      <Container>
        <Typography variant="h4">Loading Segments...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <Typography variant="h4" color="error">
          Error Loading Segments
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Segments Analysis
      </Typography>

      <Grid container spacing={3}>
        {segments.map((segment, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderLeft: `5px solid ${getSegmentColor(segment.name)}` 
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {segment.name} Segment
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  User Count: {segment.userCount}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Average Lifetime Value: ${segment.avgLTV.toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Churn Risk: {(segment.avgChurnRisk * 100).toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Optional: Segment Insights Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Segment Insights</Typography>
          <Typography variant="body2">
            {segments.length > 0 
              ? `We have identified ${segments.length} distinct user segments with varying engagement levels.`
              : 'No segments found.'}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Segmentation;