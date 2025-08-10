import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

const ChartContainer = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  onRefresh,
  onDownload,
  onFullscreen,
  actions,
  height = 400,
  minHeight = 300,
  maxHeight = 600,
  showActions = true,
  elevation = 2,
  sx = {}
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen();
    }
  };

  return (
    <Paper 
      elevation={elevation} 
      sx={{ 
        height,
        minHeight,
        maxHeight,
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {/* Header */}
      {(title || subtitle || showActions) && (
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            {title && (
              <Typography variant="h6" component="h3" gutterBottom={!!subtitle}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onRefresh && (
                <Tooltip title="Refresh data">
                  <IconButton size="small" onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {onDownload && (
                <Tooltip title="Download chart">
                  <IconButton size="small" onClick={handleDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {onFullscreen && (
                <Tooltip title="Fullscreen">
                  <IconButton size="small" onClick={handleFullscreen}>
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Content */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {loading ? (
          <LoadingSpinner message="Loading chart..." />
        ) : error ? (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        ) : (
          <Fade in={true} timeout={500}>
            <Box sx={{ width: '100%', height: '100%' }}>
              {children}
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
};

export default ChartContainer; 