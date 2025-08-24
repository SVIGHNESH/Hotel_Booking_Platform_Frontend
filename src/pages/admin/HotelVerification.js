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
  CardContent,
  Rating
} from '@mui/material';
import {
  Search,
  MoreVert,
  Hotel,
  Verified,
  Pending,
  LocationOn,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';

const HotelVerification = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, hotel: null });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', hotel: null });

  const fetchPendingHotels = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        verified: 'false' // Only get unverified hotels
      };

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
        setError('Failed to fetch pending hotels');
      }
    } catch (error) {
      console.error('Fetch pending hotels error:', error);
      setError('Failed to fetch pending hotels');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPendingHotels();
  }, [fetchPendingHotels]);

  const handleVerificationAction = async (action, hotelId) => {
    try {
      const endpoint = `/api/admin/hotels/${hotelId}/verify`;
      const payload = { isVerified: action === 'approve' };

      const response = await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        fetchPendingHotels(); // Refresh the list
        setConfirmDialog({ open: false, action: '', hotel: null });
      } else {
        setError(response.data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Verification action error:', error);
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

  const handleViewDetails = (hotel) => {
    setDetailDialog({ open: true, hotel });
    handleMenuClose();
  };

  const handleConfirmAction = (action, hotel) => {
    setConfirmDialog({ open: true, action, hotel });
    handleMenuClose();
  };

  const pendingCount = hotels.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Hotel Verification</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">{pendingCount}</Typography>
                  <Typography variant="subtitle1">Pending Verification</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Pending />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
      </Paper>

      {/* Hotels Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel Details</TableCell>
                <TableCell>Contact Information</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Pending />}
                        label="Pending Verification"
                        color="warning"
                        size="small"
                      />
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
                  <TableCell colSpan={6} align="center">
                    {loading ? 'Loading...' : 'No hotels pending verification'}
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
              <Visibility sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => handleConfirmAction('approve', selectedHotel)}>
              <CheckCircle sx={{ mr: 1 }} />
              Approve Hotel
            </MenuItem>
            <MenuItem onClick={() => handleConfirmAction('reject', selectedHotel)}>
              <Cancel sx={{ mr: 1 }} />
              Reject Hotel
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', hotel: null })}>
        <DialogTitle>Confirm {confirmDialog.action === 'approve' ? 'Approval' : 'Rejection'}</DialogTitle>
        <DialogContent>
          Are you sure you want to {confirmDialog.action} hotel "{confirmDialog.hotel?.name}"?
          {confirmDialog.action === 'approve' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will allow the hotel to start accepting bookings.
            </Typography>
          )}
          {confirmDialog.action === 'reject' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will prevent the hotel from being listed on the platform.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', hotel: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleVerificationAction(confirmDialog.action, confirmDialog.hotel?._id)}
            color={confirmDialog.action === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
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
        <DialogTitle>Hotel Verification Details</DialogTitle>
        <DialogContent>
          {detailDialog.hotel && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{detailDialog.hotel.name}</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Basic Information:</Typography>
                  <Typography variant="body2">Type: {detailDialog.hotel.type}</Typography>
                  <Typography variant="body2">Rooms: {detailDialog.hotel.rooms?.length || 0}</Typography>
                  <Typography variant="body2">
                    Price Range: ₹{detailDialog.hotel.priceRange?.min} - ₹{detailDialog.hotel.priceRange?.max}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="primary">Contact Information:</Typography>
                  <Typography variant="body2">Email: {detailDialog.hotel.contactInfo?.email}</Typography>
                  <Typography variant="body2">Phone: {detailDialog.hotel.contactInfo?.phone}</Typography>
                  <Typography variant="body2">Website: {detailDialog.hotel.contactInfo?.website || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Address:</Typography>
                  <Typography variant="body2">
                    {detailDialog.hotel.address?.street}, {detailDialog.hotel.address?.city}, 
                    {detailDialog.hotel.address?.state} {detailDialog.hotel.address?.zipCode}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Description:</Typography>
                  <Typography variant="body2">
                    {detailDialog.hotel.description || 'No description provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Amenities:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {detailDialog.hotel.amenities?.map((amenity, index) => (
                      <Chip key={index} label={amenity} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">Registration Date:</Typography>
                  <Typography variant="body2">
                    {new Date(detailDialog.hotel.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Verification Decision:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      setDetailDialog({ open: false, hotel: null });
                      handleConfirmAction('approve', detailDialog.hotel);
                    }}
                  >
                    Approve Hotel
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setDetailDialog({ open: false, hotel: null });
                      handleConfirmAction('reject', detailDialog.hotel);
                    }}
                  >
                    Reject Hotel
                  </Button>
                </Box>
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

export default HotelVerification;
