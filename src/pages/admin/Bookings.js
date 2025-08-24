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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search,
  MoreVert,
  BookOnline,
  CheckCircle,
  Pending,
  Cancel,
  Person,
  Hotel,
  CalendarToday,
  Payment
} from '@mui/icons-material';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, booking: null });

  // Mock data for demonstration
  const mockBookings = [
    {
      _id: 'b1',
      bookingReference: 'HB20250823001',
      customerId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      hotelId: { name: 'Grand Hotel', _id: 'h1' },
      roomId: { roomNumber: '101', type: 'Deluxe', _id: 'r1' },
      checkIn: '2025-08-25',
      checkOut: '2025-08-28',
      guests: { adults: 2, children: 1 },
      amount: 15000,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'b2',
      bookingReference: 'HB20250823002',
      customerId: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      hotelId: { name: 'Beach Resort', _id: 'h2' },
      roomId: { roomNumber: '205', type: 'Suite', _id: 'r2' },
      checkIn: '2025-08-30',
      checkOut: '2025-09-02',
      guests: { adults: 2, children: 0 },
      amount: 25000,
      currency: 'INR',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: 'b3',
      bookingReference: 'HB20250823003',
      customerId: { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
      hotelId: { name: 'City Inn', _id: 'h3' },
      roomId: { roomNumber: '302', type: 'Standard', _id: 'r3' },
      checkIn: '2025-08-26',
      checkOut: '2025-08-27',
      guests: { adults: 1, children: 0 },
      amount: 8000,
      currency: 'INR',
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      _id: 'b4',
      bookingReference: 'HB20250823004',
      customerId: { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com' },
      hotelId: { name: 'Mountain Lodge', _id: 'h4' },
      roomId: { roomNumber: '401', type: 'Family', _id: 'r4' },
      checkIn: '2025-09-01',
      checkOut: '2025-09-05',
      guests: { adults: 2, children: 2 },
      amount: 32000,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  useEffect(() => {
    // Using mock data since comprehensive booking endpoints might not be available
    setBookings(mockBookings);
    setTotalBookings(mockBookings.length);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <Cancel />;
      case 'completed':
        return <CheckCircle />;
      default:
        return <BookOnline />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${booking.customerId.firstName} ${booking.customerId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.hotelId.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleViewDetails = (booking) => {
    setDetailDialog({ open: true, booking });
    handleMenuClose();
  };

  // Summary statistics
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amount, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>All Bookings</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="success.main">{confirmedBookings}</Typography>
                  <Typography variant="subtitle1">Confirmed</Typography>
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
                  <Typography variant="h4" color="warning.main">{pendingBookings}</Typography>
                  <Typography variant="subtitle1">Pending</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
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
                  <Typography variant="h4" color="error.main">{cancelledBookings}</Typography>
                  <Typography variant="subtitle1">Cancelled</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <Cancel />
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
                  <Typography variant="h4" color="primary">₹{totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="subtitle1">Total Revenue</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <Payment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Bookings"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Bookings Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking Reference</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Hotel</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.bookingReference}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Room: {booking.roomId.roomNumber} ({booking.roomId.type})
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        <Box>
                          <Typography variant="body2">
                            {booking.customerId.firstName} {booking.customerId.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.customerId.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Hotel fontSize="small" />
                        <Typography variant="body2">
                          {booking.hotelId.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" />
                        <Box>
                          <Typography variant="body2">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            to {new Date(booking.checkOut).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{booking.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.guests.adults + booking.guests.children} guests
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={booking.status.toUpperCase()}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.paymentStatus.toUpperCase()}
                        color={getPaymentStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, booking)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedBooking && (
          <MenuItem onClick={() => handleViewDetails(selectedBooking)}>
            View Details
          </MenuItem>
        )}
      </Menu>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, booking: null })} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {detailDialog.booking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{detailDialog.booking.bookingReference}</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Customer Information:</Typography>
                  <Typography variant="body2">
                    {detailDialog.booking.customerId.firstName} {detailDialog.booking.customerId.lastName}
                  </Typography>
                  <Typography variant="body2">{detailDialog.booking.customerId.email}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Hotel Information:</Typography>
                  <Typography variant="body2">{detailDialog.booking.hotelId.name}</Typography>
                  <Typography variant="body2">Room: {detailDialog.booking.roomId.roomNumber} ({detailDialog.booking.roomId.type})</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Booking Details:</Typography>
                  <Typography variant="body2">Check-in: {new Date(detailDialog.booking.checkIn).toLocaleDateString()}</Typography>
                  <Typography variant="body2">Check-out: {new Date(detailDialog.booking.checkOut).toLocaleDateString()}</Typography>
                  <Typography variant="body2">Guests: {detailDialog.booking.guests.adults} adults, {detailDialog.booking.guests.children} children</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Payment Information:</Typography>
                  <Typography variant="body2">Amount: ₹{detailDialog.booking.amount.toLocaleString()}</Typography>
                  <Typography variant="body2">Status: {detailDialog.booking.paymentStatus}</Typography>
                  <Typography variant="body2">Booking Status: {detailDialog.booking.status}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Booking Date:</Typography>
                  <Typography variant="body2">{new Date(detailDialog.booking.createdAt).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, booking: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;
