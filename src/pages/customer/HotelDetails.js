import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Divider,
  IconButton,
  Paper,
  Avatar,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  LocationOn,
  Wifi,
  Pool,
  Restaurant,
  FitnessCenter,
  LocalParking,
  Business,
  Phone,
  Email,
  Language,
  Favorite,
  FavoriteOutlined,
  Share,
  ArrowBack,
  PhotoLibrary,
  CheckCircle,
  People,
  Room
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadHotelDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadHotelDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch hotel details
      const hotelResponse = await axios.get(`/api/customer/hotels/${id}`, { headers });
      
      if (hotelResponse.data.success) {
        const responseData = hotelResponse.data.data;
        setHotel(responseData.hotel);
        setRooms(responseData.rooms || []);
        setReviews(responseData.reviews || []);
      } else {
        console.error('Failed to load hotel details');
      }
    } catch (error) {
      console.error('Failed to load hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId) => {
    navigate(`/customer/booking`, { 
      state: { 
        hotelId: hotel._id || hotel.id,
        roomId: roomId,
        hotelName: hotel.name 
      } 
    });
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/customer/favorites/${hotel._id || hotel.id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setIsFavorite(!isFavorite);
        // Optional: Show success message
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Optional: Show error message
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: hotel.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!hotel) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Hotel not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/customer/search" underline="hover">
          Search Results
        </Link>
        <Typography color="text.primary">{hotel.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {hotel.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={hotel.rating?.average || 0} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {hotel.rating?.average || 0} ({hotel.rating?.count || 0} reviews)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {hotel.address?.street}, {hotel.address?.city}, {hotel.address?.state}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleShare} color="primary">
            <Share />
          </IconButton>
          <IconButton onClick={toggleFavorite} color="error">
            {isFavorite ? <Favorite /> : <FavoriteOutlined />}
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Image Gallery */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="400"
                image={hotel.images?.[selectedImageIndex] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                alt={hotel.name}
                sx={{ cursor: 'pointer' }}
                onClick={() => setImageDialogOpen(true)}
              />
              <IconButton
                sx={{ 
                  position: 'absolute', 
                  bottom: 16, 
                  right: 16, 
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
                onClick={() => setImageDialogOpen(true)}
              >
                <PhotoLibrary />
              </IconButton>
            </Box>
            <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
              {(hotel.images || []).map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${hotel.name} ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: selectedImageIndex === index ? '2px solid primary.main' : '2px solid transparent',
                    flexShrink: 0
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </Box>
          </Paper>

          {/* Tabs */}
          <Paper elevation={2}>
            <Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)}>
              <Tab label="Overview" />
              <Tab label="Rooms" />
              <Tab label="Reviews" />
              <Tab label="Amenities" />
            </Tabs>

            <TabPanel value={selectedTab} index={0}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom>About this hotel</Typography>
                <Typography variant="body1" paragraph>
                  {hotel.description}
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone color="action" sx={{ mr: 1 }} />
                      <Typography>{hotel.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email color="action" sx={{ mr: 1 }} />
                      <Typography>{hotel.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language color="action" sx={{ mr: 1 }} />
                      <Typography>{hotel.website}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Check-in/Check-out</Typography>
                    <Typography><strong>Check-in:</strong> {hotel.checkIn}</Typography>
                    <Typography><strong>Check-out:</strong> {hotel.checkOut}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Policies</Typography>
                  {(hotel.policies || []).map((policy, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{policy}</Typography>
                    </Box>
                  ))}
                  {(!hotel.policies || hotel.policies.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      No policies available
                    </Typography>
                  )}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom>Available Rooms</Typography>
                {rooms.map((room) => (
                  <Card key={room.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                            alt={room.name}
                            sx={{ borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" gutterBottom>{room.name}</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {room.description}
                          </Typography>
                          
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <People color="action" sx={{ mr: 0.5, fontSize: 16 }} />
                                <Typography variant="body2">{room.capacity?.adults || 0} guests</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Room color="action" sx={{ mr: 0.5, fontSize: 16 }} />
                                <Typography variant="body2">{room.capacity?.adults + room.capacity?.children || 0} max capacity</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2"><strong>Type:</strong> {room.roomType || 'Standard'}</Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {(room.amenities || []).map((amenity, index) => (
                              <Chip key={index} label={amenity} size="small" variant="outlined" />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" color="primary">
                                  ₹{room.pricing?.basePrice || 0}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                per night
                              </Typography>
                              {room.availableRooms > 0 && (
                                <Typography variant="body2" color="success.main">
                                  {room.availableRooms} rooms left
                                </Typography>
                              )}
                            </Box>
                            <Button
                              variant="contained"
                              size="large"
                              disabled={!room.isAvailable}
                              onClick={() => handleBookRoom(room._id || room.id)}
                            >
                              {room.isAvailable ? 'Book Now' : 'Unavailable'}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Reviews ({reviews.length})
                </Typography>
                {reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar src={review.userAvatar} sx={{ mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {review.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            {review.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {review.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.helpful} people found this helpful
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom>Hotel Amenities</Typography>
                <Grid container spacing={2}>
                  {(hotel.amenities || []).map((amenity, index) => (
                    <Grid item xs={12} sm={6} md={4} key={amenity.id || index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                        {typeof amenity === 'string' ? (
                          <>
                            <Typography sx={{ ml: 1 }}>{amenity}</Typography>
                          </>
                        ) : (
                          <>
                            {amenity.icon}
                            <Typography sx={{ ml: 1 }}>{amenity.name}</Typography>
                            {amenity.available && (
                              <CheckCircle color="success" sx={{ ml: 'auto', fontSize: 16 }} />
                            )}
                          </>
                        )}
                      </Box>
                    </Grid>
                  ))}
                  {(!hotel.amenities || hotel.amenities.length === 0) && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                        No amenities information available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Booking Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Quick Booking</Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" color="primary">
                From ₹{rooms.length > 0 ? Math.min(...rooms.map(r => r.pricing?.basePrice || 0)) : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per night
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => setSelectedTab(1)}
              sx={{ mb: 2 }}
            >
              View Rooms & Rates
            </Button>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Why book with us?</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">Free cancellation</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">Best price guarantee</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">24/7 customer support</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Image Gallery Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Hotel Gallery
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setImageDialogOpen(false)}
          >
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ImageList cols={2} gap={8}>
            {(hotel.images || []).map((image, index) => (
              <ImageListItem key={index}>
                <img src={image} alt={`${hotel.name} ${index + 1}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default HotelDetails;
