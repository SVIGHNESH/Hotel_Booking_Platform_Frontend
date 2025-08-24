import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  LinearProgress,
  Alert,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  Star,
  Reply,
  MoreVert,
  FilterList,
  TrendingUp,
  Person,
  CalendarToday,
  ThumbUp,
  Flag
} from '@mui/icons-material';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [replyDialog, setReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterRating, setFilterRating] = useState('all');

  const tabData = [
    { label: 'All Reviews', value: 'all' },
    { label: 'Recent', value: 'recent' },
    { label: 'Replied', value: 'replied' },
    { label: 'Pending Reply', value: 'pending' }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // API call to fetch hotel reviews
      const response = await fetch('/api/hotel/reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Fetch reviews error:', error);
      setError('Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReviews = () => {
    let filtered = reviews;

    // Filter by tab
    switch (currentTab) {
      case 1: // Recent
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reviewDate >= weekAgo;
        });
        break;
      case 2: // Replied
        filtered = filtered.filter(review => review.hasReply);
        break;
      case 3: // Pending Reply
        filtered = filtered.filter(review => !review.hasReply);
        break;
      default:
        break;
    }

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    return filtered;
  };

  const getReviewStats = () => {
    const total = reviews.length;
    const averageRating = total > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
    const pending = reviews.filter(r => !r.hasReply).length;
    
    // Rating distribution
    const ratingCounts = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    return { total, averageRating, pending, ratingCounts };
  };

  const handleReplyToReview = (review) => {
    setSelectedReview(review);
    setReplyText('');
    setReplyDialog(true);
    setAnchorEl(null);
  };

  const handleSubmitReply = async () => {
    try {
      console.log(`Replying to review ${selectedReview._id}: ${replyText}`);
      
      setReviews(prev => prev.map(review => 
        review._id === selectedReview._id 
          ? {
              ...review,
              hasReply: true,
              reply: {
                text: replyText,
                date: new Date().toISOString().split('T')[0],
                author: 'Hotel Manager'
              }
            }
          : review
      ));
      
      setSuccess('Reply posted successfully');
      setReplyDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Submit reply error:', error);
      setError('Failed to post reply');
    }
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const stats = getReviewStats();

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
      <Typography variant="h4" gutterBottom>Hotel Reviews & Ratings</Typography>

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

      {/* Review Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Overall Rating</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary" sx={{ mr: 2 }}>
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <Box>
                  <Rating value={stats.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    Based on {stats.total} reviews
                  </Typography>
                </Box>
              </Box>
              
              {/* Rating Distribution */}
              {Object.entries(stats.ratingCounts).reverse().map(([rating, count]) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>{rating}</Typography>
                  <Star sx={{ fontSize: 16, mx: 1, color: 'gold' }} />
                  <LinearProgress
                    variant="determinate"
                    value={stats.total > 0 ? (count / stats.total) * 100 : 0}
                    sx={{ flexGrow: 1, mx: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" color="primary">{stats.total}</Typography>
                      <Typography variant="subtitle2">Total Reviews</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Star />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
                      <Typography variant="subtitle2">Pending Reply</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                      <Reply />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" color="success.main">
                        {((stats.ratingCounts[4] + stats.ratingCounts[5]) / stats.total * 100 || 0).toFixed(0)}%
                      </Typography>
                      <Typography variant="subtitle2">Positive</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <TrendingUp />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" color="info.main">
                        {reviews.filter(r => r.verified).length}
                      </Typography>
                      <Typography variant="subtitle2">Verified</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.light' }}>
                      <Person />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
          >
            {tabData.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              <Typography variant="body2">Rating:</Typography>
              <Button
                size="small"
                variant={filterRating === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilterRating('all')}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  size="small"
                  variant={filterRating === rating.toString() ? 'contained' : 'outlined'}
                  onClick={() => setFilterRating(rating.toString())}
                >
                  {rating}★
                </Button>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {getFilteredReviews().length} reviews
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Reviews List */}
      <Grid container spacing={3}>
        {getFilteredReviews().length > 0 ? (
          getFilteredReviews().map((review) => (
            <Grid item xs={12} key={review._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {review.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.customerName}
                          </Typography>
                          {review.verified && (
                            <Chip label="Verified" size="small" color="success" />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(review.date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, review)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {review.title}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {review.comment}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={review.roomType} size="small" variant="outlined" />
                    <Chip label={`${review.stayDuration} nights`} size="small" variant="outlined" />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUp />}
                      variant="outlined"
                    >
                      Helpful ({review.helpful})
                    </Button>
                    {!review.hasReply && (
                      <Button
                        size="small"
                        startIcon={<Reply />}
                        variant="contained"
                        onClick={() => handleReplyToReview(review)}
                      >
                        Reply
                      </Button>
                    )}
                  </Box>

                  {/* Hotel Reply */}
                  {review.hasReply && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Response from {review.reply.author}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {review.reply.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.reply.date)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No reviews found for the selected filters.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedReview && (
          <>
            {!selectedReview.hasReply && (
              <MenuItem onClick={() => handleReplyToReview(selectedReview)}>
                <Reply sx={{ mr: 1 }} />
                Reply to Review
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClose}>
              <Flag sx={{ mr: 1 }} />
              Report Review
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Reply Dialog */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Reply to {selectedReview?.customerName}'s Review
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ mb: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={selectedReview.rating} readOnly size="small" />
                  <Typography variant="subtitle2">{selectedReview.title}</Typography>
                </Box>
                <Typography variant="body2">
                  {selectedReview.comment}
                </Typography>
              </Paper>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a professional response to this review..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitReply} 
            variant="contained"
            disabled={!replyText.trim()}
          >
            Post Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reviews;
