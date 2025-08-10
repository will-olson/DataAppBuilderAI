import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { fetchSigmaStatus, fetchSigmaCapabilities, fetchDatabaseHealth } from '../../services/api';

const SigmaStatusPage = () => {
  const [sigmaStatus, setSigmaStatus] = useState(null);
  const [capabilities, setCapabilities] = useState(null);
  const [dbHealth, setDbHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const [status, caps, health] = await Promise.all([
          fetchSigmaStatus(),
          fetchSigmaCapabilities(),
          fetchDatabaseHealth()
        ]);
        
        setSigmaStatus(status);
        setCapabilities(caps);
        setDbHealth(health);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading Sigma status: {error}
      </Alert>
    );
  }

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sigma Framework Status
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor the health and capabilities of your Sigma framework integration
      </Typography>

      <Grid container spacing={3}>
        {/* Sigma Framework Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Framework Status</Typography>
              </Box>
              
              {sigmaStatus ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip
                      label={sigmaStatus.sigma_mode || 'Unknown'}
                      color={getStatusColor(sigmaStatus.sigma_mode)}
                      icon={getStatusIcon(sigmaStatus.sigma_mode)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Sigma Mode
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip
                      label={sigmaStatus.database_mode || 'Unknown'}
                      color={getStatusColor(sigmaStatus.database_mode)}
                      icon={getStatusIcon(sigmaStatus.database_mode)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Database Mode
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="error">Status unavailable</Typography>
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
                <Typography variant="h6">Database Health</Typography>
              </Box>
              
              {dbHealth ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip
                      label={dbHealth.status || 'Unknown'}
                      color={getStatusColor(dbHealth.status)}
                      icon={getStatusIcon(dbHealth.status)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Connection Status
                    </Typography>
                  </Box>
                  
                  {dbHealth.details && (
                    <Typography variant="body2" color="text.secondary">
                      {dbHealth.details}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography color="error">Health check unavailable</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sigma Capabilities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Framework Capabilities
              </Typography>
              
              {capabilities ? (
                <Grid container spacing={2}>
                  {Object.entries(capabilities).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Chip
                          label={value ? 'Available' : 'Not Available'}
                          color={value ? 'success' : 'default'}
                          size="small"
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="error">Capabilities unavailable</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Backend URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Updated:</strong> {new Date().toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Framework Version:</strong> 1.0.0
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SigmaStatusPage; 