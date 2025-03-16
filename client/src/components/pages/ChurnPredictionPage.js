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
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchChurnPredictionData, fetchUserJourneyData } from '../../services/api';

const ChurnPredictionPage = () => {
    const [churnData, setChurnData] = useState(null);
    const [journeyData, setJourneyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChart, setActiveChart] = useState('segments');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch both churn prediction and user journey data
          const [predictionData, userJourneyData] = await Promise.all([
            fetchChurnPredictionData(),
            fetchUserJourneyData()
          ]);
          
          // Validate data
          if (!predictionData) {
            throw new Error('No prediction data received');
          }
          
          setChurnData(predictionData);
          setJourneyData(userJourneyData || []); // Provide default empty array
          setLoading(false);
        } catch (error) {
          console.error('Detailed churn prediction fetch error:', error);
          setError(error);
          setLoading(false);
        }
      };
  
      fetchData();
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

    // Process Journey Data for Churn Forecaster
    const churnForecasterData = {
      overallChurnRisk: journeyData.length > 0 
        ? journeyData.reduce((avg, stage) => avg + stage.avgChurnRisk, 0) / journeyData.length
        : churnData.overallChurnRisk, // Fallback to prediction data
      
      segmentChurnRisks: journeyData.length > 0 
        ? journeyData.map(stage => ({
            stage: stage.stage,
            churnRisk: stage.avgChurnRisk,
            userCount: stage.userCount,
            trendDirection: stage.avgChurnRisk > 0.5 ? 'up' : 'down'
          }))
        : churnData.highRiskSegments.map(segment => ({
            stage: segment.name,
            churnRisk: segment.churnRisk,
            userCount: segment.userCount,
            trendDirection: segment.churnRisk > 0.5 ? 'up' : 'down'
          })),
      
      interventionRecommendations: [
        {
          stage: 'High Risk Segments',
          recommendations: [
            'Personalized Engagement Campaign',
            'Targeted Retention Offers',
            'Proactive Customer Support'
          ]
        }
      ]
    };

    // Chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
    return (
      <Container>
        <Typography variant="h4">Churn Prediction & Forecasting</Typography>
        
        {/* Existing Churn Prediction Card */}
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

        {/* Churn Risk Forecaster Accordion */}
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="churn-forecaster-content"
            id="churn-forecaster-header"
          >
            <Typography variant="h6">
              Churn Risk Forecaster 
              <WarningIcon 
                color={
                  churnForecasterData.overallChurnRisk < 0.3 ? 'success' : 
                  churnForecasterData.overallChurnRisk < 0.6 ? 'warning' : 'error'
                }
                sx={{ ml: 1 }}
              />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Overall Churn Risk */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Forecasted Overall Churn Risk: 
                  {(churnForecasterData.overallChurnRisk * 100).toFixed(2)}%
                </Typography>
              </Grid>

              {/* Segment Churn Risks */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Segment Churn Risks</Typography>
                {churnForecasterData.segmentChurnRisks.map((segment, index) => (
                  <Chip 
                    key={index}
                    icon={
                      <TrendingDownIcon 
                        color={segment.trendDirection === 'up' ? 'error' : 'success'}
                      />
                    }
                    label={`${segment.stage}: ${(segment.churnRisk * 100).toFixed(2)}%`}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Grid>

              {/* Intervention Recommendations */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Intervention Recommendations</Typography>
                <List>
                  {churnForecasterData.interventionRecommendations[0].recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Existing Chart Section */}
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