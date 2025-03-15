import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Grid,
  Button
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer
} from 'recharts';
import { fetchFeatureUsageAnalytics } from '../../services/api';

const FeatureUsagePage = () => {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('topFeatures');

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

  // Prepare data for charts
  const topFeaturesChartData = featureData.topFeatures.map(feature => ({
    name: feature.name,
    usage: feature.usagePercentage * 100
  }));

  const segmentFeatureUsageData = featureData.featureUsageBySegment.flatMap(segment => 
    segment.features.map(feature => ({
      segment: segment.segment,
      feature: feature.name,
      usage: feature.usagePercentage * 100
    }))
  );

  return (
    <Container>
      <Typography variant="h4">Feature Usage Analytics</Typography>
      
      {/* Chart Selection Buttons */}
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item>
          <Button 
            variant={activeChart === 'topFeatures' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('topFeatures')}
          >
            Top Features
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'segmentUsage' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('segmentUsage')}
          >
            Segment Usage
          </Button>
        </Grid>
      </Grid>

      {/* Chart Container */}
      <Card>
        <CardContent>
          {activeChart === 'topFeatures' && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topFeaturesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Usage']}
                />
                <Legend />
                <Bar dataKey="usage" fill="#8884d8">
                  {topFeaturesChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'segmentUsage' && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={segmentFeatureUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value.toFixed(2)}%`, 
                    `${props.payload.feature} in ${props.payload.segment}`
                  ]}
                />
                <Legend />
                <Bar dataKey="usage" fill="#8884d8">
                  {segmentFeatureUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FeatureUsagePage;