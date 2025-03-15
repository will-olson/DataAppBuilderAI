// ABTestingPage.js

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
  LineChart, 
  PieChart,
  XAxis, 
  YAxis, 
  Scatter, 
  Line,
  Pie,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

// Import the service for AI insights
import { aiInsightsService } from '../../services/api';

const ABTestingPage = () => {
    const [testResults, setTestResults] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const runABTestAnalysis = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ab-testing-analysis');
        const data = await response.json();
  
        setTestResults(data);
      } catch (error) {
        console.error('AB Testing Analysis Failed', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container>
        <Typography variant="h4">A/B Testing Predictive Modeling</Typography>
        
        {/* Experimental Design Insights */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Conversion Probability Modeling</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <XAxis type="number" dataKey="feature1" />
                    <YAxis type="number" dataKey="conversion_probability" />
                    <Scatter 
                      data={testResults?.experimental_data} 
                      fill="#8884d8" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Statistical Significance</Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Confidence Level" 
                      secondary={`${testResults?.confidence_level}%`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Recommended Variant" 
                      secondary={testResults?.recommended_variant} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  
        <Button 
          variant="contained" 
          onClick={runABTestAnalysis}
          disabled={loading}
        >
          Run A/B Test Analysis
        </Button>
      </Container>
    );
  };

  export default ABTestingPage