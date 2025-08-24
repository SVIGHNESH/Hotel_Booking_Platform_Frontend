import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const ForgotPassword = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>Forgot Password</Typography>
        <Typography>Forgot password page - To be implemented</Typography>
      </Box>
    </Paper>
  </Container>
);

export default ForgotPassword;
