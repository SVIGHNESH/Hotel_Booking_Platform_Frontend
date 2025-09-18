import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Save,
  Edit,
  Add,
  Delete,
  Hotel,
  LocationOn,
  Phone,
  Star
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [hotelExists, setHotelExists] = useState(false);

  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    type: 'hotel',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    amenities: [],
    priceRange: {
      min: 0,
      max: 0
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellationPolicy: '',
      petPolicy: false,
      smokingPolicy: false
    },
    images: [],
    isActive: true
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [hotelImages, setHotelImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const availableAmenities = [
    'Free WiFi', 'Swimming Pool', 'Fitness Center', 'Spa', 'Restaurant', 
    'Room Service', 'Parking', 'Business Center', 'Conference Room', 
    'Airport Shuttle', 'Pet Friendly', 'Air Conditioning', 'Laundry Service',
    'Concierge', 'Bar/Lounge', 'Kitchen', 'Balcony', 'Garden', 'Terrace'
  ];

  const hotelTypes = [
    'hotel', 'resort', 'motel', 'hostel', 'apartment', 'villa', 'guesthouse'
  ];

  useEffect(() => {
    // Fetch hotel profile and images
    const fetchHotelProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/hotel/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setHotelData(res.data.data);
          setHotelExists(true);
          // images may be array of strings or objects {url, publicId}
            const imgs = (res.data.data.images || []).map(img => img.url || img);
          setHotelImages(imgs);
        } else {
          setError(res.data.message || 'Failed to load hotel profile');
        }
      } catch (err) {
        setError('Failed to load hotel profile');
      } finally {
        setLoading(false);
      }
    };
    fetchHotelProfile();
  }, []);

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      selectedImages.forEach(img => formData.append('images', img));
      const res = await axios.post('/api/hotel/profile/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        const imgs = (res.data.data.urls || res.data.data.images || []).map(img => img.url || img);
        setHotelImages(imgs);
        setSuccess('Images uploaded successfully');
        setSelectedImages([]);
      } else {
        setError(res.data.message || 'Failed to upload images');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const fetchHotelProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hotel/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const apiData = response.data.data || {};
        const normalized = {
          ...apiData,
          // Ensure nested objects exist
          address: {
            street: '', city: '', state: '', zipCode: '', country: 'India',
            ...(apiData.address || {})
          },
          contactInfo: {
            phone: '', email: '', website: '',
            ...(apiData.contactInfo || {})
          },
          priceRange: {
            min: apiData.priceRange?.min ?? 0,
            max: apiData.priceRange?.max ?? apiData.priceRange?.min ?? 0,
            currency: apiData.priceRange?.currency || 'INR'
          },
          amenities: Array.isArray(apiData.amenities) ? apiData.amenities : [],
          policies: {
            checkIn: apiData.checkInTime || apiData.policies?.checkIn || '15:00',
            checkOut: apiData.checkOutTime || apiData.policies?.checkOut || '11:00',
            cancellationPolicy: apiData.policies?.cancellation || '',
            petPolicy: !!apiData.policies?.pets, // boolean
            smokingPolicy: !!apiData.policies?.smokingPolicy // fallback false
          }
        };
        setHotelData(normalized);
        setHotelExists(true);
        setEditing(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Hotel profile doesn't exist, enable editing mode
        setHotelExists(false);
        setEditing(true);
      } else {
        console.error('Fetch hotel profile error:', error);
        setError('Failed to fetch hotel profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await axios.put('/api/hotel/profile', hotelData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSuccess('Hotel profile saved successfully!');
        setHotelExists(true);
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Save hotel profile error:', error);
      setError(error.response?.data?.message || 'Failed to save hotel profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setHotelData(prev => {
      if (field.includes('.')) {
        const parts = field.split('.');
        if (parts.length === 2) {
          const [parent, child] = parts;
          return {
            ...prev,
            [parent]: {
              ...(prev[parent] || {}),
              [child]: value
            }
          };
        }
        // Support deeper nesting if needed later
      }
      return { ...prev, [field]: value };
    });
  };

  const handleAddAmenity = (amenity) => {
    if (!hotelData.amenities.includes(amenity)) {
      setHotelData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setHotelData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !hotelData.amenities.includes(newAmenity.trim())) {
      handleAddAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {hotelExists ? 'Hotel Profile' : 'Add Your Hotel'}
        </Typography>
        {hotelExists && !editing && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {!hotelExists && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Welcome! Please fill in your hotel information to get started on our platform.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Hotel />
                </Avatar>
                <Typography variant="h6">Basic Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hotel Name"
                    value={hotelData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel>Hotel Type</InputLabel>
                    <Select
                      value={hotelData.type}
                      label="Hotel Type"
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      {hotelTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hotel Description"
                    value={hotelData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!editing}
                    multiline
                    rows={4}
                    placeholder="Describe your hotel, its unique features, and what makes it special..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Price (₹ per night)"
                    type="number"
                    value={hotelData.priceRange.min}
                    onChange={(e) => handleInputChange('priceRange.min', parseInt(e.target.value))}
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Price (₹ per night)"
                    type="number"
                    value={hotelData.priceRange.max}
                    onChange={(e) => handleInputChange('priceRange.max', parseInt(e.target.value))}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <LocationOn />
                </Avatar>
                <Typography variant="h6">Address Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={hotelData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={hotelData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={hotelData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={hotelData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={hotelData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Phone />
                </Avatar>
                <Typography variant="h6">Contact Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={hotelData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={hotelData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    disabled={!editing}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website URL (optional)"
                    value={hotelData.contactInfo.website}
                    onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                    disabled={!editing}
                    placeholder="https://www.yourhotel.com"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Amenities */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Star />
                </Avatar>
                <Typography variant="h6">Hotel Amenities</Typography>
              </Box>

              {editing && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Available Amenities:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {availableAmenities.filter(amenity => !hotelData.amenities.includes(amenity)).map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        onClick={() => handleAddAmenity(amenity)}
                        clickable
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      label="Custom Amenity"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAmenity()}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCustomAmenity}
                      startIcon={<Add />}
                      disabled={!newAmenity.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>Selected Amenities:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {hotelData.amenities.length > 0 ? (
                  hotelData.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={editing ? () => handleRemoveAmenity(amenity) : undefined}
                      color="primary"
                      deleteIcon={<Delete />}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No amenities selected yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Policies */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Hotel Policies</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Check-in Time"
                    type="time"
                    value={hotelData.policies?.checkIn || ''}
                    onChange={(e) => handleInputChange('policies.checkIn', e.target.value)}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Check-out Time"
                    type="time"
                    value={hotelData.policies?.checkOut || ''}
                    onChange={(e) => handleInputChange('policies.checkOut', e.target.value)}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cancellation Policy"
                    value={hotelData.policies?.cancellationPolicy || ''}
                    onChange={(e) => handleInputChange('policies.cancellationPolicy', e.target.value)}
                    disabled={!editing}
                    multiline
                    rows={3}
                    placeholder="Describe your cancellation policy..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hotelData.policies?.petPolicy || false}
                        onChange={(e) => handleInputChange('policies.petPolicy', e.target.checked)}
                        disabled={!editing}
                      />
                    }
                    label="Pet Friendly"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hotelData.policies?.smokingPolicy || false}
                        onChange={(e) => handleInputChange('policies.smokingPolicy', e.target.checked)}
                        disabled={!editing}
                      />
                    }
                    label="Smoking Allowed"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Hotel Images Section */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Hotel Images</Typography>
              <Grid container spacing={2}>
                {hotelImages && hotelImages.length > 0 ? hotelImages.map((img, idx) => (
                  <Grid item key={idx} xs={6} sm={4} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <img
                            src={typeof img === 'string' ? img : (img?.url || '')}
                            alt={`Hotel ${idx + 1}`}
                            style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8 }}
                            onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )) : (
                  <Grid item xs={12}><Typography color="text.secondary">No images uploaded yet.</Typography></Grid>
                )}
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="hotel-image-upload"
                />
                <label htmlFor="hotel-image-upload">
                  <Button variant="outlined" component="span" startIcon={<Add />}>Select Images</Button>
                </label>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedImages.length === 0 || uploading}
                  onClick={handleImageUpload}
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
              </Box>
              {selectedImages.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Selected: {selectedImages.map(img => img.name).join(', ')}</Typography>
                </Box>
              )}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        {editing && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {hotelExists && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false);
                    fetchHotelProfile(); // Reset changes
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Hotel Profile'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Profile;
