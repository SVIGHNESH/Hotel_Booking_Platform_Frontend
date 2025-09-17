import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Customer Pages 
import CustomerDashboard from './pages/customer/Dashboard';
import HotelSearch from './pages/customer/HotelSearch';
import HotelDetails from './pages/customer/HotelDetails';
import RoomBooking from './pages/customer/RoomBooking';
import BookingConfirmation from './pages/customer/BookingConfirmation';
import MyBookings from './pages/customer/MyBookings';
import BookingHistory from './pages/customer/BookingHistory';
import CustomerProfile from './pages/customer/Profile';

// Hotel Pages
import HotelDashboard from './pages/hotel/Dashboard';
import HotelProfile from './pages/hotel/Profile';
import RoomManagement from './pages/hotel/RoomManagement';
import ManageRooms from './pages/hotel/ManageRooms';
import BookingManagement from './pages/hotel/BookingManagement';
import HotelBookings from './pages/hotel/Bookings';
import HotelReviews from './pages/hotel/Reviews';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import HotelManagement from './pages/admin/HotelManagement';
import HotelVerification from './pages/admin/HotelVerification';
import AdminBookings from './pages/admin/Bookings';
import Analytics from './pages/admin/Analytics';
import GrievanceManagement from './pages/admin/GrievanceManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Enforce email verification for all roles except admin


  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect based on user role
    switch (user?.role) {
      case 'customer':
        return <Navigate to="/customer/dashboard" replace />;
      case 'hotel':
        return <Navigate to="/hotel/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
        <ErrorBoundary>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<HotelSearch />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/hotels/:id/book" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <RoomBooking />
            </ProtectedRoute>
          } />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/bookings"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/booking-history"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/booking-confirmation/:id"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />

          {/* Hotel Routes */}
          <Route
            path="/hotel/dashboard"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <HotelDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/profile"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <HotelProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/rooms"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <RoomManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/manage-rooms"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <ManageRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/booking-management"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <BookingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/bookings"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <HotelBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/reviews"
            element={
              <ProtectedRoute allowedRoles={['hotel']}>
                <HotelReviews />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HotelVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hotel-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HotelManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/grievances"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GrievanceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemSettings />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Box>

      <Footer />
    </Box>
  );
}export default App;
