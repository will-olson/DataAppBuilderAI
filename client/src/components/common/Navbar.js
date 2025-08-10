import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  IconButton,
  Avatar,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import BrainIcon from '@mui/icons-material/Psychology'; // AI/Brain icon
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import TuneIcon from '@mui/icons-material/Tune';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CodeIcon from '@mui/icons-material/Code';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock user data - replace with actual user context
  const user = {
    name: 'Will Olson',
    role: 'Admin',
    avatar: null
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out');
    handleProfileMenuClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'User Segments', icon: <PeopleIcon />, path: '/analytics/user-segments' },
    { text: 'User Journey', icon: <TimelineIcon />, path: '/analytics/user-journey' },
    { text: 'Personalization', icon: <TuneIcon />, path: '/analytics/personalization' },
    { text: 'Churn Prediction', icon: <AssessmentIcon />, path: '/analytics/churn-prediction' },
    { text: 'Strategic Analysis', icon: <BrainIcon />, path: '/strategic-analysis' },
    { text: 'A/B Testing', icon: <ScatterPlotIcon />, path: '/ab-testing' },
    { text: 'Predictive Insights', icon: <TrendingUpIcon />, path: '/predictive-insights' },
    { text: 'Sigma Status', icon: <CodeIcon />, path: '/sigma/status' },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={1}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          width: '100%'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open mobile menu"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo/Title */}
          <Typography 
            variant={isSmallMobile ? "body1" : "h6"}
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              color: 'inherit', 
              textDecoration: 'none',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {isSmallMobile ? 'GrowthMarketer AI' : 'Growth Product Marketing AI Assistant'}
          </Typography>

          {/* Desktop AI Tools - Hidden on mobile */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                AI Tools
              </Typography>
              <Chip 
                icon={<BrainIcon />} 
                label="Strategic Analysis" 
                component={Link} 
                to="/strategic-analysis"
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip 
                icon={<ScatterPlotIcon />} 
                label="A/B Testing" 
                component={Link} 
                to="/ab-testing"
                color="secondary"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Predictive Insights" 
                component={Link} 
                to="/predictive-insights"
                color="warning"
                variant="outlined"
                size="small"
              />
            </Box>
          )}

          {/* Right side icons - Responsive sizing */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {!isSmallMobile && (
              <IconButton color="inherit" size="small">
                <SearchIcon />
              </IconButton>
            )}
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              size="small"
            >
              <NotificationsIcon />
            </IconButton>

            <IconButton 
              color="inherit" 
              onClick={handleProfileMenuOpen}
              size="small"
            >
              {user.avatar ? (
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 24, height: 24 }} />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
          </Box>

          {/* Profile and Notifications Menus */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: { minWidth: 150 }
            }}
          >
            <MenuItem component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem component={Link} to="/settings">
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem>No new notifications</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: { 
            width: 280,
            top: 0,
            height: '100%',
            zIndex: theme.zIndex.drawer
          }
        }}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 280,
            top: 0,
            height: '100%'
          },
        }}
      >
        <Box sx={{ pt: 8 }}>
          <List>
            {mobileMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  onClick={toggleMobileMenu}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;