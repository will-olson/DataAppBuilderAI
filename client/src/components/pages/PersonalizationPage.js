import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  Psychology as PsychologyIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import ChartContainer from '../common/ChartContainer';
import MetricsCard from '../common/MetricsCard';

const PersonalizationPage = () => {
  const [activeChart, setActiveChart] = useState('content');
  
  const { 
    data: personalizationData, 
    loading, 
    error, 
    execute: fetchPersonalizationData 
  } = useApi(() => apiClient.getPersonalizationData(), { autoExecute: true });

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare data for charts
  const contentPreferencesChartData = personalizationData?.contentPreferences ? 
    personalizationData.contentPreferences.map(pref => ({
      name: pref.type || 'Unknown',
      value: pref.userCount,
      engagement: pref.avgEngagement * 100
    })) : [];

  const communicationPreferencesChartData = personalizationData?.communicationPreferences ?
    personalizationData.communicationPreferences.map(pref => ({
      name: pref.preference,
      value: pref.userCount,
      openRate: pref.avgEngagement * 100
    })) : [];

  // Calculate summary metrics
  const totalUsers = personalizationData?.contentPreferences ? 
    personalizationData.contentPreferences.reduce((sum, pref) => sum + pref.userCount, 0) : 0;
  
  const averageEngagement = personalizationData?.contentPreferences && personalizationData.contentPreferences.length > 0 ?
    personalizationData.contentPreferences.reduce((sum, pref) => sum + pref.avgEngagement, 0) / personalizationData.contentPreferences.length * 100 : 0;
  
  const averageOpenRate = personalizationData?.communicationPreferences && personalizationData.communicationPreferences.length > 0 ?
    personalizationData.communicationPreferences.reduce((sum, pref) => sum + pref.avgEngagement, 0) / personalizationData.communicationPreferences.length * 100 : 0;
  
  const topContentType = personalizationData?.contentPreferences ? 
    personalizationData.contentPreferences.reduce((max, pref) => 
      pref.avgEngagement > max.avgEngagement ? pref : max
    ) : null;

  const handleChartChange = (event, newChart) => {
    if (newChart !== null) {
      setActiveChart(newChart);
    }
  };

  const handleRefresh = () => {
    fetchPersonalizationData();
  };

  const handleDownloadChart = () => {
    // Implementation for chart download
    console.log('Downloading chart data...');
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'content':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contentPreferencesChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contentPreferencesChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'communication':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={communicationPreferencesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="openRate" fill="#82ca9d" name="Open Rate %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'engagement':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contentPreferencesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="engagement" fill="#ff7300" name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Personalization Insights
      </Typography>

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Users"
            value={totalUsers}
            subtitle="In personalization analysis"
            icon={<PsychologyIcon />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Avg Engagement"
            value={`${averageEngagement.toFixed(1)}%`}
            subtitle="Content engagement rate"
            icon={<CampaignIcon />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Avg Open Rate"
            value={`${averageOpenRate.toFixed(1)}%`}
            subtitle="Communication effectiveness"
            icon={<EmailIcon />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Top Content"
            value={topContentType?.type || 'N/A'}
            subtitle="Highest engagement type"
            icon={<NotificationsIcon />}
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
          <ToggleButton value="content" aria-label="content preferences">
            Content Preferences
          </ToggleButton>
          <ToggleButton value="communication" aria-label="communication preferences">
            Communication
          </ToggleButton>
          <ToggleButton value="engagement" aria-label="engagement">
            Engagement
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChartContainer
            title={`${activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Analysis`}
            subtitle="Personalization insights and user preferences"
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

      {/* Content Preferences Details */}
      {personalizationData?.contentPreferences && personalizationData.contentPreferences.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Content Preferences by Type
          </Typography>
          <Grid container spacing={2}>
            {personalizationData.contentPreferences.map((pref, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MetricsCard
                  title={pref.type}
                  value={pref.userCount}
                  subtitle={`Engagement: ${(pref.avgEngagement * 100).toFixed(1)}%`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Communication Preferences Details */}
      {personalizationData?.communicationPreferences && personalizationData.communicationPreferences.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Communication Channel Performance
          </Typography>
          <Grid container spacing={2}>
            {personalizationData.communicationPreferences.map((pref, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MetricsCard
                  title={pref.preference}
                  value={pref.userCount}
                  subtitle={`Open Rate: ${(pref.avgEngagement * 100).toFixed(1)}%`}
                  color="info"
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

export default PersonalizationPage;