import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Avatar,
  Chip,
  Alert,
  Button,
  CardActions
} from '@mui/material';
import {
  People,
  Hotel,
  BookOnline,
  Reviews,
  VerifiedUser,
  PendingActions,
  ReportProblem,
  Assessment,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" color={color} gutterBottom>
            {value}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
          {trend && (
            <Chip 
              label={trend} 
              size="small" 
              color={trend.includes('+') ? 'success' : 'default'} 
              sx={{ mt: 1 }} 
            />
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalHotels: 0,
    verifiedHotels: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalReviews: 0,
    openGrievances: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<People />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Hotels"
            value={stats.totalHotels}
            icon={<Hotel />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Verified Hotels"
            value={stats.verifiedHotels}
            icon={<VerifiedUser />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              cursor: stats.pendingVerifications > 0 ? 'pointer' : 'default',
              transition: 'transform 0.2s, elevation 0.2s',
              '&:hover': stats.pendingVerifications > 0 ? {
                transform: 'translateY(-2px)',
                elevation: 6
              } : {}
            }}
            onClick={() => stats.pendingVerifications > 0 && navigate('/admin/hotels')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {stats.pendingVerifications}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Pending Verification
                  </Typography>
                  {stats.pendingVerifications > 0 && (
                    <Chip 
                      label="Action Required" 
                      size="small" 
                      color="warning" 
                      sx={{ mt: 1 }} 
                    />
                  )}
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <PendingActions />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<BookOnline />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={<PendingActions />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<Reviews />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Grievances"
            value={stats.openGrievances}
            icon={<ReportProblem />}
            color="error"
          />
        </Grid>

        {/* Quick Insights */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Hotel Verification Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalHotels > 0 ? (stats.verifiedHotels / stats.totalHotels) * 100 : 0}
                  sx={{ mt: 1, height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.totalHotels > 0 ? Math.round((stats.verifiedHotels / stats.totalHotels) * 100) : 0}% of hotels verified
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Booking Completion Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalBookings > 0 ? ((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100 : 0}
                  color="success"
                  sx={{ mt: 1, height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.totalBookings > 0 ? Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0}% of bookings completed
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Platform Health
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.openGrievances < 10 ? 90 : Math.max(50, 100 - stats.openGrievances * 5)}
                  color={stats.openGrievances < 5 ? 'success' : stats.openGrievances < 10 ? 'warning' : 'error'}
                  sx={{ mt: 1, height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.openGrievances} open grievances
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions Needed
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.pendingVerifications > 0 && (
                <Card elevation={1} sx={{ mb: 2, bgcolor: 'warning.50' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="warning.main" fontWeight="bold">
                          {stats.pendingVerifications} hotels awaiting verification
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          New hotels need admin approval to start operating
                        </Typography>
                      </Box>
                      <PendingActions color="warning" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="warning"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/admin/hotels')}
                    >
                      Review Hotels
                    </Button>
                  </CardActions>
                </Card>
              )}
              
              {stats.pendingBookings > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {stats.pendingBookings} bookings need attention
                </Alert>
              )}
              
              {stats.openGrievances > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {stats.openGrievances} grievances require resolution
                </Alert>
              )}

              {stats.pendingVerifications === 0 && stats.pendingBookings === 0 && stats.openGrievances === 0 && (
                <Alert severity="success">
                  All systems operating smoothly! No immediate actions required.
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
