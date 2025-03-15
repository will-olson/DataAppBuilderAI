import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { fetchChurnPredictionData } from '../../services/api';

const ChurnPredictionPage = () => {
    const [churnData, setChurnData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchChurnData = async () => {
        try {
          console.log('Fetching churn data started');
          setLoading(true);
          
          const data = await fetchChurnPredictionData();
          
          console.log('Received churn data:', data);
          
          // Validate data structure
          if (!data) {
            throw new Error('No data received');
          }
          
          // Validate specific properties
          if (
            typeof data.overallChurnRisk === 'undefined' ||
            !Array.isArray(data.highRiskSegments) ||
            !Array.isArray(data.churnFactors)
          ) {
            throw new Error('Invalid data structure');
          }
          
          setChurnData(data);
          setLoading(false);
        } catch (error) {
          console.error('Detailed churn prediction fetch error:', error);
          setError(error);
          setLoading(false);
        }
      };
  
      fetchChurnData();
    }, []);
  
    // Loading state
    if (loading) {
      return (
        <Container>
          <CircularProgress />
          <Typography>Loading Churn Prediction...</Typography>
        </Container>
      );
    }
  
    // Error state
    if (error) {
      return (
        <Container>
          <Typography color="error">
            Error loading churn prediction data: {error.message}
          </Typography>
        </Container>
      );
    }
  
    // Ensure churnData exists before rendering
    if (!churnData) {
      return (
        <Container>
          <Typography>No churn prediction data available</Typography>
        </Container>
      );
    }
  
    return (
      <Container>
        <Typography variant="h4">Churn Prediction</Typography>
        
        <Card>
          <CardContent>
            <Typography variant="h5">
              Overall Churn Risk: {(churnData.overallChurnRisk * 100).toFixed(2)}%
            </Typography>
            
            <Typography variant="h6">High-Risk Segments</Typography>
            {churnData.highRiskSegments.map((segment, index) => (
              <Chip 
                key={index}
                label={`${segment.name}: ${(segment.churnRisk * 100).toFixed(2)}%`} 
                color="warning" 
              />
            ))}
            
            <Typography variant="h6">Key Churn Factors</Typography>
            <List>
              {churnData.churnFactors.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={factor.name} 
                    secondary={`Impact: ${(factor.impact * 100).toFixed(2)}%`} 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    );
  };

export default ChurnPredictionPage;