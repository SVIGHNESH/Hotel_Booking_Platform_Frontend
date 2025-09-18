import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
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
  CreditCard,
  CheckCircle,
  LocationOn,
  Star,
  ArrowBack
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Helper to sanitize phone to allowed pattern (digits, plus, spaces, hyphens)
const sanitizePhone = (raw) => {
  if (!raw) return '';
  let cleaned = raw.replace(/[^+0-9\-\s]/g, '');
  // collapse multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
};

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
  const [error, setError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const steps = ['Booking Details', 'Guest Information', 'Payment', 'Confirmation'];

  // Helper to calculate nights between two dates
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return Math.max(1, diff);
  };

  // Centralized total cost calculator using pricing details
  const calculateTotalCost = useCallback((overrides = {}) => {
    const basePrice = overrides.basePrice ?? (roomDetails?.pricing?.basePrice ?? roomDetails?.price ?? 0);
    const nights = overrides.nights ?? calculateNights(bookingData.checkIn, bookingData.checkOut);
    const roomsCount = overrides.rooms ?? bookingData.rooms ?? 1;
    const taxPercent = roomDetails?.pricing?.taxes ?? 0; // percentage
    const serviceFee = roomDetails?.pricing?.serviceFee ?? 0; // flat amount

    const safeNights = Math.max(1, Number(nights) || 0);
    const safeRooms = Math.max(1, Number(roomsCount) || 1);

    const subtotal = basePrice * safeNights * safeRooms;
    const taxes = subtotal * (Number(taxPercent) / 100);
    const total = subtotal + taxes + Number(serviceFee || 0);

    setTotalCost(total);
    return total;
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.rooms, roomDetails]);

  const loadBookingDetails = useCallback(async (hotelId, roomId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/customer/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.data?.success) {
        setError('Failed to load hotel details');
        return;
      }
      const data = res.data.data;
      const hotel = data.hotel || data;
      const rooms = data.rooms || hotel.rooms || [];
      setHotelDetails(hotel);
      const room = rooms.find(r => (r._id || r.id) === roomId);
      if (!room) {
        setError('Room not found');
        return;
      }
      setRoomDetails(room);
      // Preview total for 1 night × 1 room
      const basePrice = room.pricing?.basePrice || room.price || 0;
      const taxPercent = room.pricing?.taxes || 0;
      const serviceFee = room.pricing?.serviceFee || 0;
      const previewSubtotal = basePrice;
      const previewTaxes = previewSubtotal * (taxPercent / 100);
      setTotalCost(previewSubtotal + previewTaxes + serviceFee);
    } catch (e) {
      console.error('Failed to load booking details:', e);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get booking data from navigation state
  useEffect(() => {
    if (location.state) {
      const { hotelId, roomId } = location.state;
      loadBookingDetails(hotelId, roomId);
    }
  }, [location.state, loadBookingDetails]);

  // Recalculate total whenever key inputs change and we have room details & dates
  useEffect(() => {
    if (roomDetails && bookingData.checkIn && bookingData.checkOut) {
      calculateTotalCost();
    }
  }, [roomDetails, bookingData.checkIn, bookingData.checkOut, bookingData.rooms, calculateTotalCost]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setBookingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
      return;
    }
    setBookingData(prev => ({ ...prev, [field]: value }));
    if ((field === 'rooms' || field === 'checkIn' || field === 'checkOut') && roomDetails) {
      const nights = calculateNights(
        field === 'checkIn' ? value : bookingData.checkIn,
        field === 'checkOut' ? value : bookingData.checkOut
      );
      calculateTotalCost({ nights, rooms: field === 'rooms' ? value : bookingData.rooms });
    }
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
    if (!validateStep(activeStep)) return;
    if (activeStep === steps.length - 2) {
      setConfirmationDialog(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const totalNights = calculateNights(bookingData.checkIn, bookingData.checkOut) || 1; // still used locally for cost preview
      const sanitizedPhone = sanitizePhone(bookingData.contactInfo?.phone || user?.phone);
      const bookingPayload = {
        hotelId: hotelDetails?._id || hotelDetails?.id,
        roomId: roomDetails?._id || roomDetails?.id,
        bookingDetails: {
          checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: {
              adults: Number(bookingData.guests) || 1,
              children: 0
            },
            numberOfRooms: Number(bookingData.rooms) || 1,
            // totalNights intentionally omitted (backend computes)
            specialRequests: bookingData.specialRequests || ''
        },
        guestDetails: {
          firstName: bookingData.contactInfo?.firstName || user?.firstName || '',
          lastName: bookingData.contactInfo?.lastName || user?.lastName || '',
          email: bookingData.contactInfo?.email || user?.email || '',
          phone: sanitizedPhone,
          address: bookingData.contactInfo?.address || ''
        },
        contactDetails: {
          email: bookingData.contactInfo?.email || user?.email || '',
          phone: sanitizedPhone
        },
        paymentMethod: bookingData.paymentInfo?.method || 'card',
        totalAmount: totalCost
      };

      const response = await axios.post('/api/customer/bookings', bookingPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setConfirmationDialog(false);
        setActiveStep(steps.length - 1);
        setBookingConfirmation(response.data.data);
        setTimeout(() => {
          navigate('/customer/booking-confirmation', {
            state: {
              bookingId: response.data.data._id || 'BK' + Date.now(),
              ...bookingData,
              hotel: hotelDetails,
              room: roomDetails,
              totalCost
            }
          });
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to create booking');
      }
    } catch (e) {
      console.error('Failed to create booking:', e);
      let msg = e.response?.data?.message || 'Failed to create booking. Please try again.';
      const validationErrors = e.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length) {
        const joined = validationErrors.map(er => er.message || er.msg || er).join('\n');
        msg = `${msg}\n${joined}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
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
        <Alert severity="error">Booking details not found. Please go back and select a room.</Alert>
      </Container>
    );
  }

  const nightsNow = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const unitPrice = roomDetails.pricing?.basePrice || roomDetails.price || 0;
  const taxesPct = roomDetails.pricing?.taxes || 0;
  const svcFee = roomDetails.pricing?.serviceFee || 0;
  const baseSubtotal = unitPrice * nightsNow * bookingData.rooms;
  const taxesAmt = Math.round(baseSubtotal * (taxesPct / 100));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>Back</Button>
        <Typography variant="h4" component="h1">Book Your Stay</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

            {error && (<Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>)}

            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Check-in Date" type="date" value={bookingData.checkIn}
                    onChange={(e) => handleInputChange(null, 'checkIn', e.target.value)}
                    InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Check-out Date" type="date" value={bookingData.checkOut}
                    onChange={(e) => handleInputChange(null, 'checkOut', e.target.value)}
                    InputLabelProps={{ shrink: true }} inputProps={{ min: bookingData.checkIn || new Date().toISOString().split('T')[0] }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Number of Guests</InputLabel>
                    <Select variant="outlined" value={bookingData.guests}
                      onChange={(e) => handleInputChange(null, 'guests', e.target.value)} label="Number of Guests">
                      {[1,2,3,4].map(num => (<MenuItem key={num} value={num}>{num} Guest{num>1?'s':''}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Number of Rooms</InputLabel>
                    <Select variant="outlined" value={bookingData.rooms}
                      onChange={(e) => handleInputChange(null, 'rooms', e.target.value)} label="Number of Rooms">
                      {[1,2,3,4].map(num => (<MenuItem key={num} value={num}>{num} Room{num>1?'s':''}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Special Requests (Optional)" multiline rows={3} value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange(null, 'specialRequests', e.target.value)} placeholder="Any special requests or preferences..." />
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="First Name" value={bookingData.contactInfo.firstName}
                    onChange={(e) => handleInputChange('contactInfo', 'firstName', e.target.value)} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Last Name" value={bookingData.contactInfo.lastName}
                    onChange={(e) => handleInputChange('contactInfo', 'lastName', e.target.value)} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email Address" type="email" value={bookingData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Phone Number" value={bookingData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)} required />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Card Number" value={bookingData.paymentInfo.cardNumber}
                    onChange={(e) => handleInputChange('paymentInfo', 'cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Expiry Date" value={bookingData.paymentInfo.expiryDate}
                    onChange={(e) => handleInputChange('paymentInfo', 'expiryDate', e.target.value)} placeholder="MM/YY" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CVV" value={bookingData.paymentInfo.cvv}
                    onChange={(e) => handleInputChange('paymentInfo', 'cvv', e.target.value)} placeholder="123" required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Name on Card" value={bookingData.paymentInfo.nameOnCard}
                    onChange={(e) => handleInputChange('paymentInfo', 'nameOnCard', e.target.value)} required />
                </Grid>
              </Grid>
            )}

            {activeStep === 3 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>Booking Confirmed!</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                </Typography>
                {bookingConfirmation && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Booking Reference: {bookingConfirmation._id || bookingConfirmation.bookingId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {bookingConfirmation.status || 'Confirmed'}
                    </Typography>
                  </Box>
                )}
                {loading && <CircularProgress sx={{ mt: 2 }} />}
              </Box>
            )}

            {activeStep < steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                <Button variant="contained" onClick={handleNext}
                  disabled={!validateStep(activeStep)}>
                  {activeStep === steps.length - 2 ? 'Confirm Booking' : 'Next'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Booking Summary</Typography>

            {/* Hotel Info */}
            <Box sx={{ mb: 3 }}>
              <Box component="img"
                src={(hotelDetails.images && (hotelDetails.images[0]?.url || hotelDetails.images[0])) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'}
                alt={hotelDetails.name}
                sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">{hotelDetails.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {hotelDetails.address?.city}, {hotelDetails.address?.state}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{hotelDetails.rating?.average || 0}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Room Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>{roomDetails.name}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {(roomDetails.amenities || []).slice(0, 3).map((amenity, i) => (
                  <Chip key={i} label={amenity} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Booking Details */}
            {bookingData.checkIn && bookingData.checkOut && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Stay Details</Typography>
                <Typography variant="body2"><strong>Check-in:</strong> {bookingData.checkIn}</Typography>
                <Typography variant="body2"><strong>Check-out:</strong> {bookingData.checkOut}</Typography>
                <Typography variant="body2"><strong>Nights:</strong> {nightsNow}</Typography>
                <Typography variant="body2"><strong>Guests:</strong> {bookingData.guests}</Typography>
                <Typography variant="body2"><strong>Rooms:</strong> {bookingData.rooms}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Cost Breakdown */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>Cost Breakdown</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">₹{unitPrice} × {nightsNow} nights × {bookingData.rooms} room{bookingData.rooms>1?'s':''}</Typography>
                <Typography variant="body2">₹{baseSubtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Taxes ({taxesPct}%)</Typography>
                <Typography variant="body2">₹{taxesAmt}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Service Fee</Typography>
                <Typography variant="body2">₹{svcFee}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">₹{Math.round(totalCost)}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog} onClose={() => setConfirmationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>Review your booking details before confirming:</Typography>
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
          <Button onClick={handleConfirmBooking} variant="contained" disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}>
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomBooking;
