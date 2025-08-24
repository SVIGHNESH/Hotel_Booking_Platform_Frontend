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
  Rating,
  Avatar
} from '@mui/material';
import {
  Search,
  MoreVert,
  Hotel,
  Verified,
  Pending,
  LocationOn,
  Phone,
  Email
} from '@mui/icons-material';
import axios from 'axios';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', hotel: null });
  const [detailDialog, setDetailDialog] = useState({ open: false, hotel: null });

  const fetchHotels = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (verificationFilter !== '') params.verified = verificationFilter;

      const response = await axios.get('/api/admin/hotels', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setHotels(response.data.data.hotels);
        setTotalHotels(response.data.data.pagination.totalHotels);
      } else {
        setError('Failed to fetch hotels');
      }
    } catch (error) {
      console.error('Fetch hotels error:', error);
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, verificationFilter]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleHotelAction = async (action, hotelId) => {
    try {
      let endpoint = '';
      let payload = {};

      switch (action) {
        case 'verify':
          endpoint = `/api/admin/hotels/${hotelId}/verify`;
          payload = { isVerified: true };
          break;
        case 'unverify':
          endpoint = `/api/admin/hotels/${hotelId}/verify`;
          payload = { isVerified: false };
          break;
        default:
          return;
      }

      const response = await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        fetchHotels(); // Refresh the list
        setConfirmDialog({ open: false, action: '', hotel: null });
      } else {
        setError(response.data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Hotel action error:', error);
      setError('Failed to perform action');
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, hotel) => {
    setAnchorEl(event.currentTarget);
    setSelectedHotel(hotel);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHotel(null);
  };

  const handleConfirmAction = (action, hotel) => {
    setConfirmDialog({ open: true, action, hotel });
    handleMenuClose();
  };

  const handleViewDetails = (hotel) => {
    setDetailDialog({ open: true, hotel });
    handleMenuClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Hotel Management</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Hotels"
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

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Verification</InputLabel>
            <Select
              value={verificationFilter}
              label="Verification"
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Verified</MenuItem>
              <MenuItem value="false">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Hotels Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Hotel />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {hotel.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {hotel.type} • {hotel.rooms?.length || 0} rooms
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email fontSize="small" />
                          <Typography variant="caption">
                            {hotel.contactInfo?.email || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" />
                          <Typography variant="caption">
                            {hotel.contactInfo?.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" />
                        <Box>
                          <Typography variant="body2">
                            {hotel.address?.city || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {hotel.address?.state || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating 
                          value={hotel.rating?.average || 0} 
                          precision={0.1} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="caption">
                          ({hotel.rating?.count || 0})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={hotel.isVerified ? <Verified /> : <Pending />}
                        label={hotel.isVerified ? 'Verified' : 'Pending'}
                        color={hotel.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, hotel)}
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
                    No hotels found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalHotels}
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
        {selectedHotel && (
          <>
            <MenuItem onClick={() => handleViewDetails(selectedHotel)}>
              View Details
            </MenuItem>
            {selectedHotel.isVerified ? (
              <MenuItem onClick={() => handleConfirmAction('unverify', selectedHotel)}>
                <Pending sx={{ mr: 1 }} />
                Remove Verification
              </MenuItem>
            ) : (
              <MenuItem onClick={() => handleConfirmAction('verify', selectedHotel)}>
                <Verified sx={{ mr: 1 }} />
                Verify Hotel
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', hotel: null })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to {confirmDialog.action} hotel "{confirmDialog.hotel?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', hotel: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleHotelAction(confirmDialog.action, confirmDialog.hotel?._id)}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hotel Details Dialog */}
      <Dialog 
        open={detailDialog.open} 
        onClose={() => setDetailDialog({ open: false, hotel: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Hotel Details</DialogTitle>
        <DialogContent>
          {detailDialog.hotel && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{detailDialog.hotel.name}</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">Description:</Typography>
                <Typography variant="body2">{detailDialog.hotel.description || 'No description available'}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">Address:</Typography>
                <Typography variant="body2">
                  {detailDialog.hotel.address?.street}, {detailDialog.hotel.address?.city}, {detailDialog.hotel.address?.state} {detailDialog.hotel.address?.zipCode}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">Amenities:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {detailDialog.hotel.amenities?.map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">Price Range:</Typography>
                <Typography variant="body2">
                  ₹{detailDialog.hotel.priceRange?.min} - ₹{detailDialog.hotel.priceRange?.max} per night
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, hotel: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HotelManagement;
