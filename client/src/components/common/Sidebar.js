import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Tune as TuneIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  ViewModule as LayoutIcon,
  Bolt as ActionIcon,
  Build as BuildIcon,
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  ScatterPlot as ScatterPlotIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: <DashboardIcon />, 
      link: '/dashboard' 
    },
    { 
      title: 'User Segments', 
      icon: <PeopleIcon />, 
      link: '/analytics/user-segments' 
    },
    { 
      title: 'User Journey', 
      icon: <TimelineIcon />, 
      link: '/analytics/user-journey' 
    },
    { 
      title: 'Personalization', 
      icon: <TuneIcon />, 
      link: '/analytics/personalization' 
    },
    { 
      title: 'Churn Prediction', 
      icon: <AssessmentIcon />, 
      link: '/analytics/churn-prediction' 
    },
    { 
      title: 'Referral Insights', 
      icon: <AnalyticsIcon />, 
      link: '/analytics/referral-insights' 
    },
    { 
      title: 'Feature Usage', 
      icon: <AnalyticsIcon />, 
      link: '/analytics/feature-usage' 
    },
    { 
      title: 'Data Exploration', 
      icon: <CodeIcon />, 
      link: '/analytics/raw-user-data' 
    },
    { 
      title: 'AI Insights', 
      icon: <BrainIcon />, 
      link: '/analytics/ai-insights' 
    },
    { 
      title: 'Revenue Forecast', 
      icon: <TrendingUpIcon />, 
      link: '/analytics/revenue-forecast' 
    },
    { 
      title: 'Strategic Analysis', 
      icon: <BrainIcon />, 
      link: '/strategic-analysis' 
    },
    { 
      title: 'A/B Testing', 
      icon: <ScatterPlotIcon />, 
      link: '/ab-testing' 
    },
    { 
      title: 'Predictive Insights', 
      icon: <TrendingUpIcon />, 
      link: '/predictive-insights' 
    }
  ];

  const sigmaItems = [
    { 
      title: 'Framework Status', 
      icon: <AssessmentIcon />, 
      link: '/sigma/status' 
    },
    { 
      title: 'Development Playground', 
      icon: <CodeIcon />, 
      link: '/sigma/playground' 
    },
    { 
      title: 'Data Apps Builder', 
      icon: <BuildIcon />, 
      link: '/sigma/data-apps-builder' 
    },
    { 
      title: 'Input Tables', 
      icon: <StorageIcon />, 
      link: '/sigma/input-tables' 
    },
    { 
      title: 'Layout Elements', 
      icon: <LayoutIcon />, 
      link: '/sigma/layout-elements' 
    },
    { 
      title: 'Actions Framework', 
      icon: <ActionIcon />, 
      link: '/sigma/actions' 
    }
  ];

  if (isMobile) {
    return null; // Mobile navigation is handled by the navbar drawer
  }

  return (
    <Paper
      elevation={1}
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        top: 64, // Below navbar
        left: 0,
        zIndex: theme.zIndex.drawer,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Navigation
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Main Analytics Section */}
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ px: 2, py: 1, fontWeight: 600 }}
          >
            Analytics & Insights
          </Typography>
          <List dense>
            {sidebarItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  selected={location.pathname === item.link}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36,
                      color: location.pathname === item.link ? 'inherit' : 'text.secondary'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.link ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Sigma Framework Section */}
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ px: 2, py: 1, fontWeight: 600 }}
          >
            Sigma Framework
          </Typography>
          <List dense>
            {sigmaItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  selected={location.pathname === item.link}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.secondary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36,
                      color: location.pathname === item.link ? 'inherit' : 'text.secondary'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.link ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
};

export default Sidebar;