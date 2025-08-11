import React, { useState, useEffect, useCallback } from 'react';
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
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Badge,
  Snackbar,
  LinearProgress,
  Autocomplete,
  Checkbox,
  ListItemButton,
  Collapse,
  Fab,
  Zoom,
  Fade,
  Grow,
  Slide
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  DataObject as DataIcon,
  Event as EventIcon,
  IntegrationInstructions as IntegrationIcon,
  Add as AddIcon,
  Build as BuildIcon,
  Storage as StorageIcon,
  TableChart as TableChartIcon,
  ViewModule as ViewModuleIcon,
  PlaylistAdd as PlaylistAddIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  SmartToy as SmartToyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schema as SchemaIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Dashboard as DashboardIcon,
  TableView as TableViewIcon,
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  BubbleChart as BubbleChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  ScatterPlot as ScatterPlotIcon,
  Speed as SpeedIcon,
  Rocket as RocketIcon,
  School as SchoolIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  History as HistoryIcon
} from '@mui/icons-material';

import SigmaWorkbookEmbed from '../sigma/SigmaWorkbookEmbed.tsx';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';

/**
 * Sigma AI Workbook Builder Page
 * 
 * This page provides an AI-assisted development environment for building
 * Sigma workbooks, dashboards, and data apps with intelligent suggestions,
 * automated workflows, and best practices guidance.
 */
const SigmaAIWorkbookBuilderPage = () => {
  // Main state
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [builderMode, setBuilderMode] = useState('ai-guided'); // 'ai-guided', 'visual', 'code', 'workflow'
  
  // AI Assistant State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [aiContext, setAiContext] = useState({
    currentStep: 'planning',
    userExperience: 'beginner',
    projectType: 'dashboard',
    dataSource: 'unknown'
  });

  // Workbook Configuration
  const [workbookConfig, setWorkbookConfig] = useState({
    title: '',
    description: '',
    type: 'dashboard', // 'dashboard', 'data-app', 'report', 'workbook'
    targetAudience: '',
    dataSources: [],
    keyMetrics: [],
    visualizations: [],
    interactions: []
  });

  // AI-Generated Components
  const [aiComponents, setAiComponents] = useState({
    inputTables: [],
    layoutElements: [],
    actions: [],
    workflows: [],
    visualizations: [],
    filters: []
  });

  // Sigma Integration State
  const [workbookUrl, setWorkbookUrl] = useState('');
  const [workbookId, setWorkbookId] = useState('');
  const [workbookTitle, setWorkbookTitle] = useState('AI-Generated Sigma Workbook');
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

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // API calls
  const { data: sigmaStatus, loading: statusLoading, error: statusError } = useApi(
    () => apiClient.getSigmaStatus(),
    { autoExecute: true }
  );

  // AI Assistant Functions
  const generateAISuggestions = async (query, context = {}) => {
    setAiLoading(true);
    try {
      // Call the real Sigma AI service
      const response = await apiClient.getSigmaAISuggestions(query, context);
      if (response.success && response.suggestions) {
        setAiSuggestions(response.suggestions);
        setAiHistory(prev => [...prev, {
          id: Date.now(),
          query,
          response: response.suggestions,
          timestamp: new Date().toISOString()
        }]);
        return response;
      } else {
        // Fallback to simulated response if API fails
        const fallbackResponse = await simulateAIResponse(query, context);
        setAiSuggestions(fallbackResponse.suggestions);
        setAiHistory(prev => [...prev, {
          id: Date.now(),
          query,
          response: fallbackResponse.suggestions,
          timestamp: new Date().toISOString()
        }]);
        addNotification('Using fallback AI suggestions (API unavailable)', 'warning');
        return fallbackResponse;
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      // Fallback to simulated response
      const fallbackResponse = await simulateAIResponse(query, context);
      setAiSuggestions(fallbackResponse.suggestions);
      setAiHistory(prev => [...prev, {
        id: Date.now(),
        query,
        response: fallbackResponse.suggestions,
        timestamp: new Date().toISOString()
      }]);
      addNotification(`AI suggestion generation failed: ${error.message}. Using fallback suggestions.`, 'warning');
      return fallbackResponse;
    } finally {
      setAiLoading(false);
    }
  };

  const simulateAIResponse = async (query, context) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryLower = query.toLowerCase();
    const suggestions = [];

    // AI-powered suggestions based on query and context
    if (queryLower.includes('dashboard') || queryLower.includes('visualization')) {
      suggestions.push({
        type: 'visualization',
        title: 'Recommended Chart Types',
        description: 'Based on your data and goals, consider these visualization types:',
        items: [
          'Bar charts for comparing categories',
          'Line charts for time series data',
          'Pie charts for composition analysis',
          'Scatter plots for correlation analysis',
          'Heat maps for matrix data'
        ],
        priority: 'high',
        implementation: 'Use Sigma\'s chart builder with these configurations...'
      });
    }

    if (queryLower.includes('input') || queryLower.includes('table')) {
      suggestions.push({
        type: 'input_table',
        title: 'Input Table Configuration',
        description: 'Configure input tables for data collection:',
        items: [
          'Define column types (text, number, date, checkbox)',
          'Set data validation rules',
          'Configure user permissions',
          'Add computed columns for derived data',
          'Include audit trail columns'
        ],
        priority: 'medium',
        implementation: 'In Sigma, go to Add Element > Input Tables...'
      });
    }

    if (queryLower.includes('workflow') || queryLower.includes('action')) {
      suggestions.push({
        type: 'workflow',
        title: 'Workflow Automation',
        description: 'Automate user interactions with actions:',
        items: [
          'Configure button-triggered actions',
          'Set up conditional logic',
          'Create navigation flows',
          'Implement data refresh triggers',
          'Add user input validation'
        ],
        priority: 'high',
        implementation: 'Use Sigma Actions panel to configure...'
      });
    }

    if (queryLower.includes('layout') || queryLower.includes('design')) {
      suggestions.push({
        type: 'layout',
        title: 'Layout Best Practices',
        description: 'Optimize your workbook layout:',
        items: [
          'Use containers to group related elements',
          'Implement tabbed navigation for complex dashboards',
          'Add modals for detailed views',
          'Use consistent spacing and alignment',
          'Implement responsive design principles'
        ],
        priority: 'medium',
        implementation: 'In Sigma, use Layout Elements from the Add panel...'
      });
    }

    // Default suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'general',
        title: 'General Sigma Best Practices',
        description: 'Consider these general guidelines:',
        items: [
          'Start with a clear data model',
          'Use consistent naming conventions',
          'Implement proper data governance',
          'Test with sample data first',
          'Document your workbook structure'
        ],
        priority: 'low',
        implementation: 'Follow Sigma\'s recommended development workflow...'
      });
    }

    return { suggestions };
  };

  const applyAISuggestion = (suggestion) => {
    // Apply the AI suggestion to the workbook configuration
    switch (suggestion.type) {
      case 'visualization':
        setWorkbookConfig(prev => ({
          ...prev,
          visualizations: [...prev.visualizations, {
            id: Date.now(),
            type: suggestion.items[0]?.toLowerCase().includes('bar') ? 'bar' : 'chart',
            title: suggestion.title,
            description: suggestion.description,
            config: suggestion.implementation
          }]
        }));
        break;
      case 'input_table':
        setAiComponents(prev => ({
          ...prev,
          inputTables: [...prev.inputTables, {
            id: Date.now(),
            name: 'AI-Suggested Input Table',
            description: suggestion.description,
            columns: suggestion.items.map(item => ({
              name: item.split(' ')[0],
              type: 'text',
              description: item
            }))
          }]
        }));
        break;
      case 'workflow':
        setAiComponents(prev => ({
          ...prev,
          workflows: [...prev.workflows, {
            id: Date.now(),
            name: 'AI-Suggested Workflow',
            description: suggestion.description,
            steps: suggestion.items.map((item, index) => ({
              id: index,
              name: item,
              type: 'action',
              description: item
            }))
          }]
        }));
        break;
      case 'layout':
        setAiComponents(prev => ({
          ...prev,
          layoutElements: [...prev.layoutElements, {
            id: Date.now(),
            name: 'AI-Suggested Layout',
            type: 'container',
            description: suggestion.description,
            config: suggestion.implementation
          }]
        }));
        break;
      default:
        addNotification('Suggestion applied to general configuration', 'info');
    }
    
    addNotification(`AI suggestion "${suggestion.title}" applied successfully`, 'success');
  };

  // Workbook Management Functions
  const createWorkbook = async () => {
    try {
      // Generate workbook configuration using Sigma AI service
      const response = await apiClient.generateSigmaAIConfig(workbookConfig);
      
      if (response.success && response.configuration) {
        const config = response.configuration;
        setWorkbookConfig(prev => ({
          ...prev,
          ...config.workbook
        }));
        
        if (config.workbook.components) {
          setAiComponents(config.workbook.components);
        }
        
        addNotification('AI-generated workbook configuration created successfully!', 'success');
        setWorkbookId(config.metadata?.generated_at || Date.now().toString());
        
        return config;
      } else {
        throw new Error(response.error || 'Failed to generate workbook configuration');
      }
    } catch (error) {
      console.error('Workbook creation failed:', error);
      addNotification(`Failed to create workbook: ${error.message}`, 'error');
      
      // Fallback: create basic configuration locally
      const config = {
        ...workbookConfig,
        components: aiComponents,
        metadata: {
          createdBy: 'AI Assistant (Fallback)',
          createdAt: new Date().toISOString(),
          version: '1.0.0',
          aiGenerated: false
        }
      };
      
      addNotification('Using fallback configuration (AI service unavailable)', 'warning');
      return config;
    }
  };

  const exportWorkbook = () => {
    const config = {
      ...workbookConfig,
      components: aiComponents,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${workbookConfig.title || 'sigma-workbook'}.json`;
    link.click();
    
    addNotification('Workbook configuration exported successfully', 'success');
  };

  const importWorkbook = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        setWorkbookConfig(config);
        setAiComponents(config.components || {});
        addNotification('Workbook configuration imported successfully', 'success');
      } catch (error) {
        addNotification('Failed to import workbook configuration', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Utility Functions
  const addNotification = (message, severity = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Sigma Event Handlers
  const handleWorkbookLoaded = (workbook) => {
    setWorkbookLoaded(true);
    setWorkbookError(null);
    setWorkbookVariables(workbook.workbook?.variables || {});
    
    const event = {
      id: Date.now(),
      type: 'workbook:loaded',
      timestamp: new Date().toISOString(),
      data: workbook
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  const handleWorkbookError = (error) => {
    setWorkbookError(error);
    setWorkbookLoaded(false);
    addNotification(`Workbook error: ${error.message}`, 'error');
  };

  const handleVariableChange = (variable) => {
    const event = {
      id: Date.now(),
      type: 'variable:changed',
      timestamp: new Date().toISOString(),
      data: variable
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  const handleActionOutbound = (action) => {
    const event = {
      id: Date.now(),
      type: 'action:outbound',
      timestamp: new Date().toISOString(),
      data: action
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  // AI Assistant Dialog
  const renderAIAssistant = () => (
    <Dialog
      open={aiAssistantOpen}
      onClose={() => setAiAssistantOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SmartToyIcon color="primary" />
          <Typography variant="h6">AI Workbook Assistant</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Ask me anything about building Sigma workbooks, dashboards, or data apps. 
            I can provide suggestions, best practices, and implementation guidance.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="e.g., 'How should I design a marketing dashboard?' or 'What input tables do I need for a data collection app?'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            disabled={aiLoading}
          />
          
          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={() => generateAISuggestions(aiQuery, aiContext)}
              disabled={!aiQuery.trim() || aiLoading}
              startIcon={aiLoading ? <LinearProgress /> : <SendIcon />}
            >
              {aiLoading ? 'Generating...' : 'Ask AI Assistant'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setAiQuery('')}
              disabled={aiLoading}
            >
              Clear
            </Button>
          </Box>
        </Box>

        {aiLoading && (
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <LinearProgress sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary">
              AI is thinking...
            </Typography>
          </Box>
        )}

        {aiSuggestions.length > 0 && (
          <Box>
            <Typography variant="h6" mb={2}>AI Suggestions</Typography>
            {aiSuggestions.map((suggestion, index) => (
              <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" color="primary">
                      {suggestion.title}
                    </Typography>
                    <Chip 
                      label={suggestion.priority} 
                      size="small" 
                      color={suggestion.priority === 'high' ? 'error' : suggestion.priority === 'medium' ? 'warning' : 'default'}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {suggestion.description}
                  </Typography>
                  
                  <List dense>
                    {suggestion.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Implementation:
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace" bgcolor="grey.100" p={1} borderRadius={1}>
                      {suggestion.implementation}
                    </Typography>
                  </Box>
                  
                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => applyAISuggestion(suggestion)}
                      startIcon={<CheckIcon />}
                    >
                      Apply Suggestion
                    </Button>
                    
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(suggestion.implementation)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy Implementation
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {aiHistory.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" mb={2}>Recent Conversations</Typography>
            <List dense>
              {aiHistory.slice(0, 5).map((item) => (
                <ListItem key={item.id} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChatIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.query}
                    secondary={new Date(item.timestamp).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAiAssistantOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Workbook Configuration Form
  const renderWorkbookConfig = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={3}>Workbook Configuration</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Workbook Title"
              value={workbookConfig.title}
              onChange={(e) => setWorkbookConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Marketing Performance Dashboard"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Workbook Type</InputLabel>
              <Select
                value={workbookConfig.type}
                onChange={(e) => setWorkbookConfig(prev => ({ ...prev, type: e.target.value }))}
                label="Workbook Type"
              >
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="data-app">Data App</MenuItem>
                <MenuItem value="report">Report</MenuItem>
                <MenuItem value="workbook">General Workbook</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={workbookConfig.description}
              onChange={(e) => setWorkbookConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose and goals of this workbook..."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Audience"
              value={workbookConfig.targetAudience}
              onChange={(e) => setWorkbookConfig(prev => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="e.g., Marketing team, Executives, Analysts"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Builder Mode</InputLabel>
              <Select
                value={builderMode}
                onChange={(e) => setBuilderMode(e.target.value)}
                label="Builder Mode"
              >
                <MenuItem value="ai-guided">AI-Guided</MenuItem>
                <MenuItem value="visual">Visual Builder</MenuItem>
                <MenuItem value="code">Code Editor</MenuItem>
                <MenuItem value="workflow">Workflow Designer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={createWorkbook}
            startIcon={<RocketIcon />}
          >
            Create Workbook
          </Button>
          
          <Button
            variant="outlined"
            onClick={exportWorkbook}
            startIcon={<DownloadIcon />}
          >
            Export Config
          </Button>
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Import Config
            <input
              type="file"
              hidden
              accept=".json"
              onChange={importWorkbook}
            />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // AI Components Overview
  const renderAIComponents = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={3}>AI-Generated Components</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" mb={2}>Input Tables ({aiComponents.inputTables.length})</Typography>
            {aiComponents.inputTables.map((table) => (
              <Paper key={table.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">{table.name}</Typography>
                <Typography variant="body2" color="text.secondary">{table.description}</Typography>
                <Box mt={1}>
                  {table.columns.map((col, index) => (
                    <Chip key={index} label={col.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </Paper>
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" mb={2}>Layout Elements ({aiComponents.layoutElements.length})</Typography>
            {aiComponents.layoutElements.map((element) => (
              <Paper key={element.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">{element.name}</Typography>
                <Typography variant="body2" color="text.secondary">{element.description}</Typography>
                <Chip label={element.type} size="small" sx={{ mt: 1 }} />
              </Paper>
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" mb={2}>Workflows ({aiComponents.workflows.length})</Typography>
            {aiComponents.workflows.map((workflow) => (
              <Paper key={workflow.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">{workflow.name}</Typography>
                <Typography variant="body2" color="text.secondary">{workflow.description}</Typography>
                <Box mt={1}>
                  {workflow.steps.map((step) => (
                    <Chip key={step.id} label={step.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </Paper>
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" mb={2}>Visualizations ({aiComponents.visualizations.length})</Typography>
            {aiComponents.visualizations.map((viz) => (
              <Paper key={viz.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">{viz.title}</Typography>
                <Typography variant="body2" color="text.secondary">{viz.description}</Typography>
                <Chip label={viz.type} size="small" sx={{ mt: 1 }} />
              </Paper>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Sigma Workbook Preview
  const renderWorkbookPreview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={3}>Workbook Preview</Typography>
        
        {workbookId ? (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Workbook ID: {workbookId}
            </Typography>
            
            <SigmaWorkbookEmbed
              workbookUrl={workbookUrl || `https://app.sigmacomputing.com/workbook/${workbookId}`}
              workbookId={workbookId}
              workbookTitle={workbookTitle}
              showControls={showControls}
              showVariables={showVariables}
              showBookmarks={showBookmarks}
              workbookHeight={workbookHeight}
              onWorkbookLoaded={handleWorkbookLoaded}
              onWorkbookError={handleWorkbookError}
              onVariableChange={handleVariableChange}
              onActionOutbound={handleActionOutbound}
            />
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary" mb={2}>
              No workbook created yet. Configure your workbook and click "Create Workbook" to get started.
            </Typography>
            <Button
              variant="contained"
              onClick={createWorkbook}
              startIcon={<RocketIcon />}
            >
              Create Your First Workbook
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Main Content Renderer
  const renderMainContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            {renderWorkbookConfig()}
            <Box mt={3}>
              {renderAIComponents()}
            </Box>
          </Box>
        );
      case 1:
        return renderWorkbookPreview();
      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" mb={3}>AI Assistant History</Typography>
              {aiHistory.length > 0 ? (
                <List>
                  {aiHistory.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemIcon>
                        <ChatIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.query}
                        secondary={new Date(item.timestamp).toLocaleString()}
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setAiQuery(item.query);
                          setAiAssistantOpen(true);
                        }}
                      >
                        Repeat
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No AI assistant history yet. Start a conversation to see your history here.
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          <Box display="flex" alignItems="center" gap={2}>
            <SmartToyIcon color="primary" sx={{ fontSize: 'inherit' }} />
            Sigma AI Workbook Builder
          </Box>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Build intelligent Sigma workbooks, dashboards, and data apps with AI-powered guidance
        </Typography>
      </Box>

      {/* Status Bar */}
      <Box mb={3}>
        <Alert 
          severity={sigmaStatus?.status === 'healthy' ? 'success' : 'warning'}
          icon={sigmaStatus?.status === 'healthy' ? <CheckCircleIcon /> : <WarningIcon />}
        >
          {sigmaStatus?.status === 'healthy' 
            ? '✅ Sigma framework is healthy and ready for AI-assisted development'
            : '⚠️ Sigma framework may have issues - check status before proceeding'
          }
        </Alert>
      </Box>

      {/* Main Tabs */}
      <Box mb={3}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Configuration" icon={<SettingsIcon />} />
          <Tab label="Preview" icon={<VisibilityIcon />} />
          <Tab label="AI History" icon={<HistoryIcon />} />
        </Tabs>
      </Box>

      {/* Main Content */}
      {renderMainContent()}

      {/* AI Assistant FAB */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="AI Assistant"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setAiAssistantOpen(true)}
        >
          <SmartToyIcon />
        </Fab>
      </Zoom>

      {/* AI Assistant Dialog */}
      {renderAIAssistant()}

      {/* Notifications */}
      <Box sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
        {notifications.slice(0, 3).map((notification) => (
          <Alert
            key={notification.id}
            severity={notification.severity}
            sx={{ mb: 1, minWidth: 300 }}
            onClose={() => removeNotification(notification.id)}
          >
            {notification.message}
          </Alert>
        ))}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SigmaAIWorkbookBuilderPage; 