import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Page not found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We're sorry, the page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Go to home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
