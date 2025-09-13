import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Favorites = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorites
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Your favorite hotels will appear here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Start adding hotels to your favorites by clicking the heart icon
        </Typography>
      </Paper>
    </Container>
  );
};

export default Favorites;