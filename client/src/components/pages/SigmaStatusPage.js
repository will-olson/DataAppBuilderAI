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
  Divider,
  useTheme,
  useMediaQuery,
  Container,
  Stack
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  IntegrationInstructions as IntegrationInstructionsIcon,
  PlayArrow as PlayArrowIcon,
  NewReleases as NewReleasesIcon,
  Event as EventIcon
} from '@mui/icons-material';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import SigmaModeToggle from '../SigmaModeToggle';
import { Link } from 'react-router-dom';

const SigmaStatusPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoize API functions to prevent recreation on every render
  const getSigmaStatus = React.useCallback(() => apiClient.getSigmaStatus(), []);
  const getSigmaCapabilities = React.useCallback(() => apiClient.getSigmaCapabilities(), []);
  const getHealthCheck = React.useCallback(() => apiClient.healthCheck(), []);
  const getRawUserData = React.useCallback(() => apiClient.getRawUserData(5, 0), []);
  const getUserCount = React.useCallback(() => apiClient.getUserCount(), []);

  // Use the useApi hook for data fetching with better error handling
  const { data: sigmaStatus, loading: statusLoading, error: statusError, refetch: refetchStatus } = useApi(getSigmaStatus, { autoExecute: true });
  const { data: capabilities, loading: capsLoading, error: capsError, refetch: refetchCaps } = useApi(getSigmaCapabilities, { autoExecute: true });
  const { data: dbHealth, loading: healthLoading, error: healthError, refetch: refetchHealth } = useApi(getHealthCheck, { autoExecute: true });
  const { data: userData, loading: userLoading, error: userError, refetch: refetchUser } = useApi(getRawUserData, { autoExecute: true });
  const { data: userCountData, loading: countLoading, error: countError, refetch: refetchCount } = useApi(getUserCount, { autoExecute: true });

  const loading = statusLoading || capsLoading || healthLoading || userLoading || countLoading;
  const error = statusError || capsError || healthError || userError || countError;

  // Auto-refresh functionality
  const [autoRefresh, setAutoRefresh] = React.useState(false);
  const [refreshInterval, setRefreshInterval] = React.useState(30000); // 30 seconds
  const [lastRefreshTime, setLastRefreshTime] = React.useState(new Date());
  const [notifications, setNotifications] = React.useState([]);

  // Update last refresh time when any refresh occurs
  const updateRefreshTime = () => {
    setLastRefreshTime(new Date());
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Manual refresh function
  const refreshAllData = () => {
    updateRefreshTime();
    addNotification('Refreshing all data...', 'info');
    
    // Add error handling for refetch functions
    try {
      if (typeof refetchStatus === 'function') refetchStatus();
      if (typeof refetchCaps === 'function') refetchCaps();
      if (typeof refetchHealth === 'function') refetchHealth();
      if (typeof refetchUser === 'function') refetchUser();
      if (typeof refetchCount === 'function') refetchCount();
    } catch (error) {
      console.error('Error during manual refresh:', error);
      addNotification(`Manual refresh failed: ${error.message}`, 'error');
    }
  };

  // Enhanced refresh function that also fetches current Sigma configuration
  const refreshWithConfig = async () => {
    try {
      updateRefreshTime();
      addNotification('Performing enhanced refresh with configuration update...', 'info');
      // First get the current Sigma configuration to ensure we have the latest mode
      const configResponse = await apiClient.getSigmaConfig();
      console.log('Current Sigma config after refresh:', configResponse);
      
      // Then refresh all data with the updated configuration
      const refreshPromises = [];
      if (typeof refetchStatus === 'function') refreshPromises.push(refetchStatus());
      if (typeof refetchCaps === 'function') refreshPromises.push(refetchCaps());
      if (typeof refetchHealth === 'function') refreshPromises.push(refetchHealth());
      if (typeof refetchUser === 'function') refreshPromises.push(refetchUser());
      if (typeof refetchCount === 'function') refreshPromises.push(refetchCount());
      
      if (refreshPromises.length > 0) {
        await Promise.all(refreshPromises);
      }
      
      addNotification('Enhanced refresh completed successfully!', 'success');
      
      // Force a re-render by updating state
      setAutoRefresh(prev => prev); // This triggers a re-render
      
    } catch (error) {
      console.error('Error during enhanced refresh:', error);
      addNotification(`Refresh failed: ${error.message}`, 'error');
    }
  };

  // Mode-aware refresh that checks if configuration has changed
  const smartRefresh = async () => {
    try {
      // Get current configuration
      const currentConfig = await apiClient.getSigmaConfig();
      
      // Check if we need to refresh based on mode changes
      const needsFullRefresh = !sigmaStatus || 
                              sigmaStatus.sigma_mode !== currentConfig.sigma_mode ||
                              sigmaStatus.database_mode !== currentConfig.database_mode;
      
      if (needsFullRefresh) {
        console.log('Mode change detected, performing full refresh...');
        addNotification('Mode change detected, performing full refresh...', 'warning');
        await refreshWithConfig();
      } else {
        console.log('Performing standard refresh...');
        addNotification('Performing standard refresh...', 'info');
        refreshAllData();
      }
    } catch (error) {
      console.error('Error during smart refresh:', error);
      addNotification(`Smart refresh failed: ${error.message}`, 'error');
      // Fallback to standard refresh
      refreshAllData();
    }
  };

  // Monitor for Sigma mode changes and refresh data accordingly
  React.useEffect(() => {
    if (sigmaStatus?.sigma_mode) {
      console.log('Sigma mode detected:', sigmaStatus.sigma_mode);
      // Refresh data when mode changes to ensure accurate display
      const refreshForModeChange = async () => {
        try {
          addNotification(`Sigma mode changed to: ${sigmaStatus.sigma_mode}`, 'info');
          const refreshPromises = [];
          if (typeof refetchHealth === 'function') refreshPromises.push(refetchHealth());
          if (typeof refetchUser === 'function') refreshPromises.push(refetchUser());
          if (typeof refetchCount === 'function') refreshPromises.push(refetchCount());
          
          if (refreshPromises.length > 0) {
            await Promise.all(refreshPromises);
          }
          addNotification('Data refreshed after mode change', 'success');
        } catch (error) {
          console.error('Error refreshing data after mode change:', error);
          addNotification(`Failed to refresh data after mode change: ${error.message}`, 'error');
        }
      };
      refreshForModeChange();
    }
  }, [sigmaStatus?.sigma_mode, refetchHealth, refetchUser, refetchCount]);

  React.useEffect(() => {
    let interval;
    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(() => {
        // Use smart refresh for auto-refresh to detect mode changes
        smartRefresh();
      }, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, smartRefresh]);

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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error loading Sigma status
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error.message || error}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:5555/api'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Environment: {process.env.NODE_ENV || 'development'}
          </Typography>
          <Box mt={2}>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outlined" 
              sx={{ mr: 1 }}
            >
              Retry
            </Button>
            <Button 
              onClick={() => {
                console.log('Debug Info:', {
                  apiUrl: process.env.REACT_APP_API_URL,
                  nodeEnv: process.env.NODE_ENV,
                  errors: { statusError, capsError, healthError, userError, countError }
                });
              }} 
              variant="text" 
              size="small"
            >
              Debug Info
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  // Extract the actual data from the API response with proper fallbacks
  const sigmaData = sigmaStatus || {};
  const capabilitiesData = capabilities || {};
  const healthData = dbHealth || {};
  const userDataArray = Array.isArray(userData) ? userData : [];
  const userCount = userCountData?.total_users || 0;

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

  const getModeColor = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'standalone':
      case 'local':
        return 'info';
      case 'cloud':
        return 'primary';
      case 'hybrid':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100%',
      py: { xs: 2, sm: 3 },
      px: { xs: 1, sm: 2 },
      overflow: 'visible',
      '& .MuiCard-root': {
        '@media (max-width:600px)': {
          marginBottom: 2,
        }
      },
      '& .MuiGrid-container': {
        '@media (max-width:600px)': {
          marginLeft: -1,
          marginRight: -1,
        }
      },
      '& .MuiGrid-item': {
        '@media (max-width:600px)': {
          paddingLeft: 1,
          paddingRight: 1,
        }
      }
    }}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              severity={notification.type}
              onClose={() => removeNotification(notification.id)}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                >
                  Dismiss
                </Button>
              }
            >
              <Typography variant="body2">
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.timestamp.toLocaleTimeString()}
              </Typography>
            </Alert>
          ))}
        </Stack>
      )}
      
      {/* Sigma Mode Toggle Component */}
      <Box sx={{ mb: 3 }}>
        <SigmaModeToggle />
      </Box>
      
      {/* System Status Summary */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: 'grey.50',
        '@media (max-width:600px)': {
          mb: 2,
          '& .MuiCardContent-root': {
            padding: 2,
          }
        }
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center">
              <InfoIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                System Status Summary
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={smartRefresh}
              startIcon={<InfoIcon />}
              sx={{
                '@media (max-width:600px)': {
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                }
              }}
            >
              Refresh Overview
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={healthData.status === 'healthy' ? 'success.main' : 'error.main'}>
                  {healthData.status === 'healthy' ? '✅' : '❌'}
                </Typography>
                <Typography variant="body2">Database</Typography>
                <Typography variant="caption" color="text.secondary">
                  {healthData.status || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {sigmaData.sigma_mode || 'standalone'}
                </Typography>
                <Typography variant="body2">Sigma Mode</Typography>
                <Typography variant="caption" color="text.secondary">
                  {sigmaData.sigma_layer?.status || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary.main">
                  {userCount}
                </Typography>
                <Typography variant="body2">Total Users</Typography>
                <Typography variant="caption" color="text.secondary">
                  In Database
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={autoRefresh ? 'success.main' : 'default.main'}>
                  {autoRefresh ? '🔄' : '⏸️'}
                </Typography>
                <Typography variant="body2">Auto-Refresh</Typography>
                <Typography variant="caption" color="text.secondary">
                  {autoRefresh ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Status Information */}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {lastRefreshTime.toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Mode: {sigmaData.sigma_mode || 'standalone'} | Database: {sigmaData.database_mode || 'sqlite'}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Interval:
              </Typography>
              <select
                value={refreshInterval / 1000}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) * 1000)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
              <Chip
                label={`${autoRefresh ? 'Auto' : 'Manual'} Refresh`}
                color={autoRefresh ? 'success' : 'default'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${refreshInterval / 1000}s Interval`}
                color="info"
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Connection Status Summary */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: healthData.status === 'healthy' ? 'success.light' : 'error.light', 
        color: 'white',
        '@media (max-width:600px)': {
          mb: 2,
          '& .MuiCardContent-root': {
            padding: 2,
          }
        }
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              {healthData.status === 'healthy' ? (
                <CheckIcon sx={{ mr: 1, fontSize: { xs: 32, sm: 40 } }} />
              ) : (
                <ErrorIcon sx={{ mr: 1, fontSize: { xs: 32, sm: 40 } }} />
              )}
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {healthData.status === 'healthy' ? '✅ Connected to GrowthMarketer AI Server' : '❌ Connection Issues Detected'}
                </Typography>
                <Typography variant="body1">
                  Server: {process.env.REACT_APP_API_URL || 'http://localhost:5555/api'}
                </Typography>
                <Typography variant="body2">
                  Database: {healthData.database_mode || 'sqlite'} | Sigma Mode: {sigmaData.sigma_mode || 'standalone'}
                </Typography>
                {healthData.message && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {healthData.message}
                  </Typography>
                )}
                {healthData.timestamp && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
                    Last checked: {new Date(healthData.timestamp).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                size="small"
                onClick={smartRefresh}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white', 
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  '@media (max-width:600px)': {
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                  }
                }}
              >
                Smart Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={refreshAllData}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white', 
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  '@media (max-width:600px)': {
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                  }
                }}
              >
                Refresh Status
              </Button>
              <Button
                variant={autoRefresh ? "contained" : "outlined"}
                size="small"
                onClick={() => setAutoRefresh(!autoRefresh)}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white', 
                  bgcolor: autoRefresh ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  '@media (max-width:600px)': {
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                  }
                }}
              >
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Button>
              <Chip
                icon={healthData.status === 'healthy' ? <CheckIcon /> : <ErrorIcon />}
                label={healthData.status === 'healthy' ? 'Connected' : 'Issues Detected'}
                color={healthData.status === 'healthy' ? 'success' : 'error'}
                sx={{ 
                  color: 'white', 
                  bgcolor: healthData.status === 'healthy' ? 'success.dark' : 'error.dark',
                  '@media (max-width:600px)': {
                    fontSize: '0.75rem',
                    height: 24,
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
        {/* Database Connection & User Count */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center">
                  <StorageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Database Connection
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    if (typeof refetchHealth === 'function') refetchHealth();
                    if (typeof refetchUser === 'function') refetchUser();
                    if (typeof refetchCount === 'function') refetchCount();
                  }}
                  startIcon={<StorageIcon />}
                >
                  Refresh DB
                </Button>
              </Box>
              
              {healthData ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Status:
                    </Typography>
                    <Chip
                      icon={getStatusIcon(healthData.status)}
                      label={healthData.status || 'Unknown'}
                      color={getStatusColor(healthData.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {healthData.message || 'Database connection status'}
                  </Typography>

                  {healthData.timestamp && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      Last checked: {new Date(healthData.timestamp).toLocaleString()}
                    </Typography>
                  )}

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
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Framework Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={`Mode: ${sigmaStatus?.mode || 'Unknown'}`}
                  color={getModeColor(sigmaStatus?.status)}
                  sx={{ mb: 1 }}
                />
                <Chip 
                  label={`Status: ${sigmaStatus?.status || 'Unknown'}`}
                  color={sigmaStatus?.status === 'active' ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Current Sigma framework operational mode and status.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* SDK Integration */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                <IntegrationInstructionsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                SDK Integration
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label="React SDK v0.7.0"
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Chip 
                  label="Embed SDK v0.7.0"
                  color="secondary"
                  sx={{ mb: 1 }}
                />
                <Chip 
                  label="TypeScript Support"
                  color="info"
                  sx={{ mb: 1 }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Official Sigma React SDK integration for true platform compatibility.
              </Typography>
              
              <Button
                variant="contained"
                component={Link}
                to="/sigma/playground"
                startIcon={<PlayArrowIcon />}
                sx={{ mt: 'auto' }}
              >
                Open Development Playground
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* New Sigma SDK Features */}
        <Grid item xs={12}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NewReleasesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sigma SDK Integration Features
              </Typography>
              
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <IntegrationInstructionsIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      True Platform Compatibility
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      Use Sigma's official React SDK for seamless integration with Sigma's platform.
                      Build data applications that can be directly imported into Sigma.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <EventIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Real-time Communication
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      PostMessage-based communication with Sigma iframes. Handle workbook lifecycle,
                      user interactions, and data synchronization in real-time.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CodeIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Developer Experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      TypeScript support, React hooks, and comprehensive event handling.
                      Perfect playground for developing Sigma-compatible data applications.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sigma Capabilities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center">
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Sigma Framework Capabilities
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    if (typeof refetchCaps === 'function') refetchCaps();
                  }}
                  startIcon={<SettingsIcon />}
                >
                  Refresh Capabilities
                </Button>
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
                  
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mt: 2, overflow: 'auto', maxHeight: 300 }}>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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