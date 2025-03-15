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

// Import the correct service method
import { fetchAIInsights } from '../../services/api';

const ABTestingPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runABTestAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching AB Testing Analysis...');
      
      // Use the correct service method
      const data = await fetchAIInsights.getABTestingAnalysis();
      
      console.log('AB Testing Analysis Results:', data);
      
      // Validate data structure
      if (!data || !data.insights) {
        throw new Error('Invalid or incomplete AB testing data');
      }
      
      // Parse insights if they're in a string format
      const parsedInsights = typeof data.insights === 'string' 
        ? JSON.parse(data.insights) 
        : data.insights;
      
      setTestResults(parsedInsights);
    } catch (error) {
      console.error('Detailed AB Testing Analysis Error:', {
        message: error.message,
        stack: error.stack
      });
      
      // Provide more informative error messages
      const errorMessage = 
        error.message.includes('fetch') 
          ? 'Network error. Please check your connection.' 
          : error.message || 'Failed to run AB testing analysis. Please try again.';
      
      setError(errorMessage);
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

  // No data state
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
      <Grid container spacing={3}>
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
                {testResults.variant_performance && (
                  <ListItem>
                    <ListItemText 
                      primary="Variant Performance" 
                      secondary={JSON.stringify(testResults.variant_performance, null, 2)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Insights */}
      {testResults.insights && (
        <Card sx={{ mt: 3 }} elevation={3}>
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