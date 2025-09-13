import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People,
  MoreVert,
  Cancel,
  Receipt,
  Star,
  Phone,
  CheckCircle,
  AccessTime
} from '@mui/icons-material';
import axios from 'axios';

const MyBookings = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);

  const tabLabels = ['All Bookings', 'Upcoming', 'Past', 'Cancelled'];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/customer/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setBookings(response.data.data || []);
      } else {
        setSnackbar({ open: true, message: 'Failed to fetch bookings', severity: 'error' });
        setBookings([]);
        return;
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    
    switch (currentTab) {
      case 1: // Upcoming
        return bookings.filter(booking => 
          new Date(booking.checkIn) > now && booking.status === 'confirmed'
        );
      case 2: // Past
        return bookings.filter(booking => 
          new Date(booking.checkOut) < now && booking.status === 'completed'
        );
      case 3: // Cancelled
        return bookings.filter(booking => booking.status === 'cancelled');
      default: // All
        return bookings;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      case 'pending': return <AccessTime />;
      default: return <AccessTime />;
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleCancelBooking = () => {
    // Calculate refund amount based on cancellation policy
    const checkInDate = new Date(selectedBooking.checkIn);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    if (daysUntilCheckIn >= 7) {
      refundPercentage = 100; // Full refund
    } else if (daysUntilCheckIn >= 3) {
      refundPercentage = 50; // 50% refund
    } else if (daysUntilCheckIn >= 1) {
      refundPercentage = 25; // 25% refund
    } else {
      refundPercentage = 0; // No refund
    }
    
    setRefundAmount(Math.round((selectedBooking.totalCost * refundPercentage) / 100));
    setCancelDialog(true);
    handleMenuClose();
  };

  const handleWriteReview = () => {
    setReviewDialog(true);
    handleMenuClose();
  };

  const confirmCancelBooking = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/bookings/${selectedBooking.id}/cancel`, {
        reason: cancelReason,
        refundAmount: refundAmount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data && res.data.success) {
        setBookings(prev => prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { 
                ...booking, 
                status: 'cancelled', 
                canCancel: false,
                cancellationReason: cancelReason,
                refundAmount: refundAmount,
                paymentStatus: refundAmount > 0 ? 'refunded' : 'cancelled'
              }
            : booking
        ));

        setCancelDialog(false);
        setCancelReason('');
        setSelectedBooking(null);

        setSnackbar({ open: true, message: `Booking cancelled successfully! ${refundAmount > 0 ? `Refund of \u20b9${refundAmount} will be processed within 3-5 business days.` : 'No refund applicable as per cancellation policy.'}` , severity: 'success' });
      } else {
        setSnackbar({ open: true, message: res.data?.message || 'Failed to cancel booking', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setSnackbar({ open: true, message: 'Failed to cancel booking. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      const res = await axios.post(`/api/bookings/${selectedBooking.id}/review`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (res.data && res.data.success) {
        setBookings(prev => prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, canReview: false, hasReview: true }
            : booking
        ));

        setReviewDialog(false);
        setSelectedBooking(null);
        setReviewData({ rating: 5, comment: '' });
        setSnackbar({ open: true, message: 'Review submitted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: res.data?.message || 'Failed to submit review', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      setSnackbar({ open: true, message: 'Failed to submit review. Please try again.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Alert severity="info">
          No bookings found for this category.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card elevation={2}>
                <Grid container>
                  {/* Hotel Image */}
                  <Grid item xs={12} sm={4} md={3}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={booking.hotel.image}
                      alt={booking.hotel.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Grid>
                  
                  {/* Booking Details */}
                  <Grid item xs={12} sm={8} md={9}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.hotel.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {booking.hotel.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{booking.hotel.rating}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={getStatusIcon(booking.status)}
                            label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                          <IconButton
                            onClick={(e) => handleMenuClick(e, booking)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            {booking.room.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday color="action" sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <People color="action" sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              {booking.guests} guests, {booking.rooms} room{booking.rooms > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {calculateNights(booking.checkIn, booking.checkOut)} nights
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            ₹{booking.totalCost}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Booking ID: {booking.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                          </Typography>
                          {booking.status === 'cancelled' && booking.cancellationReason && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                              Reason: {booking.cancellationReason}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>

                      {booking.specialRequests && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { /* View details */ handleMenuClose(); }}>
          <Receipt sx={{ mr: 1 }} /> View Receipt
        </MenuItem>
        {selectedBooking?.canCancel && (
          <MenuItem onClick={handleCancelBooking}>
            <Cancel sx={{ mr: 1 }} /> Cancel Booking
          </MenuItem>
        )}
        {selectedBooking?.canReview && (
          <MenuItem onClick={handleWriteReview}>
            <Star sx={{ mr: 1 }} /> Write Review
          </MenuItem>
        )}
        <MenuItem onClick={() => { /* Contact hotel */ handleMenuClose(); }}>
          <Phone sx={{ mr: 1 }} /> Contact Hotel
        </MenuItem>
      </Menu>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cancel color="error" />
            Cancel Booking
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Please review the cancellation policy and refund details below before proceeding.
            </Typography>
          </Alert>
          
          {selectedBooking && (
            <Grid container spacing={3}>
              {/* Booking Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Booking Details
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Hotel:</strong> {selectedBooking.hotel.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Booking ID:</strong> {selectedBooking.id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Room:</strong> {selectedBooking.room.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Check-in:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Check-out:</strong> {new Date(selectedBooking.checkOut).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Paid:</strong> ₹{selectedBooking.totalCost.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>

              {/* Refund Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Refund Information
                </Typography>
                <Box sx={{ p: 2, bgcolor: refundAmount > 0 ? 'success.light' : 'error.light', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Refund Amount:</strong> ₹{refundAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Refund Percentage:</strong> {Math.round((refundAmount / selectedBooking.totalCost) * 100)}%
                  </Typography>
                  {refundAmount > 0 && (
                    <Typography variant="caption" color="success.dark">
                      Refund will be processed within 3-5 business days to your original payment method.
                    </Typography>
                  )}
                  {refundAmount === 0 && (
                    <Typography variant="caption" color="error.dark">
                      No refund applicable as per our cancellation policy for bookings cancelled within 24 hours.
                    </Typography>
                  )}
                </Box>

                {/* Cancellation Policy */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Cancellation Policy:
                  </Typography>
                  <Typography variant="caption" display="block">
                    • 7+ days: 100% refund
                  </Typography>
                  <Typography variant="caption" display="block">
                    • 3-6 days: 50% refund
                  </Typography>
                  <Typography variant="caption" display="block">
                    • 1-2 days: 25% refund
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Same day: No refund
                  </Typography>
                </Box>
              </Grid>

              {/* Cancellation Reason */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Reason for Cancellation
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Reason</InputLabel>
                  <Select
                    value={cancelReason}
                    label="Select Reason"
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    <MenuItem value="change_of_plans">Change of Plans</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="travel_restrictions">Travel Restrictions</MenuItem>
                    <MenuItem value="health_issues">Health Issues</MenuItem>
                    <MenuItem value="work_commitments">Work Commitments</MenuItem>
                    <MenuItem value="weather_conditions">Weather Conditions</MenuItem>
                    <MenuItem value="financial_constraints">Financial Constraints</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                {cancelReason === 'other' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Please specify"
                    sx={{ mt: 2 }}
                    placeholder="Please provide additional details..."
                  />
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setCancelDialog(false);
              setCancelReason('');
            }}
            variant="outlined"
          >
            Keep Booking
          </Button>
          <Button 
            onClick={confirmCancelBooking} 
            color="error" 
            variant="contained"
            disabled={!cancelReason || loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Cancel />}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.hotel.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBooking.room.name}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Overall Rating
            </Typography>
            <Rating
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData(prev => ({ ...prev, rating: newValue }));
              }}
              size="large"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Your Review"
            multiline
            rows={4}
            value={reviewData.comment}
            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Share your experience with other travelers..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button onClick={submitReview} variant="contained" disabled={!reviewData.comment.trim()}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar for MyBookings */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default MyBookings;
