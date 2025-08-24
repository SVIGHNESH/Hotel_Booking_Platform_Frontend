import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import { Hotel as HotelIcon, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HotelIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Hotel Booking Portal
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400">
              Find and book the perfect hotel for your stay. 
              Compare prices, read reviews, and make reservations with ease.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/search" color="grey.400" underline="hover">
                Search Hotels
              </Link>
              <Link href="/register" color="grey.400" underline="hover">
                Join as Hotel
              </Link>
              <Link href="/about" color="grey.400" underline="hover">
                About Us
              </Link>
              <Link href="/contact" color="grey.400" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="grey.400" underline="hover">
                Help Center
              </Link>
              <Link href="/faq" color="grey.400" underline="hover">
                FAQ
              </Link>
              <Link href="/terms" color="grey.400" underline="hover">
                Terms of Service
              </Link>
              <Link href="/privacy" color="grey.400" underline="hover">
                Privacy Policy
              </Link>
            </Box>
          </Grid>

          {/* For Hotels */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              For Hotels
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/register?role=hotel" color="grey.400" underline="hover">
                List Your Property
              </Link>
              <Link href="/hotel-help" color="grey.400" underline="hover">
                Hotel Help
              </Link>
              <Link href="/partner-portal" color="grey.400" underline="hover">
                Partner Portal
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2" color="grey.400">
                  vighneshhukla00@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2" color="grey.400">
                  +91 - 7518925362
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" color="grey.400">
                  Bareilly<br />
                  UP, 243001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} Hotel Booking Portal. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/terms" color="grey.400" underline="hover" variant="body2">
              Terms
            </Link>
            <Link href="/privacy" color="grey.400" underline="hover" variant="body2">
              Privacy
            </Link>
            <Link href="/cookies" color="grey.400" underline="hover" variant="body2">
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
