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
  CircularProgress,
  Grid,
  Button
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchChurnPredictionData } from '../../services/api';

const ChurnPredictionPage = () => {
    const [churnData, setChurnData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChart, setActiveChart] = useState('segments');
  
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

    // Prepare data for charts
    const segmentsChartData = churnData.highRiskSegments.map(segment => ({
      name: segment.name,
      value: segment.userCount,
      churnRisk: segment.churnRisk
    }));

    const churnFactorsChartData = churnData.churnFactors.map(factor => ({
      name: factor.name,
      impact: factor.impact * 100
    }));

    // Chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
    return (
      <Container>
        <Typography variant="h4">Churn Prediction</Typography>
        
        <Card sx={{ mb: 3 }}>
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
                sx={{ m: 0.5 }}
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

        {/* Chart Selection Buttons */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <Button 
              variant={activeChart === 'segments' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('segments')}
            >
              Risk Segments
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant={activeChart === 'factors' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('factors')}
            >
              Churn Factors
            </Button>
          </Grid>
        </Grid>

        {/* Chart Container */}
        <Card>
          <CardContent>
            {activeChart === 'segments' && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={segmentsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {segmentsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} Users`, 
                      `Churn Risk: ${(props.payload.churnRisk * 100).toFixed(2)}%`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'factors' && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={churnFactorsChartData}>
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impact" fill="#8884d8">
                    {churnFactorsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    );
  };

export default ChurnPredictionPage;