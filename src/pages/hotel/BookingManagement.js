import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Cancel,
  CheckCircle,
  Phone,
  Email,
  CalendarToday,
  Receipt,
  Edit
} from '@mui/icons-material';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cancellation states
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Edit booking states
  const [editDialog, setEditDialog] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);

  // Filter bookings function
  const filterBookings = useCallback(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room.number.includes(searchTerm) ||
        booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/hotel/bookings', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.success) {
        setBookings(res.data.data?.bookings || (res.data.bookings || []));
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'checked-in': return 'success';
      case 'checked-out': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialog(true);
  };

  const handleActionClick = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    
    if (type === 'cancel') {
      // Open enhanced cancel dialog
      setCancelDialog(true);
      setCancelReason('');
      setRefundAmount(0);
      
      // Calculate refund amount based on check-in date
      const checkInDate = new Date(booking.checkIn);
      const currentDate = new Date();
      const daysDifference = Math.ceil((checkInDate - currentDate) / (1000 * 60 * 60 * 24));
      
      let refundPercentage = 0;
      if (daysDifference >= 7) {
        refundPercentage = 100;
      } else if (daysDifference >= 3) {
        refundPercentage = 50;
      } else if (daysDifference >= 1) {
        refundPercentage = 25;
      } else {
        refundPercentage = 0;
      }
      
      setRefundAmount(Math.round((booking.totalAmount * refundPercentage) / 100));
    } else {
      setActionDialog(true);
    }
  };

  const handleConfirmAction = async () => {
    try {
      const res = await axios.post(`/api/hotel/bookings/${selectedBooking.id}/${actionType}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (!(res.data && res.data.success)) {
        setSnackbar({ open: true, message: res.data?.message || `Failed to ${actionType} booking`, severity: 'error' });
        return;
      }

      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          switch (actionType) {
            case 'check-in':
              return { ...booking, status: 'checked-in' };
            case 'check-out':
              return { ...booking, status: 'checked-out' };
            case 'confirm':
              return { ...booking, status: 'confirmed', paymentStatus: 'paid' };
            default:
              return booking;
          }
        }
        return booking;
      });

      setBookings(updatedBookings);
      setActionDialog(false);
      setSnackbar({
        open: true,
        message: `Booking ${actionType.replace('-', ' ')} successful!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Action failed:', error);
      setSnackbar({
        open: true,
        message: 'Action failed. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please select a reason for cancellation.',
        severity: 'warning'
      });
      return;
    }

    setCancelLoading(true);
    try {
      const res = await axios.post(`/api/hotel/bookings/${selectedBooking.id}/cancel`, {
        reason: cancelReason,
        refundAmount: refundAmount,
        cancelledBy: 'hotel'
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      if (!(res.data && res.data.success)) {
        setSnackbar({ open: true, message: res.data?.message || 'Failed to cancel booking', severity: 'error' });
        setCancelLoading(false);
        return;
      }

      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            status: 'cancelled',
            paymentStatus: refundAmount > 0 ? 'refunded' : 'no-refund',
            cancellationReason: cancelReason,
            refundAmount: refundAmount,
            cancelledBy: 'hotel',
            cancelledAt: new Date().toISOString()
          };
        }
        return booking;
      });

      setBookings(updatedBookings);
      setCancelDialog(false);
      setCancelLoading(false);
      
      setSnackbar({
        open: true,
        message: `Booking cancelled successfully. ${refundAmount > 0 ? `Refund of ₹${refundAmount} will be processed.` : 'No refund applicable.'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Cancellation failed:', error);
      setCancelLoading(false);
      setSnackbar({
        open: true,
        message: 'Cancellation failed. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditBooking = (booking) => {
    setEditBookingData({ ...booking });
    setEditDialog(true);
  };

  const handleEditBookingChange = (field, value) => {
    setEditBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditBookingSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...(editBookingData.checkIn && { checkIn: editBookingData.checkIn }),
        ...(editBookingData.checkOut && { checkOut: editBookingData.checkOut })
      };
      const res = await axios.put(`/api/hotel/bookings/${editBookingData.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.success) {
        const updated = res.data.data;
        setBookings(bookings.map(b => b.id === editBookingData.id ? { ...b, checkIn: updated.checkIn, checkOut: updated.checkOut, nights: updated.nights } : b));
        setSnackbar({ open: true, message: 'Booking updated successfully!', severity: 'success' });
        setEditDialog(false);
      } else {
        setSnackbar({ open: true, message: res.data?.message || 'Failed to update booking', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update booking', severity: 'error' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by customer name, booking number, room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
                variant="outlined"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="checked-in">Checked In</MenuItem>
                <MenuItem value="checked-out">Checked Out</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              size="large"
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Booking Details</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {booking.customer.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.bookingNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(booking.bookingDate)}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        via {booking.source}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        Room {booking.room.number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.room.type}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateOnly(booking.checkIn)}
                      </Typography>
                      <Typography variant="body2">
                        to {formatDateOnly(booking.checkOut)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.nights} night{booking.nights > 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{booking.totalAmount}
                      </Typography>
                      <Chip
                        size="small"
                        label={booking.paymentStatus}
                        color={getPaymentStatusColor(booking.paymentStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(booking)}
                          title="View Details"
                        >
                          <Visibility />
                        </IconButton>
                        {booking.status === 'pending' && (
                          <IconButton
                            size="small"
                            onClick={() => handleActionClick(booking, 'confirm')}
                            title="Confirm Booking"
                            color="primary"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        {booking.status === 'confirmed' && (
                          <IconButton
                            size="small"
                            onClick={() => handleActionClick(booking, 'check-in')}
                            title="Check In"
                            color="success"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        {booking.status === 'checked-in' && (
                          <IconButton
                            size="small"
                            onClick={() => handleActionClick(booking, 'check-out')}
                            title="Check Out"
                            color="info"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <IconButton
                            size="small"
                            onClick={() => handleActionClick(booking, 'cancel')}
                            title="Cancel Booking"
                            color="error"
                          >
                            <Cancel />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleEditBooking(booking)} disabled={!['pending','confirmed'].includes(booking.status)}>
                          <Edit />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Booking Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                    {selectedBooking.customer.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedBooking.customer.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Email sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{selectedBooking.customer.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{selectedBooking.customer.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Booking Number:</strong> {selectedBooking.bookingNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Booking Date:</strong> {formatDate(selectedBooking.bookingDate)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Source:</strong> {selectedBooking.source}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong>{' '}
                  <Chip
                    size="small"
                    label={selectedBooking.status}
                    color={getStatusColor(selectedBooking.status)}
                  />
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Payment:</strong>{' '}
                  <Chip
                    size="small"
                    label={selectedBooking.paymentStatus}
                    color={getPaymentStatusColor(selectedBooking.paymentStatus)}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Room Details</Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Room Number:</strong> {selectedBooking.room.number}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Room Type:</strong> {selectedBooking.room.type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Floor:</strong> {selectedBooking.room.floor}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Guests:</strong> {selectedBooking.guests}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Stay Details</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Check-in:</strong> {formatDate(selectedBooking.checkIn)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Check-out:</strong> {formatDate(selectedBooking.checkOut)}
                  </Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Duration:</strong> {selectedBooking.nights} night{selectedBooking.nights > 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}
                </Typography>
              </Grid>

              {selectedBooking.specialRequests && (
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Special Requests
                  </Typography>
                  <Typography variant="body2">{selectedBooking.specialRequests}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1).replace('-', ' ')}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to {actionType.replace('-', ' ')} this booking?
            </Alert>
          )}
          {selectedBooking && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Customer:</strong> {selectedBooking.customer.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Booking:</strong> {selectedBooking.bookingNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Room:</strong> {selectedBooking.room.number} - {selectedBooking.room.type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1).replace('-', ' ')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Cancel Booking Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cancel />
          Cancel Booking - Hotel Management
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              {/* Booking Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Booking Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Booking ID:</strong> {selectedBooking.bookingNumber}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Customer:</strong> {selectedBooking.customer.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Room:</strong> {selectedBooking.room.number} - {selectedBooking.room.type}
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
                      <strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Refund Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: refundAmount > 0 ? 'success.light' : 'warning.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Receipt />
                      Refund Information
                    </Typography>
                    <Typography variant="h4" gutterBottom color="inherit">
                      ₹{refundAmount}
                    </Typography>
                    <Typography variant="body2" color="inherit">
                      {refundAmount === selectedBooking?.totalAmount && 'Full refund (100%)'}
                      {refundAmount === Math.round(selectedBooking?.totalAmount * 0.5) && 'Partial refund (50%)'}
                      {refundAmount === Math.round(selectedBooking?.totalAmount * 0.25) && 'Partial refund (25%)'}
                      {refundAmount === 0 && 'No refund applicable'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cancellation Policy */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Hotel Cancellation Policy
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • 7+ days before: 100% refund
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • 3-6 days before: 50% refund
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • 1-2 days before: 25% refund
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • Same day: No refund
                    </Typography>
                  </CardContent>
                </Card>
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
                    variant="outlined"
                  >
                    <MenuItem value="customer_request">Customer Request</MenuItem>
                    <MenuItem value="overbooking">Overbooking</MenuItem>
                    <MenuItem value="maintenance_issues">Room Maintenance Issues</MenuItem>
                    <MenuItem value="facility_unavailable">Facility Unavailable</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="policy_violation">Policy Violation</MenuItem>
                    <MenuItem value="payment_issues">Payment Issues</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Warning Notice */}
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Important:</strong> This action cannot be undone. The customer will be notified immediately, 
                    and refund processing will begin automatically if applicable.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setCancelDialog(false)}
            size="large"
          >
            Keep Booking
          </Button>
          <Button 
            onClick={handleCancelBooking}
            variant="contained" 
            color="error"
            size="large"
            disabled={cancelLoading || !cancelReason}
            startIcon={cancelLoading ? <CircularProgress size={20} /> : <Cancel />}
          >
            {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Check-In Date"
                type="date"
                value={editBookingData?.checkIn?.slice(0,10) || ''}
                onChange={e => handleEditBookingChange('checkIn', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Check-Out Date"
                type="date"
                value={editBookingData?.checkOut?.slice(0,10) || ''}
                onChange={e => handleEditBookingChange('checkOut', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Guest Name"
                value={editBookingData?.customer?.name || ''}
                onChange={e => handleEditBookingChange('customer', { ...editBookingData.customer, name: e.target.value })}
                fullWidth
              />
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditBookingSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingManagement;
