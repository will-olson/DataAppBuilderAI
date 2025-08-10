import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
    Alert,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TablePagination,
    Checkbox,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const DataExplorationPage = () => {
  const [activeView, setActiveView] = useState('table');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Chart color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Use the useApi hook for data fetching
  const { data: userData, loading, error, execute: refetchData } = useApi(
    () => apiClient.getRawUserData(100, 0), // Default limit and offset
    { autoExecute: true }
  );

  // Handle errors gracefully
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading user data: {error.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={refetchData}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading user data..." />;
  }

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
        user.lifetimeValue >= range.min && 
        user.lifetimeValue < range.max
      ).length
    }));
  };

  // Handler for row details
  const handleRowDetails = (user) => {
    setSelectedUser(user);
  };

  // Handler for data export
  const handleExport = (usersToExport) => {
    setSelectedUsers(usersToExport);
    setExportDialogOpen(true);
  };

  // Handle select all users
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection
  const handleSelectUser = (user) => {
    const selectedIndex = selectedUsers.findIndex(u => u.id === user.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, user);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1),
      );
    }

    setSelectedUsers(newSelected);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedUsers([]); // Clear selection when changing pages
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelectedUsers([]); // Clear selection when changing rows per page
  };

  // Check if user is selected
  const isSelected = (user) => selectedUsers.findIndex(u => u.id === user.id) !== -1;

  // Get current page data
  const getCurrentPageData = () => {
    if (!userData) return [];
    return userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

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
        {selectedUsers.length > 0 && (
          <Grid item>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => handleExport(selectedUsers)}
            >
              Export Selected ({selectedUsers.length})
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Dynamic Content Area */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {activeView === 'table' && (
                <Box>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={selectedUsers.length > 0 && selectedUsers.length < getCurrentPageData().length}
                              checked={getCurrentPageData().length > 0 && selectedUsers.length === getCurrentPageData().length}
                              onChange={handleSelectAll}
                            />
                          </TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Plan</TableCell>
                          <TableCell>LTV</TableCell>
                          <TableCell>Sessions</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getCurrentPageData().map((user) => {
                          const isItemSelected = isSelected(user);
                          return (
                            <TableRow
                              key={user.id}
                              hover
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={() => handleSelectUser(user)}
                                />
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="subtitle2">{user.username}</Typography>
                                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={user.plan} 
                                  color="primary" 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  ${user.lifetime_value?.toFixed(2) || '0.00'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{user.total_sessions || 0}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={user.account_status || 'Active'} 
                                  color={user.account_status === 'Active' ? 'success' : 'default'} 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="small" 
                                  onClick={() => handleRowDetails(user)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={userData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box>
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
                    ${(userData.reduce((sum, user) => sum + (user.lifetime_value || 0), 0) / userData.length).toFixed(2)}
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
                  secondary={`$${(selectedUser.lifetime_value || 0).toFixed(2)}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Sessions" 
                  secondary={selectedUser.total_sessions || 0} 
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <Dialog 
        open={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export User Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to export {selectedUsers.length} users. The export will include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="User profile information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Plan and subscription details" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Lifetime value and session data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Account status and creation date" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The data will be exported as a CSV file for easy analysis in spreadsheet applications.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Implement actual CSV export logic here
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Username,Email,Plan,Lifetime Value,Sessions,Status\n" +
                selectedUsers.map(user => 
                  `${user.username},${user.email},${user.plan},${user.lifetime_value || 0},${user.total_sessions || 0},${user.account_status || 'Active'}`
                ).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `user_data_export_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              setExportDialogOpen(false);
              setSelectedUsers([]);
            }}
          >
            Export CSV
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataExplorationPage;