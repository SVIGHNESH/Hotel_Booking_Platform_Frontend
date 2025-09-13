import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Menu
} from '@mui/material';
import {
  CalendarToday,
  Hotel,
  Star,
  Download,
  MoreVert,
  Visibility,
  RateReview,
  Receipt,
  Cancel,
  CheckCircle,
  Pending,
  FilterList
} from '@mui/icons-material';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewDialog, setReviewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  const tabData = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    'checked-in': 'info',
    'checked-out': 'primary',
    cancelled: 'error',
    'no-show': 'error'
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/user/booking-history', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (res.data && res.data.success) {
        setBookings(res.data.data?.bookings || (res.data.bookings || []));
      } else {
        setError(res.data?.message || 'Failed to fetch booking history');
        setBookings([]);
      }
    } catch (error) {
      console.error('Fetch booking history error:', error);
      setError('Failed to fetch booking history');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    // Filter by tab
    const today = new Date();
    switch (currentTab) {
      case 1: // Upcoming
        filtered = filtered.filter(booking => {
          const checkInDate = new Date(booking.checkInDate);
          return checkInDate > today && booking.status !== 'cancelled';
        });
        break;
      case 2: // Past
        filtered = filtered.filter(booking => {
          const checkOutDate = new Date(booking.checkOutDate);
          return checkOutDate <= today && booking.status !== 'cancelled';
        });
        break;
      case 3: // Cancelled
        filtered = filtered.filter(booking => booking.status === 'cancelled');
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => {
      const checkInDate = new Date(b.checkInDate);
      return checkInDate > new Date() && b.status !== 'cancelled';
    }).length;
    const past = bookings.filter(b => {
      const checkOutDate = new Date(b.checkOutDate);
      return checkOutDate <= new Date() && b.status !== 'cancelled';
    }).length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalSpent = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return { total, upcoming, past, cancelled, totalSpent };
  };

  const handleAddReview = (booking) => {
    setSelectedBooking(booking);
    setReviewText('');
    setRating(5);
    setReviewDialog(true);
    setAnchorEl(null);
  };

  const handleSubmitReview = async () => {
    try {
      // API call to submit review
      const response = await fetch(`/api/bookings/${selectedBooking.bookingId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: rating,
          comment: reviewText
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      setBookings(prev => prev.map(booking => 
        booking._id === selectedBooking._id 
          ? {
              ...booking,
              hasReview: true,
              review: {
                rating: rating,
                comment: reviewText
              }
            }
          : booking
      ));
      
      setSuccess('Review submitted successfully');
      setReviewDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Submit review error:', error);
      setError('Failed to submit review');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialog(true);
    setAnchorEl(null);
  };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getDaysUntilCheckIn = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Booking History</Typography>
        <Button variant="outlined" startIcon={<Download />}>
          Download History
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="primary">{stats.total}</Typography>
                  <Typography variant="subtitle2">Total Bookings</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="info.main">{stats.upcoming}</Typography>
                  <Typography variant="subtitle2">Upcoming</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Pending />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="success.main">{stats.past}</Typography>
                  <Typography variant="subtitle2">Completed</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="secondary.main">₹{stats.totalSpent.toLocaleString()}</Typography>
                  <Typography variant="subtitle2">Total Spent</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light' }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
          >
            {tabData.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="checked-in">Checked In</MenuItem>
                <MenuItem value="checked-out">Checked Out</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {getFilteredBookings().length} bookings
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Bookings List */}
      <Grid container spacing={3}>
        {getFilteredBookings().length > 0 ? (
          getFilteredBookings().map((booking) => {
            const daysUntilCheckIn = getDaysUntilCheckIn(booking.checkInDate);
            const isUpcoming = daysUntilCheckIn > 0 && booking.status !== 'cancelled';
            
            return (
              <Grid item xs={12} key={booking._id}>
                <Card elevation={2}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={booking.hotelImage}
                            alt={booking.hotelName}
                            style={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 8,
                              backgroundColor: '#f5f5f5'
                            }}
                            onError={(e) => {
                              e.target.style.backgroundColor = '#f5f5f5';
                              e.target.style.display = 'flex';
                              e.target.style.alignItems = 'center';
                              e.target.style.justifyContent = 'center';
                            }}
                          />
                          <Chip
                            label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            color={statusColors[booking.status]}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {booking.hotelName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Star sx={{ color: 'gold', fontSize: 16 }} />
                              <Typography variant="body2">
                                {booking.hotelRating}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ₹{booking.totalAmount.toLocaleString()}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Booking ID: #{booking.bookingId}
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold">
                              Room: {booking.roomType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Room {booking.roomNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold">
                              Guests: {booking.guests.adults + booking.guests.children}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.guests.adults} adults, {booking.guests.children} children
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold">
                              Check-in: {formatDate(booking.checkInDate)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold">
                              Check-out: {formatDate(booking.checkOutDate)}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Typography variant="caption" color="text.secondary">
                          Booked on {formatDate(booking.bookingDate)} • {booking.nights} nights
                        </Typography>

                        {isUpcoming && daysUntilCheckIn <= 7 && (
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`${daysUntilCheckIn} days to check-in`} 
                              color="warning" 
                              size="small"
                            />
                          </Box>
                        )}

                        {booking.status === 'cancelled' && booking.cancellationReason && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="error">
                              Cancelled: {booking.cancellationReason}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%', justifyContent: 'center' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewDetails(booking)}
                            startIcon={<Visibility />}
                          >
                            Details
                          </Button>
                          
                          {booking.status === 'checked-out' && !booking.hasReview && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleAddReview(booking)}
                              startIcon={<RateReview />}
                            >
                              Review
                            </Button>
                          )}

                          {booking.hasReview && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ color: 'gold', fontSize: 16 }} />
                              <Typography variant="caption">
                                {booking.review.rating}/5 rated
                              </Typography>
                            </Box>
                          )}

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, booking)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Hotel sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start exploring hotels and make your first booking!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedBooking && (
          <>
            <MenuItem onClick={() => handleViewDetails(selectedBooking)}>
              <Visibility sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} />
              Download Invoice
            </MenuItem>
            {selectedBooking.status === 'confirmed' && getDaysUntilCheckIn(selectedBooking.checkInDate) > 1 && (
              <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                <Cancel sx={{ mr: 1 }} />
                Cancel Booking
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedBooking.hotelName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedBooking.roomType} • {formatDate(selectedBooking.checkInDate)} - {formatDate(selectedBooking.checkOutDate)}
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      sx={{
                        cursor: 'pointer',
                        color: star <= rating ? 'gold' : 'grey.300',
                        fontSize: 32
                      }}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience about this hotel..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            disabled={!reviewText.trim()}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Booking ID:</strong> #{selectedBooking.bookingId}</Typography>
                <Typography><strong>Hotel:</strong> {selectedBooking.hotelName}</Typography>
                <Typography><strong>Room:</strong> {selectedBooking.roomType}</Typography>
                <Typography><strong>Room Number:</strong> {selectedBooking.roomNumber}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedBooking.status} 
                    color={statusColors[selectedBooking.status]} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Stay Details</Typography>
                <Typography><strong>Check-in:</strong> {formatDate(selectedBooking.checkInDate)}</Typography>
                <Typography><strong>Check-out:</strong> {formatDate(selectedBooking.checkOutDate)}</Typography>
                <Typography><strong>Nights:</strong> {selectedBooking.nights}</Typography>
                <Typography><strong>Guests:</strong> {selectedBooking.guests.adults} adults, {selectedBooking.guests.children} children</Typography>
                <Typography><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount.toLocaleString()}</Typography>
              </Grid>

              {selectedBooking.hasReview && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Your Review</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        sx={{
                          color: star <= selectedBooking.review.rating ? 'gold' : 'grey.300',
                          fontSize: 20
                        }}
                      />
                    ))}
                    <Typography variant="body2">
                      {selectedBooking.review.rating}/5
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {selectedBooking.review.comment}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          <Button variant="contained">Download Invoice</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingHistory;
