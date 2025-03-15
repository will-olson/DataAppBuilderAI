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

import { fetchAIInsights } from '../../services/api';

const StrategicAnalysisPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateStrategicInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAIInsights.getStrategicAnalysis();
      
      // Log received data for debugging
      console.log('Received Strategic Insights:', data);
      
      // Validate data structure
      if (!data.insights || !data.segment_profiles) {
        throw new Error('Invalid insights data structure');
      }
      
      setInsights(data);
    } catch (error) {
      console.error('Strategic Insights Generation Error:', error);
      
      // Provide user-friendly error message
      setError(
        error.message.includes('fetch')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to generate insights. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    generateStrategicInsights();
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
            Generating Strategic Insights...
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
            <Button color="inherit" size="small" onClick={generateStrategicInsights}>
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

  // No insights state
  if (!insights) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No insights available. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Strategic Customer Segmentation
      </Typography>
      
      {/* Segment Visualization */}
      {insights.segment_profiles && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(insights.segment_profiles).map(([segmentKey, segment], index) => (
            <Grid item xs={12} md={4} key={segmentKey}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Segment {index + 1}
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Avg Age" 
                        secondary={segment.age ? segment.age.toFixed(2) : 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Avg Lifetime Value" 
                        secondary={segment.lifetime_value 
                          ? `$${segment.lifetime_value.toFixed(2)}` 
                          : 'N/A'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Top Plan" 
                        secondary={segment.plan || 'N/A'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Marketing Strategy Insights */}
      {insights.insights && (
        <Card sx={{ mb: 4 }} elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI-Generated Marketing Strategy
            </Typography>
            <Typography variant="body1" component="pre" sx={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit' 
            }}>
              {insights.insights}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={generateStrategicInsights}
          disabled={loading}
        >
          Regenerate Insights
        </Button>
      </Box>
    </Container>
  );
};

export default StrategicAnalysisPage;