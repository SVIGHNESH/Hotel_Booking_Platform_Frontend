import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Security,
  Notifications,
  Language,
  Help,
  Delete,
  Star,
  Hotel,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      language: 'en',
      currency: 'USD'
    }
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteDestination: '',
    memberSince: '',
    loyaltyPoints: 0
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        },
        preferences: {
          emailNotifications: user.preferences?.emailNotifications ?? true,
          smsNotifications: user.preferences?.smsNotifications ?? false,
          marketingEmails: user.preferences?.marketingEmails ?? true,
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'USD'
        }
      });

      // Mock stats - replace with actual API call
      setStats({
        totalBookings: 12,
        totalSpent: 2450,
        favoriteDestination: 'New York',
        memberSince: '2023',
        loyaltyPoints: 1250
      });
    }
  }, [user]);

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to update profile using axios
      const response = await axios.put('/api/customer/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        // Update user context
        if (updateProfile) {
          updateProfile(profileData);
        }
        
        setEditMode(false);
        setSnackbar({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success'
        });
      } else {
        setSnackbar({ open: true, message: response.data.message || 'Failed to update profile', severity: 'error' });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        },
        preferences: {
          emailNotifications: user.preferences?.emailNotifications ?? true,
          smsNotifications: user.preferences?.smsNotifications ?? false,
          marketingEmails: user.preferences?.marketingEmails ?? true,
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'USD'
        }
      });
    }
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete('/api/user/delete-account', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (res.data && res.data.success) {
        setDeleteDialog(false);
        setSnackbar({ open: true, message: res.data.message || 'Account deletion request submitted. You will receive a confirmation email.', severity: 'info' });
      } else {
        setSnackbar({ open: true, message: res.data?.message || 'Failed to delete account', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      setSnackbar({
        open: true,
        message: 'Failed to process deletion request. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                sx={{ width: 120, height: 120, fontSize: '3rem' }}
                src={user?.avatar}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              {editMode && (
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white' }}
                  size="small"
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {profileData.email}
            </Typography>
            
            <Chip 
              label={`Member since ${stats.memberSince}`} 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Paper>

          {/* Quick Stats */}
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Travel Stats
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Hotel color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Bookings" 
                  secondary={stats.totalBookings}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Receipt color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Spent" 
                  secondary={`₹${stats.totalSpent}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Favorite Destination" 
                  secondary={stats.favoriteDestination}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Loyalty Points" 
                  secondary={stats.loyaltyPoints}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Personal Information
              </Typography>
              {!editMode ? (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  variant="outlined"
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    variant="outlined"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    startIcon={<Save />}
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!editMode}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Address Information */}
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={profileData.address.street}
                  onChange={(e) => handleInputChange('street', e.target.value, 'address')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={profileData.address.city}
                  onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={profileData.address.state}
                  onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP/Postal Code"
                  value={profileData.address.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value, 'address')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={profileData.address.country}
                  onChange={(e) => handleInputChange('country', e.target.value, 'address')}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Preferences */}
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preferences & Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.preferences.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked, 'preferences')}
                      disabled={!editMode}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.preferences.smsNotifications}
                      onChange={(e) => handleInputChange('smsNotifications', e.target.checked, 'preferences')}
                      disabled={!editMode}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.preferences.marketingEmails}
                      onChange={(e) => handleInputChange('marketingEmails', e.target.checked, 'preferences')}
                      disabled={!editMode}
                    />
                  }
                  label="Marketing Emails"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Account Actions */}
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            <Button
              startIcon={<Delete />}
              onClick={() => setDeleteDialog(true)}
              variant="outlined"
              color="error"
            >
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your bookings, reviews, and personal data will be permanently deleted.
          </Alert>
          <Typography variant="body1">
            Are you absolutely sure you want to delete your account? Type "DELETE" below to confirm:
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Type DELETE to confirm"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default Profile;
// export default Profile;from 'react';
// import { Container, Typography, Paper } from '@mui/material';

// const Profile = () => (
//   <Container maxWidth="lg" sx={{ mt: 4 }}>
//     <Typography variant="h4" gutterBottom>Profile</Typography>
//     <Paper elevation={3} sx={{ p: 4 }}>
//       <Typography>Profile page - To be implemented</Typography>
//     </Paper>
//   </Container>
// );

// export default Profile;
