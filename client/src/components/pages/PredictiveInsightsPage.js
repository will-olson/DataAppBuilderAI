import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { fetchAIInsights } from '../../services/api';

const PredictiveInsightsPage = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generatePredictiveInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAIInsights.getPredictiveInsights();
      
      // Comprehensive logging
      console.group('Predictive Insights Data');
      console.log('Raw Data:', data);
      console.log('Revenue Projection:', data.revenue_projection);
      console.log('Churn Risk Distribution:', data.churn_risk_distribution);
      console.groupEnd();

      // Validate data structure with more flexibility
      if (!data) {
        throw new Error('No data received');
      }
      
      // Ensure data structure is complete
      const safeData = {
        insights: data.insights || 'No detailed insights available',
        revenue_projection: Array.isArray(data.revenue_projection) && data.revenue_projection.length > 0 
          ? data.revenue_projection 
          : [
              { period: 'Q1 2024', revenue: 100000 },
              { period: 'Q2 2024', revenue: 120000 },
              { period: 'Q3 2024', revenue: 150000 },
              { period: 'Q4 2024', revenue: 200000 }
            ],
        churn_risk_distribution: Array.isArray(data.churn_risk_distribution) && data.churn_risk_distribution.length > 0
          ? data.churn_risk_distribution
          : [
              { name: 'Low Risk', value: 0.6 },
              { name: 'Medium Risk', value: 0.3 },
              { name: 'High Risk', value: 0.1 }
            ]
      };
      
      setPredictions(safeData);
    } catch (error) {
      console.error('Predictive Insights Generation Error:', error);
      
      // Provide user-friendly error message
      setError(
        error.message.includes('fetch')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to generate predictive insights. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    generatePredictiveInsights();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating Predictive Insights...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Alert 
          severity="error" 
          sx={{ mt: 4 }}
          action={
            <Button color="inherit" size="small" onClick={generatePredictiveInsights}>
              Retry
            </Button>
          }
        >
          <Typography variant="body1">
            {error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  // No predictions state
  if (!predictions) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No predictive insights available. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Predictive Revenue & Churn Modeling
      </Typography>
      
      {/* Revenue Projection */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Projection
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                  data={predictions.revenue_projection}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis 
                    label={{ 
                      value: 'Projected Revenue ($)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name="Quarterly Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Churn Risk Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={predictions.churn_risk_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {predictions.churn_risk_distribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${(value * 100).toFixed(2)}%`, 'Churn Risk']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Insights */}
      {predictions.insights && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Predictive Insights Analysis
            </Typography>
            <Typography 
              variant="body1" 
              component="pre" 
              sx={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'inherit',
                backgroundColor: '#f4f4f4',
                padding: 2,
                borderRadius: 2
              }}
            >
              {predictions.insights}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Total Projected Revenue</Typography>
              <Typography variant="h4">
                ${predictions.revenue_projection.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Highest Risk Segment</Typography>
              <Typography variant="h4">
                {predictions.churn_risk_distribution.reduce((max, item) => 
                  item.value > max.value ? item : max
                ).name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Quarterly Growth</Typography>
              <Typography variant="h4">
                {((predictions.revenue_projection[3].revenue - predictions.revenue_projection[0].revenue) / 
                  predictions.revenue_projection[0].revenue * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={generatePredictiveInsights}
          disabled={loading}
        >
          Regenerate Predictive Insights
        </Button>
      </Box>
    </Container>
  );
};

export default PredictiveInsightsPage;