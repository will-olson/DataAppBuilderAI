import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
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
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import ChartContainer from '../common/ChartContainer';
import MetricsCard from '../common/MetricsCard';
import LoadingSpinner from '../common/LoadingSpinner';

const Segmentation = () => {
  const [activeChart, setActiveChart] = useState('userCount');
  
  // Use the useApi hook for data fetching
  const { 
    data: segments, 
    loading, 
    error, 
    execute: fetchSegments 
  } = useApi(() => apiClient.getUserSegments(), { autoExecute: true });

  // Handle errors gracefully
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading segmentation data: {error.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchSegments}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading segmentation data..." />;
  }

  // Chart color palette - used for dynamic color assignment
  const getSegmentColor = (segmentName) => {
    const colorMap = {
      'High Engagement': '#4caf50',  // Green
      'Medium Engagement': '#ff9800', // Orange
      'Low Engagement': '#f44336'     // Red
    };
    return colorMap[segmentName] || '#2196f3'; // Default blue
  };

  // Prepare data for charts
  const segmentChartData = segments ? segments.map(segment => ({
    name: segment.name,
    userCount: segment.userCount,
    avgLTV: segment.avgLTV,
    avgChurnRisk: segment.avgChurnRisk * 100
  })) : [];

  // Calculate summary metrics
  const totalUsers = segments ? segments.reduce((sum, segment) => sum + segment.userCount, 0) : 0;
  const highEngagementUsers = segments ? segments.find(s => s.name === 'High Engagement')?.userCount || 0 : 0;
  const highEngagementPercentage = totalUsers > 0 ? (highEngagementUsers / totalUsers) * 100 : 0;
  const averageLTV = segments && segments.length > 0 
    ? segments.reduce((sum, segment) => sum + (segment.userCount * segment.avgLTV), 0) / totalUsers 
    : 0;

  const handleChartChange = (event, newChart) => {
    if (newChart !== null) {
      setActiveChart(newChart);
    }
  };

  const handleRefresh = () => {
    fetchSegments();
  };

  const handleDownloadChart = () => {
    // Implementation for chart download
    console.log('Downloading chart data...');
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'userCount':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="userCount" fill="#8884d8" name="User Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'avgLTV':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="avgLTV" fill="#82ca9d" name="Average LTV" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'avgChurnRisk':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="avgChurnRisk" fill="#ff7300" name="Churn Risk %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="userCount"
              >
                {segmentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSegmentColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'combined':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="userCount" fill="#8884d8" name="User Count" />
              <Line yAxisId="right" type="monotone" dataKey="avgLTV" stroke="#82ca9d" name="Average LTV" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        User Segmentation Analysis
      </Typography>

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Users"
            value={totalUsers}
            subtitle="Across all segments"
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="High Engagement"
            value={`${highEngagementPercentage.toFixed(1)}%`}
            subtitle="Of total users"
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Average LTV"
            value={`$${averageLTV.toFixed(2)}`}
            subtitle="Per user"
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Segments"
            value={segments ? segments.length : 0}
            subtitle="Active segments"
            color="secondary"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Chart Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={activeChart}
          exclusive
          onChange={handleChartChange}
          aria-label="chart type"
          size="small"
        >
          <ToggleButton value="userCount" aria-label="user count">
            User Count
          </ToggleButton>
          <ToggleButton value="avgLTV" aria-label="average ltv">
            Average LTV
          </ToggleButton>
          <ToggleButton value="avgChurnRisk" aria-label="churn risk">
            Churn Risk
          </ToggleButton>
          <ToggleButton value="distribution" aria-label="distribution">
            Distribution
          </ToggleButton>
          <ToggleButton value="combined" aria-label="combined">
            Combined
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChartContainer
            title={`${activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Analysis`}
            subtitle="User segmentation insights and trends"
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onDownload={handleDownloadChart}
            height={500}
          >
            {renderChart()}
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Segment Details Table */}
      {segments && segments.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Segment Details
          </Typography>
          <Grid container spacing={2}>
            {segments.map((segment, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MetricsCard
                  title={segment.name}
                  value={segment.userCount}
                  subtitle={`LTV: $${segment.avgLTV.toFixed(2)} | Risk: ${(segment.avgChurnRisk * 100).toFixed(1)}%`}
                  color={segment.name === 'High Engagement' ? 'success' : 
                         segment.name === 'Medium Engagement' ? 'warning' : 'error'}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Segmentation;