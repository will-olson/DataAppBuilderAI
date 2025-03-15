import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  CircularProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { fetchUserJourneyData } from '../../services/api';

const UserJourneyPage = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('userCount');

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const loadUserJourneyData = async () => {
      try {
        const data = await fetchUserJourneyData();
        if (data) {
          setJourneyData(data);
          setLoading(false);
        } else {
          throw new Error('No user journey data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserJourneyData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading User Journey Data...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography color="error">
          Error loading user journey data: {error.message}
        </Typography>
      </Container>
    );
  }

  // Prepare data for charts
  const journeyChartData = journeyData.map(stage => ({
    name: stage.stage,
    userCount: stage.userCount,
    avgLTV: stage.avgLTV,
    churnRisk: stage.avgChurnRisk * 100
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Journey Stages
      </Typography>

      {/* Chart Selection Buttons */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Button 
            variant={activeChart === 'userCount' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('userCount')}
          >
            User Count
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'ltv' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('ltv')}
          >
            Lifetime Value
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'churnRisk' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('churnRisk')}
          >
            Churn Risk
          </Button>
        </Grid>
      </Grid>

      {/* Chart Container */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {activeChart === 'userCount' && 'User Count by Stage'}
                {activeChart === 'ltv' && 'Lifetime Value by Stage'}
                {activeChart === 'churnRisk' && 'Churn Risk by Stage'}
              </Typography>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={journeyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: activeChart === 'userCount' ? 'Number of Users' : 
                             activeChart === 'ltv' ? 'Lifetime Value ($)' : 
                             'Churn Risk (%)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      activeChart === 'userCount' ? value : 
                      activeChart === 'ltv' ? `$${value.toFixed(2)}` : 
                      `${value.toFixed(2)}%`,
                      name
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey={
                      activeChart === 'userCount' ? 'userCount' : 
                      activeChart === 'ltv' ? 'avgLTV' : 
                      'churnRisk'
                    } 
                    fill="#8884d8"
                  >
                    {journeyChartData.map((entry, index) => (
                      <Bar 
                        key={`bar-${index}`} 
                        dataKey={
                          activeChart === 'userCount' ? 'userCount' : 
                          activeChart === 'ltv' ? 'avgLTV' : 
                          'churnRisk'
                        } 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey={
                      activeChart === 'userCount' ? 'userCount' : 
                      activeChart === 'ltv' ? 'avgLTV' : 
                      'churnRisk'
                    }
                    stroke="#ff7300"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Stage Details
              </Typography>
              
              {journeyData.map((stage, index) => (
                <Grid 
                  container 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 1, 
                    borderRadius: 1,
                    backgroundColor: index % 2 ? 'action.hover' : 'transparent'
                  }}
                >
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">{stage.stage}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">
                      {stage.userCount} Users
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">
                      ${stage.avgLTV.toFixed(2)} Avg LTV
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserJourneyPage;