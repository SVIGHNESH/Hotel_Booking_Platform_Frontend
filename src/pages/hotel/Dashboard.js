import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Alert,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Pending,
  CheckCircle,
  Cancel,
  Email,
  Phone,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hotelProfile, setHotelProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    loadHotelProfile();
  }, []);

  const loadHotelProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/hotel/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const hotel = response.data.data;
        setHotelProfile(hotel);
        setVerificationStatus({
          isVerified: hotel.isVerified,
          isActive: hotel.isActive,
          rejectionReason: hotel.rejectionReason,
          verifiedAt: hotel.verifiedAt,
          rejectedAt: hotel.rejectedAt
        });
      } else {
        setError('Failed to load hotel profile');
      }
    } catch (error) {
      console.error('Failed to load hotel profile:', error);
      if (error.response?.status === 401) {
        setError('Please login again to access your hotel dashboard');
      } else if (error.response?.status === 404) {
        setError('Hotel profile not found. Please complete your registration.');
      } else {
        setError('Failed to load hotel information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<Refresh />} 
          onClick={loadHotelProfile}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Show verification status screen
  if (!verificationStatus?.isVerified) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                bgcolor: verificationStatus?.rejectionReason ? 'error.main' : 'warning.main'
              }}
            >
              {verificationStatus?.rejectionReason ? <Cancel fontSize="large" /> : <Pending fontSize="large" />}
            </Avatar>
            <Typography variant="h4" gutterBottom>
              {hotelProfile?.name || 'Your Hotel'}
            </Typography>
            
            {verificationStatus?.rejectionReason ? (
              <>
                <Chip 
                  label="Application Rejected" 
                  color="error" 
                  size="large" 
                  sx={{ mb: 3, fontSize: '1rem', py: 2 }}
                />
                <Alert severity="error" sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your hotel registration has been rejected
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Rejection Reason:</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{verificationStatus.rejectionReason}"
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rejected on:</strong> {new Date(verificationStatus.rejectedAt).toLocaleDateString()}
                  </Typography>
                </Alert>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Please address the issues mentioned above and contact our support team for re-evaluation.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Email />}
                    href="mailto:support@hotelbooking.com"
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    href="tel:+1234567890"
                  >
                    Call Support
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hotel/profile')}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Chip 
                  label="Pending Verification" 
                  color="warning" 
                  size="large" 
                  sx={{ mb: 3, fontSize: '1rem', py: 2 }}
                />
                <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your hotel is under review
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Thank you for registering your hotel with our platform. Our admin team is currently reviewing your application.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Submitted on:</strong> {new Date(hotelProfile?.createdAt).toLocaleDateString()}
                  </Typography>
                </Alert>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  You will receive an email notification once the verification is complete. 
                  This process typically takes 1-2 business days.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadHotelProfile}
                  >
                    Check Status
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hotel/profile')}
                  >
                    View Profile
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show approved hotel dashboard (simplified version without mock data)
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
          <CheckCircle />
        </Avatar>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome, {hotelProfile?.name}!
          </Typography>
          <Chip label="Verified Hotel" color="success" icon={<CheckCircle />} />
        </Box>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        🎉 Congratulations! Your hotel has been verified and is now live on our platform.
        Customers can now discover and book your rooms.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hotel Information
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Name:</strong> {hotelProfile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Location:</strong> {hotelProfile?.address?.city}, {hotelProfile?.address?.state}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Type:</strong> {hotelProfile?.type || 'Hotel'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Verified on:</strong> {new Date(verificationStatus?.verifiedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/hotel/rooms')}
                >
                  Manage Rooms
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/hotel/bookings')}
                >
                  View Bookings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/hotel/profile')}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HotelDashboard;