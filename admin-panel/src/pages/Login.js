import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validations
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // The global error is already handled in the authentication context
      console.error('Form error:', err);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ mb: 3 }}>
            Admin Panel
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center' }}>
            Portfolio contact message management
          </Typography>
          
          {(error || formError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError || error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.2,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ position: 'absolute' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Kelvin Calcano - Admin Panel
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
