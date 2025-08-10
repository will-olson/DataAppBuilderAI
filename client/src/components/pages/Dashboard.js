import React from 'react';
import { 
  Container, 
  Typography, 
  Grid
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
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import MetricsCard from '../common/MetricsCard';
import ChartContainer from '../common/ChartContainer';

const Dashboard = () => {
  const { 
    data: segments, 
    loading, 
    error, 
    execute: fetchSegments 
  } = useApi(() => apiClient.getUserSegments(), { autoExecute: true });

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate key metrics
  const totalUsers = segments ? segments.reduce((sum, segment) => sum + segment.userCount, 0) : 0;
  const totalLTV = segments ? segments.reduce((sum, segment) => sum + (segment.userCount * segment.avgLTV), 0) : 0;
  const averageLTV = totalUsers > 0 ? totalLTV / totalUsers : 0;
  const averageChurnRisk = segments && segments.length > 0 
    ? segments.reduce((sum, segment) => sum + segment.avgChurnRisk, 0) / segments.length * 100 
    : 0;

  // Prepare data for charts
  const segmentChartData = segments ? segments.map(segment => ({
    name: segment.name,
    userCount: segment.userCount,
    avgLTV: segment.avgLTV,
    avgChurnRisk: segment.avgChurnRisk * 100
  })) : [];

  const handleRefresh = () => {
    fetchSegments();
  };

  const handleDownloadChart = () => {
    // Implementation for chart download
    console.log('Downloading chart data...');
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Executive Dashboard
      </Typography>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Users"
            value={totalUsers}
            subtitle="Active users across all segments"
            icon={<PeopleIcon />}
            color="primary"
            trend="up"
            trendValue="+12%"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total LTV"
            value={`$${totalLTV.toLocaleString()}`}
            subtitle="Combined lifetime value"
            icon={<MoneyIcon />}
            color="success"
            trend="up"
            trendValue="+8%"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Average LTV"
            value={`$${averageLTV.toFixed(2)}`}
            subtitle="Per user lifetime value"
            icon={<TrendingIcon />}
            color="info"
            trend="up"
            trendValue="+5%"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Churn Risk"
            value={`${averageChurnRisk.toFixed(1)}%`}
            subtitle="Average churn risk"
            icon={<WarningIcon />}
            color="warning"
            trend="down"
            trendValue="-3%"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* User Segments Distribution */}
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="User Segments Distribution"
            subtitle="Breakdown of users by engagement level"
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onDownload={handleDownloadChart}
            height={400}
          >
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        {/* Average LTV by Segment */}
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Average LTV by Segment"
            subtitle="Lifetime value distribution across segments"
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onDownload={handleDownloadChart}
            height={400}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="avgLTV" fill="#8884d8" name="Average LTV" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        {/* Churn Risk by Segment */}
        <Grid item xs={12}>
          <ChartContainer
            title="Churn Risk by Segment"
            subtitle="Churn risk analysis across user segments"
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onDownload={handleDownloadChart}
            height={400}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={segmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgChurnRisk" 
                  stroke="#ff7300" 
                  name="Churn Risk %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;