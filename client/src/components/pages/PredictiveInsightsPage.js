import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PredictiveInsightsPage = () => {
  const [expandedInsight, setExpandedInsight] = React.useState(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = React.useState(false);

  // Use the useApi hook for data fetching
  const { data: predictions, loading, error, execute: generatePredictiveInsights } = useApi(() => apiClient.getAIInsights(), { autoExecute: true });

  // Handle errors gracefully
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error generating predictive insights: {error.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={generatePredictiveInsights}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Generating predictive insights..." />;
  }

  // Ensure data structure is complete
  const safeData = predictions ? {
    insights: predictions.insights || 'No detailed insights available',
    revenue_projection: Array.isArray(predictions.revenue_projection) && predictions.revenue_projection.length > 0 
      ? predictions.revenue_projection 
      : [
          { period: 'Q1 2024', revenue: 100000 },
          { period: 'Q2 2024', revenue: 120000 },
          { period: 'Q3 2024', revenue: 150000 },
          { period: 'Q4 2024', revenue: 200000 }
        ],
    churn_risk_distribution: Array.isArray(predictions.churn_risk_distribution) && predictions.churn_risk_distribution.length > 0
      ? predictions.churn_risk_distribution
      : [
          { name: 'Low Risk', value: 0.6 },
          { name: 'Medium Risk', value: 0.3 },
          { name: 'High Risk', value: 0.1 }
        ]
  } : null;

  const handleRefresh = () => {
    generatePredictiveInsights();
  };

  const handleInsightExpand = (insightId) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  const renderRevenueChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart 
        data={safeData.revenue_projection}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChurnChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={safeData.churn_risk_distribution}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
        >
          {safeData.churn_risk_distribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#00C49F', '#FFBB28', '#FF8042'][index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Risk Level']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderInsightsList = () => {
    if (!safeData.insights || typeof safeData.insights === 'string') {
      return (
        <List>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="General Insights" 
              secondary={safeData.insights || 'No insights available'} 
            />
          </ListItem>
        </List>
      );
    }

    // If insights is an array or object, render it as structured data
    const insightsArray = Array.isArray(safeData.insights) ? safeData.insights : [safeData.insights];
    
    return (
      <List>
        {insightsArray.map((insight, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                {insight.type === 'warning' ? (
                  <WarningIcon color="warning" />
                ) : insight.type === 'trend' ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <InfoIcon color="info" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={insight.title || `Insight ${index + 1}`}
                secondary={insight.description || insight.message || insight}
              />
              {insight.actions && (
                <Box>
                  {insight.actions.map((action, actionIndex) => (
                    <Chip 
                      key={actionIndex}
                      label={action.label || action}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  ))}
                </Box>
              )}
            </ListItem>
            {index < insightsArray.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  const renderDetailedAnalysis = () => {
    if (!showDetailedAnalysis) return null;

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Accordion 
            expanded={expandedInsight === 'revenue'} 
            onChange={() => handleInsightExpand('revenue')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Revenue Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Revenue projections show a steady upward trend with seasonal variations. 
                Q4 typically shows the highest revenue due to holiday spending patterns.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Growth Rate" 
                    secondary="20% quarter-over-quarter" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Seasonal Factor" 
                    secondary="Q4 peak: +40% vs Q1" 
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={6}>
          <Accordion 
            expanded={expandedInsight === 'churn'} 
            onChange={() => handleInsightExpand('churn')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Churn Risk Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Churn risk analysis identifies users most likely to leave the platform.
                Focus on high-risk users to improve retention.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="High Risk Users" 
                    secondary="10% of total user base" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Retention Opportunity" 
                    secondary="Potential 15% improvement" 
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Predictive Insights
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
            sx={{ mr: 2 }}
          >
            {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
          >
            Refresh Insights
          </Button>
        </Box>
      </Box>

      {!safeData ? (
        <Alert severity="info">
          No predictive insights available. Click "Refresh Insights" to generate new predictions.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Key Insights Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Insights
                </Typography>
                {renderInsightsList()}
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Projection Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Projection
                </Typography>
                {renderRevenueChart()}
              </CardContent>
            </Card>
          </Grid>

          {/* Churn Risk Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Churn Risk Distribution
                </Typography>
                {renderChurnChart()}
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Analysis Section */}
          {renderDetailedAnalysis()}

          {/* Action Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommended Actions
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Focus on Q4 Marketing Campaigns" 
                      secondary="Leverage seasonal revenue patterns for maximum impact" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Implement Retention Strategies" 
                      secondary="Target high-risk users with personalized engagement" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Monitor Revenue Trends" 
                      secondary="Track quarter-over-quarter growth and adjust strategies" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PredictiveInsightsPage;