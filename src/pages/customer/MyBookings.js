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
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People,
  MoreVert,
  Cancel,
  Edit,
  Receipt,
  Star,
  Message,
  Phone,
  Email,
  CheckCircle,
  AccessTime,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const tabLabels = ['All Bookings', 'Upcoming', 'Past', 'Cancelled'];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockBookings = [
        {
          id: 'BK001',
          hotel: {
            id: 'H001',
            name: 'Grand Plaza Hotel',
            location: 'Downtown Manhattan, New York',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.5,
            phone: '+1 (555) 123-4567',
            email: 'info@grandplaza.com'
          },
          room: {
            name: 'Deluxe King Room',
            type: 'King'
          },
          checkIn: '2024-12-25',
          checkOut: '2024-12-28',
          guests: 2,
          rooms: 1,
          totalCost: 450,
          status: 'confirmed',
          bookingDate: '2024-12-20',
          specialRequests: 'Late check-in requested',
          paymentStatus: 'paid',
          canCancel: true,
          canReview: false
        },
        {
          id: 'BK002',
          hotel: {
            id: 'H002',
            name: 'Seaside Resort',
            location: 'Miami Beach, Florida',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.8,
            phone: '+1 (555) 987-6543',
            email: 'reservations@seasideresort.com'
          },
          room: {
            name: 'Ocean View Suite',
            type: 'Suite'
          },
          checkIn: '2024-11-15',
          checkOut: '2024-11-18',
          guests: 2,
          rooms: 1,
          totalCost: 680,
          status: 'completed',
          bookingDate: '2024-11-10',
          specialRequests: '',
          paymentStatus: 'paid',
          canCancel: false,
          canReview: true
        },
        {
          id: 'BK003',
          hotel: {
            id: 'H003',
            name: 'Mountain Lodge',
            location: 'Aspen, Colorado',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.2,
            phone: '+1 (555) 456-7890',
            email: 'info@mountainlodge.com'
          },
          room: {
            name: 'Standard Double Room',
            type: 'Double'
          },
          checkIn: '2024-10-05',
          checkOut: '2024-10-08',
          guests: 4,
          rooms: 2,
          totalCost: 520,
          status: 'cancelled',
          bookingDate: '2024-09-30',
          specialRequests: 'Ground floor room preferred',
          paymentStatus: 'refunded',
          canCancel: false,
          canReview: false,
          cancellationReason: 'Change of plans'
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
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
    setCancelDialog(true);
    handleMenuClose();
  };

  const handleWriteReview = () => {
    setReviewDialog(true);
    handleMenuClose();
  };

  const confirmCancelBooking = async () => {
    try {
      // Mock API call for cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking status
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'cancelled', canCancel: false }
          : booking
      ));
      
      setCancelDialog(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const submitReview = async () => {
    try {
      // Mock API call for review submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking to mark as reviewed
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, canReview: false, hasReview: true }
          : booking
      ));
      
      setReviewDialog(false);
      setSelectedBooking(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to submit review:', error);
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
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Alert>
          {selectedBooking && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Hotel:</strong> {selectedBooking.hotel.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Booking ID:</strong> {selectedBooking.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Dates:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()} - {new Date(selectedBooking.checkOut).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Total Amount:</strong> ₹{selectedBooking.totalCost}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Booking</Button>
          <Button onClick={confirmCancelBooking} color="error" variant="contained">
            Cancel Booking
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
    </Container>
  );
};

export default MyBookings;
