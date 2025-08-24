import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  Search,
  Hotel,
  Star,
  Security,
  Support,
  Payment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search fontSize="large" color="primary" />,
      title: 'Easy Search',
      description: 'Find hotels by location, dates, and preferences with our advanced search filters.'
    },
    {
      icon: <Hotel fontSize="large" color="primary" />,
      title: 'Verified Hotels',
      description: 'All hotels are verified and reviewed to ensure quality and authenticity.'
    },
    {
      icon: <Star fontSize="large" color="primary" />,
      title: 'Best Prices',
      description: 'Compare prices and get the best deals on hotel bookings.'
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Secure Booking',
      description: 'Your data and payments are protected with industry-standard security.'
    },
    {
      icon: <Support fontSize="large" color="primary" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with any queries.'
    },
    {
      icon: <Payment fontSize="large" color="primary" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options and flexible cancellation policies.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 15,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Find Your Perfect Stay
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Discover amazing hotels around the world and book with confidence
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/search')}
              sx={{ px: 4, py: 1.5 }}
            >
              Search Hotels
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register?role=hotel')}
              sx={{
                px: 4,
                py: 1.5,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              List Your Hotel
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          We make hotel booking simple, secure, and rewarding
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Paper sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                1000+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Hotels
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                50K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Happy Customers
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                100K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Bookings
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                4.8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Average Rating
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Join thousands of travelers who trust us for their accommodation needs
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5, mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/search')}
            sx={{ px: 4, py: 1.5 }}
          >
            Browse Hotels
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
