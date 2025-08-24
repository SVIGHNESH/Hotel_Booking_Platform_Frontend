import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday,
  People,
  CreditCard,
  CheckCircle,
  LocationOn,
  Star,
  Wifi,
  Pool,
  Restaurant,
  ArrowBack
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoomBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    specialRequests: '',
    contactInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  });
  
  const [roomDetails, setRoomDetails] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const steps = ['Booking Details', 'Guest Information', 'Payment', 'Confirmation'];

  // Get booking data from navigation state
  useEffect(() => {
    if (location.state) {
      const { hotelId, roomId, hotelName } = location.state;
      loadBookingDetails(hotelId, roomId);
    }
  }, [location.state]);

  const loadBookingDetails = async (hotelId, roomId) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockRoom = {
        id: roomId,
        name: 'Deluxe King Room',
        description: 'Spacious room with king-size bed, city view, and modern amenities.',
        price: 150,
        maxGuests: 2,
        amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
      };
      
      const mockHotel = {
        id: hotelId,
        name: 'Grand Plaza Hotel',
        location: 'Downtown',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      };
      
      setRoomDetails(mockRoom);
      setHotelDetails(mockHotel);
      
      // Calculate initial cost
      calculateTotalCost(mockRoom.price, 1, 1);
    } catch (error) {
      console.error('Failed to load booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (roomPrice, nights, rooms) => {
    const subtotal = roomPrice * nights * rooms;
    const taxes = subtotal * 0.1; // 10% tax
    const serviceFee = 25;
    setTotalCost(subtotal + taxes + serviceFee);
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setBookingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Recalculate cost if relevant fields change
      if (field === 'rooms' && roomDetails) {
        const nights = calculateNights();
        calculateTotalCost(roomDetails.price, nights, value);
      }
    }
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return bookingData.checkIn && bookingData.checkOut && bookingData.guests;
      case 1:
        return bookingData.contactInfo.firstName && bookingData.contactInfo.lastName && 
               bookingData.contactInfo.email && bookingData.contactInfo.phone;
      case 2:
        return bookingData.paymentInfo.cardNumber && bookingData.paymentInfo.expiryDate && 
               bookingData.paymentInfo.cvv && bookingData.paymentInfo.nameOnCard;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 2) {
        // Last step before confirmation
        setConfirmationDialog(true);
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Mock API call for booking creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConfirmationDialog(false);
      setActiveStep(steps.length - 1);
      
      // Navigate to confirmation page after a delay
      setTimeout(() => {
        navigate('/customer/booking-confirmation', {
          state: {
            bookingId: 'BK' + Date.now(),
            ...bookingData,
            hotel: hotelDetails,
            room: roomDetails,
            totalCost
          }
        });
      }, 3000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-in Date"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => handleInputChange(null, 'checkIn', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-out Date"
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => handleInputChange(null, 'checkOut', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: bookingData.checkIn || new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Number of Guests</InputLabel>
                <Select
                  value={bookingData.guests}
                  onChange={(e) => handleInputChange(null, 'guests', e.target.value)}
                  label="Number of Guests"
                >
                  {[1, 2, 3, 4].map(num => (
                    <MenuItem key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Number of Rooms</InputLabel>
                <Select
                  value={bookingData.rooms}
                  onChange={(e) => handleInputChange(null, 'rooms', e.target.value)}
                  label="Number of Rooms"
                >
                  {[1, 2, 3, 4].map(num => (
                    <MenuItem key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests (Optional)"
                multiline
                rows={3}
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange(null, 'specialRequests', e.target.value)}
                placeholder="Any special requests or preferences..."
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={bookingData.contactInfo.firstName}
                onChange={(e) => handleInputChange('contactInfo', 'firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={bookingData.contactInfo.lastName}
                onChange={(e) => handleInputChange('contactInfo', 'lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={bookingData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={bookingData.contactInfo.phone}
                onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={bookingData.paymentInfo.cardNumber}
                onChange={(e) => handleInputChange('paymentInfo', 'cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={bookingData.paymentInfo.expiryDate}
                onChange={(e) => handleInputChange('paymentInfo', 'expiryDate', e.target.value)}
                placeholder="MM/YY"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CVV"
                value={bookingData.paymentInfo.cvv}
                onChange={(e) => handleInputChange('paymentInfo', 'cvv', e.target.value)}
                placeholder="123"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name on Card"
                value={bookingData.paymentInfo.nameOnCard}
                onChange={(e) => handleInputChange('paymentInfo', 'nameOnCard', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </Typography>
            {loading && <CircularProgress sx={{ mt: 2 }} />}
          </Box>
        );
        
      default:
        return null;
    }
  };

  if (loading && !roomDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!roomDetails || !hotelDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Booking details not found. Please go back and select a room.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Book Your Stay
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Booking Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            {activeStep < steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateStep(activeStep)}
                >
                  {activeStep === steps.length - 2 ? 'Confirm Booking' : 'Next'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>

            {/* Hotel Info */}
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src={hotelDetails.image}
                alt={hotelDetails.name}
                sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, mb: 1 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {hotelDetails.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {hotelDetails.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{hotelDetails.rating}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Room Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {roomDetails.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {roomDetails.amenities.slice(0, 3).map((amenity, index) => (
                  <Chip key={index} label={amenity} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Booking Details */}
            {bookingData.checkIn && bookingData.checkOut && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stay Details
                </Typography>
                <Typography variant="body2">
                  <strong>Check-in:</strong> {bookingData.checkIn}
                </Typography>
                <Typography variant="body2">
                  <strong>Check-out:</strong> {bookingData.checkOut}
                </Typography>
                <Typography variant="body2">
                  <strong>Nights:</strong> {calculateNights()}
                </Typography>
                <Typography variant="body2">
                  <strong>Guests:</strong> {bookingData.guests}
                </Typography>
                <Typography variant="body2">
                  <strong>Rooms:</strong> {bookingData.rooms}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Cost Breakdown */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Cost Breakdown
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  ₹{roomDetails.price} × {calculateNights()} nights × {bookingData.rooms} room{bookingData.rooms > 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2">
                  ₹{roomDetails.price * calculateNights() * bookingData.rooms}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Taxes (10%)</Typography>
                <Typography variant="body2">
                  ₹{Math.round(roomDetails.price * calculateNights() * bookingData.rooms * 0.1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Service Fee</Typography>
                <Typography variant="body2">₹25</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₹{Math.round(totalCost)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog} onClose={() => setConfirmationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Please review your booking details before confirming:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2"><strong>Hotel:</strong> {hotelDetails.name}</Typography>
            <Typography variant="body2"><strong>Room:</strong> {roomDetails.name}</Typography>
            <Typography variant="body2"><strong>Dates:</strong> {bookingData.checkIn} to {bookingData.checkOut}</Typography>
            <Typography variant="body2"><strong>Guests:</strong> {bookingData.guests}</Typography>
            <Typography variant="body2"><strong>Total:</strong> ₹{Math.round(totalCost)}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmBooking} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomBooking;
