// PredictiveInsightsPage.js

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

const PredictiveInsightsPage = () => {
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const generatePredictiveInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/predictive-insights');
        const data = await response.json();
  
        setPredictions(data);
      } catch (error) {
        console.error('Predictive Insights Generation Failed', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container>
        <Typography variant="h4">Predictive Revenue & Churn Modeling</Typography>
        
        {/* Revenue Projection */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Revenue Projection</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions?.revenue_projection}>
                    <XAxis dataKey="period" />
                    <YAxis label="Projected Revenue" />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Churn Risk Prediction</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={predictions?.churn_risk_distribution}
                      dataKey="value"
                      nameKey="name"
                      fill="#8884d8"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  
        <Button 
          variant="contained" 
          onClick={generatePredictiveInsights}
          disabled={loading}
        >
          Generate Predictive Insights
        </Button>
      </Container>
    );
  };

  export default PredictiveInsightsPage