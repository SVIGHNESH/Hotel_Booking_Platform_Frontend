import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  TrendingUp,
  Hotel,
  People,
  Star,
  AttachMoney,
  CalendarToday,
  Notifications,
  CheckCircle,
  Cancel,
  Pending,
  MoreVert,
  Visibility,
  Edit
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HotelDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRooms: 0,
      occupiedRooms: 0,
      totalBookings: 0,
      revenue: 0,
      averageRating: 0,
      pendingCheckIns: 0
    },
    recentBookings: [],
    revenueData: [],
    occupancyData: [],
    ratingDistribution: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockData = {
        stats: {
          totalRooms: 45,
          occupiedRooms: 32,
          totalBookings: 128,
          revenue: 15420,
          averageRating: 4.3,
          pendingCheckIns: 8
        },
        recentBookings: [
          {
            id: 'BK001',
            customerName: 'John Smith',
            roomNumber: '201',
            roomType: 'Deluxe King',
            checkIn: '2024-12-25',
            checkOut: '2024-12-28',
            status: 'confirmed',
            amount: 450,
            guests: 2
          },
          {
            id: 'BK002',
            customerName: 'Sarah Johnson',
            roomNumber: '315',
            roomType: 'Suite',
            checkIn: '2024-12-24',
            checkOut: '2024-12-27',
            status: 'checked-in',
            amount: 680,
            guests: 2
          },
          {
            id: 'BK003',
            customerName: 'Mike Wilson',
            roomNumber: '102',
            roomType: 'Standard Double',
            checkIn: '2024-12-26',
            checkOut: '2024-12-29',
            status: 'pending',
            amount: 320,
            guests: 4
          },
          {
            id: 'BK004',
            customerName: 'Emily Davis',
            roomNumber: '408',
            roomType: 'Ocean View',
            checkIn: '2024-12-23',
            checkOut: '2024-12-25',
            status: 'checked-out',
            amount: 520,
            guests: 2
          }
        ],
        revenueData: [
          { month: 'Jan', revenue: 12000, bookings: 45 },
          { month: 'Feb', revenue: 14500, bookings: 52 },
          { month: 'Mar', revenue: 16800, bookings: 58 },
          { month: 'Apr', revenue: 15200, bookings: 54 },
          { month: 'May', revenue: 18900, bookings: 67 },
          { month: 'Jun', revenue: 22100, bookings: 78 },
          { month: 'Jul', revenue: 25400, bookings: 89 },
          { month: 'Aug', revenue: 24200, bookings: 85 },
          { month: 'Sep', revenue: 20800, bookings: 72 },
          { month: 'Oct', revenue: 19200, bookings: 68 },
          { month: 'Nov', revenue: 17500, bookings: 62 },
          { month: 'Dec', revenue: 15420, bookings: 55 }
        ],
        occupancyData: [
          { date: '12/20', occupied: 28, total: 45 },
          { date: '12/21', occupied: 32, total: 45 },
          { date: '12/22', occupied: 35, total: 45 },
          { date: '12/23', occupied: 38, total: 45 },
          { date: '12/24', occupied: 42, total: 45 },
          { date: '12/25', occupied: 40, total: 45 },
          { date: '12/26', occupied: 37, total: 45 }
        ],
        ratingDistribution: [
          { rating: '5 Stars', count: 45, color: '#4CAF50' },
          { rating: '4 Stars', count: 28, color: '#8BC34A' },
          { rating: '3 Stars', count: 12, color: '#FFC107' },
          { rating: '2 Stars', count: 4, color: '#FF9800' },
          { rating: '1 Star', count: 2, color: '#F44336' }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'checked-in': return 'success';
      case 'checked-out': return 'default';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'checked-in': return <CheckCircle />;
      case 'checked-out': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Pending />;
    }
  };

  const occupancyRate = dashboardData.stats.totalRooms > 0 
    ? (dashboardData.stats.occupiedRooms / dashboardData.stats.totalRooms * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Hotel Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.firstName}! Here's what's happening at your hotel today.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/hotel/bookings')}>
          Manage Bookings
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {dashboardData.stats.totalRooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rooms
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Hotel />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {occupancyRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Occupancy Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(occupancyRate)} 
                sx={{ mt: 1 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {dashboardData.stats.totalBookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    ₹{dashboardData.stats.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenue (MTD)
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {dashboardData.stats.averageRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Rating
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="error.main">
                    {dashboardData.stats.pendingCheckIns}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Check-ins
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Notifications />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupancy Trend */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Occupancy
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupied" stroke="#4caf50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Bookings
              </Typography>
              <Button size="small" onClick={() => navigate('/hotel/bookings')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentBookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem
                    sx={{ px: 0 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{booking.amount}
                        </Typography>
                        <IconButton edge="end" size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        {booking.customerName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {booking.customerName}
                          </Typography>
                          <Chip
                            size="small"
                            label={booking.status}
                            color={getStatusColor(booking.status)}
                            icon={getStatusIcon(booking.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Room {booking.roomNumber} • {booking.roomType} • {booking.guests} guests
                          <br />
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < dashboardData.recentBookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Rating Distribution */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.ratingDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ rating, count }) => `${rating}: ${count}`}
                >
                  {dashboardData.ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate('/hotel/rooms')}>
              Manage Rooms
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<Visibility />} onClick={() => navigate('/hotel/reviews')}>
              View Reviews
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<People />} onClick={() => navigate('/hotel/bookings')}>
              Customer Management
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<Star />} onClick={() => navigate('/hotel/profile')}>
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HotelDashboard;
