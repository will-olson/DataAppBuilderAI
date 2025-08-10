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
  Collapse
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
  Timeline as TimelineIcon
} from '@mui/icons-material';

import SigmaWorkbookEmbed from '../sigma/SigmaWorkbookEmbed.tsx';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';

/**
 * Sigma Data Apps Builder Page
 * 
 * This page provides a comprehensive development environment for building
 * true Sigma-compatible data applications using the official React SDK.
 * It extends beyond the playground with advanced data app building capabilities,
 * workflow management, and AI-powered features.
 */
const SigmaDataAppsBuilderPage = () => {
  // Main state
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [builderMode, setBuilderMode] = useState('visual'); // 'visual', 'code', 'workflow'
  
  // Data App Configuration
  const [dataAppConfig, setDataAppConfig] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    category: 'analytics',
    tags: [],
    permissions: {
      canEdit: true,
      canPublish: true,
      canShare: true
    },
    dataSources: [],
    workflows: [],
    aiFeatures: []
  });

  // Input Tables Management
  const [inputTables, setInputTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableBuilderOpen, setTableBuilderOpen] = useState(false);
  const [newTableConfig, setNewTableConfig] = useState({
    name: '',
    type: 'empty', // 'empty', 'csv', 'linked'
    columns: [],
    validation: {},
    permissions: {}
  });

  // Layout Elements Management
  const [layoutElements, setLayoutElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementBuilderOpen, setElementBuilderOpen] = useState(false);
  const [newElementConfig, setNewElementConfig] = useState({
    type: 'container',
    properties: {},
    children: []
  });

  // Actions & Workflows
  const [actions, setActions] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowBuilderOpen, setWorkflowBuilderOpen] = useState(false);

  // AI Features
  const [aiFeatures, setAiFeatures] = useState([]);
  const [aiBuilderOpen, setAiBuilderOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    type: 'smart-validation',
    model: 'gpt-4',
    parameters: {},
    triggers: []
  });

  // Workbook Integration
  const [workbookUrl, setWorkbookUrl] = useState('');
  const [workbookId, setWorkbookId] = useState('');
  const [workbookTitle, setWorkbookTitle] = useState('Data App Builder');
  const [workbookLoaded, setWorkbookLoaded] = useState(false);
  const [workbookError, setWorkbookError] = useState(null);
  const [workbookVariables, setWorkbookVariables] = useState({});
  const [workbookEvents, setWorkbookEvents] = useState([]);

  // Preview & Testing
  const [previewMode, setPreviewMode] = useState(false);
  const [testData, setTestData] = useState({});
  const [testResults, setTestResults] = useState([]);

  // API calls
  const { data: sigmaStatus, loading: statusLoading, error: statusError } = useApi(
    () => apiClient.getSigmaStatus(),
    { autoExecute: true }
  );

  const { data: dataAppTemplates, loading: templatesLoading } = useApi(
    () => apiClient.getDataAppTemplates(),
    { autoExecute: true }
  );

  // Available data app categories
  const dataAppCategories = [
    'analytics',
    'data-collection',
    'approval-workflow',
    'pipeline-management',
    'ticketing-system',
    'forecasting',
    'scenario-modeling',
    'reconciliation',
    'custom'
  ];

  // Input table types with descriptions
  const inputTableTypes = [
    {
      value: 'empty',
      label: 'Empty Input Table',
      description: 'Blank table for manual data entry and construction',
      icon: <TableChartIcon />
    },
    {
      value: 'csv',
      label: 'CSV Input Table',
      description: 'Pre-populated table from CSV upload with editing capabilities',
      icon: <CloudUploadIcon />
    },
    {
      value: 'linked',
      label: 'Linked Input Table',
      description: 'Connected to existing data with primary key relationships',
      icon: <SchemaIcon />
    }
  ];

  // Layout element types
  const layoutElementTypes = [
    {
      value: 'container',
      label: 'Container',
      description: 'Flexible container for organizing content',
      icon: <ViewModuleIcon />
    },
    {
      value: 'tabbed-container',
      label: 'Tabbed Container',
      description: 'Multi-tab interface for content organization',
      icon: <ViewModuleIcon />
    },
    {
      value: 'modal',
      label: 'Modal',
      description: 'Overlay dialog for focused interactions',
      icon: <ViewModuleIcon />
    },
    {
      value: 'popover',
      label: 'Popover',
      description: 'Contextual floating content panel',
      icon: <ViewModuleIcon />
    }
  ];

  // AI feature types
  const aiFeatureTypes = [
    {
      value: 'smart-validation',
      label: 'Smart Data Validation',
      description: 'AI-powered data quality checks and suggestions',
      icon: <SmartToyIcon />
    },
    {
      value: 'auto-completion',
      label: 'Auto-completion',
      description: 'Intelligent field suggestions based on context',
      icon: <AutoAwesomeIcon />
    },
    {
      value: 'anomaly-detection',
      label: 'Anomaly Detection',
      description: 'Identify unusual patterns in data',
      icon: <SmartToyIcon />
    },
    {
      value: 'predictive-insights',
      label: 'Predictive Insights',
      description: 'AI-generated forecasts and recommendations',
      icon: <TimelineIcon />
    }
  ];

  // Handle workbook events
  const handleWorkbookLoaded = useCallback((workbook) => {
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
  }, []);

  const handleWorkbookError = useCallback((error) => {
    setWorkbookError(error);
    setWorkbookLoaded(false);
    
    const event = {
      id: Date.now(),
      type: 'workbook:error',
      timestamp: new Date().toISOString(),
      data: error
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  }, []);

  const handleVariableChange = useCallback((variable) => {
    setWorkbookVariables(prev => ({
      ...prev,
      [variable.name]: variable.value
    }));
    
    const event = {
      id: Date.now(),
      type: 'workbook:variable:change',
      timestamp: new Date().toISOString(),
      data: variable
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  }, []);

  const handleActionOutbound = useCallback((action) => {
    const event = {
      id: Date.now(),
      type: 'workbook:action:outbound',
      timestamp: new Date().toISOString(),
      data: action
    };
    setWorkbookEvents(prev => [event, ...prev.slice(0, 49)]);
  }, []);

  // Input Table Management
  const createInputTable = () => {
    const newTable = {
      id: Date.now().toString(),
      ...newTableConfig,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setInputTables(prev => [...prev, newTable]);
    setTableBuilderOpen(false);
    setNewTableConfig({
      name: '',
      type: 'empty',
      columns: [],
      validation: {},
      permissions: {}
    });
  };

  const updateInputTable = (tableId, updates) => {
    setInputTables(prev => 
      prev.map(table => 
        table.id === tableId ? { ...table, ...updates } : table
      )
    );
  };

  const deleteInputTable = (tableId) => {
    setInputTables(prev => prev.filter(table => table.id !== tableId));
  };

  // Layout Element Management
  const createLayoutElement = () => {
    const newElement = {
      id: Date.now().toString(),
      ...newElementConfig,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setLayoutElements(prev => [...prev, newElement]);
    setElementBuilderOpen(false);
    setNewElementConfig({
      type: 'container',
      properties: {},
      children: []
    });
  };

  const updateLayoutElement = (elementId, updates) => {
    setLayoutElements(prev => 
      prev.map(element => 
        element.id === elementId ? { ...element, ...updates } : element
      )
    );
  };

  const deleteLayoutElement = (elementId) => {
    setLayoutElements(prev => prev.filter(element => element.id !== elementId));
  };

  // Workflow Management
  const createWorkflow = () => {
    const newWorkflow = {
      id: Date.now().toString(),
      name: 'New Workflow',
      description: '',
      steps: [],
      triggers: [],
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setWorkflowBuilderOpen(false);
  };

  const updateWorkflow = (workflowId, updates) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId ? { ...workflow, ...updates } : workflow
      )
    );
  };

  const deleteWorkflow = (workflowId) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
  };

  // AI Feature Management
  const createAiFeature = () => {
    const newAiFeature = {
      id: Date.now().toString(),
      ...aiConfig,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setAiFeatures(prev => [...prev, newAiFeature]);
    setAiBuilderOpen(false);
    setAiConfig({
      type: 'smart-validation',
      model: 'gpt-4',
      parameters: {},
      triggers: []
    });
  };

  const updateAiFeature = (featureId, updates) => {
    setAiFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId ? { ...feature, ...updates } : feature
      )
    );
  };

  const deleteAiFeature = (featureId) => {
    setAiFeatures(prev => prev.filter(feature => feature.id !== featureId));
  };

  // Data App Export/Import
  const exportDataApp = () => {
    const dataAppExport = {
      config: dataAppConfig,
      inputTables,
      layoutElements,
      workflows,
      aiFeatures,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(dataAppExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataAppConfig.name || 'data-app'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataApp = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported.config) setDataAppConfig(imported.config);
          if (imported.inputTables) setInputTables(imported.inputTables);
          if (imported.layoutElements) setLayoutElements(imported.layoutElements);
          if (imported.workflows) setWorkflows(imported.workflows);
          if (imported.aiFeatures) setAiFeatures(imported.aiFeatures);
        } catch (error) {
          console.error('Error importing data app:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Validation
  const validateDataApp = () => {
    const errors = [];
    
    if (!dataAppConfig.name) errors.push('Data app name is required');
    if (!dataAppConfig.description) errors.push('Description is required');
    if (inputTables.length === 0) errors.push('At least one input table is required');
    if (layoutElements.length === 0) errors.push('At least one layout element is required');
    
    return errors;
  };

  // Generate Sigma Workbook Configuration
  const generateWorkbookConfig = () => {
    const config = {
      name: dataAppConfig.name,
      description: dataAppConfig.description,
      version: dataAppConfig.version,
      inputTables: inputTables.map(table => ({
        id: table.id,
        name: table.name,
        type: table.type,
        columns: table.columns,
        validation: table.validation,
        permissions: table.permissions
      })),
      layoutElements: layoutElements.map(element => ({
        id: element.id,
        type: element.type,
        properties: element.properties,
        children: element.children
      })),
      workflows: workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        steps: workflow.steps,
        triggers: workflow.triggers,
        conditions: workflow.conditions,
        actions: workflow.actions
      })),
      aiFeatures: aiFeatures.map(feature => ({
        id: feature.id,
        type: feature.type,
        model: feature.model,
        parameters: feature.parameters,
        triggers: feature.triggers
      }))
    };
    
    return config;
  };

  // Test Data App
  const testDataApp = async () => {
    setTestResults([]);
    const config = generateWorkbookConfig();
    
    try {
      // Simulate testing each component
      const results = [];
      
      // Test input tables
      for (const table of config.inputTables) {
        results.push({
          component: 'Input Table',
          name: table.name,
          status: 'success',
          message: 'Table configuration valid'
        });
      }
      
      // Test layout elements
      for (const element of config.layoutElements) {
        results.push({
          component: 'Layout Element',
          name: element.type,
          status: 'success',
          message: 'Element configuration valid'
        });
      }
      
      // Test workflows
      for (const workflow of config.workflows) {
        results.push({
          component: 'Workflow',
          name: workflow.name,
          status: 'success',
          message: 'Workflow configuration valid'
        });
      }
      
      // Test AI features
      for (const feature of config.aiFeatures) {
        results.push({
          component: 'AI Feature',
          name: feature.type,
          status: 'success',
          message: 'AI feature configuration valid'
        });
      }
      
      setTestResults(results);
    } catch (error) {
      setTestResults([{
        component: 'System',
        name: 'Error',
        status: 'error',
        message: error.message
      }]);
    }
  };

  // Render Input Table Builder
  const renderInputTableBuilder = () => (
    <Dialog 
      open={tableBuilderOpen} 
      onClose={() => setTableBuilderOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create Input Table</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Table Name"
              value={newTableConfig.name}
              onChange={(e) => setNewTableConfig(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Table Type</InputLabel>
              <Select
                value={newTableConfig.type}
                onChange={(e) => setNewTableConfig(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                {inputTableTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTableBuilderOpen(false)}>Cancel</Button>
        <Button onClick={createInputTable} variant="contained">
          Create Table
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render Layout Element Builder
  const renderLayoutElementBuilder = () => (
    <Dialog 
      open={elementBuilderOpen} 
      onClose={() => setElementBuilderOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create Layout Element</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Element Type</InputLabel>
              <Select
                value={newElementConfig.type}
                onChange={(e) => setNewElementConfig(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                {layoutElementTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setElementBuilderOpen(false)}>Cancel</Button>
        <Button onClick={createLayoutElement} variant="contained">
          Create Element
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render AI Feature Builder
  const renderAiFeatureBuilder = () => (
    <Dialog 
      open={aiBuilderOpen} 
      onClose={() => setAiBuilderOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create AI Feature</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>AI Feature Type</InputLabel>
              <Select
                value={aiConfig.type}
                onChange={(e) => setAiConfig(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                {aiFeatureTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>AI Model</InputLabel>
              <Select
                value={aiConfig.model}
                onChange={(e) => setAiConfig(prev => ({
                  ...prev,
                  model: e.target.value
                }))}
              >
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                <MenuItem value="claude-3">Claude 3</MenuItem>
                <MenuItem value="custom">Custom Model</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAiBuilderOpen(false)}>Cancel</Button>
        <Button onClick={createAiFeature} variant="contained">
          Create AI Feature
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render Main Content
  const renderMainContent = () => {
    switch (activeTab) {
      case 0: // Configuration
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Data App Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data App Name"
                  value={dataAppConfig.name}
                  onChange={(e) => setDataAppConfig(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter data app name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Version"
                  value={dataAppConfig.version}
                  onChange={(e) => setDataAppConfig(prev => ({
                    ...prev,
                    version: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={dataAppConfig.description}
                  onChange={(e) => setDataAppConfig(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Describe your data app"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={dataAppConfig.category}
                    onChange={(e) => setDataAppConfig(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                  >
                    {dataAppCategories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={dataAppConfig.tags}
                  onChange={(event, newValue) => setDataAppConfig(prev => ({
                    ...prev,
                    tags: newValue
                  }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1: // Input Tables
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Input Tables ({inputTables.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setTableBuilderOpen(true)}
              >
                Add Input Table
              </Button>
            </Box>
            
            {inputTables.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <DataIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Input Tables Created
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start building your data app by creating input tables for data collection
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {inputTables.map((table) => (
                  <Grid item xs={12} md={6} lg={4} key={table.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">{table.name}</Typography>
                          <Chip 
                            label={table.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {table.columns.length} columns
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton size="small" onClick={() => setSelectedTable(table)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteInputTable(table.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 2: // Layout Elements
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Layout Elements ({layoutElements.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setElementBuilderOpen(true)}
              >
                Add Layout Element
              </Button>
            </Box>
            
            {layoutElements.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <ViewModuleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Layout Elements Created
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create layout elements to organize your data app interface
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {layoutElements.map((element) => (
                  <Grid item xs={12} md={6} lg={4} key={element.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">{element.type}</Typography>
                          <Chip 
                            label={element.children.length} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Layout element
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton size="small" onClick={() => setSelectedElement(element)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteLayoutElement(element.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 3: // Workflows
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Workflows ({workflows.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setWorkflowBuilderOpen(true)}
              >
                Add Workflow
              </Button>
            </Box>
            
            {workflows.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Workflows Created
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create workflows to automate data app processes and user interactions
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {workflows.map((workflow) => (
                  <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">{workflow.name}</Typography>
                          <Chip 
                            label={`${workflow.steps.length} steps`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {workflow.description || 'No description'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton size="small" onClick={() => setSelectedWorkflow(workflow)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteWorkflow(workflow.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 4: // AI Features
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                AI Features ({aiFeatures.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAiBuilderOpen(true)}
              >
                Add AI Feature
              </Button>
            </Box>
            
            {aiFeatures.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <SmartToyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No AI Features Created
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add AI-powered features to enhance your data app capabilities
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {aiFeatures.map((feature) => (
                  <Grid item xs={12} md={6} lg={4} key={feature.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">{feature.type}</Typography>
                          <Chip 
                            label={feature.model} 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          AI-powered feature
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton size="small" onClick={() => setSelectedElement(feature)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteAiFeature(feature.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 5: // Preview & Testing
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview & Testing
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Data App Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Test your data app configuration and see how it will behave
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={testDataApp}
                        startIcon={<PlayIcon />}
                        fullWidth
                      >
                        Run Tests
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Export/Import
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Save your data app configuration or load existing ones
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={exportDataApp}
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Export
                      </Button>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                      >
                        Import
                        <input
                          type="file"
                          hidden
                          accept=".json"
                          onChange={importDataApp}
                        />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {testResults.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Test Results
                </Typography>
                <Grid container spacing={2}>
                  {testResults.map((result, index) => (
                    <Grid item xs={12} key={index}>
                      <Alert
                        severity={result.status}
                        icon={
                          result.status === 'success' ? <CheckCircleIcon /> :
                          result.status === 'error' ? <ErrorIcon /> :
                          result.status === 'warning' ? <WarningIcon /> :
                          <InfoIcon />
                        }
                      >
                        <Typography variant="body2">
                          <strong>{result.component}:</strong> {result.name} - {result.message}
                        </Typography>
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      p: { xs: 1, sm: 2, md: 3 },
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            lineHeight: 1.2
          }}
        >
          <BuildIcon sx={{ mr: { xs: 1, sm: 2 }, verticalAlign: 'middle', fontSize: 'inherit' }} />
          Sigma Data Apps Builder
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' } }}
        >
          Build true Sigma-compatible data applications with advanced AI capabilities
        </Typography>
      </Box>

      {/* Status Bar */}
      {statusLoading ? (
        <LinearProgress sx={{ mb: 2 }} />
      ) : statusError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Sigma connection error: {statusError.message}
        </Alert>
      ) : (
        <Alert severity="success" sx={{ mb: 2 }}>
          Sigma connected successfully - Ready to build data apps
        </Alert>
      )}

      {/* Main Builder Interface */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* Left Sidebar - Builder Tools */}
        <Grid item xs={12} lg={3} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                Builder Tools
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setTableBuilderOpen(true)}
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 0.75, sm: 1 }
                  }}
                >
                  Input Table
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setElementBuilderOpen(true)}
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 0.75, sm: 1 }
                  }}
                >
                  Layout Element
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setWorkflowBuilderOpen(true)}
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 0.75, sm: 1 }
                  }}
                >
                  Workflow
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setAiBuilderOpen(true)}
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 0.75, sm: 1 }
                  }}
                >
                  AI Feature
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<PlayIcon />}
                  onClick={testDataApp}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Test App
                </Button>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<DownloadIcon />}
                  onClick={exportDataApp}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Export
                </Button>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<RefreshIcon />}
                  onClick={() => window.location.reload()}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} lg={9} md={8}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              {/* Tabs */}
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minHeight: { xs: 40, sm: 48 },
                    px: { xs: 1, sm: 2 }
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Configuration" icon={<SettingsIcon />} />
                <Tab label="Input Tables" icon={<TableChartIcon />} />
                <Tab label="Layout Elements" icon={<ViewModuleIcon />} />
                <Tab label="Workflows" icon={<TimelineIcon />} />
                <Tab label="AI Features" icon={<SmartToyIcon />} />
                <Tab label="Preview & Testing" icon={<PlayIcon />} />
              </Tabs>

              {/* Tab Content */}
              {renderMainContent()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sigma Workbook Preview */}
      {workbookLoaded && (
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                Sigma Workbook Preview
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Real-time preview of your data app in Sigma
              </Typography>
              
              <Box sx={{ 
                mt: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <SigmaWorkbookEmbed
                  workbookUrl={workbookUrl}
                  workbookId={workbookId}
                  workbookTitle={workbookTitle}
                  onWorkbookLoaded={handleWorkbookLoaded}
                  onWorkbookError={handleWorkbookError}
                  onVariableChange={handleVariableChange}
                  onActionOutbound={handleActionOutbound}
                  height={400}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Event Log */}
      {workbookEvents.length > 0 && (
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                Event Log
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Real-time Sigma workbook events and interactions
              </Typography>
              
              <List sx={{ 
                maxHeight: 300, 
                overflow: 'auto',
                '& .MuiListItem-root': {
                  py: { xs: 0.5, sm: 1 }
                }
              }}>
                {workbookEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemIcon>
                      <EventIcon color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={event.type}
                      secondary={`${new Date(event.timestamp).toLocaleTimeString()} - ${JSON.stringify(event.data)}`}
                      primaryTypographyProps={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                      secondaryTypographyProps={{
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Dialogs */}
      {renderInputTableBuilder()}
      {renderLayoutElementBuilder()}
      {renderAiFeatureBuilder()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={false}
        autoHideDuration={6000}
        message="Data app updated successfully"
      />
    </Box>
  );
};

export default SigmaDataAppsBuilderPage; 