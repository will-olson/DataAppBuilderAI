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
  Button
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  Code as CodeIcon
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

  // Use the useApi hook for data fetching with better error handling
  const { data: sigmaStatus, loading: statusLoading, error: statusError } = useApi(getSigmaStatus, { autoExecute: true });
  const { data: capabilities, loading: capsLoading, error: capsError } = useApi(getSigmaCapabilities, { autoExecute: true });
  const { data: dbHealth, loading: healthLoading, error: healthError } = useApi(getHealthCheck, { autoExecute: true });

  const loading = statusLoading || capsLoading || healthLoading;
  const error = statusError || capsError || healthError;

  // Debug logging
  React.useEffect(() => {
    console.log('SigmaStatusPage mounted');
    console.log('API Base URL:', process.env.REACT_APP_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Status loading:', statusLoading, 'Error:', statusError);
    console.log('Capabilities loading:', capsLoading, 'Error:', capsError);
    console.log('Health loading:', healthLoading, 'Error:', healthError);
    
    // Test the API URL directly
    if (process.env.REACT_APP_API_URL) {
      console.log('Testing API connectivity...');
      fetch(`${process.env.REACT_APP_API_URL}/health`)
        .then(response => response.json())
        .then(data => console.log('Direct fetch test successful:', data))
        .catch(err => console.error('Direct fetch test failed:', err));
    }
  }, [statusLoading, statusError, capsLoading, capsError, healthLoading, healthError]);

  if (loading) {
    return <LoadingSpinner message="Loading Sigma status..." />;
  }

  if (error) {
    console.error('Sigma Status Error Details:', {
      statusError,
      capsError,
      healthError,
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
      
      {/* Existing Status Content */}
      <Grid container spacing={3}>
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

        {/* Database Health */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Database Health
                </Typography>
              </Box>
              
              {healthData ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
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
                  
                  {healthData.details && (
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                        {JSON.stringify(healthData.details, null, 2)}
                      </Typography>
                    </Paper>
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