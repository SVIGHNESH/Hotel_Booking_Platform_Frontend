import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container
} from '@mui/material';
import {
  AccountCircle,
  Hotel as HotelIcon,
  Dashboard,
  Logout
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'hotel':
        return '/hotel/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getProfileRoute = () => {
    switch (user?.role) {
      case 'customer':
        return '/customer/profile';
      case 'hotel':
        return '/hotel/profile';
      default:
        return '/';
    }
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <HotelIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              Hotel Booking Portal
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/search"
                >
                  Search Hotels
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                {user?.role === 'customer' && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/search"
                  >
                    Search Hotels
                  </Button>
                )}
                
                <Button
                  color="inherit"
                  component={Link}
                  to={getDashboardRoute()}
                  startIcon={<Dashboard />}
                >
                  Dashboard
                </Button>

                {/* User Menu */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
                
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {user?.email}
                    </Typography>
                  </MenuItem>
                  
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(getDashboardRoute());
                    }}
                  >
                    <Dashboard sx={{ mr: 1 }} />
                    Dashboard
                  </MenuItem>
                  
                  {user?.role !== 'admin' && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate(getProfileRoute());
                      }}
                    >
                      <AccountCircle sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                  )}
                  
                  {user?.role === 'customer' && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate('/customer/bookings');
                      }}
                    >
                      My Bookings
                    </MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
