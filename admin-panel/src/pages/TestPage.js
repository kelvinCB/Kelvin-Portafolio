import React, { useState } from 'react';
import { Button, Box, Typography, Paper, CircularProgress, TextField } from '@mui/material';
import { testApiConnection } from '../utils/testApi';

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('kelvinc0219@gmail.com');
  const [password, setPassword] = useState('kelvin123456');

  const handleTestApi = async () => {
    setLoading(true);
    try {
      const response = await testApiConnection();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        details: 'Unexpected error executing the test'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        API Connection Test
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection data
        </Typography>
        <Typography variant="body1">
          API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
            margin="normal"
          />
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleTestApi} 
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Test Connection'}
        </Button>
      </Paper>

      {result && (
        <Paper sx={{ p: 3, bgcolor: result.success ? '#e8f5e9' : '#ffebee' }}>
          <Typography variant="h6" gutterBottom>
            Test Result
          </Typography>
          <Typography variant="body1" component="pre" sx={{ 
            whiteSpace: 'pre-wrap',
            bgcolor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            maxHeight: 300,
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TestPage;
