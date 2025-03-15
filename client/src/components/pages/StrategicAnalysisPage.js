// StrategicAnalysisPage.js

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

// Import the service for AI insights
import { aiInsightsService } from '../../services/api';

const StrategicAnalysisPage = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const generateStrategicInsights = async () => {
      setLoading(true);
      try {
        // API call to backend to generate insights similar to Python script
        const response = await fetch('/api/strategic-analysis');
        const data = await response.json();
  
        setInsights(data);
      } catch (error) {
        console.error('Failed to generate insights', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container>
        <Typography variant="h4">Strategic Customer Segmentation</Typography>
        
        {/* Segment Visualization */}
        <Grid container spacing={3}>
          {insights?.segment_profiles.map((segment, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Segment {index + 1}</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Avg Age" 
                        secondary={segment.age.toFixed(2)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Avg Lifetime Value" 
                        secondary={`$${segment.lifetime_value.toFixed(2)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Top Plan" 
                        secondary={segment.plan} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Marketing Strategy Insights */}
        {insights?.marketing_strategy && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5">AI-Generated Marketing Strategy</Typography>
              <Typography variant="body1">
                {insights.marketing_strategy}
              </Typography>
            </CardContent>
          </Card>
        )}
  
        <Button 
          variant="contained" 
          onClick={generateStrategicInsights}
          disabled={loading}
        >
          {loading ? 'Generating Insights...' : 'Generate Strategic Insights'}
        </Button>
      </Container>
    );
  };

  export default StrategicAnalysisPage