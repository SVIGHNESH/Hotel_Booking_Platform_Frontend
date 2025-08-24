import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search,
  MoreVert,
  ReportProblem,
  CheckCircle,
  Pending,
  Close,
  Person,
  Hotel
} from '@mui/icons-material';
import axios from 'axios';

const GrievanceManagement = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalGrievances, setTotalGrievances] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, grievance: null });
  const [responseDialog, setResponseDialog] = useState({ open: false, grievance: null, response: '' });

  // Mock data for demonstration
  const mockGrievances = [
    {
      _id: '1',
      title: 'Room was not clean',
      description: 'The room had dirty sheets and bathroom was not cleaned properly.',
      status: 'open',
      priority: 'high',
      category: 'cleanliness',
      userId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      hotelId: { name: 'Grand Hotel', _id: 'h1' },
      createdAt: new Date().toISOString(),
      responses: []
    },
    {
      _id: '2',
      title: 'Booking cancellation issue',
      description: 'Unable to cancel booking and get refund.',
      status: 'in-progress',
      priority: 'medium',
      category: 'booking',
      userId: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      hotelId: { name: 'Beach Resort', _id: 'h2' },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      responses: [{ message: 'We are looking into this issue.', timestamp: new Date().toISOString() }]
    },
    {
      _id: '3',
      title: 'Staff behavior complaint',
      description: 'Front desk staff was rude and unhelpful.',
      status: 'closed',
      priority: 'low',
      category: 'service',
      userId: { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
      hotelId: { name: 'City Inn', _id: 'h3' },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      responses: [
        { message: 'Thank you for reporting. We have addressed this with our staff.', timestamp: new Date().toISOString() }
      ]
    }
  ];

  useEffect(() => {
    // Using mock data since grievance endpoints are not implemented
    setGrievances(mockGrievances);
    setTotalGrievances(mockGrievances.length);
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (grievanceId, newStatus) => {
    try {
      // Mock API call
      console.log(`Updating grievance ${grievanceId} to status: ${newStatus}`);
      
      // Update local state
      setGrievances(prev => prev.map(g => 
        g._id === grievanceId ? { ...g, status: newStatus } : g
      ));
      
      setAnchorEl(null);
    } catch (error) {
      console.error('Status update error:', error);
      setError('Failed to update status');
    }
  };

  const handleAddResponse = async () => {
    try {
      if (!responseDialog.response.trim()) return;

      // Mock API call
      console.log(`Adding response to grievance ${responseDialog.grievance._id}: ${responseDialog.response}`);
      
      // Update local state
      setGrievances(prev => prev.map(g => 
        g._id === responseDialog.grievance._id 
          ? { 
              ...g, 
              responses: [...g.responses, { 
                message: responseDialog.response, 
                timestamp: new Date().toISOString() 
              }],
              status: g.status === 'open' ? 'in-progress' : g.status
            } 
          : g
      ));
      
      setResponseDialog({ open: false, grievance: null, response: '' });
    } catch (error) {
      console.error('Add response error:', error);
      setError('Failed to add response');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <ReportProblem />;
      case 'in-progress':
        return <Pending />;
      case 'closed':
        return <CheckCircle />;
      default:
        return <ReportProblem />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || grievance.status === statusFilter;
    const matchesPriority = priorityFilter === '' || grievance.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, grievance) => {
    setAnchorEl(event.currentTarget);
    setSelectedGrievance(grievance);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGrievance(null);
  };

  // Summary statistics
  const openGrievances = grievances.filter(g => g.status === 'open').length;
  const inProgressGrievances = grievances.filter(g => g.status === 'in-progress').length;
  const closedGrievances = grievances.filter(g => g.status === 'closed').length;
  const highPriorityGrievances = grievances.filter(g => g.priority === 'high').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Grievance Management</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="error">{openGrievances}</Typography>
                  <Typography variant="subtitle1">Open Grievances</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <ReportProblem />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">{inProgressGrievances}</Typography>
                  <Typography variant="subtitle1">In Progress</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Pending />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="success.main">{closedGrievances}</Typography>
                  <Typography variant="subtitle1">Resolved</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="error">{highPriorityGrievances}</Typography>
                  <Typography variant="subtitle1">High Priority</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <ReportProblem />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Grievances"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Grievances Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Grievance</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Hotel</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredGrievances.length > 0 ? (
                filteredGrievances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((grievance) => (
                  <TableRow key={grievance._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {grievance.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {grievance.description.substring(0, 60)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        <Box>
                          <Typography variant="body2">
                            {grievance.userId.firstName} {grievance.userId.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {grievance.userId.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Hotel fontSize="small" />
                        <Typography variant="body2">
                          {grievance.hotelId.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={grievance.priority.toUpperCase()}
                        color={getPriorityColor(grievance.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(grievance.status)}
                        label={grievance.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(grievance.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(grievance.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, grievance)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No grievances found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredGrievances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedGrievance && (
          <>
            <MenuItem onClick={() => setDetailDialog({ open: true, grievance: selectedGrievance })}>
              View Details
            </MenuItem>
            <MenuItem onClick={() => setResponseDialog({ open: true, grievance: selectedGrievance, response: '' })}>
              Add Response
            </MenuItem>
            {selectedGrievance.status === 'open' && (
              <MenuItem onClick={() => handleStatusUpdate(selectedGrievance._id, 'in-progress')}>
                Mark In Progress
              </MenuItem>
            )}
            {selectedGrievance.status !== 'closed' && (
              <MenuItem onClick={() => handleStatusUpdate(selectedGrievance._id, 'closed')}>
                Mark Resolved
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, grievance: null })} maxWidth="md" fullWidth>
        <DialogTitle>Grievance Details</DialogTitle>
        <DialogContent>
          {detailDialog.grievance && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{detailDialog.grievance.title}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{detailDialog.grievance.description}</Typography>
              
              <Typography variant="subtitle2" color="primary">Customer:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {detailDialog.grievance.userId.firstName} {detailDialog.grievance.userId.lastName} ({detailDialog.grievance.userId.email})
              </Typography>

              <Typography variant="subtitle2" color="primary">Hotel:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{detailDialog.grievance.hotelId.name}</Typography>

              <Typography variant="subtitle2" color="primary">Responses:</Typography>
              {detailDialog.grievance.responses.length > 0 ? (
                detailDialog.grievance.responses.map((response, index) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2">{response.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(response.timestamp).toLocaleString()}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No responses yet</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, grievance: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialog.open} onClose={() => setResponseDialog({ open: false, grievance: null, response: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Add Response</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Response"
            value={responseDialog.response}
            onChange={(e) => setResponseDialog(prev => ({ ...prev, response: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog({ open: false, grievance: null, response: '' })}>Cancel</Button>
          <Button onClick={handleAddResponse} variant="contained">Add Response</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GrievanceManagement;
