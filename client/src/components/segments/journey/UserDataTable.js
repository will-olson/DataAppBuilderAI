import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination,
  TableSortLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const UserDataTable = ({ 
  userData, 
  onRowDetails, 
  onExport 
}) => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plan: '',
    minAge: '',
    maxAge: '',
    minLifetimeValue: '',
    maxLifetimeValue: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'lifetime_value',
    direction: 'desc'
  });

  // Comprehensive filtering and sorting
  const processedData = useMemo(() => {
    let result = [...userData];

    // Filtering
    result = result.filter(user => {
      // Global search
      const searchMatch = !searchTerm || 
        Object.values(user).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Specific filters
      const planMatch = !filters.plan || user.plan === filters.plan;
      const ageMatch = 
        (!filters.minAge || user.age >= Number(filters.minAge)) &&
        (!filters.maxAge || user.age <= Number(filters.maxAge));
      const ltvMatch = 
        (!filters.minLifetimeValue || user.lifetime_value >= Number(filters.minLifetimeValue)) &&
        (!filters.maxLifetimeValue || user.lifetime_value <= Number(filters.maxLifetimeValue));

      return searchMatch && planMatch && ageMatch && ltvMatch;
    });

    // Sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [userData, searchTerm, filters, sortConfig]);

  // Pagination
  const paginatedData = processedData.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  // Selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = paginatedData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Export handler
  const handleExport = () => {
    const selectedUsers = userData.filter(user => selected.includes(user.id));
    onExport(selectedUsers);
  };

  return (
    <Paper>
      {/* Filtering and Search Section */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Plan</InputLabel>
            <Select
              value={filters.plan}
              label="Plan"
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                plan: e.target.value
              }))}
            >
              <MenuItem value="">All Plans</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="plus">Plus</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Min Age"
            type="number"
            value={filters.minAge}
            onChange={(e) => setFilters(prev => ({
              ...prev, 
              minAge: e.target.value
            }))}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Max Age"
            type="number"
            value={filters.maxAge}
            onChange={(e) => setFilters(prev => ({
              ...prev, 
              maxAge: e.target.value
            }))}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Tooltip title="Export Selected Users">
            <IconButton 
              color="primary" 
              onClick={handleExport}
              disabled={selected.length === 0}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Data Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                  checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {[
                { key: 'username', label: 'Username' },
                { key: 'email', label: 'Email' },
                { key: 'age', label: 'Age' },
                { key: 'plan', label: 'Plan' },
                { key: 'lifetime_value', label: 'Lifetime Value' },
                { key: 'total_sessions', label: 'Total Sessions' }
              ].map((column) => (
                <TableCell 
                  key={column.key}
                  sortDirection={sortConfig.key === column.key ? sortConfig.direction : false}
                >
                  <TableSortLabel
                    active={sortConfig.key === column.key}
                    direction={sortConfig.key === column.key ? sortConfig.direction : 'asc'}
                    onClick={() => setSortConfig(prev => ({
                      key: column.key,
                      direction: prev.key === column.key && prev.direction === 'desc' ? 'asc' : 'desc'
                    }))}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user) => {
              const isItemSelected = selected.indexOf(user.id) !== -1;

              return (
                <TableRow 
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={user.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onClick={(event) => handleClick(event, user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>${user.lifetime_value.toFixed(2)}</TableCell>
                  <TableCell>{user.total_sessions}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => onRowDetails(user)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Results Summary */}
      <Typography variant="body2" sx={{ p: 2 }}>
        Showing {paginatedData.length} of {processedData.length} users
        {selected.length > 0 && ` (${selected.length} selected)`}
      </Typography>
    </Paper>
  );
};

export default UserDataTable;