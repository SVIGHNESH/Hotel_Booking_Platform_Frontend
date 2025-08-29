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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  InputAdornment,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Block,
  CheckCircle,
  Hotel,
  People,
  Settings,
  Add,
  Edit,
  Visibility
} from '@mui/icons-material';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [blockDialog, setBlockDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockType, setBlockType] = useState('maintenance');
  
  // Add Room Dialog States
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [addRoomLoading, setAddRoomLoading] = useState(false);
  const [addRoomError, setAddRoomError] = useState('');
  const [addRoomSuccess, setAddRoomSuccess] = useState('');
  const [newRoom, setNewRoom] = useState({
    name: '',
    roomType: 'Standard',
    description: '',
    pricing: {
      basePrice: '',
      currency: 'INR'
    },
    capacity: {
      adults: 2,
      children: 0
    },
    size: {
      value: '',
      unit: 'sqft'
    },
    amenities: [],
    totalRooms: 1
  });

  const roomTypes = [
    { value: 'Standard', label: 'Standard Room' },
    { value: 'Deluxe', label: 'Deluxe Room' },
    { value: 'Suite', label: 'Suite' },
    { value: 'Presidential Suite', label: 'Presidential Suite' },
    { value: 'Single', label: 'Single Room' },
    { value: 'Double', label: 'Double Room' },
    { value: 'Family Room', label: 'Family Room' }
  ];

  const amenitiesList = [
    'WiFi', 'Air Conditioning', 'TV', 'Mini Bar',
    'Safe', 'Balcony', 'Kitchenette', 'Coffee Machine',
    'Hair Dryer', 'Iron', 'Bathtub', 'Shower',
    'Work Desk', 'Sofa', 'Ocean View', 'City View'
  ];

  const tabData = [
    { label: 'Room Calendar', value: 'calendar' },
    { label: 'Room Status', value: 'status' },
    { label: 'Availability', value: 'availability' }
  ];

  const blockTypes = [
    { value: 'maintenance', label: 'Maintenance', color: 'warning' },
    { value: 'blocked', label: 'Blocked', color: 'error' },
    { value: 'cleaning', label: 'Deep Cleaning', color: 'info' }
  ];

  useEffect(() => {
    fetchRoomsAndBookings();
  }, []);

  const fetchRoomsAndBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch hotel rooms from dedicated endpoint
      try {
        const roomsResponse = await axios.get('/api/hotel/rooms', { headers });
        
        if (roomsResponse.data.success) {
          const roomsData = roomsResponse.data.data;
          setRooms(roomsData.rooms || []);
        } else {
          setError('Failed to fetch room data: ' + roomsResponse.data.message);
        }
      } catch (roomError) {
        console.error('Room fetch error:', roomError);
        setError('Failed to fetch rooms: ' + (roomError.response?.data?.message || roomError.message));
        setRooms([]); // Set empty array to prevent undefined errors
      }

      // Fetch hotel bookings for calendar view
      try {
        const bookingsResponse = await axios.get('/api/hotel/bookings', { headers });
        if (bookingsResponse.data.success) {
          const bookingsData = bookingsResponse.data.data;
          setBookings(bookingsData.bookings || []);
        } else {
          console.log('Bookings fetch failed:', bookingsResponse.data.message);
          setBookings([]);
        }
      } catch (bookingError) {
        console.log('Bookings not available:', bookingError.message);
        setBookings([]);
      }

    } catch (error) {
      console.error('General fetch error:', error);
      setError(error.response?.data?.message || 'Failed to fetch data');
      setRooms([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDateBookings = (roomId, date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      return booking.roomId === roomId && date >= checkIn && date < checkOut;
    });
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'occupied':
        return 'primary';
      case 'maintenance':
        return 'warning';
      case 'blocked':
        return 'error';
      case 'cleaning':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleBlockRoom = (room, date) => {
    setSelectedRoom(room);
    setSelectedDate(date);
    setBlockDialog(true);
  };

  const handleConfirmBlock = () => {
    console.log(`Blocking room ${selectedRoom.roomNumber} on ${selectedDate} for ${blockType}: ${blockReason}`);
    setSuccess(`Room ${selectedRoom.roomNumber} blocked successfully`);
    setBlockDialog(false);
    setBlockReason('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleToggleAvailability = (roomId) => {
    setRooms(prev => prev.map(room => 
      room._id === roomId 
        ? { ...room, isAvailable: !room.isAvailable }
        : room
    ));
  };

  // Add Room Functions
  const handleAddRoom = () => {
    setAddRoomDialogOpen(true);
  };

  const handleSaveRoom = async () => {
    try {
      setAddRoomLoading(true);
      setAddRoomError('');
      setAddRoomSuccess('');

      // Validate required fields
      if (!newRoom.name || !newRoom.roomType || !newRoom.pricing.basePrice || 
          !newRoom.capacity.adults || !newRoom.description || !newRoom.totalRooms) {
        setAddRoomError('Please fill in all required fields');
        return;
      }

      // Validate description length
      if (newRoom.description.length < 10) {
        setAddRoomError('Description must be at least 10 characters long');
        return;
      }

      if (newRoom.description.length > 500) {
        setAddRoomError('Description must be no more than 500 characters');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setAddRoomError('Please login again. Session expired.');
        return;
      }

      const roomData = {
        name: newRoom.name,
        roomType: newRoom.roomType,
        description: newRoom.description,
        pricing: {
          basePrice: parseFloat(newRoom.pricing.basePrice),
          currency: newRoom.pricing.currency
        },
        capacity: {
          adults: parseInt(newRoom.capacity.adults),
          children: parseInt(newRoom.capacity.children)
        },
        size: newRoom.size.value ? {
          value: parseFloat(newRoom.size.value),
          unit: newRoom.size.unit
        } : undefined,
        amenities: newRoom.amenities,
        totalRooms: parseInt(newRoom.totalRooms)
      };

      console.log('Sending room data:', roomData);

      const response = await axios.post('/api/hotel/rooms', roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Room added successfully:', response.data);

      // Show success message
      setAddRoomSuccess('Room added successfully!');
      
      // Reset form and close dialog after a short delay
      setTimeout(() => {
        setNewRoom({
          name: '',
          roomType: 'Standard',
          description: '',
          pricing: {
            basePrice: '',
            currency: 'INR'
          },
          capacity: {
            adults: 2,
            children: 0
          },
          size: {
            value: '',
            unit: 'sqft'
          },
          amenities: [],
          totalRooms: 1
        });
        setAddRoomDialogOpen(false);
        setAddRoomSuccess('');
        
        // Refresh the room data
        fetchRoomsAndBookings();
      }, 1500);
      
    } catch (err) {
      console.error('Add room error:', err);
      console.error('Error response:', err.response?.data);
      setAddRoomError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.message || 
        'Failed to add room. Please try again.'
      );
    } finally {
      setAddRoomLoading(false);
    }
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const dates = [];

    // Generate calendar dates
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(selectedYear, selectedMonth, day));
    }

    return (
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(prev => prev - 1);
                  } else {
                    setSelectedMonth(prev => prev - 1);
                  }
                }}
              >
                Previous
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(prev => prev + 1);
                  } else {
                    setSelectedMonth(prev => prev + 1);
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Room</TableCell>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <TableCell key={day} align="center">{day}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {room.roomNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.roomType}
                        </Typography>
                      </Box>
                    </TableCell>
                    {Array.from({ length: 7 }, (_, colIndex) => {
                      const weekDates = [];
                      for (let week = 0; week < Math.ceil((dates.length) / 7); week++) {
                        const dateIndex = week * 7 + colIndex;
                        if (dates[dateIndex]) {
                          weekDates.push(dates[dateIndex]);
                        }
                      }
                      
                      return (
                        <TableCell key={colIndex} sx={{ p: 0.5, minWidth: 120 }}>
                          {weekDates.map((date, dateIndex) => {
                            const dayBookings = getDateBookings(room._id, date);
                            const isBooked = dayBookings.length > 0;
                            const booking = dayBookings[0];
                            
                            return (
                              <Box 
                                key={dateIndex}
                                sx={{ 
                                  mb: 0.5, 
                                  p: 0.5, 
                                  border: 1, 
                                  borderColor: 'grey.300',
                                  borderRadius: 1,
                                  minHeight: 40,
                                  cursor: 'pointer',
                                  bgcolor: isBooked ? 'primary.light' : 'transparent',
                                  '&:hover': { bgcolor: isBooked ? 'primary.main' : 'grey.100' }
                                }}
                                onClick={() => !isBooked && handleBlockRoom(room, date)}
                              >
                                <Typography variant="caption" fontWeight="bold">
                                  {date.getDate()}
                                </Typography>
                                {isBooked && (
                                  <Tooltip title={`${booking.customerName} - ${booking.status}`}>
                                    <Chip
                                      label={booking.customerName.split(' ')[0]}
                                      size="small"
                                      color="primary"
                                      sx={{ fontSize: 10, height: 16 }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            );
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    );
  };

  const renderStatusView = () => (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Booking</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map(room => {
              const safeStatus = room.status || (room.isAvailable ? 'ready' : 'maintenance');
              const currentBooking = bookings.find(b => 
                b.roomId === room._id && 
                new Date(b.checkInDate) <= new Date() && 
                new Date(b.checkOutDate) > new Date()
              );
              
              return (
                <TableRow key={room._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: getRoomStatusColor(safeStatus) + '.light' }}>
                        <Hotel fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Room {room.roomNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
                      color={getRoomStatusColor(safeStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {currentBooking ? (
                      <Box>
                        <Typography variant="body2">{currentBooking.customerName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Until {new Date(currentBooking.checkOutDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No current booking
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{room.price.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per night
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={room.isAvailable}
                          onChange={() => handleToggleAvailability(room._id)}
                          size="small"
                        />
                      }
                      label=""
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderAvailabilityView = () => {
    const availableRooms = rooms.filter(room => room.isAvailable && room.status === 'ready').length;
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
    const blockedRooms = rooms.filter(room => !room.isAvailable).length;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="success.main">{availableRooms}</Typography>
                  <Typography variant="subtitle2">Available</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="primary.main">{occupiedRooms}</Typography>
                  <Typography variant="subtitle2">Occupied</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">{maintenanceRooms}</Typography>
                  <Typography variant="subtitle2">Maintenance</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Settings />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="error.main">{blockedRooms}</Typography>
                  <Typography variant="subtitle2">Blocked</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <Block />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Room Availability Chart</Typography>
            <Grid container spacing={2}>
              {rooms.map(room => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Room {room.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {room.roomType} - ₹{room.price.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={room.status}
                          color={getRoomStatusColor(room.status)}
                          size="small"
                        />
                        <Chip
                          label={room.isAvailable ? 'Available' : 'Unavailable'}
                          color={room.isAvailable ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  };

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
        <Typography variant="h4" gutterBottom>Room Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddRoom}>
          Add New Room
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

      {/* Navigation Tabs */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && renderCalendarView()}
      {currentTab === 1 && renderStatusView()}
      {currentTab === 2 && renderAvailabilityView()}

      {/* Block Room Dialog */}
      <Dialog open={blockDialog} onClose={() => setBlockDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Block Room {selectedRoom?.roomNumber}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selected Date: {selectedDate?.toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Block Type</InputLabel>
                <Select
                  value={blockType}
                  label="Block Type"
                  onChange={(e) => setBlockType(e.target.value)}
                >
                  {blockTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                multiline
                rows={3}
                placeholder="Enter reason for blocking this room..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmBlock} variant="contained">
            Block Room
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Room Dialog */}
      <Dialog open={addRoomDialogOpen} onClose={() => setAddRoomDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              required
              fullWidth
              helperText="e.g., Ocean View Standard Room, Deluxe Suite 101"
            />
            <FormControl fullWidth required>
              <InputLabel>Room Type</InputLabel>
              <Select
                value={newRoom.roomType}
                label="Room Type"
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price per Night"
              type="number"
              value={newRoom.pricing.basePrice}
              onChange={(e) => setNewRoom({ 
                ...newRoom, 
                pricing: { ...newRoom.pricing, basePrice: e.target.value }
              })}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              label="Adult Capacity"
              type="number"
              value={newRoom.capacity.adults}
              onChange={(e) => setNewRoom({ 
                ...newRoom, 
                capacity: { ...newRoom.capacity, adults: parseInt(e.target.value) || 1 }
              })}
              required
              fullWidth
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Children Capacity"
              type="number"
              value={newRoom.capacity.children}
              onChange={(e) => setNewRoom({ 
                ...newRoom, 
                capacity: { ...newRoom.capacity, children: parseInt(e.target.value) || 0 }
              })}
              fullWidth
              inputProps={{ min: 0, max: 5 }}
            />
            <TextField
              label="Room Size (sq ft)"
              type="number"
              value={newRoom.size.value}
              onChange={(e) => setNewRoom({ 
                ...newRoom, 
                size: { ...newRoom.size, value: e.target.value }
              })}
              fullWidth
            />
            <TextField
              label="Total Rooms Available"
              type="number"
              value={newRoom.totalRooms}
              onChange={(e) => setNewRoom({ ...newRoom, totalRooms: parseInt(e.target.value) || 1 })}
              required
              fullWidth
              inputProps={{ min: 1 }}
              helperText="How many rooms of this type are available"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              required
              fullWidth
              inputProps={{ minLength: 10, maxLength: 500 }}
              helperText="Minimum 10 characters, maximum 500 characters"
            />
            <FormControl fullWidth>
              <InputLabel>Amenities</InputLabel>
              <Select
                multiple
                value={newRoom.amenities}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                input={<OutlinedInput label="Amenities" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {amenitiesList.map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>
                    <Checkbox checked={newRoom.amenities.indexOf(amenity) > -1} />
                    <ListItemText primary={amenity} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {addRoomError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {addRoomError}
            </Alert>
          )}
          {addRoomSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {addRoomSuccess}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRoomDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveRoom} variant="contained" disabled={addRoomLoading}>
            {addRoomLoading ? <CircularProgress size={24} /> : 'Add Room'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomManagement;
