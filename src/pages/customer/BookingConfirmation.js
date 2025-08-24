import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  People,
  Download,
  Share,
  Print,
  Home,
  Star
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      setBookingDetails(location.state);
    } else {
      // Redirect if no booking data
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 3000);
    }
  }, [location.state, navigate]);

  const calculateNights = () => {
    if (bookingDetails?.checkIn && bookingDetails?.checkOut) {
      const checkIn = new Date(bookingDetails.checkIn);
      const checkOut = new Date(bookingDetails.checkOut);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleDownloadReceipt = () => {
    // Mock download functionality
    alert('Receipt download would start here');
  };

  const handleShareBooking = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `My booking at ${bookingDetails?.hotel?.name} is confirmed!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!bookingDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          No booking details found. Redirecting to dashboard...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Success Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: 'success.50' }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Booking ID: {bookingDetails.bookingId}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your reservation has been successfully confirmed. A confirmation email has been sent to {bookingDetails.contactInfo?.email}
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownloadReceipt}
        >
          Download Receipt
        </Button>
        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={handleShareBooking}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Hotel & Room Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hotel & Room Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  component="img"
                  src={bookingDetails.hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                  alt={bookingDetails.hotel?.name}
                  sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" gutterBottom>
                  {bookingDetails.hotel?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {bookingDetails.hotel?.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{bookingDetails.hotel?.rating} stars</Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {bookingDetails.room?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingDetails.room?.description}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Booking Information */}
            <Typography variant="h6" gutterBottom>
              Booking Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday color="action" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Check-in:</strong> {new Date(bookingDetails.checkIn).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday color="action" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Check-out:</strong> {new Date(bookingDetails.checkOut).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="action" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Guests:</strong> {bookingDetails.guests}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Rooms:</strong> {bookingDetails.rooms}
                </Typography>
                <Typography variant="body2">
                  <strong>Nights:</strong> {calculateNights()}
                </Typography>
              </Grid>
            </Grid>

            {bookingDetails.specialRequests && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Special Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingDetails.specialRequests}
                </Typography>
              </>
            )}
          </Paper>

          {/* Guest Information */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Guest Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Name:</strong> {bookingDetails.contactInfo?.firstName} {bookingDetails.contactInfo?.lastName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Email color="action" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    {bookingDetails.contactInfo?.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone color="action" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    {bookingDetails.contactInfo?.phone}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Booking ID
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {bookingDetails.bookingId}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Status
              </Typography>
              <Chip label="Paid" color="success" size="small" />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Booking Status
              </Typography>
              <Chip label="Confirmed" color="primary" size="small" />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Cost Breakdown */}
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Room × {calculateNights()} nights
              </Typography>
              <Typography variant="body2">
                ₹{(bookingDetails.room?.price || 150) * calculateNights() * (bookingDetails.rooms || 1)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Taxes</Typography>
              <Typography variant="body2">
                ₹{Math.round((bookingDetails.room?.price || 150) * calculateNights() * (bookingDetails.rooms || 1) * 0.1)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Service Fee</Typography>
              <Typography variant="body2">₹25</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6" fontWeight="bold">Total Paid</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ₹{Math.round(bookingDetails.totalCost || 0)}
              </Typography>
            </Box>
          </Paper>

          {/* Important Information */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Important Information
            </Typography>
            <Typography variant="body2" paragraph>
              • Check-in time: 3:00 PM
            </Typography>
            <Typography variant="body2" paragraph>
              • Check-out time: 11:00 AM
            </Typography>
            <Typography variant="body2" paragraph>
              • Please bring a valid photo ID at check-in
            </Typography>
            <Typography variant="body2" paragraph>
              • Cancellation policy: Free cancellation up to 24 hours before check-in
            </Typography>
            <Typography variant="body2">
              • For any changes or questions, contact the hotel directly
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate('/customer/dashboard')}
        >
          Go to Dashboard
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/customer/bookings')}
        >
          View All Bookings
        </Button>
      </Box>
    </Container>
  );
};

export default BookingConfirmation;
