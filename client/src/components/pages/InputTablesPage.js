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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TableChart as TableIcon
} from '@mui/icons-material';
import { fetchInputTables, createInputTable } from '../../services/api';

const InputTablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    table_type: 'csv',
    columns: [],
    validation_rules: {},
    governance_config: {}
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await fetchInputTables();
      setTables(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        name: table.name || '',
        description: table.description || '',
        table_type: table.table_type || 'csv',
        columns: table.columns || [],
        validation_rules: table.validation_rules || {},
        governance_config: table.governance_config || {}
      });
    } else {
      setEditingTable(null);
      setFormData({
        name: '',
        description: '',
        table_type: 'csv',
        columns: [],
        validation_rules: {},
        governance_config: {}
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTable(null);
    setFormData({
      name: '',
      description: '',
      table_type: 'csv',
      columns: [],
      validation_rules: {},
      governance_config: {}
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingTable) {
        // Update existing table
        // await updateInputTable(editingTable.id, formData);
      } else {
        // Create new table
        await createInputTable(formData);
      }
      handleCloseDialog();
      fetchTables();
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

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: 'VARCHAR', length: 255 }]
    }));
  };

  const updateColumn = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => 
        i === index ? { ...col, [field]: value } : col
      )
    }));
  };

  const removeColumn = (index) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const getTableTypeColor = (type) => {
    const colors = {
      csv: 'primary',
      api: 'secondary',
      database: 'success',
      empty: 'default'
    };
    return colors[type] || 'default';
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
            Input Tables Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your Sigma input tables and data sources
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Table
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tables List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Existing Tables ({tables.length})
          </Typography>
          
          {tables.length === 0 ? (
            <Box textAlign="center" py={4}>
              <TableIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No input tables found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first input table to get started
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Columns</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{table.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {table.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={table.table_type}
                          color={getTableTypeColor(table.table_type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {table.columns?.length || 0} columns
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={table.status || 'Active'}
                          color={table.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(table)}>
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
          {editingTable ? 'Edit Input Table' : 'Create New Input Table'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Table Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter table name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Table Type</InputLabel>
                <Select
                  value={formData.table_type}
                  onChange={(e) => handleInputChange('table_type', e.target.value)}
                  label="Table Type"
                >
                  <MenuItem value="csv">CSV File</MenuItem>
                  <MenuItem value="api">API Endpoint</MenuItem>
                  <MenuItem value="database">Database Table</MenuItem>
                  <MenuItem value="empty">Empty Table</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter table description"
                multiline
                rows={2}
              />
            </Grid>
            
            {/* Columns Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Columns</Typography>
                <Button startIcon={<AddIcon />} onClick={addColumn}>
                  Add Column
                </Button>
              </Box>
              
              {formData.columns.map((column, index) => (
                <Box key={index} display="flex" gap={2} mb={2} alignItems="center">
                  <TextField
                    label="Column Name"
                    value={column.name}
                    onChange={(e) => updateColumn(index, 'name', e.target.value)}
                    placeholder="Column name"
                    size="small"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={column.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="VARCHAR">VARCHAR</MenuItem>
                      <MenuItem value="INTEGER">INTEGER</MenuItem>
                      <MenuItem value="DECIMAL">DECIMAL</MenuItem>
                      <MenuItem value="TIMESTAMP">TIMESTAMP</MenuItem>
                      <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Length"
                    value={column.length}
                    onChange={(e) => updateColumn(index, 'length', e.target.value)}
                    type="number"
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeColumn(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || formData.columns.length === 0}
          >
            {editingTable ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InputTablesPage; 