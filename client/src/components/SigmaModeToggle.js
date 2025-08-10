import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import apiClient from '../services/api';

const SigmaModeToggle = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSigmaConfig();
      setConfig(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSigmaMode = async (newMode) => {
    try {
      setToggling(true);
      setError(null);
      
      const result = await apiClient.toggleSigmaMode(newMode);
      setConfig(result.config);
      
      // Show success message
      alert(`Sigma mode successfully changed to ${newMode}! Please refresh the page to see all changes.`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'standalone':
        return 'Local development mode with SQLite database';
      case 'mock_warehouse':
        return 'Testing mode with simulated data warehouse';
      case 'sigma':
        return 'Production mode with real Sigma integration';
      default:
        return 'Unknown mode';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'standalone':
        return 'default';
      case 'mock_warehouse':
        return 'warning';
      case 'sigma':
        return 'success';
      default:
        return 'error';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error: {error}
        <Button 
          onClick={fetchConfig} 
          size="small" 
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <ComputerIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Sigma Framework Mode Control
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Current Status */}
        <Box flex={1}>
          <Typography variant="subtitle1" gutterBottom>
            Current Configuration
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Mode:
            </Typography>
            <Chip 
              label={config?.sigma_mode || 'unknown'} 
              color={getModeColor(config?.sigma_mode)}
              size="small"
            />
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Database:
            </Typography>
            <Chip 
              label={config?.database_mode || 'unknown'} 
              color="primary"
              size="small"
            />
          </Box>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Status:
            </Typography>
            <Chip 
              label={config?.sigma_enabled ? 'Enabled' : 'Disabled'} 
              color={config?.sigma_enabled ? 'success' : 'default'}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {getModeDescription(config?.sigma_mode)}
          </Typography>
        </Box>

        {/* Mode Selection */}
        <Box flex={1}>
          <Typography variant="subtitle1" gutterBottom>
            Switch Mode
          </Typography>
          
          <Box mb={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => toggleSigmaMode('standalone')}
              disabled={toggling}
              startIcon={<StorageIcon />}
            >
              Standalone Mode
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              Local development with SQLite
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => toggleSigmaMode('mock_warehouse')}
              disabled={toggling}
              startIcon={<CloudIcon />}
            >
              Mock Warehouse Mode
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              Testing with simulated data
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => toggleSigmaMode('sigma')}
              disabled={toggling}
              startIcon={<SettingsIcon />}
            >
              Sigma Mode
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              Production with real warehouse
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Features Status */}
      {config?.features && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Available Features
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Object.entries(config.features).map(([feature, enabled]) => (
              <Chip
                key={feature}
                label={feature.replace(/_/g, ' ')}
                color={enabled ? 'success' : 'default'}
                size="small"
                variant={enabled ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          startIcon={<SettingsIcon />}
          onClick={fetchConfig}
          disabled={toggling}
          size="small"
        >
          Refresh Status
        </Button>
        
        {toggling && (
          <Box display="flex" alignItems="center">
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">Updating mode...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SigmaModeToggle; 