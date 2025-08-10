// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore,
  Storage as StorageIcon,
  ViewModule as LayoutIcon,
  Bolt as ActionIcon,
  Assessment as AssessmentIcon,
  Code as CodeIcon,
  Build as BuildIcon
} from '@mui/icons-material';

// Import existing pages
import DashboardPage from './components/pages/Dashboard';
import UserSegmentsPage from './components/pages/Segmentation';
import UserJourneyPage from './components/pages/UserJourney';
import PersonalizationPage from './components/pages/PersonalizationPage';
import ChurnPredictionPage from './components/pages/ChurnPredictionPage';
import ReferralInsightsPage from './components/pages/ReferralGrowthPage';
import RawUserDataPage from './components/pages/DataExplorationPage';
import AIInsightsPage from './components/pages/StrategicAnalysisPage';
import FeatureUsagePage from './components/pages/FeatureUsagePage';
import RevenueForecastPage from './components/pages/PredictiveInsightsPage';

// Import new Sigma framework pages
import SigmaStatusPage from './components/pages/SigmaStatusPage';
import InputTablesPage from './components/pages/InputTablesPage';
import LayoutElementsPage from './components/pages/LayoutElementsPage';
import ActionsPage from './components/pages/ActionsPage';
import SigmaPlaygroundPage from './components/pages/SigmaPlaygroundPage';
import SigmaDataAppsBuilderPage from './components/pages/SigmaDataAppsBuilderPage';

// Import ErrorBoundary
import ErrorBoundary from './components/common/ErrorBoundary';

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [open, setOpen] = useState(true);
  const [sigmaMenuOpen, setSigmaMenuOpen] = useState(true);
  const [analyticsMenuOpen, setAnalyticsMenuOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      page: DashboardPage
    }
  ];

  const analyticsItems = [
    {
      text: 'User Segments',
      icon: <PeopleIcon />,
      path: '/analytics/user-segments',
      page: UserSegmentsPage
    },
    {
      text: 'User Journey',
      icon: <TimelineIcon />,
      path: '/analytics/user-journey',
      page: UserJourneyPage
    },
    {
      text: 'Personalization',
      icon: <TuneIcon />,
      path: '/analytics/personalization',
      page: PersonalizationPage
    },
    {
      text: 'Churn Prediction',
      icon: <AssessmentIcon />,
      path: '/analytics/churn-prediction',
      page: ChurnPredictionPage
    },
    {
      text: 'Referral Insights',
      icon: <AnalyticsIcon />,
      path: '/analytics/referral-insights',
      page: ReferralInsightsPage
    },
    {
      text: 'Raw User Data',
      icon: <CodeIcon />,
      path: '/analytics/raw-user-data',
      page: RawUserDataPage
    },
    {
      text: 'AI Insights',
      icon: <AnalyticsIcon />,
      path: '/analytics/ai-insights',
      page: AIInsightsPage
    },
    {
      text: 'Feature Usage',
      icon: <AnalyticsIcon />,
      path: '/analytics/feature-usage',
      page: FeatureUsagePage
    },
    {
      text: 'Revenue Forecast',
      icon: <AnalyticsIcon />,
      path: '/analytics/revenue-forecast',
      page: RevenueForecastPage
    }
  ];

  const sigmaItems = [
    {
      text: 'Framework Status',
      icon: <AssessmentIcon />,
      path: '/sigma/status',
      page: SigmaStatusPage
    },
    {
      text: 'Development Playground',
      icon: <CodeIcon />,
      path: '/sigma/playground',
      page: SigmaPlaygroundPage
    },
    {
      text: 'Data Apps Builder',
      icon: <BuildIcon />,
      path: '/sigma/data-apps-builder',
      page: SigmaDataAppsBuilderPage
    },
    {
      text: 'Input Tables',
      icon: <StorageIcon />,
      path: '/sigma/input-tables',
      page: InputTablesPage
    },
    {
      text: 'Layout Elements',
      icon: <LayoutIcon />,
      path: '/sigma/layout-elements',
      page: LayoutElementsPage
    },
    {
      text: 'Actions Framework',
      icon: <ActionIcon />,
      path: '/sigma/actions',
      page: ActionsPage
    }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          GrowthMarketer AI
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Main Dashboard */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Analytics Section */}
      <List>
        <ListItemButton onClick={() => setAnalyticsMenuOpen(!analyticsMenuOpen)}>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
          {analyticsMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={analyticsMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {analyticsItems.map((item) => (
              <ListItemButton
                key={item.text}
                sx={{ pl: 4 }}
                component={Link}
                to={item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <Divider />

      {/* Sigma Framework Section */}
      <List>
        <ListItemButton onClick={() => setSigmaMenuOpen(!sigmaMenuOpen)}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="Sigma Framework" />
          {sigmaMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={sigmaMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sigmaItems.map((item) => (
              <ListItemButton
                key={item.text}
                sx={{ pl: 4 }}
                component={Link}
                to={item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  GrowthMarketer AI - Sigma Framework
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              {/* Mobile drawer */}
              <Drawer
                variant="temporary"
                open={open}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
              >
                {drawer}
              </Drawer>
              
              {/* Desktop drawer */}
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                mt: 8
              }}
            >
              <Routes>
                {/* Main Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Analytics Routes */}
                <Route path="/analytics/user-segments" element={<UserSegmentsPage />} />
                <Route path="/analytics/user-journey" element={<UserJourneyPage />} />
                <Route path="/analytics/personalization" element={<PersonalizationPage />} />
                <Route path="/analytics/churn-prediction" element={<ChurnPredictionPage />} />
                <Route path="/analytics/referral-insights" element={<ReferralInsightsPage />} />
                <Route path="/analytics/raw-user-data" element={<RawUserDataPage />} />
                <Route path="/analytics/ai-insights" element={<AIInsightsPage />} />
                <Route path="/analytics/feature-usage" element={<FeatureUsagePage />} />
                <Route path="/analytics/revenue-forecast" element={<RevenueForecastPage />} />
                
                {/* Sigma Framework Routes */}
                <Route path="/sigma/status" element={<SigmaStatusPage />} />
                <Route path="/sigma/playground" element={<SigmaPlaygroundPage />} />
                <Route path="/sigma/data-apps-builder" element={<SigmaDataAppsBuilderPage />} />
                <Route path="/sigma/input-tables" element={<InputTablesPage />} />
                <Route path="/sigma/layout-elements" element={<LayoutElementsPage />} />
                <Route path="/sigma/actions" element={<ActionsPage />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;