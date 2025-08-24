import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs
} from '@mui/material';
import {
  Save,
  Add,
  Delete,
  Security,
  Notifications,
  Payment,
  Settings,
  Email,
  Sms
} from '@mui/icons-material';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Hotel Booking Portal',
    siteDescription: 'Best hotel booking platform in India',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: false,
    maxBookingsPerUser: 10,
    bookingCancellationHours: 24,
    autoVerifyHotels: false
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    razorpayEnabled: true,
    paypalEnabled: false,
    processingFeePercentage: 2.5,
    refundProcessingDays: 5,
    currency: 'INR'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    bookingConfirmationEmail: true,
    bookingReminderEmail: true,
    promotionalEmails: true,
    systemMaintenanceNotifications: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    requireStrongPasswords: true,
    allowMultipleSessions: true
  });

  const [amenities, setAmenities] = useState([
    'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'Pet Friendly', 'Room Service'
  ]);
  const [newAmenity, setNewAmenity] = useState('');
  const [amenityDialog, setAmenityDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = (settingsType) => {
    // Mock save operation
    console.log(`Saving ${settingsType} settings...`);
    setSaveMessage(`${settingsType} settings saved successfully!`);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
      setAmenityDialog(false);
    }
  };

  const handleDeleteAmenity = (amenityToDelete) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToDelete));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>System Settings</Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Paper elevation={3}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Settings />} label="General" />
          <Tab icon={<Payment />} label="Payment" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Security />} label="Security" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Site Configuration</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Site Name"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      fullWidth
                    />
                    <TextField
                      label="Site Description"
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                        />
                      }
                      label="Maintenance Mode"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>User Registration</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={generalSettings.registrationEnabled}
                          onChange={(e) => setGeneralSettings({...generalSettings, registrationEnabled: e.target.checked})}
                        />
                      }
                      label="Allow New Registrations"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={generalSettings.emailVerificationRequired}
                          onChange={(e) => setGeneralSettings({...generalSettings, emailVerificationRequired: e.target.checked})}
                        />
                      }
                      label="Require Email Verification"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={generalSettings.phoneVerificationRequired}
                          onChange={(e) => setGeneralSettings({...generalSettings, phoneVerificationRequired: e.target.checked})}
                        />
                      }
                      label="Require Phone Verification"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Booking Settings</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Max Bookings Per User"
                      type="number"
                      value={generalSettings.maxBookingsPerUser}
                      onChange={(e) => setGeneralSettings({...generalSettings, maxBookingsPerUser: parseInt(e.target.value)})}
                    />
                    <TextField
                      label="Cancellation Hours Before Check-in"
                      type="number"
                      value={generalSettings.bookingCancellationHours}
                      onChange={(e) => setGeneralSettings({...generalSettings, bookingCancellationHours: parseInt(e.target.value)})}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={generalSettings.autoVerifyHotels}
                          onChange={(e) => setGeneralSettings({...generalSettings, autoVerifyHotels: e.target.checked})}
                        />
                      }
                      label="Auto-verify New Hotels"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Available Amenities</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      startIcon={<Add />}
                      variant="outlined"
                      onClick={() => setAmenityDialog(true)}
                      sx={{ mb: 1 }}
                    >
                      Add Amenity
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        onDelete={() => handleDeleteAmenity(amenity)}
                        deleteIcon={<Delete />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('General')}
                size="large"
              >
                Save General Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Settings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payment Gateways</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={paymentSettings.stripeEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripeEnabled: e.target.checked})}
                        />
                      }
                      label="Enable Stripe"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={paymentSettings.razorpayEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, razorpayEnabled: e.target.checked})}
                        />
                      }
                      label="Enable Razorpay"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={paymentSettings.paypalEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypalEnabled: e.target.checked})}
                        />
                      }
                      label="Enable PayPal"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payment Configuration</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Processing Fee (%)"
                      type="number"
                      value={paymentSettings.processingFeePercentage}
                      onChange={(e) => setPaymentSettings({...paymentSettings, processingFeePercentage: parseFloat(e.target.value)})}
                    />
                    <TextField
                      label="Refund Processing Days"
                      type="number"
                      value={paymentSettings.refundProcessingDays}
                      onChange={(e) => setPaymentSettings({...paymentSettings, refundProcessingDays: parseInt(e.target.value)})}
                    />
                    <TextField
                      label="Default Currency"
                      value={paymentSettings.currency}
                      onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Payment')}
                size="large"
              >
                Save Payment Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Notification Channels</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        />
                      }
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Email fontSize="small" />Email Notifications</Box>}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                        />
                      }
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Sms fontSize="small" />SMS Notifications</Box>}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                        />
                      }
                      label="Push Notifications"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Email Types</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.bookingConfirmationEmail}
                          onChange={(e) => setNotificationSettings({...notificationSettings, bookingConfirmationEmail: e.target.checked})}
                        />
                      }
                      label="Booking Confirmation"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.bookingReminderEmail}
                          onChange={(e) => setNotificationSettings({...notificationSettings, bookingReminderEmail: e.target.checked})}
                        />
                      }
                      label="Booking Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.promotionalEmails}
                          onChange={(e) => setNotificationSettings({...notificationSettings, promotionalEmails: e.target.checked})}
                        />
                      }
                      label="Promotional Emails"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={notificationSettings.systemMaintenanceNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemMaintenanceNotifications: e.target.checked})}
                        />
                      }
                      label="System Maintenance"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Notification')}
                size="large"
              >
                Save Notification Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Authentication Security</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                        />
                      }
                      label="Enable Two-Factor Authentication"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={securitySettings.requireStrongPasswords}
                          onChange={(e) => setSecuritySettings({...securitySettings, requireStrongPasswords: e.target.checked})}
                        />
                      }
                      label="Require Strong Passwords"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={securitySettings.allowMultipleSessions}
                          onChange={(e) => setSecuritySettings({...securitySettings, allowMultipleSessions: e.target.checked})}
                        />
                      }
                      label="Allow Multiple Sessions"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Session & Login Security</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Session Timeout (minutes)"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                    <TextField
                      label="Password Expiry (days)"
                      type="number"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiryDays: parseInt(e.target.value)})}
                    />
                    <TextField
                      label="Max Login Attempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                    <TextField
                      label="Lockout Duration (minutes)"
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Security')}
                size="large"
              >
                Save Security Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add Amenity Dialog */}
      <Dialog open={amenityDialog} onClose={() => setAmenityDialog(false)}>
        <DialogTitle>Add New Amenity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amenity Name"
            fullWidth
            variant="outlined"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAmenityDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAmenity} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SystemSettings;
