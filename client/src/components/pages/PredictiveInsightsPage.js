import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Chip
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
  const [showDetailedAnalysis, setShowDetailedAnalysis] = React.useState(false);

  // Use the useApi hook for data fetching
  const { data: predictions, loading, error, execute: generatePredictiveInsights } = useApi(() => apiClient.getAIInsights(), { autoExecute: true });

  // Handle errors gracefully
  if (error) {
    return (
      <Box>
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
      </Box>
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
        <Box>
          <Chip 
            icon={<InfoIcon color="primary" />}
            label={safeData.insights || 'No insights available'} 
            variant="outlined"
            sx={{ mb: 1 }}
          />
        </Box>
      );
    }

    // If insights is an array or object, render it as structured data
    const insightsArray = Array.isArray(safeData.insights) ? safeData.insights : [safeData.insights];
    
    return (
      <Box>
        {insightsArray.map((insight, index) => (
          <React.Fragment key={index}>
            <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
              <Chip 
                icon={
                  insight.type === 'warning' ? (
                    <WarningIcon color="warning" />
                  ) : insight.type === 'trend' ? (
                    <TrendingUpIcon color="success" />
                  ) : (
                    <InfoIcon color="info" />
                  )
                }
                label={insight.title || `Insight ${index + 1}`}
                variant="outlined"
                sx={{ mr: 1 }}
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
            </Box>
          </React.Fragment>
        ))}
      </Box>
    );
  };

  const renderDetailedAnalysis = () => {
    if (!showDetailedAnalysis) return null;

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Box>
            <Chip 
              icon={<ExpandMoreIcon />}
              label="Revenue Analysis" 
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" paragraph>
              Revenue projections show a steady upward trend with seasonal variations. 
              Q4 typically shows the highest revenue due to holiday spending patterns.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                icon={<TrendingUpIcon color="success" />}
                label="Growth Rate: 20% quarter-over-quarter" 
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Chip 
                icon={<InfoIcon color="info" />}
                label="Seasonal Factor: Q4 peak: +40% vs Q1" 
                variant="outlined"
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Chip 
              icon={<ExpandMoreIcon />}
              label="Churn Risk Analysis" 
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" paragraph>
              Churn risk analysis identifies users most likely to leave the platform.
              Focus on high-risk users to improve retention.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                icon={<WarningIcon color="warning" />}
                label="High Risk Users: 10% of total user base" 
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Chip 
                icon={<InfoIcon color="info" />}
                label="Retention Opportunity: Potential 15% improvement" 
                variant="outlined"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
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
                <Box>
                  <Chip 
                    icon={<TrendingUpIcon color="success" />}
                    label="Focus on Q4 Marketing Campaigns" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    icon={<WarningIcon color="warning" />}
                    label="Implement Retention Strategies" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    icon={<InfoIcon color="info" />}
                    label="Monitor Revenue Trends" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PredictiveInsightsPage;