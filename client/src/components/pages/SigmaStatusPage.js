import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Paper,
  Button,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import SigmaModeToggle from '../SigmaModeToggle';

const SigmaStatusPage = () => {
  // Memoize API functions to prevent recreation on every render
  const getSigmaStatus = React.useCallback(() => apiClient.getSigmaStatus(), []);
  const getSigmaCapabilities = React.useCallback(() => apiClient.getSigmaCapabilities(), []);
  const getHealthCheck = React.useCallback(() => apiClient.healthCheck(), []);
  const getRawUserData = React.useCallback(() => apiClient.getRawUserData(5, 0), []);
  const getUserCount = React.useCallback(() => apiClient.getUserCount(), []);

  // Use the useApi hook for data fetching with better error handling
  const { data: sigmaStatus, loading: statusLoading, error: statusError } = useApi(getSigmaStatus, { autoExecute: true });
  const { data: capabilities, loading: capsLoading, error: capsError } = useApi(getSigmaCapabilities, { autoExecute: true });
  const { data: dbHealth, loading: healthLoading, error: healthError } = useApi(getHealthCheck, { autoExecute: true });
  const { data: userData, loading: userLoading, error: userError } = useApi(getRawUserData, { autoExecute: true });
  const { data: userCountData, loading: countLoading, error: countError } = useApi(getUserCount, { autoExecute: true });

  const loading = statusLoading || capsLoading || healthLoading || userLoading || countLoading;
  const error = statusError || capsError || healthError || userError || countError;

  // Debug logging
  React.useEffect(() => {
    console.log('SigmaStatusPage mounted');
    console.log('API Base URL:', process.env.REACT_APP_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Status loading:', statusLoading, 'Error:', statusError);
    console.log('Capabilities loading:', capsLoading, 'Error:', capsError);
    console.log('Health loading:', healthLoading, 'Error:', healthError);
    console.log('User data loading:', userLoading, 'Error:', userError);
    console.log('User count loading:', countLoading, 'Error:', countError);
    
    // Test the API URL directly
    if (process.env.REACT_APP_API_URL) {
      console.log('Testing API connectivity...');
      fetch(`${process.env.REACT_APP_API_URL}/health`)
        .then(response => response.json())
        .then(data => console.log('Direct fetch test successful:', data))
        .catch(err => console.error('Direct fetch test failed:', err));
    }
  }, [statusLoading, statusError, capsLoading, capsError, healthLoading, healthError, userLoading, userError, countLoading, countError]);

  if (loading) {
    return <LoadingSpinner message="Loading Sigma status..." />;
  }

  if (error) {
    console.error('Sigma Status Error Details:', {
      statusError,
      capsError,
      healthError,
      userError,
      countError,
      fullError: error
    });
    
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Error loading Sigma status
        </Typography>
        <Typography variant="body2" gutterBottom>
          {error.message || error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          API Base URL: {process.env.REACT_APP_API_URL}
        </Typography>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outlined" 
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // Extract the actual data from the API response with proper fallbacks
  const sigmaData = sigmaStatus?.data || sigmaStatus || {};
  const capabilitiesData = capabilities?.data || capabilities || {};
  const healthData = dbHealth?.data || dbHealth || {};
  const userDataArray = Array.isArray(userData) ? userData : [];
  const userCount = userCountData?.data?.total_users || 0;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'healthy':
      case 'enabled':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'disabled':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'healthy':
      case 'enabled':
        return <CheckIcon />;
      case 'warning':
        return <InfoIcon />;
      case 'error':
      case 'disabled':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Box>
      {/* Sigma Mode Toggle Component */}
      <SigmaModeToggle />
      
      {/* Connection Status Summary */}
      <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <CheckIcon sx={{ mr: 1, fontSize: 40 }} />
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  ✅ Connected to GrowthMarketer AI Server
                </Typography>
                <Typography variant="body1">
                  Server: {process.env.REACT_APP_API_URL || 'http://localhost:5555/api'}
                </Typography>
                <Typography variant="body2">
                  Database: {healthData.database_mode || 'sqlite'} | Sigma Mode: {sigmaData.sigma_mode || 'standalone'}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<CheckIcon />}
              label="Connected"
              color="success"
              sx={{ color: 'white', bgcolor: 'success.dark' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Existing Status Content */}
      <Grid container spacing={3}>
        {/* Database Connection & User Count */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Database Connection
                </Typography>
              </Box>
              
              {healthData ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Status:
                    </Typography>
                    <Chip
                      icon={getStatusIcon(healthData.status)}
                      label={healthData.status}
                      color={getStatusColor(healthData.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {healthData.message || 'Database connection is healthy'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  
                  {/* User Count Information */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      Database Users
                    </Typography>
                  </Box>
                  
                  {userDataArray.length > 0 ? (
                    <Box>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {userCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Total users in database
                      </Typography>
                      
                      {/* Sample Users */}
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" mb={1}>Sample Users:</Typography>
                        {userDataArray.slice(0, 3).map((user, index) => (
                          <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem' }}>
                            • {user.username || 'Unknown'} ({user.email || 'No email'})
                          </Typography>
                        ))}
                        {userDataArray.length > 3 && (
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            ... and {userDataArray.length - 3} more
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No user data available
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No database health information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sigma Framework Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CodeIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Sigma Framework Status
                </Typography>
              </Box>
              
              {sigmaData ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Status:
                    </Typography>
                    <Chip
                      icon={getStatusIcon(sigmaData.sigma_layer?.status || sigmaData.sigma_mode)}
                      label={sigmaData.sigma_layer?.status || sigmaData.sigma_mode || 'Unknown'}
                      color={getStatusColor(sigmaData.sigma_layer?.status || sigmaData.sigma_mode)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Sigma framework is {sigmaData.sigma_layer?.status || sigmaData.sigma_mode || 'operational'}
                  </Typography>

                  {sigmaData.database_adapter && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" mb={1}>Database Adapter:</Typography>
                      <Chip
                        label={sigmaData.database_adapter.type}
                        color="primary"
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={sigmaData.database_adapter.status}
                        color={getStatusColor(sigmaData.database_adapter.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  )}
                  
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                      {JSON.stringify(sigmaData, null, 2)}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No status information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sigma Capabilities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Sigma Framework Capabilities
                </Typography>
              </Box>
              
              {capabilitiesData ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Available Sigma framework capabilities
                  </Typography>
                  
                  {capabilitiesData.input_tables && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" mb={1}>Input Tables:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {capabilitiesData.input_tables.map((table, index) => (
                          <Chip
                            key={index}
                            label={table}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {capabilitiesData.layout_elements && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" mb={1}>Layout Elements:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {capabilitiesData.layout_elements.map((element, index) => (
                          <Chip
                            key={index}
                            label={element}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {capabilitiesData.actions && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" mb={1}>Actions:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {capabilitiesData.actions.map((action, index) => (
                          <Chip
                            key={index}
                            label={action}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mt: 2 }}>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                      {JSON.stringify(capabilitiesData, null, 2)}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No capabilities information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SigmaStatusPage; 