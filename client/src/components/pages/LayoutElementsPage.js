import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewModule as LayoutIcon,
  ViewComfy as ViewComfyIcon,
  ViewComfy as ContainerIcon,
  Tab as TabIcon,
  Description as FormIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import useApi from '../../hooks/useApi';
import apiClient from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const LayoutElementsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingElement, setEditingElement] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    element_type: 'container',
    config: {},
    parent_id: null,
    nesting_level: 0
  });

  // Use the useApi hook for data fetching
  const { data: layoutElements, loading, error, execute: fetchLayoutElements } = useApi(() => apiClient.getSigmaLayoutElements(), { autoExecute: true });

  if (loading) {
    return <LoadingSpinner message="Loading layout elements..." />;
  }

  if (error) {
    console.error('Layout Elements Error:', error);
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading layout elements: {error.message || error}
        <Button onClick={fetchLayoutElements} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  // Extract the actual data from the API response with proper fallbacks
  const elementsData = layoutElements?.data || layoutElements || [];

  const handleOpenDialog = (element = null) => {
    if (element) {
      setEditingElement(element);
      setFormData({
        name: element.name || '',
        description: element.description || '',
        element_type: element.element_type || 'container',
        config: element.config || {},
        parent_id: element.parent_id || null,
        nesting_level: element.nesting_level || 0
      });
    } else {
      setEditingElement(null);
      setFormData({
        name: '',
        description: '',
        element_type: 'container',
        config: {},
        parent_id: null,
        nesting_level: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingElement(null);
    setFormData({
      name: '',
      description: '',
      element_type: 'container',
      config: {},
      parent_id: null,
      nesting_level: 0
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingElement) {
        // Update existing element - would need to implement updateLayoutElement in apiClient
        // await apiClient.put(`/sigma/layout-elements/${editingElement.id}`, formData);
      } else {
        // Create new element - would need to implement createLayoutElement in apiClient
        // await apiClient.post('/sigma/layout-elements', formData);
      }
      handleCloseDialog();
      fetchLayoutElements();
    } catch (err) {
      console.error('Error saving layout element:', err);
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

  const getElementTypeIcon = (type) => {
    const icons = {
      container: <ViewComfyIcon />,
      modal: <ViewComfyIcon />,
      tabs: <TabIcon />,
      form: <FormIcon />,
      chart: <ChartIcon />
    };
    return icons[type] || <LayoutIcon />;
  };

  const getElementTypeColor = (type) => {
    const colors = {
      container: 'primary',
      modal: 'secondary',
      tabs: 'success',
      form: 'warning',
      chart: 'info'
    };
    return colors[type] || 'default';
  };

  const renderConfigFields = () => {
    const { element_type } = formData;
    
    switch (element_type) {
      case 'container':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grid Columns"
                type="number"
                value={formData.config.grid_columns || 12}
                onChange={(e) => handleConfigChange('grid_columns', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 12 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Spacing"
                type="number"
                value={formData.config.spacing || 2}
                onChange={(e) => handleConfigChange('spacing', parseInt(e.target.value))}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.responsive || false}
                    onChange={(e) => handleConfigChange('responsive', e.target.checked)}
                  />
                }
                label="Responsive Layout"
              />
            </Grid>
          </Grid>
        );
      
      case 'modal':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Width"
                value={formData.config.width || '600px'}
                onChange={(e) => handleConfigChange('width', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height"
                value={formData.config.height || '400px'}
                onChange={(e) => handleConfigChange('height', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.backdrop || true}
                    onChange={(e) => handleConfigChange('backdrop', e.target.checked)}
                  />
                }
                label="Backdrop"
              />
            </Grid>
          </Grid>
        );
      
      case 'tabs':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tab Names (comma-separated)"
                value={formData.config.tab_names || ''}
                onChange={(e) => handleConfigChange('tab_names', e.target.value)}
                placeholder="Tab 1, Tab 2, Tab 3"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.vertical || false}
                    onChange={(e) => handleConfigChange('vertical', e.target.checked)}
                  />
                }
                label="Vertical Tabs"
              />
            </Grid>
          </Grid>
        );
      
      case 'form':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Form Fields (comma-separated)"
                value={formData.config.form_fields || ''}
                onChange={(e) => handleConfigChange('form_fields', e.target.value)}
                placeholder="name, email, message"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Layout</InputLabel>
                <Select
                  value={formData.config.layout || 'vertical'}
                  onChange={(e) => handleConfigChange('layout', e.target.value)}
                  label="Layout"
                >
                  <MenuItem value="vertical">Vertical</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      case 'chart':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={formData.config.chart_type || 'bar'}
                  onChange={(e) => handleConfigChange('chart_type', e.target.value)}
                  label="Chart Type"
                >
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                  <MenuItem value="scatter">Scatter Plot</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height"
                value={formData.config.height || '300px'}
                onChange={(e) => handleConfigChange('height', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Layout Elements Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage Sigma layout elements for your applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Element
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Elements List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Existing Elements ({elementsData.length})
          </Typography>
          
          {elementsData.length === 0 ? (
            <Box textAlign="center" py={4}>
              <LayoutIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No layout elements found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first layout element to get started
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
                    <TableCell>Nesting Level</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {elementsData.map((element) => (
                    <TableRow key={element.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getElementTypeIcon(element.element_type)}
                          <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            {element.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={element.element_type}
                          color={getElementTypeColor(element.element_type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {element.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Level ${element.nesting_level || 0}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(element)}>
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
          {editingElement ? 'Edit Layout Element' : 'Create New Layout Element'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Element Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter element name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Element Type</InputLabel>
                <Select
                  value={formData.element_type}
                  onChange={(e) => handleInputChange('element_type', e.target.value)}
                  label="Element Type"
                >
                  <MenuItem value="container">Container</MenuItem>
                  <MenuItem value="modal">Modal</MenuItem>
                  <MenuItem value="tabs">Tabs</MenuItem>
                  <MenuItem value="form">Form</MenuItem>
                  <MenuItem value="chart">Chart</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter element description"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nesting Level"
                type="number"
                value={formData.nesting_level}
                onChange={(e) => handleInputChange('nesting_level', parseInt(e.target.value))}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            
            {/* Configuration Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              {renderConfigFields()}
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
            {editingElement ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LayoutElementsPage; 