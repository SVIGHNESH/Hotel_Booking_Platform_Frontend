import React, { useState, useEffect } from 'react';
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
  Snackbar
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Cancel,
  CheckCircle,
  Phone,
  Email,
  CalendarToday,
  People,
  AttachMoney,
  LocationOn
} from '@mui/icons-material';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockBookings = [
        {
          id: 'BK001',
          bookingNumber: 'HB-2024-001',
          customer: {
            id: 'C001',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567',
            avatar: null
          },
          room: {
            number: '201',
            type: 'Deluxe King Room',
            floor: 2
          },
          checkIn: '2024-12-25T15:00:00',
          checkOut: '2024-12-28T11:00:00',
          guests: 2,
          nights: 3,
          totalAmount: 450,
          status: 'confirmed',
          paymentStatus: 'paid',
          bookingDate: '2024-12-20T10:30:00',
          specialRequests: 'Late check-in requested, ground floor room preferred',
          source: 'Website'
        },
        {
          id: 'BK002',
          bookingNumber: 'HB-2024-002',
          customer: {
            id: 'C002',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1 (555) 987-6543',
            avatar: null
          },
          room: {
            number: '315',
            type: 'Ocean View Suite',
            floor: 3
          },
          checkIn: '2024-12-24T15:00:00',
          checkOut: '2024-12-27T11:00:00',
          guests: 2,
          nights: 3,
          totalAmount: 680,
          status: 'checked-in',
          paymentStatus: 'paid',
          bookingDate: '2024-12-19T14:20:00',
          specialRequests: '',
          source: 'Booking.com'
        },
        {
          id: 'BK003',
          bookingNumber: 'HB-2024-003',
          customer: {
            id: 'C003',
            name: 'Mike Wilson',
            email: 'mike.wilson@email.com',
            phone: '+1 (555) 456-7890',
            avatar: null
          },
          room: {
            number: '102',
            type: 'Standard Double Room',
            floor: 1
          },
          checkIn: '2024-12-26T15:00:00',
          checkOut: '2024-12-29T11:00:00',
          guests: 4,
          nights: 3,
          totalAmount: 320,
          status: 'pending',
          paymentStatus: 'pending',
          bookingDate: '2024-12-21T09:15:00',
          specialRequests: 'Two extra beds required',
          source: 'Phone'
        },
        {
          id: 'BK004',
          bookingNumber: 'HB-2024-004',
          customer: {
            id: 'C004',
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '+1 (555) 321-0987',
            avatar: null
          },
          room: {
            number: '408',
            type: 'Mountain View Room',
            floor: 4
          },
          checkIn: '2024-12-23T15:00:00',
          checkOut: '2024-12-25T11:00:00',
          guests: 2,
          nights: 2,
          totalAmount: 520,
          status: 'checked-out',
          paymentStatus: 'paid',
          bookingDate: '2024-12-18T16:45:00',
          specialRequests: 'Anniversary celebration, flowers and champagne',
          source: 'Website'
        },
        {
          id: 'BK005',
          bookingNumber: 'HB-2024-005',
          customer: {
            id: 'C005',
            name: 'David Brown',
            email: 'david.brown@email.com',
            phone: '+1 (555) 654-3210',
            avatar: null
          },
          room: {
            number: '205',
            type: 'Business Suite',
            floor: 2
          },
          checkIn: '2024-12-30T15:00:00',
          checkOut: '2025-01-03T11:00:00',
          guests: 1,
          nights: 4,
          totalAmount: 800,
          status: 'cancelled',
          paymentStatus: 'refunded',
          bookingDate: '2024-12-15T11:30:00',
          specialRequests: 'Business center access required',
          source: 'Expedia'
        }
      ];

      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
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
    setActionDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          switch (actionType) {
            case 'check-in':
              return { ...booking, status: 'checked-in' };
            case 'check-out':
              return { ...booking, status: 'checked-out' };
            case 'cancel':
              return { ...booking, status: 'cancelled', paymentStatus: 'refunded' };
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
