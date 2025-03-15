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
  Box
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import BrainIcon from '@mui/icons-material/Psychology'; // AI/Brain icon
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            color: 'inherit', 
            textDecoration: 'none' 
          }}
        >
          Growth Product Marketing AI Assistant
        </Typography>

        {/* Quick Navigation
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/segmentation">
          Segmentation
        </Button>
        <Button color="inherit" component={Link} to="/user-journey">
          User Journey
        </Button> */}

        {/* AI-Powered Insights */}
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
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<ScatterPlotIcon />} 
            label="A/B Testing" 
            component={Link} 
            to="/ab-testing"
            color="secondary"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<TrendingUpIcon />} 
            label="Predictive Insights" 
            component={Link} 
            to="/predictive-insights"
            color="warning"
            variant="outlined"
          />
        </Box>

        {/* Rest of the Navbar remains the same */}
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton 
          color="inherit" 
          onClick={handleNotificationsOpen}
        >
          <NotificationsIcon />
        </IconButton>

        <IconButton 
          color="inherit" 
          onClick={handleProfileMenuOpen}
        >
          {user.avatar ? (
            <Avatar src={user.avatar} alt={user.name} />
          ) : (
            <AccountCircleIcon />
          )}
        </IconButton>

        {/* Profile and Notifications Menus remain the same */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
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
        >
          <MenuItem>No new notifications</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;