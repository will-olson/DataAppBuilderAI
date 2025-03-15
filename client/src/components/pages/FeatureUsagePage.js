import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress
} from '@mui/material';
import { fetchFeatureUsageAnalytics } from '../../services/api';

const FeatureUsagePage = () => {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        console.log('Fetching feature usage data');
        setLoading(true);
        
        const data = await fetchFeatureUsageAnalytics();
        
        console.log('Received feature usage data:', data);
        
        // Validate data structure
        if (!data) {
          throw new Error('No data received');
        }
        
        // Ensure both keys exist with default empty arrays
        const processedData = {
          featureUsageBySegment: data.featureUsageBySegment || [],
          topFeatures: data.topFeatures || []
        };
        
        setFeatureData(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Feature usage fetch error', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchFeatureData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading Feature Usage...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography color="error">
          Error loading feature usage data: {error.message}
        </Typography>
      </Container>
    );
  }

  // Ensure featureData exists and has expected properties
  if (!featureData || 
      !Array.isArray(featureData.featureUsageBySegment) || 
      !Array.isArray(featureData.topFeatures)) {
    return (
      <Container>
        <Typography>No feature usage data available</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4">Feature Usage Analytics</Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h5">Top Features</Typography>
          {featureData.topFeatures.length > 0 ? (
            featureData.topFeatures.map((feature, index) => (
              <Typography key={index}>
                {feature.name}: {(feature.usagePercentage * 100).toFixed(2)}%
              </Typography>
            ))
          ) : (
            <Typography>No top features data available</Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5">Feature Usage by Segment</Typography>
          {featureData.featureUsageBySegment.length > 0 ? (
            featureData.featureUsageBySegment.map((segment, segmentIndex) => (
              <div key={segmentIndex}>
                <Typography variant="h6">{segment.segment}</Typography>
                {segment.features.map((feature, featureIndex) => (
                  <Typography key={featureIndex}>
                    {feature.name}: {(feature.usagePercentage * 100).toFixed(2)}%
                  </Typography>
                ))}
              </div>
            ))
          ) : (
            <Typography>No segment feature usage data available</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FeatureUsagePage;