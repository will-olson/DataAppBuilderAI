// src/components/common/Navbar.js
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
  Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

// Mock context - replace with actual auth context
const AuthContext = React.createContext(null);

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
    // Implement logout logic
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
          User Insights Platform
        </Typography>

        {/* Quick Navigation */}
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/segmentation">
          Segmentation
        </Button>
        <Button color="inherit" component={Link} to="/user-journey">
          User Journey
        </Button>

        {/* Search and Notifications */}
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton 
          color="inherit" 
          onClick={handleNotificationsOpen}
        >
          <NotificationsIcon />
        </IconButton>

        {/* User Profile */}
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

        {/* Profile Menu */}
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

        {/* Notifications Menu */}
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