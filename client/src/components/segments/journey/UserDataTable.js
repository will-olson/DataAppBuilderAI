import React, { useState, useMemo, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Box
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ImportExport as ExportIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const formatValue = (key, value, type) => {
    if (value === null || value === undefined) return 'N/A';
  
    switch (type) {
      case 'datetime':
        return value ? new Date(value).toLocaleString() : 'Never';
      
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      
      case 'percentage':
        return `${(parseFloat(value) * 100).toFixed(2)}%`;
      
      case 'number':
        return parseFloat(value).toFixed(2);
      
      case 'boolean':
        return value ? 'Yes' : 'No';
      
      case 'json':
        return typeof value === 'object' 
          ? JSON.stringify(value, null, 2) 
          : value;
      
      default:
        return String(value);
    }
  };

// Add these utility export functions before the UserDataTable component
const exportToCSV = (data, filename = 'export.csv') => {
    if (data.length === 0) return;
  
    // Extract headers and rows
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${String(row[header]).replace(/"/g, '""')}"` // Escape quotes
        ).join(',')
      )
    ].join('\n');
  
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };
  
  const exportToJSON = (data, filename = 'export.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    saveAs(blob, filename);
  };
  
  const exportToExcel = (data, filename = 'export.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

const UserDataTable = ({ 
  userData, 
  onRowDetails, 
  onExport,
  exportFormats = ['CSV', 'JSON', 'Excel']
}) => {
  // State Management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'lifetime_value', 
    direction: 'desc' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({});
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  // Comprehensive columns list
  const columns = [
    // Core Identifiers
    { key: 'username', label: 'Username', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'uuid', label: 'UUID', type: 'string' },

    // Account Metadata
    { key: 'account_created', label: 'Account Created', type: 'datetime' },
    { key: 'last_login', label: 'Last Login', type: 'datetime' },
    { key: 'account_age_days', label: 'Account Age (Days)', type: 'number' },

    // Demographic Insights
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'gender', label: 'Gender', type: 'string' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'language', label: 'Language', type: 'string' },
    { key: 'timezone', label: 'Timezone', type: 'string' },

    // Engagement Metrics
    { key: 'avg_visit_time', label: 'Avg Visit Time', type: 'number' },
    { key: 'total_sessions', label: 'Total Sessions', type: 'number' },
    { key: 'session_frequency', label: 'Session Frequency', type: 'number' },

    // Communication Engagement
    { key: 'last_email_open', label: 'Last Email Open', type: 'datetime' },
    { key: 'last_email_click', label: 'Last Email Click', type: 'datetime' },
    { key: 'email_open_rate', label: 'Email Open Rate', type: 'percentage' },
    { key: 'email_click_rate', label: 'Email Click Rate', type: 'percentage' },

    // Product Interaction
    { key: 'last_app_login', label: 'Last App Login', type: 'datetime' },
    { key: 'last_app_click', label: 'Last App Click', type: 'datetime' },
    { key: 'last_completed_action', label: 'Last Completed Action', type: 'string' },

    // Conversion & Revenue Metrics
    { key: 'plan', label: 'Plan', type: 'string' },
    { key: 'plan_start_date', label: 'Plan Start Date', type: 'datetime' },
    { key: 'lifetime_value', label: 'Lifetime Value', type: 'currency' },
    { key: 'total_purchases', label: 'Total Purchases', type: 'number' },
    { key: 'average_purchase_value', label: 'Avg Purchase Value', type: 'currency' },

    // Retention Indicators
    { key: 'churn_risk', label: 'Churn Risk', type: 'percentage' },
    { key: 'engagement_score', label: 'Engagement Score', type: 'percentage' },

    // Personalization Attributes
    { key: 'preferred_content_type', label: 'Content Preference', type: 'string' },
    { key: 'communication_preference', label: 'Communication Preference', type: 'string' },
    { key: 'notification_settings', label: 'Notification Settings', type: 'json' },

    // Feature Usage
    { key: 'feature_usage_json', label: 'Feature Usage', type: 'json' },

    // Referral & Growth
    { key: 'referral_source', label: 'Referral Source', type: 'string' },
    { key: 'referral_count', label: 'Referral Count', type: 'number' },

    // Compliance & Privacy
    { key: 'marketing_consent', label: 'Marketing Consent', type: 'boolean' },
    { key: 'last_consent_update', label: 'Last Consent Update', type: 'datetime' }
  ];

  // Initialize visible columns on first render
  React.useEffect(() => {
    const initialVisibility = columns.reduce((acc, column) => {
      acc[column.key] = true;
      return acc;
    }, {});
    setVisibleColumns(initialVisibility);
  }, []);

  // Advanced Search and Filtering
  const filteredAndSearchedData = useMemo(() => {
    if (!userData) return [];

    return userData.filter(user => {
      // Search across all visible columns
      const matchesSearch = searchTerm 
        ? Object.keys(visibleColumns)
            .some(key => 
              visibleColumns[key] && 
              String(user[key])
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
        : true;

      // Advanced filtering
      const matchesFilters = Object.entries(filters).every(([key, value]) => 
        value === '' || user[key] === value
      );

      return matchesSearch && matchesFilters;
    });
  }, [userData, searchTerm, visibleColumns, filters]);

  // Sorting Function
  const sortedData = useMemo(() => {
    return [...filteredAndSearchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      return sortConfig.direction === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
  }, [filteredAndSearchedData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

    // Modify the export handler
    const handleExport = useCallback((format) => {
        // Close export menu
        setExportAnchorEl(null);

        // If custom export handler is provided, use it
        if (onExport) {
        onExport(sortedData, format);
        return;
        }
    
    // Default export logic
    const exportData = sortedData.map(user => 
      Object.fromEntries(
        Object.entries(user)
          .filter(([key]) => visibleColumns[key])
          .map(([key, value]) => [key, formatValue(key, value, columns.find(c => c.key === key)?.type)])
      )
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `user_export_${timestamp}`;

    switch(format) {
      case 'CSV':
        exportToCSV(exportData, `${filename}.csv`);
        break;
      case 'JSON':
        exportToJSON(exportData, `${filename}.json`);
        break;
      case 'Excel':
        exportToExcel(exportData, `${filename}.xlsx`);
        break;
    }
  }, [sortedData, visibleColumns, onExport, columns]);

    // Column Visibility Toggle
    const toggleColumnVisibility = (columnKey) => {
        setVisibleColumns(prev => ({
        ...prev,
        [columnKey]: !prev[columnKey]
        }));
    };

  return (
    <Paper>
      {/* Toolbar with Search, Filters, and Export */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2 
        }}
      >
        {/* Search Input */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />
          }}
        />

        {/* Column Visibility and Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Column Visibility Dropdown */}
          <IconButton 
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            {columns.map((column) => (
              <MenuItem key={column.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleColumns[column.key]}
                      onChange={() => toggleColumnVisibility(column.key)}
                    />
                  }
                  label={column.label}
                />
              </MenuItem>
            ))}
          </Menu>

            {/* Export Dropdown */}
            <Button 
                startIcon={<ExportIcon />}
                variant="outlined"
                onClick={(e) => setExportAnchorEl(e.currentTarget)}
            >
                Export
            </Button>
            <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={() => setExportAnchorEl(null)}
            >
                {exportFormats.map((format) => (
                <MenuItem 
                    key={format} 
                    onClick={() => handleExport(format)}
                >
                    Export as {format}
                </MenuItem>
                ))}
            </Menu>
        </Box>
      </Box>

      {/* Table Component (similar to previous version) */}
      <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns
                .filter(column => visibleColumns[column.key])
                .map((column) => (
                  <TableCell 
                    key={column.key}
                    onClick={() => setSortConfig(prev => ({
                      key: column.key,
                      direction: prev.key === column.key && prev.direction === 'desc' ? 'asc' : 'desc'
                    }))}
                    sx={{ 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {column.label}
                    {sortConfig.key === column.key && 
                      (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                  </TableCell>
                ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user, index) => (
              <TableRow key={index}>
                {columns
                  .filter(column => visibleColumns[column.key])
                  .map((column) => (
                    <TableCell 
                      key={column.key}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {formatValue(column.key, user[column.key], column.type)}
                    </TableCell>
                  ))}
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => onRowDetails(user)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default UserDataTable;