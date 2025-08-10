import React from 'react';
import { Box, Typography } from '@mui/material';

const TestPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Test Page</Typography>
      <Typography variant="body1">If you can see this, React is mounting correctly.</Typography>
    </Box>
  );
};

export default TestPage; 