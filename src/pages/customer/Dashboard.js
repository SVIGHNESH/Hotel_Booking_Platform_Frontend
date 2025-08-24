import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import {
  Hotel,
  CalendarToday,
  LocationOn,
  Star,
  TrendingUp,
  Notifications,
  Search,
  History,
  Favorite,
  Settings,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    favoritesCount: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Load customer bookings to calculate stats
      const bookingsResponse = await axios.get('/api/customer/bookings', { headers });
      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.data || [];
        
        // Calculate stats from real bookings
        const now = new Date();
        const upcoming = bookings.filter(booking => 
          new Date(booking.bookingDetails.checkIn) > now && 
          booking.status === 'confirmed'
        );
        const completed = bookings.filter(booking => 
          new Date(booking.bookingDetails.checkOut) < now &&
          booking.status === 'confirmed'
        );

        setStats({
          totalBookings: bookings.length,
          upcomingBookings: upcoming.length,
          completedBookings: completed.length,
          favoritesCount: 0 // Will be implemented when favorites feature is added
        });

        // Set recent bookings (last 5)
        setRecentBookings(bookings.slice(0, 5));
      }

      // Load hotel recommendations (available hotels)
      try {
        const hotelsResponse = await axios.get('/api/customer/hotels', { headers });
        if (hotelsResponse.data.success) {
          const hotels = hotelsResponse.data.data || [];
          // Get top rated hotels as recommendations
          const topHotels = hotels
            .filter(hotel => hotel.verificationStatus === 'approved')
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 4);
          setRecommendations(topHotels);
        }
      } catch (hotelError) {
        console.log('Hotels not available:', hotelError.message);
        setRecommendations([]);
      }

      // Set empty notifications for now (can be enhanced later)
      setNotifications([]);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'translateY(-2px)', transition: 'transform 0.2s' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6">Loading your dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ width: 60, height: 60, mr: 2, bgcolor: 'white', color: 'primary.main' }}
            >
              {user?.firstName?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Welcome back, {user?.firstName || 'User'}!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Ready for your next adventure?
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              startIcon={<Search />}
              onClick={() => navigate('/customer/search')}
            >
              Search Hotels
            </Button>
            <IconButton sx={{ color: 'white' }}>
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Hotel />}
            color="primary"
            onClick={() => navigate('/customer/bookings')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Upcoming Trips"
            value={stats.upcomingBookings}
            icon={<CalendarToday />}
            color="success"
            onClick={() => navigate('/customer/bookings?filter=upcoming')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Completed Trips"
            value={stats.completedBookings}
            icon={<TrendingUp />}
            color="info"
            onClick={() => navigate('/customer/bookings?filter=completed')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Favorites"
            value={stats.favoritesCount}
            icon={<Favorite />}
            color="error"
            onClick={() => navigate('/customer/favorites')}
          />
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Recent Bookings
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<History />}
                  onClick={() => navigate('/customer/bookings')}
                >
                  View All
                </Button>
              </Box>
              
              {recentBookings.length === 0 ? (
                <Alert severity="info">
                  No bookings yet. Start by searching for hotels!
                </Alert>
              ) : (
                recentBookings.map((booking, index) => (
                  <Box key={booking._id || booking.id}>
                    <Box sx={{ display: 'flex', p: 2, '&:hover': { bgcolor: 'grey.50' } }}>
                      <Box
                        component="img"
                        sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
                        src={booking.hotelId?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                        alt={booking.hotelId?.name || 'Hotel'}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {booking.hotelId?.name || 'Hotel Name'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <LocationOn color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.hotelId?.address?.city || 'Location'}, {booking.hotelId?.address?.state || ''}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(booking.bookingDetails.checkIn).toLocaleDateString()} - {new Date(booking.bookingDetails.checkOut).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                          label={booking.status.toUpperCase()} 
                          color={getStatusColor(booking.status)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" color="primary">
                          ₹{booking.totalAmount || 0}
                        </Typography>
                      </Box>
                    </Box>
                    {index < recentBookings.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Notifications
                </Typography>
                <IconButton size="small">
                  <Settings />
                </IconButton>
              </Box>
              
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No new notifications
                </Typography>
              ) : (
                notifications.slice(0, 3).map((notification, index) => (
                  <Box key={notification.id}>
                    <Box sx={{ p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1, 
                            bgcolor: notification.type === 'booking' ? 'success.light' : 'warning.light'
                          }}
                        >
                          {notification.type === 'booking' ? <Hotel /> : <TrendingUp />}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight={!notification.read ? 'bold' : 'normal'}>
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                        {!notification.read && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        )}
                      </Box>
                    </Box>
                    {index < notifications.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recommended for You
              </Typography>
              <Grid container spacing={2}>
                {recommendations.map((hotel) => (
                  <Grid item xs={12} sm={6} md={3} key={hotel._id || hotel.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
                      }}
                      onClick={() => navigate(`/customer/hotel/${hotel._id || hotel.id}`)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={hotel.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {hotel.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <LocationOn color="action" sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {hotel.address?.city || 'Location'}, {hotel.address?.state || ''}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{hotel.rating || 'New'}</Typography>
                          </Box>
                          <Typography variant="h6" color="primary">
                            {hotel.rooms?.[0]?.pricePerNight ? `₹${hotel.rooms[0].pricePerNight}` : 'Contact'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Search />}
                    onClick={() => navigate('/customer/search')}
                    sx={{ py: 1.5 }}
                  >
                    Search Hotels
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<History />}
                    onClick={() => navigate('/customer/bookings')}
                    sx={{ py: 1.5 }}
                  >
                    My Bookings
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Favorite />}
                    onClick={() => navigate('/customer/favorites')}
                    sx={{ py: 1.5 }}
                  >
                    Favorites
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Phone />}
                    sx={{ py: 1.5 }}
                  >
                    Support
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
