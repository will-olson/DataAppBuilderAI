// FeatureUsagePage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent,
  LinearProgress
} from '@mui/material';
import { fetchFeatureUsageAnalytics } from '../../services/api';

const FeatureUsagePage = () => {
    const [featureData, setFeatureData] = useState({
      topFeatures: [],
      featureEngagementBySegment: []
    });
  
    useEffect(() => {
      const fetchFeatureUsage = async () => {
        try {
          const data = await fetchFeatureUsageAnalytics();
          setFeatureData(data);
        } catch (error) {
          console.error('Feature usage fetch error', error);
        }
      };
  
      fetchFeatureUsage();
    }, []);
  
    return (
      <Container>
        <Typography variant="h4">Feature Usage Analytics</Typography>
        
        <Card>
          <CardContent>
            <Typography variant="h5">Top Features</Typography>
            {featureData.topFeatures.map(feature => (
              <LinearProgress 
                variant="determinate" 
                value={feature.usagePercentage * 100}
                label={feature.name}
              />
            ))}
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5">Feature Engagement by Segment</Typography>
            {featureData.featureEngagementBySegment.map(segment => (
              <Typography>
                {segment.name}: {(segment.engagementRate * 100).toFixed(2)}%
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Container>
    );
  };

  export default FeatureUsagePage