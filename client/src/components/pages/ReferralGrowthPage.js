import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { fetchReferralInsights } from '../../services/api';

const ReferralGrowthPage = () => {
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChart, setActiveChart] = useState('sources');

    // Chart color palette
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
    useEffect(() => {
      const fetchReferralData = async () => {
        try {
          setLoading(true);
          const data = await fetchReferralInsights();
          
          // Validate data structure
          if (!data || 
              !Array.isArray(data.referralSources) || 
              !Array.isArray(data.referralConversionRates)
          ) {
            throw new Error('Invalid data structure');
          }
          
          setReferralData(data);
          setLoading(false);
        } catch (error) {
          console.error('Referral data fetch error', error);
          setError(error);
          setLoading(false);
        }
      };
  
      fetchReferralData();
    }, []);

    // Loading state
    if (loading) {
      return (
        <Container>
          <CircularProgress />
          <Typography>Loading Referral Insights...</Typography>
        </Container>
      );
    }

    // Error state
    if (error) {
      return (
        <Container>
          <Typography color="error">
            Error loading referral insights: {error.message}
          </Typography>
        </Container>
      );
    }

    // Ensure referralData exists
    if (!referralData) {
      return (
        <Container>
          <Typography>No referral data available</Typography>
        </Container>
      );
    }

    // Prepare data for charts
    const referralSourcesChartData = referralData.referralSources.map(source => ({
      name: source.name,
      referralCount: source.count,
      avgReferralValue: source.avgReferralValue
    }));

    const conversionRatesChartData = referralData.referralConversionRates.map(rate => ({
      name: rate.source,
      conversionRate: rate.conversionRate * 100,
      totalReferrals: rate.totalReferrals
    }));

    return (
      <Container>
        <Typography variant="h4">Referral & Growth Insights</Typography>
        
        {/* Chart Selection Buttons */}
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item>
            <Button 
              variant={activeChart === 'sources' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('sources')}
            >
              Referral Sources
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant={activeChart === 'conversion' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('conversion')}
            >
              Conversion Rates
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant={activeChart === 'combined' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('combined')}
            >
              Detailed Insights
            </Button>
          </Grid>
        </Grid>

        {/* Chart Container */}
        <Card>
          <CardContent>
            {activeChart === 'sources' && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={referralSourcesChartData}>
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Referral Count', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      name === 'referralCount' ? `${value} Referrals` : `$${value.toFixed(2)}`,
                      props.payload.name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="referralCount" fill="#8884d8" name="Referral Count" />
                  <Bar dataKey="avgReferralValue" fill="#82ca9d" name="Avg Referral Value" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'conversion' && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={conversionRatesChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="conversionRate"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {conversionRatesChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value.toFixed(2)}%`, 
                      `Total Referrals: ${props.payload.totalReferrals}`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'combined' && (
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={conversionRatesChartData}>
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Referrals', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="conversionRate" barSize={20} fill="#413ea0" name="Conversion Rate" />
                  <Line yAxisId="right" type="monotone" dataKey="totalReferrals" stroke="#ff7300" name="Total Referrals" />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Referrals</Typography>
                <Typography variant="h4">
                  {referralData.referralSources.reduce((sum, source) => sum + source.count, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Conversion Rate</Typography>
                <Typography variant="h4">
                  {(referralData.referralConversionRates.reduce((sum, rate) => sum + rate.conversionRate, 0) / 
                    referralData.referralConversionRates.length * 100).toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Top Referral Source</Typography>
                <Typography variant="h4">
                  {referralData.referralSources.reduce((top, source) => 
                    source.count > top.count ? source : top
                  ).name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

export default ReferralGrowthPage;