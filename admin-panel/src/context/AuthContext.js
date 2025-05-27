import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Create authentication context
const AuthContext = createContext(null);

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure Axios interceptor to include token in requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        // Verify if token has expired
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setError('Your session has expired. Please log in again.');
        } else {
          // Token valid, get user information
          const response = await axios.get(`${API_URL}/users/profile`);
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setError('Authentication error. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      
      const { token: newToken, user } = response.data;
      
      // Save token in localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login error. Please verify your credentials and try again.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.put(`${API_URL}/users/password`, { 
        currentPassword, 
        newPassword 
      });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      setError(
        err.response?.data?.message || 
        'Error changing password. Please verify your current password and try again.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    logout,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
