import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const ActionTypes = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case ActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case ActionTypes.AUTH_FAIL:
    case ActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload || null
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await axios.get('/api/auth/me');
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: { user: res.data.data }
        });
      } catch (error) {
        dispatch({ type: ActionTypes.AUTH_FAIL });
      }
    } else {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const res = await axios.post('/api/auth/register', formData);
      
      toast.success(res.data.message);
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      
      dispatch({
        type: ActionTypes.AUTH_FAIL,
        payload: message
      });
      
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const res = await axios.post('/api/auth/login', formData);
      
      setAuthToken(res.data.data.token);
      
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: {
          token: res.data.data.token,
          user: res.data.data.user
        }
      });
      
      toast.success(res.data.message);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      
      dispatch({
        type: ActionTypes.AUTH_FAIL,
        payload: message
      });
      
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: ActionTypes.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const res = await axios.post('/api/auth/verify-email', { token });
      toast.success(res.data.message);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      toast.success(res.data.message);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set initial auth token
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    clearError,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
