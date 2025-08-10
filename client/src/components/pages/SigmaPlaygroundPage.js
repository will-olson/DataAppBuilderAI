import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  DataObject as DataIcon,
  Event as EventIcon,
  IntegrationInstructions as IntegrationIcon
} from '@mui/icons-material';

import SigmaWorkbookEmbed from '../sigma/SigmaWorkbookEmbed.tsx';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';

/**
 * Sigma Development Playground Page
 * 
 * This page demonstrates true Sigma compatibility using the official React SDK.
 * Developers can use this as a playground to build and test Sigma data applications.
 */
const SigmaPlaygroundPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [workbookUrl, setWorkbookUrl] = useState('');
  const [workbookId, setWorkbookId] = useState('');
  const [workbookTitle, setWorkbookTitle] = useState('Sample Sigma Workbook');
  const [showControls, setShowControls] = useState(true);
  const [showVariables, setShowVariables] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [workbookHeight, setWorkbookHeight] = useState(600);
  
  // Sigma integration state
  const [workbookLoaded, setWorkbookLoaded] = useState(false);
  const [workbookError, setWorkbookError] = useState(null);
  const [workbookVariables, setWorkbookVariables] = useState({});
  const [workbookEvents, setWorkbookEvents] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // API calls - using proper API client functions
  const { data: sigmaStatus, loading: statusLoading, error: statusError } = useApi(
    () => apiClient.getSigmaStatus(),
    { autoExecute: true }
  );

  // Sample workbook URLs for testing
  const sampleWorkbooks = [
    {
      name: 'Sample Analytics Dashboard',
      url: 'https://app.sigmacomputing.com/sample-dashboard',
      description: 'Basic analytics dashboard with charts and tables'
    },
    {
      name: 'Marketing Performance',
      url: 'https://app.sigmacomputing.com/marketing-dashboard',
      description: 'Marketing metrics and KPIs dashboard'
    },
    {
      name: 'Sales Analytics',
      url: 'https://app.sigmacomputing.com/sales-analytics',
      description: 'Sales performance and forecasting dashboard'
    }
  ];

  // Handle workbook loaded
  const handleWorkbookLoaded = (workbook) => {
    setWorkbookLoaded(true);
    setWorkbookError(null);
    setWorkbookVariables(workbook.workbook?.variables || {});
    
    // Add to events log
    const event = {
      id: Date.now(),
      type: 'workbook:loaded',
      timestamp: new Date().toISOString(),
      data: workbook
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
  };

  // Handle workbook error
  const handleWorkbookError = (error) => {
    setWorkbookLoaded(false);
    setWorkbookError(error);
    
    const event = {
      id: Date.now(),
      type: 'workbook:error',
      timestamp: new Date().toISOString(),
      data: error
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  // Handle variable change
  const handleVariableChange = (variable) => {
    setWorkbookVariables(prev => ({
      ...prev,
      [variable.variable.name]: variable.variable.value
    }));
    
    const event = {
      id: Date.now(),
      type: 'workbook:variable:change',
      timestamp: new Date().toISOString(),
      data: variable
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  // Handle action outbound
  const handleActionOutbound = (action) => {
    const event = {
      id: Date.now(),
      type: 'workbook:action:outbound',
      timestamp: new Date().toISOString(),
      data: action
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  // Load sample workbook
  const loadSampleWorkbook = (sample) => {
    setWorkbookUrl(sample.url);
    setWorkbookTitle(sample.name);
    setWorkbookId(`sample-${Date.now()}`);
  };

  // Clear events
  const clearEvents = () => {
    setWorkbookEvents([]);
  };

  // Export events as JSON
  const exportEvents = () => {
    const dataStr = JSON.stringify(workbookEvents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sigma-events-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        🚀 Sigma Development Playground
      </Typography>
      
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Build and test Sigma data applications with true platform compatibility
      </Typography>

      {/* Sigma Status */}
      {!statusLoading && sigmaStatus && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Sigma Framework Status:</strong> {sigmaStatus.mode} mode
            {sigmaStatus.mode === 'sigma' && ' - Full Sigma integration available'}
            {sigmaStatus.mode === 'mock_warehouse' && ' - Mock warehouse mode with Sigma features'}
            {sigmaStatus.mode === 'standalone' && ' - Standalone mode (limited Sigma features)'}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel - Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Workbook Configuration
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Workbook URL"
                  value={workbookUrl}
                  onChange={(e) => setWorkbookUrl(e.target.value)}
                  placeholder="https://app.sigmacomputing.com/your-workbook"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Workbook Title"
                  value={workbookTitle}
                  onChange={(e) => setWorkbookTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Workbook ID"
                  value={workbookId}
                  onChange={(e) => setWorkbookId(e.target.value)}
                  placeholder="Optional: Custom workbook identifier"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Height (px)"
                  type="number"
                  value={workbookHeight}
                  onChange={(e) => setWorkbookHeight(Number(e.target.value))}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Display Options
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  label="Show Controls"
                  color={showControls ? "primary" : "default"}
                  onClick={() => setShowControls(!showControls)}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label="Show Variables"
                  color={showVariables ? "primary" : "default"}
                  onClick={() => setShowVariables(!showVariables)}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label="Show Bookmarks"
                  color={showBookmarks ? "primary" : "default"}
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Sample Workbooks
              </Typography>
              
              <List dense>
                {sampleWorkbooks.map((sample, index) => (
                  <ListItem key={index} button onClick={() => loadSampleWorkbook(sample)}>
                    <ListItemIcon>
                      <PlayIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={sample.name}
                      secondary={sample.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Workbook Display */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <IntegrationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sigma Workbook Integration
              </Typography>
              
              {workbookUrl ? (
                <SigmaWorkbookEmbed
                  workbookUrl={workbookUrl}
                  workbookId={workbookId}
                  title={workbookTitle}
                  height={workbookHeight}
                  showControls={showControls}
                  showVariables={showVariables}
                  showBookmarks={showBookmarks}
                  onWorkbookLoaded={handleWorkbookLoaded}
                  onError={handleWorkbookError}
                  onVariableChange={handleVariableChange}
                  onActionOutbound={handleActionOutbound}
                />
              ) : (
                <Box sx={{ 
                  height: 400, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <IntegrationIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Workbook Loaded
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Enter a workbook URL above or select a sample workbook to get started
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => loadSampleWorkbook(sampleWorkbooks[0])}
                    >
                      Load Sample Dashboard
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Panel - Events and Variables */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Variables Panel */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <DataIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Workbook Variables
              </Typography>
              
              {Object.keys(workbookVariables).length > 0 ? (
                <Box>
                  {Object.entries(workbookVariables).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {key}
                      </Typography>
                      <Typography variant="body2">
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No variables available. Load a workbook to see variables.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Events Panel */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Real-time Events
                </Typography>
                <Box>
                  <Button size="small" onClick={clearEvents} sx={{ mr: 1 }}>
                    Clear
                  </Button>
                  <Button size="small" variant="outlined" onClick={exportEvents}>
                    Export
                  </Button>
                </Box>
              </Box>
              
              {workbookEvents.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {workbookEvents.map((event) => (
                    <Box key={event.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={event.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {JSON.stringify(event.data, null, 2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No events yet. Interact with the workbook to see real-time events.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Development Guide */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Development Guide
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<PlayIcon />}>
              <Typography variant="subtitle1">Getting Started with Sigma Integration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                This playground demonstrates true Sigma compatibility using the official React SDK. 
                You can use this environment to develop Sigma data applications that will seamlessly 
                integrate with Sigma's platform.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Key Features:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="• Real-time workbook communication via postMessage" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Event-driven architecture for user interactions" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Variable management and synchronization" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Bookmark system integration" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Fullscreen and display controls" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<PlayIcon />}>
              <Typography variant="subtitle1">Integration Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Event Handling:</strong> Always implement proper error handling for Sigma events. 
                Use the event log above to monitor real-time communication.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Variable Management:</strong> Variables are the primary way to make workbooks dynamic. 
                Update them programmatically to create interactive experiences.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Performance:</strong> Monitor iframe performance and implement proper cleanup 
                when components unmount.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SigmaPlaygroundPage; 