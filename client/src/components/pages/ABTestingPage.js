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
  ScatterChart, 
  XAxis, 
  YAxis, 
  Scatter,
  Tooltip,
  Legend
} from 'recharts';

import { fetchAIInsights } from '../../services/api';

const ABTestingPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runABTestAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAIInsights.getABTestingAnalysis();
      
      console.log('Received AB Testing Insights:', data);
      
      // Validate data structure
      if (!data.insights) {
        throw new Error('Invalid AB testing data structure');
      }
      
      setTestResults(data);
    } catch (error) {
      console.error('AB Testing Insights Generation Error:', error);
      
      // Provide user-friendly error message
      setError(
        error.message.includes('fetch')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to run AB testing analysis. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    runABTestAnalysis();
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
            Running A/B Testing Analysis...
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
            <Button color="inherit" size="small" onClick={runABTestAnalysis}>
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

  // No results state
  if (!testResults) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No A/B testing results available. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        A/B Testing Predictive Modeling
      </Typography>
      
      {/* Experimental Design Insights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversion Probability Modeling
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <XAxis 
                    type="number" 
                    dataKey="feature1" 
                    name="Feature 1" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="conversion_probability" 
                    name="Conversion Probability" 
                  />
                  <Scatter 
                    data={testResults.experimental_data || []} 
                    fill="#8884d8" 
                    name="Experimental Data"
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistical Significance
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Confidence Level" 
                    secondary={testResults.confidence_level 
                      ? `${testResults.confidence_level}%` 
                      : 'N/A'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Recommended Variant" 
                    secondary={testResults.recommended_variant || 'No recommendation'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Insights */}
      {testResults.insights && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Detailed A/B Testing Insights
            </Typography>
            <Typography variant="body1" component="pre" sx={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit' 
            }}>
              {testResults.insights}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={runABTestAnalysis}
          disabled={loading}
        >
          Regenerate A/B Test Analysis
        </Button>
      </Box>
    </Container>
  );
};

export default ABTestingPage;