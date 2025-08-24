import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Card,
  CardContent,
  Avatar,
  Switch,
  FormControlLabel,
  CircularProgress,
  Menu,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Bed,
  People,
  Visibility,
  VisibilityOff,
  Hotel as HotelIcon
} from '@mui/icons-material';


const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [roomData, setRoomData] = useState({
    roomNumber: '',
    roomType: 'standard',
    name: '',
    description: '',
    capacity: {
      adults: 2,
      children: 1
    },
    bedType: 'double',
    price: 0,
    amenities: [],
    isAvailable: true,
    size: 0,
    images: []
  });

  const roomTypes = [
    'standard', 'deluxe', 'suite', 'family', 'presidential', 'economy'
  ];

  const bedTypes = [
    'single', 'double', 'queen', 'king', 'twin', 'bunk'
  ];

  const availableAmenities = [
    'Air Conditioning', 'Free WiFi', 'TV', 'Mini Bar', 'Safe', 'Balcony',
    'Sea View', 'City View', 'Room Service', 'Kitchenette', 'Jacuzzi',
    'Work Desk', 'Coffee Machine', 'Hair Dryer', 'Iron', 'Telephone'
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Mock data since rooms API might not be fully implemented
      const mockRooms = [
        {
          _id: '1',
          roomNumber: '101',
          roomType: 'deluxe',
          name: 'Deluxe Room with City View',
          description: 'Spacious room with modern amenities and city view',
          capacity: { adults: 2, children: 1 },
          bedType: 'queen',
          price: 5000,
          amenities: ['Air Conditioning', 'Free WiFi', 'TV', 'City View'],
          isAvailable: true,
          size: 35,
          images: []
        },
        {
          _id: '2',
          roomNumber: '201',
          roomType: 'suite',
          name: 'Executive Suite',
          description: 'Luxury suite with separate living area and premium amenities',
          capacity: { adults: 4, children: 2 },
          bedType: 'king',
          price: 12000,
          amenities: ['Air Conditioning', 'Free WiFi', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi'],
          isAvailable: true,
          size: 65,
          images: []
        }
      ];
      setRooms(mockRooms);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomData({
      roomNumber: '',
      roomType: 'standard',
      name: '',
      description: '',
      capacity: { adults: 2, children: 1 },
      bedType: 'double',
      price: 0,
      amenities: [],
      isAvailable: true,
      size: 0,
      images: []
    });
    setDialogOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomData(room);
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      // Mock delete operation
      console.log(`Deleting room ${roomId}`);
      setRooms(prev => prev.filter(room => room._id !== roomId));
      setSuccess('Room deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Delete room error:', error);
      setError('Failed to delete room');
    }
    setAnchorEl(null);
  };

  const handleSaveRoom = async () => {
    try {
      setError('');
      
      if (editingRoom) {
        // Mock update operation
        console.log('Updating room:', roomData);
        setRooms(prev => prev.map(room => 
          room._id === editingRoom._id ? { ...roomData, _id: editingRoom._id } : room
        ));
        setSuccess('Room updated successfully');
      } else {
        // Mock create operation
        const newRoom = { ...roomData, _id: Date.now().toString() };
        console.log('Creating room:', newRoom);
        setRooms(prev => [...prev, newRoom]);
        setSuccess('Room added successfully');
      }
      
      setDialogOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Save room error:', error);
      setError('Failed to save room');
    }
  };

  const handleToggleAvailability = async (roomId, isAvailable) => {
    try {
      console.log(`Toggling availability for room ${roomId} to ${!isAvailable}`);
      setRooms(prev => prev.map(room => 
        room._id === roomId ? { ...room, isAvailable: !isAvailable } : room
      ));
    } catch (error) {
      console.error('Toggle availability error:', error);
      setError('Failed to update room availability');
    }
    setAnchorEl(null);
  };

  const handleInputChange = (field, value) => {
    setRoomData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleAmenityToggle = (amenity) => {
    setRoomData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleMenuClick = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoom(null);
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
        <Typography variant="h4" gutterBottom>Manage Rooms</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRoom}
        >
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="primary">{rooms.length}</Typography>
                  <Typography variant="subtitle1">Total Rooms</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <HotelIcon />
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
                  <Typography variant="h4" color="success.main">
                    {rooms.filter(room => room.isAvailable).length}
                  </Typography>
                  <Typography variant="subtitle1">Available</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <Visibility />
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
                  <Typography variant="h4" color="error.main">
                    {rooms.filter(room => !room.isAvailable).length}
                  </Typography>
                  <Typography variant="subtitle1">Unavailable</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <VisibilityOff />
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
                  <Typography variant="h4" color="info.main">
                    ₹{rooms.length > 0 ? Math.round(rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length) : 0}
                  </Typography>
                  <Typography variant="subtitle1">Avg. Price</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Bed />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rooms Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Room {room.roomNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" />
                        <Typography variant="body2">
                          {room.capacity.adults + room.capacity.children} guests
                        </Typography>
                      </Box>
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
                      <Chip
                        label={room.isAvailable ? 'Available' : 'Unavailable'}
                        color={room.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, room)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No rooms found. Add your first room to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedRoom && (
          <>
            <MenuItem onClick={() => handleEditRoom(selectedRoom)}>
              <Edit sx={{ mr: 1 }} />
              Edit Room
            </MenuItem>
            <MenuItem onClick={() => handleToggleAvailability(selectedRoom._id, selectedRoom.isAvailable)}>
              {selectedRoom.isAvailable ? <VisibilityOff sx={{ mr: 1 }} /> : <Visibility sx={{ mr: 1 }} />}
              {selectedRoom.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </MenuItem>
            <MenuItem onClick={() => handleDeleteRoom(selectedRoom._id)} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} />
              Delete Room
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Add/Edit Room Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                value={roomData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={roomData.roomType}
                  label="Room Type"
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room Name"
                value={roomData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={roomData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Adults Capacity"
                type="number"
                value={roomData.capacity.adults}
                onChange={(e) => handleInputChange('capacity.adults', parseInt(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Children Capacity"
                type="number"
                value={roomData.capacity.children}
                onChange={(e) => handleInputChange('capacity.children', parseInt(e.target.value))}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Bed Type</InputLabel>
                <Select
                  value={roomData.bedType}
                  label="Bed Type"
                  onChange={(e) => handleInputChange('bedType', e.target.value)}
                >
                  {bedTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price per Night (₹)"
                type="number"
                value={roomData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Size (sq ft)"
                type="number"
                value={roomData.size}
                onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={roomData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                  />
                }
                label="Available for Booking"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Room Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    color={roomData.amenities.includes(amenity) ? 'primary' : 'default'}
                    variant={roomData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                    size="small"
                    clickable
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRoom} variant="contained">
            {editingRoom ? 'Update Room' : 'Add Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add room"
        onClick={handleAddRoom}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default ManageRooms;
