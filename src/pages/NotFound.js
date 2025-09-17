import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h3" color="error" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="body1">
      The page you are looking for does not exist.
    </Typography>
  </Box>
);

export default NotFound;

