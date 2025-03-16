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
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { 
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const UserDataTable = ({ userData, onRowDetails, onExport }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'lifetime_value', 
    direction: 'desc' 
  });

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

  // Formatting helper
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

  // Sorting function
  const sortedData = useMemo(() => {
    if (!userData) return [];

    return [...userData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [userData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
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
                {columns.map((column) => (
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