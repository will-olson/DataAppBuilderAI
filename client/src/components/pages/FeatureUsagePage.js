import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
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
  Cell,
  ResponsiveContainer
} from 'recharts';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ChartContainer from '../common/ChartContainer';

const FeatureUsagePage = () => {
  const [activeChart, setActiveChart] = useState('topFeatures');

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Use the useApi hook for data fetching
  const { data: featureData, loading, error, execute: fetchFeatureData } = useApi(() => apiClient.getFeatureUsage(), { autoExecute: true });

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading Feature Usage..." />;
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
  if (!featureData || !Array.isArray(featureData)) {
    return (
      <Container>
        <Typography>No feature usage data available</Typography>
      </Container>
    );
  }

  // Prepare data for charts
  const topFeaturesChartData = featureData.map(feature => ({
    name: feature.feature,
    usage: (feature.userCount / featureData.reduce((sum, f) => sum + f.userCount, 0)) * 100
  }));

  const segmentFeatureUsageData = featureData.map(feature => ({
    segment: 'All Users',
    feature: feature.feature,
    usage: (feature.userCount / featureData.reduce((sum, f) => sum + f.userCount, 0)) * 100
  }));

  const engagementByFeatureData = featureData.map(feature => ({
    feature: feature.feature,
    engagement: feature.avgEngagement * 100,
    ltv: feature.avgLTV
  }));

  const handleRefresh = () => {
    fetchFeatureData();
  };

  const renderChart = () => {
    if (activeChart === 'topFeatures') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topFeaturesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#8884d8">
              {topFeaturesChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeChart === 'segmentUsage') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={segmentFeatureUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#8884d8">
              {segmentFeatureUsageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

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
      <ChartContainer 
        title={`${activeChart === 'topFeatures' ? 'Top Features' : 'Segment Feature Usage'} Analysis`}
        subtitle="Feature usage analytics and insights"
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        height={500}
      >
        {renderChart()}
      </ChartContainer>
    </Container>
  );
};

export default FeatureUsagePage;