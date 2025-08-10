import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  Bolt as ActionIcon,
  Navigation as NavIcon,
  DataUsage as DataIcon,
  TouchApp as TouchIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import { fetchActions, createAction, executeAction } from '../../services/api';

const ActionsPage = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [executeDialog, setExecuteDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [executionParams, setExecutionParams] = useState({});
  const [executionResult, setExecutionResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    action_type: 'navigation',
    config: {},
    parameters: [],
    enabled: true
  });

  useEffect(() => {
    fetchActionsList();
  }, []);

  const fetchActionsList = async () => {
    try {
      setLoading(true);
      const data = await fetchActions();
      setActions(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (action = null) => {
    if (action) {
      setEditingAction(action);
      setFormData({
        name: action.name || '',
        description: action.description || '',
        action_type: action.action_type || 'navigation',
        config: action.config || {},
        parameters: action.parameters || [],
        enabled: action.enabled !== false
      });
    } else {
      setEditingAction(null);
      setFormData({
        name: '',
        description: '',
        action_type: 'navigation',
        config: {},
        parameters: [],
        enabled: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAction(null);
    setFormData({
      name: '',
      description: '',
      action_type: 'navigation',
      config: {},
      parameters: [],
      enabled: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingAction) {
        // Update existing action
        // await updateAction(editingAction.id, formData);
      } else {
        // Create new action
        await createAction(formData);
      }
      handleCloseDialog();
      fetchActionsList();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const addParameter = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', type: 'string', required: false }]
    }));
  };

  const updateParameter = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const removeParameter = (index) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const handleExecuteAction = async (action) => {
    setSelectedAction(action);
    setExecutionParams({});
    setExecutionResult(null);
    setExecuteDialog(true);
  };

  const executeSelectedAction = async () => {
    try {
      const result = await executeAction(selectedAction.id, executionParams);
      setExecutionResult(result);
    } catch (err) {
      setExecutionResult({ error: err.message });
    }
  };

  const getActionTypeIcon = (type) => {
    const icons = {
      navigation: <NavIcon />,
      data_operation: <DataIcon />,
      ui_interaction: <TouchIcon />,
      api_call: <ApiIcon />,
      custom: <ActionIcon />
    };
    return icons[type] || <ActionIcon />;
  };

  const getActionTypeColor = (type) => {
    const colors = {
      navigation: 'primary',
      data_operation: 'success',
      ui_interaction: 'warning',
      api_call: 'info',
      custom: 'secondary'
    };
    return colors[type] || 'default';
  };

  const renderConfigFields = () => {
    const { action_type } = formData;
    
    switch (action_type) {
      case 'navigation':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Route Path"
                value={formData.config.route_path || ''}
                onChange={(e) => handleConfigChange('route_path', e.target.value)}
                placeholder="/dashboard/users"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.new_tab || false}
                    onChange={(e) => handleConfigChange('new_tab', e.target.checked)}
                  />
                }
                label="Open in New Tab"
              />
            </Grid>
          </Grid>
        );
      
      case 'data_operation':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Operation Type</InputLabel>
                <Select
                  value={formData.config.operation_type || 'select'}
                  onChange={(e) => handleConfigChange('operation_type', e.target.value)}
                  label="Operation Type"
                >
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="insert">Insert</MenuItem>
                  <MenuItem value="update">Update</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Table Name"
                value={formData.config.table_name || ''}
                onChange={(e) => handleConfigChange('table_name', e.target.value)}
                placeholder="users"
              />
            </Grid>
          </Grid>
        );
      
      case 'ui_interaction':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Element ID"
                value={formData.config.element_id || ''}
                onChange={(e) => handleConfigChange('element_id', e.target.value)}
                placeholder="user-table"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Interaction Type</InputLabel>
                <Select
                  value={formData.config.interaction_type || 'show'}
                  onChange={(e) => handleConfigChange('interaction_type', e.target.value)}
                  label="Interaction Type"
                >
                  <MenuItem value="show">Show</MenuItem>
                  <MenuItem value="hide">Hide</MenuItem>
                  <MenuItem value="toggle">Toggle</MenuItem>
                  <MenuItem value="focus">Focus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      case 'api_call':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Endpoint"
                value={formData.config.api_endpoint || ''}
                onChange={(e) => handleConfigChange('api_endpoint', e.target.value)}
                placeholder="https://api.example.com/users"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>HTTP Method</InputLabel>
                <Select
                  value={formData.config.http_method || 'GET'}
                  onChange={(e) => handleConfigChange('http_method', e.target.value)}
                  label="HTTP Method"
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.include_auth || false}
                    onChange={(e) => handleConfigChange('include_auth', e.target.checked)}
                  />
                }
                label="Include Authentication"
              />
            </Grid>
          </Grid>
        );
      
      default:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Custom Configuration (JSON)"
                value={JSON.stringify(formData.config, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData(prev => ({ ...prev, config: parsed }));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                multiline
                rows={4}
                placeholder='{"custom_field": "value"}'
              />
            </Grid>
          </Grid>
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Actions Framework
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage Sigma actions for automation and user interactions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Action
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Actions List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available Actions ({actions.length})
          </Typography>
          
          {actions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ActionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No actions found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first action to get started
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getActionTypeIcon(action.action_type)}
                          <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            {action.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={action.action_type}
                          color={getActionTypeColor(action.action_type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={action.enabled ? 'Active' : 'Disabled'}
                          color={action.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => handleExecuteAction(action)}
                          title="Execute Action"
                        >
                          <PlayIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialog(action)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAction ? 'Edit Action' : 'Create New Action'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Action Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter action name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={formData.action_type}
                  onChange={(e) => handleInputChange('action_type', e.target.value)}
                  label="Action Type"
                >
                  <MenuItem value="navigation">Navigation</MenuItem>
                  <MenuItem value="data_operation">Data Operation</MenuItem>
                  <MenuItem value="ui_interaction">UI Interaction</MenuItem>
                  <MenuItem value="api_call">API Call</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter action description"
                multiline
                rows={2}
              />
            </Grid>
            
            {/* Configuration Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              {renderConfigFields()}
            </Grid>

            {/* Parameters Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Parameters</Typography>
                <Button startIcon={<AddIcon />} onClick={addParameter}>
                  Add Parameter
                </Button>
              </Box>
              
              {formData.parameters.map((param, index) => (
                <Box key={index} display="flex" gap={2} mb={2} alignItems="center">
                  <TextField
                    label="Parameter Name"
                    value={param.name}
                    onChange={(e) => updateParameter(index, 'name', e.target.value)}
                    placeholder="param_name"
                    size="small"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={param.type}
                      onChange={(e) => updateParameter(index, 'type', e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="string">String</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                      <MenuItem value="object">Object</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={param.required}
                        onChange={(e) => updateParameter(index, 'required', e.target.checked)}
                      />
                    }
                    label="Required"
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeParameter(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) => handleInputChange('enabled', e.target.checked)}
                  />
                }
                label="Action Enabled"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name}
          >
            {editingAction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Execute Action Dialog */}
      <Dialog open={executeDialog} onClose={() => setExecuteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Execute Action: {selectedAction?.name}
        </DialogTitle>
        <DialogContent>
          {selectedAction && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedAction.description}
              </Typography>
              
              {selectedAction.parameters && selectedAction.parameters.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Parameters
                  </Typography>
                  {selectedAction.parameters.map((param, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      label={`${param.name} (${param.type})${param.required ? ' *' : ''}`}
                      value={executionParams[param.name] || ''}
                      onChange={(e) => setExecutionParams(prev => ({
                        ...prev,
                        [param.name]: e.target.value
                      }))}
                      required={param.required}
                      sx={{ mb: 2 }}
                    />
                  ))}
                </Box>
              )}

              {executionResult && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Execution Result
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialog(false)}>Close</Button>
          <Button 
            onClick={executeSelectedAction} 
            variant="contained"
            startIcon={<PlayIcon />}
          >
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActionsPage; 