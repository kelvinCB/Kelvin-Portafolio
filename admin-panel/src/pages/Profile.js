import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, changePassword, error, loading } = useAuth();
  
  // States for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States for UI management
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    //  Validations
    if (!currentPassword) {
      setFormError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setFormError('New password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully');
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {currentUser.username}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.username}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Registration date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Change password */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon sx={{ mr: 1 }} /> Change Password
            </Typography>
            
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleChangePassword} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="currentPassword"
                label="Current password"
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New password"
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm new password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                startIcon={<SaveIcon />}
                disabled={isChangingPassword || loading}
                sx={{ mt: 2 }}
              >
                {isChangingPassword ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
