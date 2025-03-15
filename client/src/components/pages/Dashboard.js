import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress 
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
import { fetchUserSegments } from '../../services/api';

const Dashboard = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const loadSegments = async () => {
      try {
        const data = await fetchUserSegments();
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

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading Dashboard...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography color="error">
          Error loading dashboard data: {error.message}
        </Typography>
      </Container>
    );
  }

  // Prepare data for charts
  const segmentChartData = segments.map(segment => ({
    name: segment.name,
    userCount: segment.userCount,
    avgLTV: segment.avgLTV,
    avgChurnRisk: segment.avgChurnRisk * 100
  }));

  // Calculate key metrics
  const totalUsers = segments.reduce((sum, segment) => sum + segment.userCount, 0);
  const totalLTV = segments.reduce((sum, segment) => sum + (segment.userCount * segment.avgLTV), 0);
  const averageLTV = totalLTV / totalUsers;
  const averageChurnRisk = segments.reduce((sum, segment) => sum + segment.avgChurnRisk, 0) / segments.length * 100;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Executive Dashboard
      </Typography>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Lifetime Value</Typography>
              <Typography variant="h4">${averageLTV.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Churn Risk</Typography>
              <Typography variant="h4" color={averageChurnRisk > 50 ? 'error' : 'text.primary'}>
                {averageChurnRisk.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visualization Grid */}
      <Grid container spacing={3}>
        {/* User Segments Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">User Segments Distribution</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={segmentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="userCount"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {segmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} Users`, 
                      `Avg LTV: $${props.payload.avgLTV.toFixed(2)}`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Segment Metrics Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Segment Performance</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={segmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Metrics', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="userCount" name="User Count" fill="#8884d8" />
                  <Bar dataKey="avgLTV" name="Avg Lifetime Value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;