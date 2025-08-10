import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  List,
  ListItem,
  ListItemText,
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
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ChartContainer from '../common/ChartContainer';

const ChurnPredictionPage = () => {
    const [activeChart, setActiveChart] = useState('segments');
  
    // Use the useApi hook for data fetching
    const { data: churnData, loading: churnLoading, error: churnError, execute: fetchChurnData } = useApi(() => apiClient.getChurnPrediction(), { autoExecute: true });
    const { data: journeyData, loading: journeyLoading, error: journeyError, execute: fetchJourneyData } = useApi(() => apiClient.getUserJourney(), { autoExecute: true });

    const loading = churnLoading || journeyLoading;
    const error = churnError || journeyError;

    // Loading state
    if (loading) {
      return <LoadingSpinner message="Loading Churn Prediction..." />;
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
    const churnRiskChartData = churnData?.map(source => ({
      name: source.source,
      churnRisk: source.avgChurnRisk * 100,
      userCount: source.userCount
    })) || [];

    const journeyChartData = journeyData?.map(stage => ({
      name: stage.stage,
      userCount: stage.userCount,
      avgLTV: stage.avgLTV,
      churnRisk: stage.avgChurnRisk * 100
    })) || [];

    // Calculate summary metrics
    const totalUsers = churnData ? churnData.reduce((sum, source) => sum + source.userCount, 0) : 0;
    const averageChurnRisk = churnData && churnData.length > 0 
      ? churnData.reduce((sum, source) => sum + source.avgChurnRisk, 0) / churnData.length * 100 
      : 0;

    // Process Journey Data for Churn Forecaster
    const churnForecasterData = {
      overallChurnRisk: journeyData?.length > 0 
         ? journeyData.reduce((avg, stage) => avg + stage.avgChurnRisk, 0) / journeyData.length
         : averageChurnRisk, // Fallback to prediction data
      
      segmentChurnRisks: journeyData?.length > 0 
         ? journeyData.map(stage => ({
             stage: stage.stage,
             avgChurnRisk: stage.avgChurnRisk,
             trendDirection: stage.avgChurnRisk > 0.5 ? 'up' : 'down'
           }))
         : churnData.highRiskSegments?.map(segment => ({
             stage: segment.name,
             churnRisk: segment.churnRisk,
             trendDirection: segment.churnRisk > 0.5 ? 'up' : 'down'
           })) || [],
      
      interventionRecommendations: journeyData?.length > 0 
         ? journeyData.map(stage => ({
             stage: stage.stage,
             recommendations: stage.recommendations || []
           }))
         : [{
             stage: 'General',
             recommendations: churnData.interventionRecommendations || []
           }]
    };

    const handleRefresh = () => {
      fetchChurnData();
      fetchJourneyData();
    };

    const renderChart = () => {
      if (activeChart === 'segments') {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={churnRiskChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {churnRiskChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${entry.churnRisk * 2}, 70%, 50%)`} />
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
        );
      }

      if (activeChart === 'factors') {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={journeyChartData}>
              <XAxis dataKey="churnRisk" />
              <YAxis label={{ value: 'Average LTV', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgLTV" fill="#8884d8">
                {journeyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${entry.churnRisk * 2}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }

      return null;
    };

    // Chart colors
    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
    return (
      <Container>
        <Typography variant="h4">Churn Prediction & Forecasting</Typography>
        
        {/* Existing Churn Prediction Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5">
              Overall Churn Risk: {(averageChurnRisk).toFixed(2)}%
            </Typography>
            
            <Typography variant="h6">High-Risk Segments</Typography>
            {churnData.highRiskSegments?.map((segment, index) => (
              <Chip 
                key={index}
                label={`${segment.name}: ${(segment.churnRisk * 100).toFixed(2)}%`} 
                color="warning" 
                sx={{ m: 0.5 }}
              />
            ))}
            
            <Typography variant="h6">Key Churn Factors</Typography>
            <List>
              {churnData.churnFactors?.map((factor, index) => (
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
        <ChartContainer 
          title={`${activeChart === 'segments' ? 'Risk Segments' : 'Churn Factors'} Analysis`}
          subtitle="Churn prediction insights and risk analysis"
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
          height={500}
        >
          {renderChart()}
        </ChartContainer>
      </Container>
    );
  };

export default ChurnPredictionPage;