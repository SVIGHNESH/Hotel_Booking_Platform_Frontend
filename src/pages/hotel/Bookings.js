import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  Divider
} from '@mui/material';
import {
  CalendarToday,
  Person,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
  MoreVert,
  Download,
  Email,
  Print,
  Visibility,
  Edit
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const tabData = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'Analytics', value: 'analytics' }
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
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/hotel/bookings', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.success) {
        setBookings(res.data.data?.bookings || (res.data.bookings || []));
      } else {
        setError(res.data?.message || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setError('Failed to fetch bookings');
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
    switch (currentTab) {
      case 1: // Today
        filtered = filtered.filter(booking => {
          const today = new Date().toISOString().split('T')[0];
          return booking.checkInDate === today || booking.checkOutDate === today;
        });
        break;
      case 2: // This Week
        filtered = filtered.filter(booking => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= weekAgo;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const checkedIn = bookings.filter(b => b.status === 'checked-in').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.amountPaid, 0);
    const averageBookingValue = total > 0 ? totalRevenue / total : 0;

    return { total, pending, confirmed, checkedIn, totalRevenue, averageBookingValue };
  };

  const getAnalyticsData = () => {
    // Monthly booking trends
    const monthlyData = [
      { month: 'Jan', bookings: 45, revenue: 450000 },
      { month: 'Feb', bookings: 52, revenue: 520000 },
      { month: 'Mar', bookings: 48, revenue: 480000 },
      { month: 'Apr', bookings: 61, revenue: 610000 },
      { month: 'May', bookings: 55, revenue: 550000 },
      { month: 'Jun', bookings: 67, revenue: 670000 }
    ];

    // Room type distribution
    const roomTypeData = [
      { name: 'Standard', value: 35, color: '#8884d8' },
      { name: 'Deluxe', value: 40, color: '#82ca9d' },
      { name: 'Suite', value: 20, color: '#ffc658' },
      { name: 'Premium', value: 5, color: '#ff7300' }
    ];

    // Booking source distribution
    const sourceData = [
      { name: 'Website', value: 50, color: '#0088fe' },
      { name: 'Phone', value: 25, color: '#00c49f' },
      { name: 'App', value: 20, color: '#ffbb28' },
      { name: 'Walk-in', value: 5, color: '#ff8042' }
    ];

    return { monthlyData, roomTypeData, sourceData };
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const stats = getBookingStats();
  const analyticsData = getAnalyticsData();

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
        <Typography variant="h4" gutterBottom>Hotel Bookings</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<CalendarToday />}>
            Calendar View
          </Button>
        </Box>
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
                  <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
                  <Typography variant="subtitle2">Pending</Typography>
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
                  <Typography variant="h4" color="success.main">{stats.confirmed}</Typography>
                  <Typography variant="subtitle2">Confirmed</Typography>
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
                  <Typography variant="h4" color="info.main">₹{stats.totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="subtitle2">Revenue</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <AttachMoney />
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
          
          {currentTab !== 3 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                {getFilteredBookings().length} bookings
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Content based on tab */}
      {currentTab === 3 ? (
        // Analytics View
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Booking Trends</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Room Type Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.roomTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {analyticsData.roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Booking Sources</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.sourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {analyticsData.sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // Bookings Table
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredBookings().length > 0 ? (
                  getFilteredBookings().map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            #{booking.bookingId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(booking.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {booking.customerName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {booking.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.guests.adults} adults, {booking.guests.children} children
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            Room {booking.roomNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.roomType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.nights} nights
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            ₹{booking.totalAmount.toLocaleString()}
                          </Typography>
                          <Chip
                            label={booking.paymentStatus}
                            size="small"
                            color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          color={statusColors[booking.status]}
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
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No bookings found for the selected filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

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
              <Edit sx={{ mr: 1 }} />
              Edit Booking
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <Email sx={{ mr: 1 }} />
              Send Email
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Print sx={{ mr: 1 }} />
              Print Invoice
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Booking Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details - #{selectedBooking?.bookingId}</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.customerName}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.customerEmail}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.customerPhone}</Typography>
                <Typography><strong>Guests:</strong> {selectedBooking.guests.adults} adults, {selectedBooking.guests.children} children</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Booking ID:</strong> {selectedBooking.bookingId}</Typography>
                <Typography><strong>Created:</strong> {formatDateTime(selectedBooking.createdAt)}</Typography>
                <Typography><strong>Source:</strong> {selectedBooking.bookingSource}</Typography>
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
                <Typography variant="h6" gutterBottom>Room Details</Typography>
                <Typography><strong>Room:</strong> {selectedBooking.roomNumber}</Typography>
                <Typography><strong>Type:</strong> {selectedBooking.roomType}</Typography>
                <Typography><strong>Check-in:</strong> {formatDate(selectedBooking.checkInDate)}</Typography>
                <Typography><strong>Check-out:</strong> {formatDate(selectedBooking.checkOutDate)}</Typography>
                <Typography><strong>Nights:</strong> {selectedBooking.nights}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Information</Typography>
                <Typography><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount.toLocaleString()}</Typography>
                <Typography><strong>Amount Paid:</strong> ₹{selectedBooking.amountPaid.toLocaleString()}</Typography>
                <Typography><strong>Payment Status:</strong> 
                  <Chip 
                    label={selectedBooking.paymentStatus} 
                    color={selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Special Requests</Typography>
                <Typography>{selectedBooking.specialRequests || 'None'}</Typography>
              </Grid>
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

export default Bookings;
