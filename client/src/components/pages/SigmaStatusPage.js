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
    refetchStatus();
    refetchCaps();
    refetchHealth();
    refetchUser();
    refetchCount();
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
      await Promise.all([
        refetchStatus(),
        refetchCaps(),
        refetchHealth(),
        refetchUser(),
        refetchCount()
      ]);
      
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
          await Promise.all([
            refetchHealth(),
            refetchUser(),
            refetchCount()
          ]);
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

  return (
    <Box>
      {/* Notifications */}
      {notifications.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              severity={notification.type}
              sx={{ mb: 1 }}
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
        </Box>
      )}
      
      {/* Sigma Mode Toggle Component */}
      <SigmaModeToggle />
      
      {/* System Status Summary */}
      <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
            >
              Refresh Overview
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
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
            
            <Grid item xs={12} sm={6} md={3}>
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
            
            <Grid item xs={12} sm={6} md={3}>
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
            
            <Grid item xs={12} sm={6} md={3}>
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
            <Box display="flex" gap={1} alignItems="center">
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
      <Card sx={{ mb: 3, bgcolor: healthData.status === 'healthy' ? 'success.light' : 'error.light', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {healthData.status === 'healthy' ? (
                <CheckIcon sx={{ mr: 1, fontSize: 40 }} />
              ) : (
                <ErrorIcon sx={{ mr: 1, fontSize: 40 }} />
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
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={smartRefresh}
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Smart Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={refreshAllData}
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
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
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Button>
              <Chip
                icon={healthData.status === 'healthy' ? <CheckIcon /> : <ErrorIcon />}
                label={healthData.status === 'healthy' ? 'Connected' : 'Issues Detected'}
                color={healthData.status === 'healthy' ? 'success' : 'error'}
                sx={{ color: 'white', bgcolor: healthData.status === 'healthy' ? 'success.dark' : 'error.dark' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Existing Status Content */}
      <Grid container spacing={3}>
        {/* Database Connection & User Count */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
                    refetchHealth();
                    refetchUser();
                    refetchCount();
                  }}
                  startIcon={<StorageIcon />}
                >
                  Refresh DB
                </Button>
              </Box>
              
              {healthData ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <CodeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Sigma Framework Status
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    refetchStatus();
                    refetchCaps();
                  }}
                  startIcon={<CodeIcon />}
                >
                  Refresh Sigma
                </Button>
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
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Sigma Framework Capabilities
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => refetchCaps()}
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