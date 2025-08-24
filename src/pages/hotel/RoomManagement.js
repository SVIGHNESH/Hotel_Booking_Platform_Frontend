import React, { useState, useEffect } from 'react';
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
      
      // Mock rooms data
      const mockRooms = [
        {
          _id: '1',
          roomNumber: '101',
          roomType: 'deluxe',
          name: 'Deluxe Room with City View',
          price: 5000,
          isAvailable: true,
          status: 'ready',
          capacity: { adults: 2, children: 1 }
        },
        {
          _id: '2',
          roomNumber: '102',
          roomType: 'standard',
          name: 'Standard Room',
          price: 3500,
          isAvailable: true,
          status: 'ready',
          capacity: { adults: 2, children: 1 }
        },
        {
          _id: '3',
          roomNumber: '201',
          roomType: 'suite',
          name: 'Executive Suite',
          price: 12000,
          isAvailable: false,
          status: 'maintenance',
          capacity: { adults: 4, children: 2 }
        },
        {
          _id: '4',
          roomNumber: '202',
          roomType: 'deluxe',
          name: 'Deluxe Sea View',
          price: 6500,
          isAvailable: true,
          status: 'occupied',
          capacity: { adults: 2, children: 1 }
        }
      ];

      // Mock bookings data for calendar view
      const mockBookings = [
        {
          _id: '1',
          roomId: '1',
          roomNumber: '101',
          customerName: 'John Doe',
          checkInDate: '2024-01-20',
          checkOutDate: '2024-01-23',
          status: 'confirmed'
        },
        {
          _id: '2',
          roomId: '2',
          roomNumber: '102',
          customerName: 'Jane Smith',
          checkInDate: '2024-01-25',
          checkOutDate: '2024-01-28',
          status: 'confirmed'
        },
        {
          _id: '3',
          roomId: '4',
          roomNumber: '202',
          customerName: 'Mike Johnson',
          checkInDate: '2024-01-18',
          checkOutDate: '2024-01-22',
          status: 'checked-in'
        }
      ];

      setRooms(mockRooms);
      setBookings(mockBookings);
    } catch (error) {
      console.error('Fetch data error:', error);
      setError('Failed to fetch room data');
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
              const currentBooking = bookings.find(b => 
                b.roomId === room._id && 
                new Date(b.checkInDate) <= new Date() && 
                new Date(b.checkOutDate) > new Date()
              );
              
              return (
                <TableRow key={room._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: getRoomStatusColor(room.status) + '.light' }}>
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
                      label={room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      color={getRoomStatusColor(room.status)}
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
        <Button variant="contained" startIcon={<Add />}>
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
    </Container>
  );
};

export default RoomManagement;
