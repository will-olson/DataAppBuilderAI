import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  CircularProgress
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { fetchPersonalizationData } from '../../services/api';

const PersonalizationPage = () => {
  const [personalizationData, setPersonalizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('content');

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const loadPersonalizationData = async () => {
      try {
        const data = await fetchPersonalizationData();
        if (data) {
          setPersonalizationData(data);
          setLoading(false);
        } else {
          throw new Error('No personalization data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadPersonalizationData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading Personalization Insights...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography color="error">
          Error loading personalization data: {error.message}
        </Typography>
      </Container>
    );
  }

  // Prepare data for charts
  const contentPreferencesChartData = personalizationData.contentPreferences.map(pref => ({
    name: pref.type,
    value: pref.userCount,
    engagement: pref.avgEngagement * 100
  }));

  const communicationPreferencesChartData = personalizationData.communicationPreferences.map(pref => ({
    name: pref.channel,
    value: pref.userCount,
    openRate: pref.avgOpenRate * 100
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Personalization Insights
      </Typography>

      {/* Chart Selection Buttons */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Button 
            variant={activeChart === 'content' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('content')}
          >
            Content Preferences
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeChart === 'communication' ? 'contained' : 'outlined'}
            onClick={() => setActiveChart('communication')}
          >
            Communication Preferences
          </Button>
        </Grid>
      </Grid>

      {/* Chart Container */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {activeChart === 'content' ? 'Content Preferences' : 'Communication Preferences'}
              </Typography>
              
              {activeChart === 'content' && (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={contentPreferencesChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentPreferencesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} Users`, 
                        `Engagement: ${props.payload.engagement.toFixed(2)}%`
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'communication' && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={communicationPreferencesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'User Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        value, 
                        `Open Rate: ${props.payload.openRate.toFixed(2)}%`
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {communicationPreferencesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Detailed Insights
              </Typography>
              
              {activeChart === 'content' && (
                <div>
                  {personalizationData.contentPreferences.map((pref, index) => (
                    <Grid container key={index} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography>{pref.type}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography color="text.secondary">
                          {pref.userCount} Users
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography color="text.secondary">
                          {(pref.avgEngagement * 100).toFixed(2)}% Engagement
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              )}

              {activeChart === 'communication' && (
                <div>
                  {personalizationData.communicationPreferences.map((pref, index) => (
                    <Grid container key={index} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography>{pref.channel}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography color="text.secondary">
                          {pref.userCount} Users
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography color="text.secondary">
                          {(pref.avgOpenRate * 100).toFixed(2)}% Open Rate
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PersonalizationPage;