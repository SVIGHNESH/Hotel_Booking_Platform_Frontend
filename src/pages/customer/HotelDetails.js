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

  // Mock hotel data
  const mockHotel = {
    id: parseInt(id),
    name: 'Grand Plaza Hotel',
    description: 'Experience luxury and comfort at the Grand Plaza Hotel, located in the heart of downtown. Our elegant rooms and suites offer stunning city views, modern amenities, and personalized service that exceeds expectations.',
    location: 'Downtown',
    fullAddress: '123 Main Street, Downtown, City 12345',
    rating: 4.5,
    reviewCount: 234,
    starRating: 5,
    phone: '+1 (555) 123-4567',
    email: 'info@grandplaza.com',
    website: 'www.grandplaza.com',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: [
      { id: 'wifi', name: 'Free WiFi', icon: <Wifi />, available: true },
      { id: 'pool', name: 'Swimming Pool', icon: <Pool />, available: true },
      { id: 'restaurant', name: 'Restaurant', icon: <Restaurant />, available: true },
      { id: 'gym', name: 'Fitness Center', icon: <FitnessCenter />, available: true },
      { id: 'parking', name: 'Free Parking', icon: <LocalParking />, available: true },
      { id: 'business', name: 'Business Center', icon: <Business />, available: true }
    ],
    policies: [
      'Check-in: 3:00 PM - 12:00 AM',
      'Check-out: 12:00 PM',
      'Pets allowed (additional fees may apply)',
      'Non-smoking rooms available',
      'Free cancellation up to 24 hours before check-in'
    ]
  };

  const mockRooms = [
    {
      id: 1,
      name: 'Standard King Room',
      description: 'Comfortable room with king-size bed, city view, and modern amenities.',
      price: 150,
      originalPrice: 180,
      maxGuests: 2,
      bedType: 'King',
      size: '25 sqm',
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
      available: true,
      availableRooms: 3
    },
    {
      id: 2,
      name: 'Deluxe Suite',
      description: 'Spacious suite with separate living area, premium amenities, and panoramic views.',
      price: 280,
      originalPrice: 320,
      maxGuests: 4,
      bedType: 'King + Sofa Bed',
      size: '45 sqm',
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Balcony', 'Room Service'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
      available: true,
      availableRooms: 2
    }
  ];

  const mockReviews = [
    {
      id: 1,
      userName: 'John Smith',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      date: '2025-08-15',
      title: 'Excellent stay!',
      comment: 'Amazing hotel with great service. The staff was very friendly and the room was spotless. Highly recommended!',
      helpful: 12
    },
    {
      id: 2,
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b66178ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 4,
      date: '2025-08-10',
      title: 'Great location',
      comment: 'Perfect location in downtown. Easy access to restaurants and attractions. Room was comfortable and clean.',
      helpful: 8
    }
  ];

  useEffect(() => {
    loadHotelDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadHotelDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHotel(mockHotel);
      setRooms(mockRooms);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to load hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId) => {
    navigate(`/customer/booking`, { 
      state: { 
        hotelId: hotel.id,
        roomId: roomId,
        hotelName: hotel.name 
      } 
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: API call to add/remove from favorites
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
                <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {hotel.rating} ({hotel.reviewCount} reviews)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {hotel.fullAddress}
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
                image={hotel.images[selectedImageIndex]}
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
              {hotel.images.map((image, index) => (
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
                  {hotel.policies.map((policy, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{policy}</Typography>
                    </Box>
                  ))}
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
                            image={room.images[0]}
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
                                <Typography variant="body2">{room.maxGuests} guests</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Room color="action" sx={{ mr: 0.5, fontSize: 16 }} />
                                <Typography variant="body2">{room.size}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2"><strong>Bed:</strong> {room.bedType}</Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {room.amenities.map((amenity, index) => (
                              <Chip key={index} label={amenity} size="small" variant="outlined" />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" color="primary">
                                  ₹{room.price}
                                </Typography>
                                {room.originalPrice > room.price && (
                                  <Typography 
                                    variant="body2" 
                                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                  >
                                    ₹{room.originalPrice}
                                  </Typography>
                                )}
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
                              disabled={!room.available}
                              onClick={() => handleBookRoom(room.id)}
                            >
                              {room.available ? 'Book Now' : 'Unavailable'}
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
                  {hotel.amenities.map((amenity) => (
                    <Grid item xs={12} sm={6} md={4} key={amenity.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                        {amenity.icon}
                        <Typography sx={{ ml: 1 }}>{amenity.name}</Typography>
                        {amenity.available && (
                          <CheckCircle color="success" sx={{ ml: 'auto', fontSize: 16 }} />
                        )}
                      </Box>
                    </Grid>
                  ))}
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
                From ₹{Math.min(...rooms.map(r => r.price))}
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
            {hotel.images.map((image, index) => (
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
