import React, { useState, useEffect } from 'react';
import { 
  fetchUserSegments 
} from '../../services/api';

import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress,
  Button
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

const Segmentation = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('userCount');

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Color mapping for segments
  const getSegmentColor = (segmentName) => {
    const colorMap = {
      'High Engagement': '#4caf50',  // Green
      'Medium Engagement': '#ff9800', // Orange
      'Low Engagement': '#f44336'     // Red
    };
    return colorMap[segmentName] || '#2196f3'; // Default blue
  };

  // Fetch segments on component mount
  useEffect(() => {
    const loadSegments = async () => {
      try {
        setLoading(true);
        const data = await fetchUserSegments();
        
        // Validate and process data
        if (Array.isArray(data)) {
          setSegments(data);
        } else {
          throw new Error('Invalid data format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching segments:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadSegments();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <Container>
        <Typography variant="h4">Loading Segments...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <Typography variant="h4" color="error">
          Error Loading Segments
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Container>
    );
  }

  // Prepare data for charts
  const segmentChartData = segments.map(segment => ({
    name: segment.name,
    userCount: segment.userCount,
    avgLTV: segment.avgLTV,
    churnRisk: segment.avgChurnRisk * 100
  }));

  // Calculate key metrics
  const totalUsers = segments.reduce((sum, segment) => sum + segment.userCount, 0);
  const totalLTV = segments.reduce((sum, segment) => sum + (segment.userCount * segment.avgLTV), 0);
  const averageLTV = totalLTV / totalUsers;
  const averageChurnRisk = segments.reduce((sum, segment) => sum + segment.avgChurnRisk, 0) / segments.length * 100;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Segments Analysis
      </Typography>

      {/* Segmentation-Specific Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Revenue Potential</Typography>
              <Typography variant="h4">
                ${(segments.reduce((sum, segment) => 
                  sum + (segment.userCount * segment.avgLTV), 0)).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Projected Annual Segment Revenue
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Highest potential segment: {
                  segments.reduce((max, segment) => 
                    (segment.userCount * segment.avgLTV) > (max.userCount * max.avgLTV) ? segment : max
                  ).name
                }
            </Typography>
          </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Segment Concentration</Typography>
              <Typography variant="h4">
                {((segments.reduce((max, segment) => 
                  Math.max(max, segment.userCount / totalUsers), 0) * 100).toFixed(2))}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Largest segment's proportion of total users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Segment LTV Variance</Typography>
              <Typography variant="h4">
                ${(Math.max(...segments.map(s => s.avgLTV)) - 
                  Math.min(...segments.map(s => s.avgLTV))).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Difference between highest and lowest segment LTV
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Selection Buttons */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Button 
            variant={activeChart === 'userCount' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('userCount')}
          >
            User Count
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'ltv' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('ltv')}
          >
            Lifetime Value
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'churnRisk' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('churnRisk')}
          >
            Churn Risk
          </Button>
        </Grid>
      </Grid>

      {/* Visualization Grid */}
      <Grid container spacing={3}>
        {/* Segment Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Segment Revenue Contribution</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={segments.map(segment => ({
                  name: segment.name,
                  revenue: segment.userCount * segment.avgLTV,
                  userCount: segment.userCount
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: '', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `$${value.toLocaleString()}`, 
                      `${props.payload.name} Revenue`
                    ]}
                    labelFormatter={(label) => `Segment: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#8884d8"
                    name="Revenue"
                  >
                    {segments.map((segment, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="userCount"
                    stroke="#ff7300"
                    name="User Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Segment Metrics Composed Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Segment Performance</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={segmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: activeChart === 'userCount' ? 'Number of Users' : 
                             activeChart === 'ltv' ? 'Lifetime Value ($)' : 
                             'Churn Risk (%)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey={
                      activeChart === 'userCount' ? 'userCount' : 
                      activeChart === 'ltv' ? 'avgLTV' : 
                      'churnRisk'
                    } 
                    fill="#8884d8" 
                  />
                  <Line
                    type="monotone"
                    dataKey={
                      activeChart === 'userCount' ? 'userCount' : 
                      activeChart === 'ltv' ? 'avgLTV' : 
                      'churnRisk'
                    }
                    stroke="#ff7300"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Segment Details Grid */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {segments.map((segment, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderLeft: `5px solid ${getSegmentColor(segment.name)}` 
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {segment.name} Segment
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  User Count: {segment.userCount}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Average Lifetime Value: ${segment.avgLTV.toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Churn Risk: {(segment.avgChurnRisk * 100).toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Comprehensive Segment Insights */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Segment Analysis Insights</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Segment Characteristics</Typography>
              <Typography variant="body2">
                Our analysis reveals {segments.length} distinct user segments, 
                ranging from {segments[0].name} to {segments[segments.length - 1].name}. 
                The most populous segment represents {
                  (segments.reduce((max, segment) => 
                    Math.max(max, segment.userCount / totalUsers), 0) * 100
                  ).toFixed(2)
                }% of our total user base.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Performance Variation</Typography>
              <Typography variant="body2">
                Lifetime Value (LTV) shows significant variation across segments:
                • Highest LTV Segment: ${Math.max(...segments.map(s => s.avgLTV)).toFixed(2)}
                • Lowest LTV Segment: ${Math.min(...segments.map(s => s.avgLTV)).toFixed(2)}
                • Overall LTV Spread: ${
                  (Math.max(...segments.map(s => s.avgLTV)) - 
                  Math.min(...segments.map(s => s.avgLTV))).toFixed(2)
                }
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Churn Risk Insights</Typography>
              <Typography variant="body2">
                Churn risk varies significantly across segments:
                • Highest Risk Segment: {
                  segments.reduce((max, segment) => 
                    segment.avgChurnRisk > max.avgChurnRisk ? segment : max
                  ).name
                } with {
                  (segments.reduce((max, segment) => 
                    segment.avgChurnRisk > max.avgChurnRisk ? segment : max
                  ).avgChurnRisk * 100).toFixed(2)
                }% churn probability
                • Lowest Risk Segment: {
                  segments.reduce((min, segment) => 
                    segment.avgChurnRisk < min.avgChurnRisk ? segment : min
                  ).name
                } with {
                  (segments.reduce((min, segment) => 
                    segment.avgChurnRisk < min.avgChurnRisk ? segment : min
                  ).avgChurnRisk * 100).toFixed(2)
                }% churn probability
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Segmentation;