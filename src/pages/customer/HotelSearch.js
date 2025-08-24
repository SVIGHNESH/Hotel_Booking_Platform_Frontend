import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Search,
  LocationOn,
  FilterList,
  Sort,
  Favorite,
  FavoriteOutlined,
  Wifi,
  Pool,
  Restaurant,
  FitnessCenter,
  LocalParking,
  Business
} from '@mui/icons-material';
// Removed date picker imports due to module resolution issues
import { useNavigate } from 'react-router-dom';

const HotelSearch = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    sortBy: 'relevance'
  });
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  
  const navigate = useNavigate();

  const amenityOptions = [
    { value: 'wifi', label: 'Free WiFi', icon: <Wifi /> },
    { value: 'pool', label: 'Swimming Pool', icon: <Pool /> },
    { value: 'restaurant', label: 'Restaurant', icon: <Restaurant /> },
    { value: 'gym', label: 'Fitness Center', icon: <FitnessCenter /> },
    { value: 'parking', label: 'Parking', icon: <LocalParking /> },
    { value: 'business', label: 'Business Center', icon: <Business /> }
  ];

  // Mock hotel data for demonstration
  const mockHotels = [
    {
      id: 1,
      name: 'Grand Plaza Hotel',
      location: 'Downtown',
      rating: 4.5,
      reviewCount: 234,
      price: 150,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      amenities: ['wifi', 'pool', 'restaurant', 'gym'],
      description: 'Luxury hotel in the heart of downtown with premium amenities.'
    },
    {
      id: 2,
      name: 'Seaside Resort',
      location: 'Beachfront',
      rating: 4.8,
      reviewCount: 156,
      price: 220,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      amenities: ['wifi', 'pool', 'restaurant', 'parking'],
      description: 'Beautiful beachfront resort with ocean views and spa services.'
    },
    {
      id: 3,
      name: 'Business Inn',
      location: 'Business District',
      rating: 4.2,
      reviewCount: 89,
      price: 120,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      amenities: ['wifi', 'business', 'restaurant', 'parking'],
      description: 'Modern business hotel with conference facilities and meeting rooms.'
    }
  ];

  useEffect(() => {
    searchHotels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters, currentPage]);

  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search criteria
      let filteredHotels = mockHotels.filter(hotel => {
        const matchesLocation = !searchFilters.location || 
          hotel.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
          hotel.name.toLowerCase().includes(searchFilters.location.toLowerCase());
        
        const matchesPrice = hotel.price >= searchFilters.priceRange[0] && 
          hotel.price <= searchFilters.priceRange[1];
        
        const matchesRating = hotel.rating >= searchFilters.rating;
        
        const matchesAmenities = searchFilters.amenities.length === 0 ||
          searchFilters.amenities.every(amenity => hotel.amenities.includes(amenity));
        
        return matchesLocation && matchesPrice && matchesRating && matchesAmenities;
      });

      // Sort hotels
      switch (searchFilters.sortBy) {
        case 'price-low':
          filteredHotels.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredHotels.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredHotels.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // relevance - keep original order
          break;
      }

      setHotels(filteredHotels);
      setTotalPages(Math.ceil(filteredHotels.length / 6));
    } catch (err) {
      setError('Failed to search hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenity) => {
    setSearchFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/customer/hotel/${hotelId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* Search Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Where are you going?"
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                value={searchFilters.checkIn ? searchFilters.checkIn.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('checkIn', e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                value={searchFilters.checkOut ? searchFilters.checkOut.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('checkOut', e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: searchFilters.checkIn ? searchFilters.checkIn.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Guests</InputLabel>
                <Select
                  value={searchFilters.guests}
                  onChange={(e) => handleFilterChange('guests', e.target.value)}
                  label="Guests"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <MenuItem key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={searchHotels}
              >
                Search
              </Button>
            </Grid>
            
            <Grid item xs={12} md={1}>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? 'primary' : 'default'}
              >
                <FilterList />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          {showFilters && (
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>

                {/* Price Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Price Range (per night)
                  </Typography>
                  <Slider
                    value={searchFilters.priceRange}
                    onChange={(e, value) => handleFilterChange('priceRange', value)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={10}
                    marks={[
                      { value: 0, label: '₹0' },
                      { value: 500, label: '₹500' },
                      { value: 1000, label: '₹1000+' }
                    ]}
                  />
                </Box>

                {/* Rating Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Minimum Rating
                  </Typography>
                  <Rating
                    value={searchFilters.rating}
                    onChange={(e, value) => handleFilterChange('rating', value || 0)}
                    precision={0.5}
                  />
                </Box>

                {/* Amenities */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {amenityOptions.map((amenity) => (
                      <Chip
                        key={amenity.value}
                        icon={amenity.icon}
                        label={amenity.label}
                        clickable
                        color={searchFilters.amenities.includes(amenity.value) ? 'primary' : 'default'}
                        onClick={() => handleAmenityToggle(amenity.value)}
                        variant={searchFilters.amenities.includes(amenity.value) ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Sort By */}
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={searchFilters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    label="Sort By"
                    startAdornment={<Sort sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          )}

          {/* Hotel Results */}
          <Grid item xs={12} md={showFilters ? 9 : 12}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {hotels.map((hotel) => (
                    <Grid item xs={12} md={6} lg={4} key={hotel.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          cursor: 'pointer',
                          '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
                        }}
                        onClick={() => handleHotelClick(hotel.id)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={hotel.image}
                            alt={hotel.name}
                          />
                          <IconButton
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8, 
                              bgcolor: 'rgba(255,255,255,0.8)' 
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(hotel.id);
                            }}
                          >
                            {favorites.has(hotel.id) ? (
                              <Favorite color="error" />
                            ) : (
                              <FavoriteOutlined />
                            )}
                          </IconButton>
                        </Box>
                        
                        <CardContent>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {hotel.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {hotel.location}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({hotel.reviewCount} reviews)
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {hotel.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {hotel.amenities.slice(0, 3).map((amenity) => {
                              const amenityInfo = amenityOptions.find(a => a.value === amenity);
                              return amenityInfo ? (
                                <Chip
                                  key={amenity}
                                  icon={amenityInfo.icon}
                                  label={amenityInfo.label}
                                  size="small"
                                  variant="outlined"
                                />
                              ) : null;
                            })}
                            {hotel.amenities.length > 3 && (
                              <Chip
                                label={`+${hotel.amenities.length - 3} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="h6" color="primary">
                                ₹{hotel.price}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                per night
                              </Typography>
                            </Box>
                            <Button variant="contained" size="small">
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {hotels.length === 0 && !loading && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No hotels found matching your criteria
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or search terms
                    </Typography>
                  </Box>
                )}

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => setCurrentPage(page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  };

export default HotelSearch;
