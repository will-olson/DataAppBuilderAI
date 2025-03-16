import React, { useState, useEffect } from 'react';
import UserDataTable from '../../components/segments/journey/UserDataTable';
import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Grid, 
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
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

const UserDetailsModal = ({ user, open, onClose }) => {
    if (!user) return null;
  
    // Exclude certain keys or format specific keys
    const excludeKeys = ['id', 'uuid'];
    const formatKeys = {
      'account_created': (value) => new Date(value).toLocaleString(),
      'last_login': (value) => value ? new Date(value).toLocaleString() : 'Never',
      'lifetime_value': (value) => `$${value.toFixed(2)}`,
      'churn_risk': (value) => `${(value * 100).toFixed(2)}%`,
      'email_open_rate': (value) => `${(value * 100).toFixed(2)}%`,
      'email_click_rate': (value) => `${(value * 100).toFixed(2)}%`,
    };
  
    // Get keys, excluding specified keys
    const userKeys = Object.keys(user)
      .filter(key => !excludeKeys.includes(key));
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Comprehensive User Details</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow>
                    {userKeys.map((key) => (
                      <TableCell 
                        key={key} 
                        sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f4f4f4',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {userKeys.map((key) => {
                      let value = user[key];
                      
                      // Apply custom formatting if exists
                      if (formatKeys[key]) {
                        value = formatKeys[key](value);
                      }
  
                      // Handle JSON and object types
                      if (typeof value === 'object') {
                        value = JSON.stringify(value, null, 2);
                      }
  
                      // Handle null/undefined
                      if (value === null || value === undefined) {
                        value = 'N/A';
                      }
  
                      return (
                        <TableCell 
                          key={key} 
                          sx={{ 
                            whiteSpace: 'nowrap',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          p: 2 
        }}>
          <Button 
            onClick={onClose} 
            color="primary" 
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Dialog>
    );
  };

const DataExplorationPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('table');
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Handler for row details
  const handleRowDetails = (user) => {
    setSelectedUser(user);
  };

  // Handler for data export
  const handleExport = (selectedUsers) => {
    // Implement export logic
    console.log('Exporting users:', selectedUsers);
    // Could trigger file download, open export modal, etc.
  };

  // Render loading state
  if (loading) {
    return (
      <Container>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading User Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100vh"
        >
          <Typography color="error" variant="h6">
            Error loading user data: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Render no data state
  if (!userData || userData.length === 0) {
    return (
      <Container>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100vh"
        >
          <Typography variant="h6">
            No user data available
          </Typography>
        </Box>
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
                <UserDataTable 
                  userData={userData}
                  onRowDetails={handleRowDetails}
                  onExport={handleExport}
                />
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
                    <CartesianGrid strokedasharray="3 3" />
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

      {/* User Details Modal */}
      <Dialog 
        open={!!selectedUser} 
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <List>
              <ListItem>
                <ListItemText 
                  primary="Username" 
                  secondary={selectedUser.username} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={selectedUser.email} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Age" 
                  secondary={selectedUser.age} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Plan" 
                  secondary={selectedUser.plan} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Lifetime Value" 
                  secondary={`$${selectedUser.lifetime_value.toFixed(2)}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Sessions" 
                  secondary={selectedUser.total_sessions} 
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DataExplorationPage;