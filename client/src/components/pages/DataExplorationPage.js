import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
import { fetchRawUserData } from '../../services/api';

const DataExplorationPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('table');
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    plan: '',
    minLifetimeValue: '',
    sortBy: 'lifetime_value',
    sortOrder: 'desc'
  });

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Fetch data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchRawUserData(filters);
        
        if (data && data.length > 0) {
          setUserData(data);
          setLoading(false);
        } else {
          throw new Error('No user data received');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserData();
  }, [filters]);

  // Prepare data for charts
  const getPlanDistribution = () => {
    if (!userData) return [];
    
    const planCounts = userData.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(planCounts).map(([name, value]) => ({
      name, 
      value,
      percentage: ((value / userData.length) * 100).toFixed(2)
    }));
  };

  const getLTVDistribution = () => {
    if (!userData) return [];
    
    const ranges = [
      { name: '$0-$100', min: 0, max: 100 },
      { name: '$100-$500', min: 100, max: 500 },
      { name: '$500-$1000', min: 500, max: 1000 },
      { name: '$1000+', min: 1000, max: Infinity }
    ];

    return ranges.map(range => ({
      name: range.name,
      count: userData.filter(user => 
        user.lifetime_value >= range.min && 
        user.lifetime_value < range.max
      ).length
    }));
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading User Data...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography color="error">
          Error loading user data: {error}
        </Typography>
      </Container>
    );
  }

  // No data state
  if (!userData || userData.length === 0) {
    return (
      <Container>
        <Typography>No user data available</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Data Exploration
      </Typography>

      {/* View Selection Buttons */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Button 
            variant={activeView === 'table' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('table')}
          >
            User Table
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeView === 'planDistribution' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('planDistribution')}
          >
            Plan Distribution
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant={activeView === 'ltvDistribution' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('ltvDistribution')}
          >
            LTV Distribution
          </Button>
        </Grid>
      </Grid>

      {/* Dynamic Content Area */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {activeView === 'table' && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Lifetime Value</TableCell>
                        <TableCell>Total Sessions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userData.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.age}</TableCell>
                          <TableCell>{user.plan}</TableCell>
                          <TableCell>${user.lifetime_value.toFixed(2)}</TableCell>
                          <TableCell>{user.total_sessions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeView === 'planDistribution' && (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={getPlanDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getPlanDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} Users`, 
                        `${props.payload.percentage}%`
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {activeView === 'ltvDistribution' && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getLTVDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'User Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8">
                      {getLTVDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{userData.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Avg Lifetime Value</Typography>
                  <Typography variant="h4">
                    ${(userData.reduce((sum, user) => sum + user.lifetime_value, 0) / userData.length).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Top Plan</Typography>
                  <Typography variant="h4">
                    {getPlanDistribution()[0]?.name || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataExplorationPage;