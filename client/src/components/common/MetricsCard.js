import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

const MetricsCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendPeriod = 'vs last period',
  color = 'primary',
  variant = 'outlined',
  size = 'medium',
  icon,
  onClick,
  sx = {}
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      case 'flat':
        return <TrendingFlatIcon color="action" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'default';
    
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      case 'flat':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { p: 1.5, minHeight: 80 };
      case 'large':
        return { p: 3, minHeight: 140 };
      default:
        return { p: 2, minHeight: 100 };
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card
      variant={variant}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 4
        } : {},
        ...sx
      }}
      onClick={onClick}
    >
      <CardContent sx={getSizeStyles()}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant={size === 'large' ? 'h6' : size === 'small' ? 'body2' : 'subtitle2'} 
            color="text.secondary"
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          
          {icon && (
            <Box sx={{ ml: 1, color: `${color}.main` }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography 
          variant={size === 'large' ? 'h4' : size === 'small' ? 'h6' : 'h5'} 
          component="div"
          sx={{ 
            fontWeight: 'bold',
            color: `${color}.main`,
            mb: 1
          }}
        >
          {formatValue(value)}
        </Typography>

        {subtitle && (
          <Typography 
            variant={size === 'small' ? 'caption' : 'body2'} 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getTrendIcon()}
            <Chip
              label={`${trendValue} ${trendPeriod}`}
              size="small"
              color={getTrendColor()}
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard; 